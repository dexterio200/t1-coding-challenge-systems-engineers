import express from 'express'
import Kafka from 'node-rdkafka';
import { RawMarketMessage } from './types';
import { connectToDb } from './db';
import { getTradingData, storeTradingDataFromMessage } from './trading';
import { toMarketMessage } from './transformation';
import { storePnlData } from './pnl';

const app = express();
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Calculation service running on port ${PORT}`);
});

app.get('/health', (_req, res) => {
    res.json({ status: 'OK' });
});

run().catch((err) => {
    console.error('Error in calculation service:', err);
    process.exit(1);
});

const kafkaConfig = {
    'group.id': 'calculation-service',
    'metadata.broker.list': 'kafka:9092',
    'enable.auto.commit': false,
};
const topics = ['market', 'trades'];

async function run() {
    await connectToDb();

    const consumer = new Kafka.KafkaConsumer(kafkaConfig, {});
    consumer.connect({}, (err, metaData) => {
        if (err) {
            console.error('Error connecting to Kafka:', err);
            return;
        }

        console.log('Connected to Kafka:', metaData);
    });

    consumer.on('ready', () => {
        consumer.subscribe(topics);
        consumer.consume();
    });

    consumer.on('data', async (message) => {
        if (!message.value) {
            throw new Error('Invalid message');
        }

        const topic = message.topic;
        const messageContent = JSON.parse(message.value.toString());

        if (topic === 'trades') {
            await storeTradingDataFromMessage(messageContent);
        } else if (topic === 'market') {
            const parsedMarketMessage = toMarketMessage(messageContent as RawMarketMessage);
            const tradingData = await getTradingData(parsedMarketMessage.startTime, parsedMarketMessage.endTime);

            const buyVolume = tradingData.filter(trade => trade.tradeType === 'BUY').reduce((sum, trade) => sum + trade.volume, 0);
            const sellVolume = tradingData.filter(trade => trade.tradeType === 'SELL').reduce((sum, trade) => sum + trade.volume, 0);
            const pnl = sellVolume * parsedMarketMessage.sellPrice - buyVolume * parsedMarketMessage.buyPrice;

            await storePnlData({ startTime: parsedMarketMessage.startTime, endTime: parsedMarketMessage.endTime, pnl });
            consumer.commitMessage(message);
        } else {
            throw new Error(`Invalid trade type`);
        }
    });
}

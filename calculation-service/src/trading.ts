import { RawTradeMessage, TradingData } from "./types";
import { toTradeMessage } from './transformation';
import { TradingModel } from './models/trading-data.schema';

export async function getTradingData(startTime: Date, endTime: Date): Promise<TradingData[]> {
    return TradingModel.find({ time: { $gte: startTime, $lte: endTime } }).lean().exec();
}

export async function storeTradingDataFromMessage(rawTradeMessage: RawTradeMessage): Promise<void> {
    const parsedData = toTradeMessage(rawTradeMessage);
    const trading = new TradingModel({ tradeType: parsedData.tradeType, volume: parsedData.volume, time: parsedData.time });
    await trading.save();
}
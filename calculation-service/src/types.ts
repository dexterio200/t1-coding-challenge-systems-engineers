export interface RawMarketMessage {
    messageType: "market";
    buyPrice: string;
    sellPrice: string;
    startTime: string;
    endTime: string;
}

export interface MarketMessage {
    messageType: "market";
    buyPrice: number;
    sellPrice: number;
    startTime: Date;
    endTime: Date;
}

export interface RawTradeMessage {
    messageType: "trades";
    tradeType: "BUY" | "SELL";
    volume: string;
    time: string;
}

export interface TradeMessage {
    messageType: "trades";
    tradeType: "BUY" | "SELL";
    volume: number;
    time: Date;
}

export interface TradingData extends Omit<TradeMessage, 'messageType'>{}

export interface PnL {
    startTime: Date;
    endTime: Date;
    pnl: number
}
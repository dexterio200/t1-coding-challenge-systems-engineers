import mongoose from "mongoose";
import { TradingData } from "../types";

const tradingDataSchema = new mongoose.Schema<TradingData>(
    {
        tradeType: { type: String, required: true },
        volume: { type: Number, required: true },
        time: { type: Date, required: true },
    },
);

export const TradingModel = mongoose.model("TradingData", tradingDataSchema, "trading-data");

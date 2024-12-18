import mongoose from "mongoose";
import { PnL } from "../types";

const pnlSchema = new mongoose.Schema<PnL>(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        pnl: { type: Number, required: true },
    },
);

export const PnlModel = mongoose.model("PnL", pnlSchema, "pnl");

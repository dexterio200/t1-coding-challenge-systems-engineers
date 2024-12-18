import mongoose from 'mongoose'
import { PnL } from "./types";

export async function getPnls(): Promise<PnL[]> {
    const PnlCollection = mongoose.connection?.db?.collection('pnl');
    if (!PnlCollection) {
        throw new Error(`Unable to get PnlCollection`);
    }

    const latestPnlResults = await PnlCollection.find().sort({ endTime: -1 }).limit(5).toArray();
    return latestPnlResults.map(res => ({
        startTime: res.startTime.toISOString(),
        endTime: res.endTime.toISOString(),
        pnl: res.pnl.toFixed(1)
    }))
}
import { PnL } from "./types";
import { PnlModel } from './models/pnl.schema';

export async function storePnlData(pnlData: PnL): Promise<void> {
    const pnl = new PnlModel(pnlData);
    await pnl.save();
    console.log('Saved profit/loss:', pnlData);
}
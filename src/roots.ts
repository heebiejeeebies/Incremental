import Decimal from "break_eternity.js";
import { GameState } from "./main";

const LEVEL2_ELEVATION = 1;
const LEVEL3_ELEVATION = 2;
const LEVEL4_ELEVATION = 3;
const LEVEL5_ELEVATION = 4;

export const TOTAL_DEPTH = 5;

const Level_Multipliers: Record<string, Decimal> = {
    LEVEL1: new Decimal(1),
    LEVEL2: new Decimal(1.05),
    LEVEL3: new Decimal(1.1),
    LEVEL4: new Decimal(1.15),
    LEVEL5: new Decimal(1.2),
};

export function getLevelMult(state: GameState) {
    return Level_Multipliers[getLevel(state)];
}

function getLevel(state: GameState): string {
    if (state.rootdepth < LEVEL2_ELEVATION) {
        return "LEVEL1";
    } else if (state.rootdepth < LEVEL3_ELEVATION) {
        return "LEVEL2";
    } else if (state.rootdepth < LEVEL4_ELEVATION) {
        return "LEVEL3";
    } else if (state.rootdepth < LEVEL5_ELEVATION) {
        return "LEVEL4";
    } else {
        return "LEVEL5";
    }
}





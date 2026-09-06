import Decimal from "break_eternity.js";
import type { GameState } from "../main";

export type Flower = {
    numFlowers: Decimal;
    maxFlowerMultiplier: Decimal;
    currFlowerMultiplier: Decimal;
}

export function flowerIncrease(state: GameState) {
    let totalFlowerIncrease = state.upgrades.flower.numFlowers;

    return totalFlowerIncrease;
}
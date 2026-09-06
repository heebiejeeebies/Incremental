import Decimal from "break_eternity.js";
import type { GameState } from "../main";

export type Flower = {
    numFlowers: Decimal;
    maxFlowerMultiplier: Decimal;
    currFlowerMultiplier: Decimal;
}

export function flowerIncrease(state: GameState): Decimal {
    let totalFlowerIncrease = state.upgrades.flower.numFlowers;

    return totalFlowerIncrease;
}

export function flowerMultIncrease(state: GameState) {
    const maxMultiplier = state.upgrades.flower.maxFlowerMultiplier;

    if (state.upgrades.flower.currFlowerMultiplier.lessThan(maxMultiplier)) {
        state.upgrades.flower.currFlowerMultiplier = state.upgrades.flower.currFlowerMultiplier.add(0.03);

        // Clamps the current flower multiplier to the max multiplier if it exceeds it
        if (state.upgrades.flower.currFlowerMultiplier.greaterThan(maxMultiplier)) {
            state.upgrades.flower.currFlowerMultiplier = maxMultiplier;
        }
    }
}
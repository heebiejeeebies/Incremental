import { GameState } from "../main";
import { randomLeaf } from "../purchases";

export function aurafarmPoints(state: GameState) {
    const totalAuraFarms = state.upgrades.aurafarm;
    for (let i = 0; (totalAuraFarms.mul(5)).greaterThan(i); i++) {
        state.leaves.push(randomLeaf());
    }
    state.upgrades.leaf = state.upgrades.leaf.add(totalAuraFarms);
}
import { GameState } from "./main";

export function clickTree(state: GameState) {
  const totalClickValue = state.clickValue + state.upgrades.clickIncrease;
  state.lifepoints += totalClickValue;
}



import { GameState } from "./main";
import { peep } from "./buffqueue";

export function clickTree(state: GameState) {
  const totalClickValue = state.clickValue + state.upgrades.clickIncrease;
  const activeBuff = peep(state.buffsqueue);
  const multiplier = (activeBuff === "will" || activeBuff === "will&leaf") ? 2 : 1;
  state.lifepoints += totalClickValue * multiplier;
}



import Decimal from "break_eternity.js";
import { addPoints, GameState } from "../main";
import { peep } from "../buffqueue";

export function leafpoints(state: GameState) {
  const totalLeaves = state.upgrades.leaf;
  const photosynthBase = new Decimal(1.05);
  let increase = totalLeaves.mul(photosynthBase.pow(state.upgrades.photosynthesis));
  const activeBuff = peep(state.buffsqueue);
  if (activeBuff === "leaf" || activeBuff === "will&leaf") {
    increase = increase.mul(2);
  }
  addPoints(increase);
}


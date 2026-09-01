import { GameState, Upgrades} from "./main";

function buyClickIncrease(state: GameState) {
  if (state.lifepoints)
  state.upgrades.clickIncrease++;
  
}

// function getCost(state: GameState, upgrade: Upgrades): number {
//   // checks if you have X amount of Y upgrade, and then returns the cost of it
//   // as in it looks at how many upgrade stacks you got of the given upgrade and retuirns the cost base off that
//   if (upgrade)
//   state.
//   return 0;
// }
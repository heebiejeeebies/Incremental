import { GameState, Leaf } from "./main";

export const LEAF_COST = 50;

function randomLeaf(): Leaf {
  // scattered in an ellipse around de tree
  const centerX = 51;
  const centerY = 27.5;
  const radiusX = 19;
  const radiusY = 22.5;

  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.sqrt(Math.random()); 

  return {
    x: centerX + Math.cos(angle) * radius * radiusX,
    y: centerY + Math.sin(angle) * radius * radiusY,
    rotation: Math.random() * 360,
  };
}

export function buyLeaf(state: GameState): boolean {
  if (state.lifepoints < LEAF_COST) return false;
  state.lifepoints -= LEAF_COST;
  for (let i = 0; i < 5; i++) {
    state.leaves.push(randomLeaf());
  }
  return true;
}

export function clearLeaves(state: GameState): void {
  state.leaves = [];
}

// import { GameState, Upgrades} from "./main";

// function buyClickIncrease(state: GameState) {
//   if (state.lifepoints)
//   state.upgrades.clickIncrease++;
  
// }

// // function getCost(state: GameState, upgrade: Upgrades): number {
// //   // checks if you have X amount of Y upgrade, and then returns the cost of it
// //   // as in it looks at how many upgrade stacks you got of the given upgrade and retuirns the cost base off that
// //   if (upgrade)
// //   state.
// //   return 0;
// // }
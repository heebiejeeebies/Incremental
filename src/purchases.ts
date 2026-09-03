import { GameState, Leaf} from "./main";

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

export function buyClickIncrease(state: GameState) {
  if (!state) return;

  if (state.lifepoints < getCostTemp(state)) return false;
  state.lifepoints -= LEAF_COST;

  state.upgrades.clickIncrease++;
}

export function buyPhotosynthesisIncrease(state: GameState) {
  if (!state) return;

  if (state.lifepoints < getCostTemp(state)) return false;
  state.lifepoints -= LEAF_COST;

  state.upgrades.photosynthesisIncrease++;
}

// Temp function for cost of the buying will, will be replaced when getCost is finished
function getCostTemp(state: GameState): number {
  return state.leaves.length;
}

// function getCost(state: GameState, upgrade: Upgrades): number {
//   // checks if you have X amount of Y upgrade, and then returns the cost of it
//   // as in it looks at how many upgrade stacks you got of the given upgrade and retuirns the cost base off that
  
//   // Placeholder cost
//   return state.leaves.length;
// }
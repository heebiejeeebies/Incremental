import { GameState, Leaf, Fruit} from "./main";
import {enqueue} from "./buffqueue";

export const LEAF_COST = 50;
export const FRUIT_COST = 20;
export const FRUIT_BUFF_DURATION= 60;


export function buyFruit(state: GameState): boolean {
  if (state.lifepoints < FRUIT_COST) return false;
  state.lifepoints -= FRUIT_COST;
  let type = Math.floor(Math.random() * 10);
  if (type < 2) {
    // dud
    state.fruit.push(createFruit("ethanberry"));
  } else if (type < 4) {
    state.lifepoints += FRUIT_COST + 10;
    state.fruit.push(createFruit("antonyberry"));
  } else if (type < 6) {
    enqueue(state.buffsqueue, {
      type: "will", 
      remainingTicks: FRUIT_BUFF_DURATION
    });
    state.fruit.push(createFruit("izaacberry"));
  } else if (type < 8) {
    enqueue(state.buffsqueue, {
      type: "leaf", 
      remainingTicks: FRUIT_BUFF_DURATION
    });
    state.fruit.push(createFruit("allenberry"));
  } else {
    enqueue(state.buffsqueue, {
      type: "will&leaf", 
      remainingTicks: FRUIT_BUFF_DURATION
    });
    state.fruit.push(createFruit("kevinberry"));
  }

  return true;
}

function createFruit(type: string): Fruit {
  const centerX = 51;
  const centerY = 27.5;
  const radiusX = 19;
  const radiusY = 22.5;

  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.sqrt(Math.random()); 

  return {
    x: centerX + Math.cos(angle) * radius * radiusX,
    y: centerY + Math.sin(angle) * radius * radiusY,
    typeName: type
  };
}

export function clearFruit(state: GameState): void {
  state.fruit = [];
}

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
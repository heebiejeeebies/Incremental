import { GameState, Leaf, Fruit} from "./main";
import {enqueue} from "./buffqueue";
// import Decimal from "break_eternity.js";

// export const LEAF_COST = 50;
// export const FRUIT_COST = 20;
export const FRUIT_BUFF_DURATION = 60;


export function buyFruit(state: GameState): boolean {
  let fruit_cost = getCost(state, 'FRUIT');

  if (state.lifepoints.lessThan(fruit_cost)) return false;
  state.lifepoints = state.lifepoints.minus(fruit_cost);
  let type = Math.floor(Math.random() * 10);
  if (type < 2) {
    // dud
    state.fruit.push(createFruit("ethanberry"));
  } else if (type < 4) {
    state.lifepoints = state.lifepoints.add(fruit_cost + 10);
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

export function randomLeaf(): Leaf {
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
  let leafCost = getCost(state, 'LEAF');

  if (state.lifepoints.lessThan(leafCost)) return false;
  state.lifepoints = state.lifepoints.minus(leafCost);
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
  let clickIncreaseCost = getCost(state, 'CLICKINCREASE');

  if (state.lifepoints.lessThan(clickIncreaseCost)) return false;
  state.lifepoints = state.lifepoints.minus(clickIncreaseCost);

  state.upgrades.clickIncrease = state.upgrades.clickIncrease.add(1);
}

export function buyPhotosynthesis(state: GameState) {
  if (!state) return;
  let photosynthesisCost = getCost(state, 'PHOTOSYNTHESIS');

  if (state.lifepoints.lessThan(photosynthesisCost)) return false;
  state.lifepoints = state.lifepoints.minus(photosynthesisCost);

  state.upgrades.photosynthesis = state.upgrades.photosynthesis.add(1);
}

export function buyAuraFarm(state: GameState) {
  const aurafarmCost = getCost(state, 'AURAFARM');

  if (!state) return;
   if (state.lifepoints.lessThan(aurafarmCost)) return false;
    state.lifepoints = state.lifepoints.minus(aurafarmCost);
    state.upgrades.aurafarm = state.upgrades.aurafarm.add(1);
    return true;
}

function getCost(state: GameState, upgrade: string): number {
  // checks if you have X amount of Y upgrade, and then returns the cost of it
  // as in it looks at how many upgrade stacks you got of the given upgrade and retuirns the cost base off that
  if (upgrade === 'CLICKINCREASE') {
  
  } else if (upgrade === 'FRUIT') {

  } else if (upgrade === 'PHOTOSYNTHESIS') {

  } else if (upgrade === 'AURAFARM') {
    
  }
  // Placeholder cost
  return state.leaves.length;
}
import { GameState, Extinction, defaultState } from "./main"
import { tickMeteor } from "./meteor"
import { randomLeaf } from "./purchases"
import {peep, dequeue} from "./buffqueue"

// time moving
export function countUp(state: GameState) {
  if (!state) return;
  state.tickCounter = (state.tickCounter + state.tickRate) % 500;

  // every second add a point for each leaf (including multipliers)
  if (state.tickCounter % 2 === 0) {
    const totalLeaves = state.upgrades.leaf.div(5);
    let increase = totalLeaves.mul(state.upgrades.photosynthesis);
    const activeBuff = peep(state.buffsqueue);
    if (activeBuff === "leaf" || activeBuff === "will&leaf") {
      increase = increase.mul(2);
    }
    state.lifepoints = state.lifepoints.add(increase);
  }

  // every 3 (for testing purpses) seconds add 5 leaves for each aura farm
  if (state.tickCounter % 3 === 0) {
    const totalAuraFarms = state.upgrades.auraFarm;
    for (let i = 0; i < totalAuraFarms * 5; i++) {
      state.leaves.push(randomLeaf());
    }
  }
  
  tickBuffs(state);

  if (tickMeteor()) {
    state.extinction = Extinction.ASTEROID;
  }
}

function tickBuffs(state: GameState) {
  if (state.buffsqueue.length === 0) return;
  state.buffsqueue[0].remainingTicks--;
  if (state.buffsqueue[0].remainingTicks <= 0) {
    dequeue(state.buffsqueue);
  }
}

// if tree dies, reset time
function resetTick(state: GameState) {
  if (!state) return;
  state.tickCounter = 0;
}

export function checkExtinctions(state: GameState) {
  // 1. flip the state to appropriate death if needed
  // conditions NOT FINISHED

  // 2. play animation of doom and despair
  if (state.extinction === Extinction.ALIVE) {
    return;
  } else if (state.extinction === Extinction.CHOP_TREE) {
    // play animation
    resetTick(state);
    timeLoopState(state);
  } else if (state.extinction === Extinction.ASTEROID) {
    // play animation
    resetTick(state);
    timeLoopState(state);
  } else if (state.extinction === Extinction.LASERED) {
    // play animation
    resetTick(state);
    timeLoopState(state);
  }
}

function timeLoopState(state: GameState) {
  const newloops = state.loops + 1;
  Object.assign(state, defaultState());
  state.loops = newloops;
}

import { GameState, Extinction, defaultState } from "./main"
import { tickMeteor } from "./meteor"
import { randomLeaf } from "./purchases"

// time moving
export function countUp(state: GameState) {
  if (!state) return;
  state.tickCounter = (state.tickCounter + state.tickRate) % 500;

  // every 2 seconds add a point for each 5 leaves
  if (state.tickCounter % 2 === 0) {
    const totalLeaves = (state.leaves.length / 5);
    state.lifepoints += totalLeaves * state.upgrades.photosynthesisIncrease;
  }

  // every 3 (for testing purpses) seconds add 5 leaves for each aura farm
  if (state.tickCounter % 3 === 0) {
    const totalAuraFarms = state.upgrades.auraFarm;
    for (let i = 0; i < totalAuraFarms * 5; i++) {
      state.leaves.push(randomLeaf());
    }
  }

  if (tickMeteor()) {
    state.extinction = Extinction.ASTEROID;
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

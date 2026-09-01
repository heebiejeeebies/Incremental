import { GameState, Extinction } from "./main"

// time moving
export function countUp(state: GameState) {
  if (!state) return;
  state.tickCounter = (state.tickCounter + state.tickRate) % 500;

  // every 2 seconds add a point for each 5 leaves
  if (state.tickCounter % 2 === 0) {
    state.lifepoints += (state.leaves.length / 5);
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
  } else if (state.extinction === Extinction.ASTEROID) {
    // play animation
    resetTick(state);
  } else if (state.extinction === Extinction.LASERED) {
    // play animation
    resetTick(state);
  }
}

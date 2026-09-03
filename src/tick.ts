import { GameState, Extinction, defaultState } from "./main"
import { tickMeteor } from "./meteor"
import {peep, dequeue} from "./buffqueue"

// time moving
export function countUp(state: GameState) {
  if (!state) return;
  state.tickCounter = (state.tickCounter + state.tickRate) % 500;

  // every 2 seconds add a point for each 5 leaves
  if (state.tickCounter % 2 === 0) {
    const totalLeaves = (state.leaves.length / 5);
    let increase = totalLeaves * state.upgrades.photosynthesisIncrease;
    const activeBuff = peep(state.buffsqueue);
    if (activeBuff === "leaf" || activeBuff === "will&leaf") {
      increase = increase * 2;
    }
    state.lifepoints += increase;
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

import { Dinosaur, GameState } from "./main";
import { sellDinosaurAt } from "./dinosaur";

export enum VenusPhase {
    IDLE,
    OPENMOUTH,
    LOOKINGDOWN,
}

export const TRAP_COST = 500;
export const TRAP_UNLOCK_FRUIT = 2;

const OPEN_MOUTH_DURATION_TICKS = 1;
const LOOKING_DOWN_DURATION_TICKS = 1;

const DEVOUR_REWARDS: Record<string, number> = {
  triceratops: 200,
  stegosaur: 400,
  brontosaur: 600,
  pteranadon: 800,
  trex: 1000,
  bevisaur: 1200,
};

let phase = VenusPhase.IDLE;
let phaseTicks = 0;
let pendingDevourDinosaur: Dinosaur | null = null;
let pendingDevourReward = 0;

export function getVenusPhase(): VenusPhase {
  return phase;
}

export function buyTrap(state: GameState): boolean {
  if (state.hasVenusTrap) return false;
  if (state.fruit.length < TRAP_UNLOCK_FRUIT) return false;
  if (state.lifepoints.lessThan(TRAP_COST)) return false;

  state.lifepoints = state.lifepoints.minus(TRAP_COST);
  const consumedFruitIndex = Math.floor(Math.random() * state.fruit.length);
  state.fruit.splice(consumedFruitIndex, 1);
  state.hasVenusTrap = true;
  return true;
}

export function startDevour(state: GameState, index: number): boolean {
  if (!state.hasVenusTrap) return false;
  if (phase !== VenusPhase.IDLE) return false;
  if (index < 0 || index >= state.dinosaurslot.length) return false;

  const dinosaur = state.dinosaurslot[index];
  pendingDevourDinosaur = dinosaur;
  pendingDevourReward = DEVOUR_REWARDS[dinosaur.name] ?? 0;
  phase = VenusPhase.OPENMOUTH;
  phaseTicks = 0;
  return true;
}

export function tickTrap(state: GameState): void {
  if (phase === VenusPhase.IDLE) return;

  phaseTicks++;

  if (phase === VenusPhase.OPENMOUTH && phaseTicks >= OPEN_MOUTH_DURATION_TICKS) {
    phase = VenusPhase.LOOKINGDOWN;
    phaseTicks = 0;
  } else if (phase === VenusPhase.LOOKINGDOWN && phaseTicks >= LOOKING_DOWN_DURATION_TICKS) {
    phase = VenusPhase.IDLE;
    phaseTicks = 0;

    if (pendingDevourDinosaur !== null) {
      const index = state.dinosaurslot.indexOf(pendingDevourDinosaur);
      if (index !== -1) {
        sellDinosaurAt(state, index);
        state.lifepoints = state.lifepoints.add(pendingDevourReward);
      }
    }
    pendingDevourDinosaur = null;
    pendingDevourReward = 0;
  }
}

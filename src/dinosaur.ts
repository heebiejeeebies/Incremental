import { Dinosaur, GameState } from "./main";

export enum dinosaurphase {
    STRUTTING,
    VIBING,
    RECRUITED,
    LEAVING
}

export const TIME_FOR_DINO_PATIENCE = 20;
export const MIN_FRUIT_TO_SPAWN = 1;

const STRUT_DURATION_TICKS = 3;
export const LEAVE_DURATION_TICKS = 2;
const MODIFIER_CHANCE = 100;

const DINOSAUR_COSTS: Record<string, number> = {
  triceratops: 700,
  stegosaur: 1000,
  brontosaur: 1200,
  pteranadon: 1400,
  trex: 1600,
  bevisaur: 2000,
};

export function buyDinosaur(state: GameState, dinosaur: Dinosaur) {
  if (state.dinosaurslot.length < state.dinomaxslots) {
    state.dinosaurslot.push(dinosaur);
  } else {
    for (let i = 0; i < state.dinomaxslots - 1; i++) {
        state.dinosaurslot[i] = state.dinosaurslot[i + 1];
    }

    state.dinosaurslot[state.dinomaxslots - 1] = dinosaur;
  }

  const cost = DINOSAUR_COSTS[dinosaur.name] ?? 0;
  state.lifepoints = state.lifepoints.minus(cost);
}

export const GROUND_ELEVATION_Y = 80;

export function trySpawnDinosaur(state: GameState): void {
  if (state.activeDinosaur !== null) return;
  if (state.fruit.length < MIN_FRUIT_TO_SPAWN) return;

  const dinosaur = generateRandomDinosaur();
  const entry = randomEdgePosition();
  state.activeDinosaur = {
    ...dinosaur,
    x: 10 + Math.random() * 80, 
    y: GROUND_ELEVATION_Y,
    entryX: entry.x,
    entryY: entry.y,
  };
}

function randomEdgePosition(): { x: number; y: number } {
  const fromLeft = Math.random() < 0.5;
  return { x: fromLeft ? -10 : 110, y: GROUND_ELEVATION_Y };
}

export function recruitActiveDinosaur(state: GameState): boolean {
  const dinosaur = state.activeDinosaur;
  if (!dinosaur) return false;

  const canRecruit = dinosaur.phase === dinosaurphase.STRUTTING || dinosaur.phase === dinosaurphase.VIBING;
  if (canRecruit) {
    buyDinosaur(state, dinosaur);
  }
  state.activeDinosaur = null;
  return canRecruit;
}

export function generateRandomDinosaur(): Dinosaur {
    let rand = Math.floor(Math.random() * 100);
    let modifier_rand = Math.floor(Math.random() * 100);
    let mod_type = "none";
    if (modifier_rand < MODIFIER_CHANCE) {
        mod_type = "something"  // add more modifiers if they wanna
    }

    if (rand < 20) {
        return {
            name: "triceratops",
            phase: dinosaurphase.STRUTTING,
            modifier: mod_type,
            ticks: 0
        }
    } else if (rand < 40) {
        return {
            name: "stegosaur",
            phase: dinosaurphase.STRUTTING,
            modifier: mod_type,
            ticks: 0
        }
    } else if (rand < 60) {
        return {
            name: "brontosaur",
            phase: dinosaurphase.STRUTTING,
            modifier: mod_type,
            ticks: 0
        }
    } else if (rand < 80) {
        return {
            name: "pteranadon",
            phase: dinosaurphase.STRUTTING,
            modifier: mod_type,
            ticks: 0
        }
    } else if (rand < 90) {
        return {
            name: "trex",
            phase: dinosaurphase.STRUTTING,
            modifier: mod_type,
            ticks: 0
        }
    } else {
        return {
            name: "bevisaur",
            phase: dinosaurphase.STRUTTING,
            modifier: mod_type,
            ticks: 0
        }
    }
}

export function sellDinosaur(state: GameState, dinosaur: Dinosaur) {
    const index = state.dinosaurslot.findIndex(
        (d) => d.name === dinosaur.name && d.modifier === dinosaur.modifier
    );
    if (index !== -1) {
        state.dinosaurslot.splice(index, 1);
    }
}

export function sellDinosaurAt(state: GameState, index: number) {
    if (index < 0 || index >= state.dinosaurslot.length) return;
    state.dinosaurslot.splice(index, 1);
}

export function tickDinosaur(dinosaur: Dinosaur): boolean {
    if (dinosaur.phase === dinosaurphase.STRUTTING) {
        dinosaur.ticks++;
        if (dinosaur.ticks >= STRUT_DURATION_TICKS) {
            dinosaur.phase = dinosaurphase.VIBING;
        }
        return false;
    } else if (dinosaur.phase === dinosaurphase.VIBING) {
        dinosaur.ticks++;
        if (dinosaur.ticks >= TIME_FOR_DINO_PATIENCE) {
            dinosaur.phase = dinosaurphase.LEAVING;
        }
        return false;
    } else if (dinosaur.phase === dinosaurphase.LEAVING) {
        dinosaur.ticks++;
        return dinosaur.ticks >= TIME_FOR_DINO_PATIENCE + LEAVE_DURATION_TICKS;
    }
    return false;
}

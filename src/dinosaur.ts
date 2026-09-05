import { Dinosaur, GameState, Poop } from "./main";

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

const DINOSAUR_SPAWN_WEIGHTS: Record<string, number> = {
  triceratops: 20,
  stegosaur: 20,
  brontosaur: 20,
  pteranadon: 20,
  trex: 10,
  bevisaur: 10,
};

export const GROUND_ELEVATION_Y = 80;

// Where recruited dinosaurs park their asses, near the tree
export const DINOSAUR_PARK_BASE_X = 55;
export const DINOSAUR_PARK_Y = GROUND_ELEVATION_Y;
const DINOSAUR_PARK_SPACING_X = 8;

export function buyDinosaur(state: GameState, dinosaur: Dinosaur) {
  const parkIndex = Math.min(state.dinosaurslot.length, state.dinomaxslots - 1);
  const parkedDinosaur: Dinosaur = {
    name: dinosaur.name,
    phase: dinosaurphase.RECRUITED,
    modifier: dinosaur.modifier,
    ticks: 0,
    x: DINOSAUR_PARK_BASE_X + parkIndex * DINOSAUR_PARK_SPACING_X,
    y: DINOSAUR_PARK_Y,
  };

  if (state.dinosaurslot.length < state.dinomaxslots) {
    state.dinosaurslot.push(parkedDinosaur);
  } else {
    for (let i = 0; i < state.dinomaxslots - 1; i++) {
        state.dinosaurslot[i] = state.dinosaurslot[i + 1];
    }

    state.dinosaurslot[state.dinomaxslots - 1] = parkedDinosaur;
  }
}

export function trySpawnDinosaur(state: GameState): void {
  if (state.activeDinosaur !== null) return;
  if (state.fruit.length < MIN_FRUIT_TO_SPAWN) return;

  const dinosaur = generateRandomDinosaur();
  const entry = randomEdgePosition();
  state.activeDinosaur = {
    ...dinosaur,
    x: 10 + Math.random() * 80, // where it settles once it's done wandering in
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
    const modifier_rand = Math.floor(Math.random() * 100);
    const mod_type = modifier_rand < MODIFIER_CHANCE ? "something" : "none"; // add more modifiers if they wanna

    const names = Object.keys(DINOSAUR_SPAWN_WEIGHTS);
    const totalWeight = names.reduce((sum, name) => sum + DINOSAUR_SPAWN_WEIGHTS[name], 0);
    let roll = Math.random() * totalWeight;
    let chosenName = names[names.length - 1];
    for (const name of names) {
        if (roll < DINOSAUR_SPAWN_WEIGHTS[name]) {
            chosenName = name;
            break;
        }
        roll -= DINOSAUR_SPAWN_WEIGHTS[name];
    }

    return {
        name: chosenName,
        phase: dinosaurphase.STRUTTING,
        modifier: mod_type,
        ticks: 0,
        x: 0, 
        y: 0,
    };
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

const VIBE_WANDER_RANGE = 5;
const VIBE_X_MIN = 10;
const VIBE_X_MAX = 90;

export function tickDinosaur(dinosaur: Dinosaur): boolean {
    if (dinosaur.phase === dinosaurphase.STRUTTING) {
        dinosaur.ticks++;
        if (dinosaur.ticks >= STRUT_DURATION_TICKS) {
            dinosaur.phase = dinosaurphase.VIBING;
        }
        return false;
    } else if (dinosaur.phase === dinosaurphase.VIBING) {
        dinosaur.ticks++;
        const delta = (Math.random() * 2 - 1) * VIBE_WANDER_RANGE;
        dinosaur.x = Math.min(VIBE_X_MAX, Math.max(VIBE_X_MIN, dinosaur.x + delta));
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

const POOP_CHANCE_SCALE = 1;
function poopChanceFor(name: string): number {
  const weight = DINOSAUR_SPAWN_WEIGHTS[name] ?? 20;
  return POOP_CHANCE_SCALE / weight;
}

const POOP_DROP_SPEED = 4; 
const POOP_SPAWN_OFFSET_Y = 6; 

export function tickPoop(state: GameState): void {
  for (const dinosaur of state.dinosaurslot) {
    if (Math.random() < poopChanceFor(dinosaur.name)) {
      const poop: Poop = { x: dinosaur.x, y: dinosaur.y + POOP_SPAWN_OFFSET_Y };
      state.poop.push(poop);
    }
  }

  for (const poop of state.poop) {
    poop.y += POOP_DROP_SPEED;
  }
  state.poop = state.poop.filter((poop) => poop.y <= 100);
}

export const POOP_VALUE = 25;

export function collectPoop(state: GameState, poop: Poop): void {
  const index = state.poop.indexOf(poop);
  if (index === -1) return;
  state.poop.splice(index, 1);
  state.lifepoints = state.lifepoints.add(POOP_VALUE);
}

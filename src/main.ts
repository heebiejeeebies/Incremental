import { countUp, checkExtinctions } from "./tick";
import { render } from "../FrontEnd/FrontEnd.js";
import Decimal from "break_eternity.js";

const SAVE_KEY = 'incremental-save';
const TICK_INTERVAL_MS = 1000;

export enum Extinction {
  ALIVE, // 0
  CHOP_TREE, // 1
  ASTEROID, // 2
  LASERED // 3
}

export interface Leaf {
  x: number; // coords
  y: number; 
  rotation: number; // rotation
}

export interface Buff {
  type: string;
  remainingTicks: number;
}

export interface Fruit {
  x: number; // coords
  y: number; 
  typeName: string; // rotation
}

export interface GameState {
  loops: number;
  lifepoints: Decimal;
  will: Decimal;
  upgrades: Upgrades;
  leaves: Leaf[];
  fruit: Fruit[];
  buffsqueue: Buff[];
  tickCounter: number;
  tickRate: number;
  extinction: Extinction;
}

export interface Upgrades {
  clickIncrease: Decimal,
  leaf: Decimal,
  photosynthesis: Decimal,
  aurafarm: Decimal
  // add other upgrades which could be objects that contain other special fields
}

export function defaultState(): GameState {
  return {
    loops: 0,
    lifepoints: new Decimal(0),
    will: new Decimal(1),
    upgrades: {
      clickIncrease: new Decimal(0),
      leaf: new Decimal(0),
      photosynthesis: new Decimal(0), // life point per leaf/s
      aurafarm: new Decimal(0)
      // add more upgrades
    },
    leaves: [],
    buffsqueue: [],
    fruit: [],
    tickCounter: 0,
    tickRate: 1,
    extinction: Extinction.ALIVE,
  };
}

function loadState(): GameState {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return defaultState();
  }
  // ensures nothings null. prolly works
  const merged = { ...defaultState(), ...JSON.parse(raw) } as GameState;

  // Decimal serializes to a plain string via JSON.stringify, and JSON.parse
  // just hands that string back -- it does NOT revive a real Decimal
  // instance. Without re-wrapping these here, every field below would be a
  // string/number by the time it reaches render()/tick logic, which call
  // Decimal-only methods like .floor()/.lessThan()/.add() on them and crash.
  merged.lifepoints = new Decimal(merged.lifepoints);
  merged.will = new Decimal(merged.will);
  merged.upgrades = {
    clickIncrease: new Decimal(merged.upgrades.clickIncrease),
    leaf: new Decimal(merged.upgrades.leaf),
    photosynthesis: new Decimal(merged.upgrades.photosynthesis),
    aurafarm: new Decimal(merged.upgrades.aurafarm),
  };

  return merged;
}

function saveState(state: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

const state = loadState();

function update() {
  saveState(state);
  render(state, update);
}

update();

setInterval(() => {
  countUp(state);
  checkExtinctions(state);
  update();
}, TICK_INTERVAL_MS);

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
  photosynthesis: Decimal
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
      photosynthesis: new Decimal(1) // life point per leaf/s
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
  return { ...defaultState(), ...JSON.parse(raw) } as GameState;
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

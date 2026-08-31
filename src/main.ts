import { countUp, checkExtinctions } from "./tick";
import { render } from "../FrontEnd/FrontEnd.js";

const SAVE_KEY = 'incremental-save';
const TICK_INTERVAL_MS = 1000;

export enum Extinction {
  ALIVE, // 0
  CHOP_TREE, // 1
  ASTEROID, // 2
  LASERED // 3
}

export interface GameState {
  lifepoints: number;
  clickValue: number;
  upgrades: Upgrades;
  tickCounter: number;
  tickRate: number;
  extinction: Extinction;
}

export interface Upgrades {
  clickIncrease: number,
  // add other upgrades which could be objects that contain other special fields
  
}

function loadState(): GameState {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return { lifepoints: 0, 
      clickValue: 1,
      upgrades: {
        clickIncrease: 0,
        // add more upgrades
      },
      tickCounter: 0, 
      tickRate: 1, 
      extinction: Extinction.ALIVE };
  }
  return JSON.parse(raw) as GameState;
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

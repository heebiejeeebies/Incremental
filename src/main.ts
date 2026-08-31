import { countUp, checkExtinctions } from "./tick";

const app = document.querySelector<HTMLDivElement>('#app')!;

const SAVE_KEY = 'incremental-save';
const skib_COST = 5;
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

function render() {
  app.innerHTML = `
    <h1>Incremental</h1>
    <p>lifepoints: <span id="count">${state.lifepoints}</span></p>
    <button id="gather">Gather</button>
    <button id="skib" ${state.lifepoints < skib_COST ? 'disabled' : ''}>
      Skib Tree (${skib_COST} lifepoints)
    </button>
  `;

  document.querySelector<HTMLButtonElement>('#gather')!.addEventListener('click', () => {
    state.lifepoints++;
    saveState(state);
    render();
  });

  document.querySelector<HTMLButtonElement>('#skib')!.addEventListener('click', () => {
    if (state.lifepoints < skib_COST) return;
    state.lifepoints -= skib_COST;
    saveState(state);
    render();
  });
}

render();

setInterval(() => {
  countUp(state);
  checkExtinctions(state);
  saveState(state);
  render();
}, TICK_INTERVAL_MS);

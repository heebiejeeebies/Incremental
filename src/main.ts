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
  currency: number;
  tree: {
    lifepoints: number;
  };
  tickCounter: number;
  tickRate: number;
  extinction: Extinction
}

function loadState(): GameState {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return { currency: 0, tree: { lifepoints: 0 }, tickCounter: 0, tickRate: 1, extinction: Extinction.ALIVE };
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
    <p>currency: <span id="count">${state.currency}</span></p>
    <p>Tree lifepoints: <span id="lifepoints">${state.tree.lifepoints}</span></p>
    <button id="gather">Gather</button>
    <button id="skib" ${state.currency < skib_COST ? 'disabled' : ''}>
      Skib Tree (${skib_COST} currency)
    </button>
  `;

  document.querySelector<HTMLButtonElement>('#gather')!.addEventListener('click', () => {
    state.currency++;
    saveState(state);
    render();
  });

  document.querySelector<HTMLButtonElement>('#skib')!.addEventListener('click', () => {
    if (state.currency < skib_COST) return;
    state.currency -= skib_COST;
    state.tree.lifepoints++;
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

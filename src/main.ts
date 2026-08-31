const app = document.querySelector<HTMLDivElement>('#app')!;

const SAVE_KEY = 'incremental-save';
const skib_COST = 5;

interface GameState {
  currency: number;
  tree: {
    lifepoints: number;
  };
}

function loadState(): GameState {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return { currency: 0, tree: { lifepoints: 0 } };
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
    <button id="currency" ${state.currency < skib_COST ? 'disabled' : ''}>
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

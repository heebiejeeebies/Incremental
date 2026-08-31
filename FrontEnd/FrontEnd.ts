import type { GameState } from '../src/main.js';

const app = document.querySelector<HTMLDivElement>('#app')!;

export function render(state: GameState, onChange: () => void): void {
  app.innerHTML = `
    <h1>Incremental</h1>
    <p>lifepoints: <span id="count">${state.lifepoints}</span></p>
    <button id="tree" class="tree-button">Tree</button>
  `;

  document.querySelector<HTMLButtonElement>('#tree')!.addEventListener('click', () => {
    state.lifepoints++;
    onChange();
  });
}

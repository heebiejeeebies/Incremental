import type { GameState } from '../src/main.js';
import {clickTree} from '../src/tree.js'
import dino_background from './assets/dinobackground.png'
import tree_image from './assets/treelol.png'
import bevis from './assets/bevis.png'

const app = document.querySelector<HTMLDivElement>('#app')!;

document.body.style.backgroundImage = `url(${dino_background})`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundRepeat = 'no-repeat';

export function render(state: GameState, onChange: () => void): void {
  app.innerHTML = `
    <h1>Incremental</h1>
    <img src="${bevis}" alt="Bevis" class="bevis-image" />
    <p>lifepoints: <span id="count">${state.lifepoints}</span></p>
    <button id="tree" class="tree-button">
      <img src="${tree_image}" alt="Tree" />
    </button>
  `;

  document.querySelector<HTMLButtonElement>('#tree')!.addEventListener('click', () => {
    clickTree(state);
    onChange();
  });
}

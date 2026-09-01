import type { GameState } from '../src/main.js';
import {clickTree} from '../src/tree.js'
import { buyLeaf, clearLeaves, LEAF_COST } from '../src/purchases.js'
import dino_background from './assets/background.png'
import tree_image from './assets/treewow.png'
import bevis from './assets/bevis.png'
import leaf_image from './assets/leaf.png'

const app = document.querySelector<HTMLDivElement>('#app')!;

document.body.style.backgroundImage = `url(${dino_background})`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundRepeat = 'no-repeat';

function renderLeaves(state: GameState): string {
  return state.leaves
    .map(
      (leaf) =>
        `<img src="${leaf_image}" alt="Leaf" class="leaf-image" style="left: ${leaf.x}%; top: ${leaf.y}%; transform: translate(-50%, -50%) rotate(${leaf.rotation}deg);" />`
    )
    .join('');
}

export function render(state: GameState, onChange: () => void): void {
  app.innerHTML = `
    <h1>Incremental</h1>
    <img src="${bevis}" alt="Bevis" class="bevis-image" />
    <p>lifepoints: <span id="count">${state.lifepoints}</span></p>
    <div class="tree-container">
      <button id="tree" class="tree-button">
        <img src="${tree_image}" alt="Tree" />
      </button>
      ${renderLeaves(state)}
    </div>
    <button id="buy-leaf" ${state.lifepoints < LEAF_COST ? 'disabled' : ''}>
      Buy Leaf (${LEAF_COST} lifepoints)
    </button>
    <button id="clear-leaves">Clear Leaves</button>
  `;

  document.querySelector<HTMLButtonElement>('#tree')!.addEventListener('click', () => {
    clickTree(state);
    onChange();
  });

  document.querySelector<HTMLButtonElement>('#buy-leaf')!.addEventListener('click', () => {
    if (buyLeaf(state)) {
      onChange();
    }
  });

  document.querySelector<HTMLButtonElement>('#clear-leaves')!.addEventListener('click', () => {
    clearLeaves(state);
    onChange();
  });
}

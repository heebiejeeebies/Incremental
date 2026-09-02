import type { GameState } from '../src/main.js';
import {clickTree} from '../src/tree.js'
import { buyLeaf, clearLeaves, LEAF_COST } from '../src/purchases.js'
import { getMeteorSize, getMeteorBurnedness, getMeteorPhase, MeteorPhase, SIZE_FOR_BOOM } from '../src/meteor.js'
import dino_background from './assets/background.png'
import tree_image from './assets/treewow.png'
import bevis from './assets/bevis.png'
import leaf_image from './assets/leaf.png'
import meteor_image from './assets/meatball.png'
import fire_image from './assets/fiyah.png'
import explosion_image from './assets/explosion.png'

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

// The meteor is a persistent DOM element created once, outside app.innerHTML's
// render cycle. A full innerHTML rebuild on every tick would destroy and
// recreate this element each time, which breaks CSS transitions -- the browser
// never sees a "before" state to animate from, so it would just teleport to
// wherever the current phase says it should be instead of flying there.
const meteorContainer = document.createElement('div');
meteorContainer.className = 'meteor-container';
meteorContainer.innerHTML = `
  <img src="${meteor_image}" alt="Meteor" class="meteor-img" />
  <img src="${fire_image}" alt="Fire" class="fire-img" />
`;
document.body.appendChild(meteorContainer);
const meteorFireImg = meteorContainer.querySelector<HTMLImageElement>('.fire-img')!;

function updateMeteor(): void {
  const phase = getMeteorPhase();

  if (phase === MeteorPhase.EXPLODING) {
    meteorContainer.style.display = 'none';
    return;
  }

  meteorContainer.style.display = '';
  const sizeFraction = Math.min(getMeteorSize() / SIZE_FOR_BOOM, 1);
  const pixelSize = 40 + sizeFraction * 120; // grows from 40px up to 160px
  meteorContainer.style.width = `${pixelSize}px`;
  meteorContainer.style.height = `${pixelSize}px`;
  meteorFireImg.style.opacity = String(Math.min(getMeteorBurnedness() / SIZE_FOR_BOOM, 1));
  meteorContainer.classList.toggle('flying', phase === MeteorPhase.FLYING_TO_CENTER);
}

function renderExplosion(): string {
  if (getMeteorPhase() !== MeteorPhase.EXPLODING) return '';
  return `<img src="${explosion_image}" alt="Explosion" class="explosion-image" />`;
}

export function render(state: GameState, onChange: () => void): void {
  app.innerHTML = `
    <h1>Incremental</h1>
    <img src="${bevis}" alt="Bevis" class="bevis-image" />
    <p>lifepoints: <span id="count">${Math.floor(state.lifepoints)}</span></p>
    <p>loops: ${state.loops}</p>
    <div class="tree-container">
      <button id="tree" class="tree-button">
        <img src="${tree_image}" alt="Tree" />
      </button>
      ${renderLeaves(state)}
      ${renderExplosion()}
    </div>
    <button id="buy-leaf" ${state.lifepoints < LEAF_COST ? 'disabled' : ''}>
      Buy Leaf (${LEAF_COST} lifepoints)
    </button>
    <button id="clear-leaves">Clear Leaves</button>
  `;

  updateMeteor();

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

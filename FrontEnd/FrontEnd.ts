import type { GameState } from '../src/main.js';
import {clickTree} from '../src/tree.js'
import { buyLeaf, clearLeaves, buyFruit, buyAuraFarm, clearFruit, buyClickIncrease, buyPhotosynthesis } from '../src/purchases.js'
import { getMeteorSize, getMeteorBurnedness, getMeteorPhase, MeteorPhase, SIZE_FOR_BOOM } from '../src/meteor.js'
import dino_background from './assets/background.png'
import tree_image from './assets/treewow.png'
import bevis from './assets/bevis.png'
import leaf_image from './assets/leaf.png'
import meteor_image from './assets/meatball.png'
import fire_image from './assets/fiyah.png'
import explosion_image from './assets/explosion.png'
import allen_image from './assets/allen.png'
import antony_image from './assets/antony.png'
import ethan_image from './assets/ethan.png'
import izaac_image from './assets/izaac.png'
import gigachad_image from './assets/gigachad.png'
import { costAurafarm, costClickIncrease, costFruit, costLeaf, costPhotoSynthesis } from '../src/growth.js';
import Decimal from 'break_eternity.js';

const app = document.querySelector<HTMLDivElement>('#app')!;

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 2000;

const HUD_HEIGHT_ESTIMATE = 180;
const TREE_POSITION = {
  x: window.innerWidth / 2 + 125,
  y: HUD_HEIGHT_ESTIMATE + (window.innerHeight - HUD_HEIGHT_ESTIMATE) / 2 - 20,
};
const METEOR_START_POSITION = { x: 400, y: 300 };
const BEVIS_POSITION = { x: 500, y: 500 };

const BACKGROUND_WIDTH = window.innerWidth;

let showStats = false;

function renderLeaves(state: GameState): string {
  return state.leaves
    .map(
      (leaf) =>
        `<img src="${leaf_image}" alt="Leaf" class="leaf-image" style="left: ${leaf.x}%; top: ${leaf.y}%; transform: translate(-50%, -50%) rotate(${leaf.rotation}deg);" />`
    )
    .join('');
}

const FRUIT_IMAGES: Record<string, string> = {
  ethanberry: ethan_image,
  antonyberry: antony_image,
  izaacberry: izaac_image,
  allenberry: allen_image,
  kevinberry: gigachad_image,
};

function renderFruit(state: GameState): string {
  return state.fruit
    .map(
      (fruit) =>
        `<img src="${FRUIT_IMAGES[fruit.typeName]}" alt="${fruit.typeName}" class="fruit-image" style="left: ${fruit.x}%; top: ${fruit.y}%;" />`
    )
    .join('');
}

const BUFF_LABELS: Record<string, string> = {
  will: 'Click x2',
  leaf: 'Leaf x2',
  'will&leaf': 'Click x2 & Leaf x2',
};

function renderActiveBuff(state: GameState): string {
  if (state.buffsqueue.length === 0) return '';
  const buff = state.buffsqueue[0];
  const label = BUFF_LABELS[buff.type] ?? buff.type;
  return `<p>Active buff: ${label} (${buff.remainingTicks}s left)</p>`;
}

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

  if (phase === MeteorPhase.EXPLODING || phase === MeteorPhase.GAME_OVER) {
    meteorContainer.style.display = 'none';
    return;
  }

  meteorContainer.style.display = '';
  const sizeFraction = Math.min(getMeteorSize() / SIZE_FOR_BOOM, 1);
  const pixelSize = 40 + sizeFraction * 120; 
  meteorContainer.style.width = `${pixelSize}px`;
  meteorContainer.style.height = `${pixelSize}px`;
  meteorFireImg.style.opacity = String(Math.min(getMeteorBurnedness() / SIZE_FOR_BOOM, 1));

  const target = phase === MeteorPhase.FLYING_TO_CENTER ? TREE_POSITION : METEOR_START_POSITION;
  meteorContainer.style.left = `${target.x}px`;
  meteorContainer.style.top = `${target.y}px`;
}

const cheat = document.createElement('div');
cheat.innerHTML = `
  <input type="text" id="cheat" placeholder="get bajillion LP" style= "pointer-events: auto; cursor: text;" />
  <button id="cheat-button">Add LP</button>
`;
document.body.appendChild(cheat);


function renderExplosion(): string {
  if (getMeteorPhase() !== MeteorPhase.EXPLODING) return '';
  return `<img src="${explosion_image}" alt="Explosion" class="explosion-image" />`;
}

function renderGameOver(): string {
  if (getMeteorPhase() !== MeteorPhase.GAME_OVER) return '';
  return `<div class="game-over-text">GAME OVER</div>`;
}

export function render(state: GameState, onChange: () => void): void {
  const leafCost = costLeaf(state.upgrades.leaf);
  const fruitCost = costFruit(state.fruit.length);
  const photosynthesisCost = costPhotoSynthesis(state.upgrades.photosynthesis);
  const clickIncreaseCost = costClickIncrease(state.upgrades.clickIncrease);
  const aurafarmCost = costAurafarm(state.upgrades.aurafarm);

  app.innerHTML = `
    <div class="world" style="width: ${WORLD_WIDTH}px; height: ${WORLD_HEIGHT}px; background-image: url(${dino_background}); background-size: ${BACKGROUND_WIDTH}px auto;">
      <img src="${bevis}" alt="Bevis" class="bevis-image" style="left: ${BEVIS_POSITION.x}px; top: ${BEVIS_POSITION.y}px;" />
      <div class="tree-container" style="left: ${TREE_POSITION.x}px; top: ${TREE_POSITION.y}px;">
        <button id="tree" class="tree-button">
          <img src="${tree_image}" alt="Tree" />
        </button>
        ${renderLeaves(state)}
        ${renderFruit(state)}
        ${renderExplosion()}
      </div>
    </div>
    <div class="hud">
      <h1>Incremental</h1>
      <p>lifepoints: <span id="count">${state.lifepoints.floor().toString()}</span></p>
      <p>loops: ${state.loops}</p>
      ${renderActiveBuff(state)}
      <button id="buy-leaf" ${state.lifepoints.lessThan(leafCost) ? 'disabled' : ''}>
        Buy Leaf (${leafCost} lifepoints)
      </button>
      <button id="clear-leaves">Clear Leaves</button>
       <button id="buy-click-increase" ${state.lifepoints.lessThan(clickIncreaseCost) ? 'disabled' : ''}>
        Buy Click Increase (${clickIncreaseCost} lifepoints)
      </button>
      <button id="buy-aurafarm" ${state.lifepoints.lessThan(aurafarmCost) ? 'disabled' : ''}>
        Buy Aurafarm (${aurafarmCost} lifepoints)
      </button>
      <button id="buy-photosynthesis" ${state.lifepoints.lessThan(photosynthesisCost) ? 'disabled' : ''}>
        Buy Photosynthesis (${photosynthesisCost} lifepoints)
      </button>
      <button id="buy-fruit" ${state.lifepoints.lessThan(fruitCost) ? 'disabled' : ''}>
        Buy Fruit (${fruitCost} lifepoints)
      </button>
      <button id="clear-fruit">Clear Fruit</button>
      <button id="toggle-stats">
        ${showStats ? 'Hide Stats' : 'Show Stats'}
      </button>
      ${showStats ? `
        <div class="stats-panel">
          <p> WILL: ${state.will}</p>
          <p> Click Increases: ${state.upgrades.clickIncrease}</p>
          <p> Leaves: ${state.upgrades.leaf.toString()}</p>
          <p> Fruits: ${state.fruit.length}</p>
          <p> Aurafarms: ${state.upgrades.aurafarm.toString()}</p>
          <p> Photosynthesis: ${state.upgrades.photosynthesis.toString()}</p>
        </div>
      ` : ''}
    </div>
    ${renderGameOver()}
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

  document.querySelector<HTMLButtonElement>('#buy-aurafarm')!.addEventListener('click', () => {
    if (buyAuraFarm(state)) {
      onChange();
    }
  });

  document.querySelector<HTMLButtonElement>('#buy-photosynthesis')!.addEventListener('click', () => {
    if (buyPhotosynthesis(state)) {
      onChange();
    }
  });

  document.querySelector<HTMLButtonElement>('#buy-click-increase')!.addEventListener('click', () => {
    if (buyClickIncrease(state)) {
      onChange();
    }
  });

  document.querySelector<HTMLButtonElement>('#buy-fruit')!.addEventListener('click', () => {
    if (buyFruit(state)) {
      onChange();
    }
  });

  document.querySelector<HTMLButtonElement>('#clear-fruit')!.addEventListener('click', () => {
    clearFruit(state);
    onChange();
  });

  document.querySelector<HTMLButtonElement>('#toggle-stats')?.addEventListener('click', () => {
    showStats = !showStats;
    onChange();
  });

  document.querySelector<HTMLButtonElement>('#cheat-button')?.addEventListener('click', () => {
    const input = document.querySelector<HTMLInputElement>('#cheat');
    if (!input) return;

    const amountToAdd = new Decimal(input.value);
    state.lifepoints = state.lifepoints.add(amountToAdd);
    input.value = ''; 
    onChange();
  });
}

import type { GameState, Poop } from '../src/main.js';
import {clickTree} from '../src/tree.js'
import { buyLeaf, clearLeaves, buyFruit, buyAuraFarm, clearFruit, buyClickIncrease, buyPhotosynthesis } from '../src/purchases.js'
import { getMeteorSize, getMeteorBurnedness, getMeteorPhase, MeteorPhase, SIZE_FOR_BOOM } from '../src/meteor.js'
import ground_image from './assets/ground.png'
import sun_image from './assets/sun.png'
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
import { recruitActiveDinosaur, sellDinosaurAt, collectPoop, dinosaurphase } from '../src/dinosaur.js';
import { buyTrap, startDevour, getVenusPhase, VenusPhase, TRAP_COST, TRAP_UNLOCK_FRUIT } from '../src/venustrap.js';
import trike_image from './assets/trike.png'
import steg_image from './assets/steg.png'
import bront_image from './assets/bront.png'
import ptera_image from './assets/ptera.png'
import rex_image from './assets/rex.png'
import poop_image from './assets/poop.png'
import dinomuncher_image from './assets/dinomuncher.png'
import dinomuncheropen_image from './assets/dinomunchermouthopen.png'
import dinomuncherlookingdown_image from './assets/dinomuncherlookingdown.png'
import Decimal from 'break_eternity.js';

const app = document.querySelector<HTMLDivElement>('#app')!;

const EXPANDED_WORLD_WIDTH = 4000;
const EXPANDED_WORLD_HEIGHT = 2000;
let worldUnlocked = false;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.0015; 
let zoomLevel = 1;

const GROUND_WIDTH = window.innerWidth;
const GROUND_HEIGHT = window.innerHeight;

const SUN_SIZE = 180;
const SUN_MARGIN = 40;
const SUN_POSITION = {
  x: window.innerWidth - SUN_MARGIN - SUN_SIZE / 2,
  y: SUN_MARGIN + SUN_SIZE / 2,
};

const TREE_POSITION = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2 + 120,
};
const METEOR_START_POSITION = { x: 400, y: 300 };
const BEVIS_POSITION = { x: 500, y: 650 };

const VENUS_TRAP_POSITION = { x: 1175, y: 750 };
const VENUS_TRAP_SIZE = 200;

const CONTROLS_WIDTH = 300;
const CONTROLS_POSITION = { x: 40, y: 40 };
const STATS_PANEL_POSITION = { x: CONTROLS_POSITION.x + CONTROLS_WIDTH + 20, y: CONTROLS_POSITION.y };

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

const DINOSAUR_IMAGES: Record<string, string> = {
  triceratops: trike_image,
  stegosaur: steg_image,
  brontosaur: bront_image,
  pteranadon: ptera_image,
  trex: rex_image,
  bevisaur: bevis,
};

const dinosaurContainer = document.createElement('button');
dinosaurContainer.className = 'dinosaur-button';
dinosaurContainer.innerHTML = `<img alt="Dinosaur" />`;
document.body.appendChild(dinosaurContainer);
const dinosaurImg = dinosaurContainer.querySelector<HTMLImageElement>('img')!;

let lastSeenActiveDinosaur: GameState['activeDinosaur'] = null;
let lastSeenActiveDinosaurPhase: dinosaurphase | null = null;

function updateActiveDinosaur(state: GameState, worldWidth: number, worldHeight: number, zoomLevel: number): void {
  const dinosaur = state.activeDinosaur;

  if (!dinosaur) {
    dinosaurContainer.style.display = 'none';
    lastSeenActiveDinosaur = null;
    lastSeenActiveDinosaurPhase = null;
    return;
  }

  dinosaurContainer.style.display = '';
  dinosaurImg.src = DINOSAUR_IMAGES[dinosaur.name];
  dinosaurContainer.style.opacity = dinosaur.phase === dinosaurphase.LEAVING ? '0.3' : '1';
  dinosaurContainer.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;

  const restLeft = (dinosaur.x / 100) * worldWidth * zoomLevel;
  const restTop = (dinosaur.y / 100) * worldHeight * zoomLevel;

  if (dinosaur !== lastSeenActiveDinosaur) {
    // brand new spawn: snap to the entry point, then walk in to the rest
    // position over the full 3s strut duration
    lastSeenActiveDinosaur = dinosaur;
    lastSeenActiveDinosaurPhase = dinosaur.phase;
    const entryLeft = (dinosaur.entryX / 100) * worldWidth * zoomLevel;
    const entryTop = (dinosaur.entryY / 100) * worldHeight * zoomLevel;
    dinosaurContainer.style.transition = 'none';
    dinosaurContainer.style.left = `${entryLeft}px`;
    dinosaurContainer.style.top = `${entryTop}px`;
    void dinosaurContainer.offsetWidth;
    dinosaurContainer.style.transition = 'left 3s linear, top 3s linear, opacity 1s linear';
  } else if (dinosaur.phase !== lastSeenActiveDinosaurPhase) {
    lastSeenActiveDinosaurPhase = dinosaur.phase;
    if (dinosaur.phase === dinosaurphase.VIBING) {
      dinosaurContainer.style.transition = 'left 1s linear, top 1s linear, opacity 1s linear';
    }
  }

  dinosaurContainer.style.left = `${restLeft}px`;
  dinosaurContainer.style.top = `${restTop}px`;
}

let dinosaurClickListenerAttached = false;
function attachDinosaurClickListenerOnce(state: GameState, onChange: () => void): void {
  if (dinosaurClickListenerAttached) return;
  dinosaurClickListenerAttached = true;
  dinosaurContainer.addEventListener('click', () => {
    recruitActiveDinosaur(state);
    onChange();
  });
}

let selectedDinosaurIndex: number | null = null;

function renderDinosaurRoster(state: GameState): string {
  return state.dinosaurslot
    .map((dinosaur, index) => {
      const label = state.hasVenusTrap ? `Devour ${dinosaur.name}` : `Sell ${dinosaur.name}`;
      const sellPopup =
        selectedDinosaurIndex === index
          ? `<button class="sell-dinosaur-button" data-dino-index="${index}">${label}</button>`
          : '';
      return `
        <div class="parked-dinosaur" style="left: ${dinosaur.x}%; top: ${dinosaur.y}%;">
          <button class="parked-dinosaur-button" data-dino-index="${index}">
            <img src="${DINOSAUR_IMAGES[dinosaur.name]}" alt="${dinosaur.name}" />
          </button>
          ${sellPopup}
        </div>
      `;
    })
    .join('');
}

const poopContainer = document.createElement('div');
document.body.appendChild(poopContainer);
const poopElements = new Map<Poop, HTMLImageElement>();

function updatePoop(state: GameState, worldWidth: number, worldHeight: number, zoomLevel: number, onChange: () => void): void {
  const currentPoop = new Set(state.poop);

  for (const [poop, el] of poopElements) {
    if (!currentPoop.has(poop)) {
      el.remove();
      poopElements.delete(poop);
    }
  }

  for (const poop of state.poop) {
    const left = (poop.x / 100) * worldWidth * zoomLevel;
    const top = (poop.y / 100) * worldHeight * zoomLevel;
    const transform = `translate(-50%, -50%) scale(${zoomLevel})`;

    let el = poopElements.get(poop);
    if (!el) {
      el = document.createElement('img');
      el.src = poop_image;
      el.alt = 'Poop';
      el.className = 'poop-image';

      el.addEventListener('click', () => {
        collectPoop(state, poop);
        onChange();
      });
      poopContainer.appendChild(el);
      poopElements.set(poop, el);

      el.style.transition = 'none';
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.transform = transform;
      void el.offsetWidth; 
      el.style.transition = 'top 1s linear, left 1s linear';
    }

    el.style.transform = transform;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }
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

function updateMeteor(zoomLevel: number): void {
  const phase = getMeteorPhase();

  if (phase === MeteorPhase.EXPLODING || phase === MeteorPhase.GAME_OVER) {
    meteorContainer.style.display = 'none';
    return;
  }

  meteorContainer.style.display = '';
  meteorContainer.style.transform = `translate(-50%, -50%) rotate(-45deg) scale(${zoomLevel})`;
  const sizeFraction = Math.min(getMeteorSize() / SIZE_FOR_BOOM, 1);
  const pixelSize = 40 + sizeFraction * 120;
  meteorContainer.style.width = `${pixelSize}px`;
  meteorContainer.style.height = `${pixelSize}px`;
  meteorFireImg.style.opacity = String(Math.min(getMeteorBurnedness() / SIZE_FOR_BOOM, 1));

  const target = phase === MeteorPhase.FLYING_TO_CENTER ? TREE_POSITION : METEOR_START_POSITION;
  meteorContainer.style.left = `${target.x * zoomLevel}px`;
  meteorContainer.style.top = `${target.y * zoomLevel}px`;
}

const cheat = document.createElement('div');
cheat.innerHTML = `
  <input type="text" id="cheat" placeholder="get bajillion LP" style= "pointer-events: auto; cursor: text;" />
  <button id="cheat-button">Add LP</button>
  <button id="unlock-world-button">Unlock World</button>
`;
document.body.appendChild(cheat);


const VENUS_TRAP_IMAGES: Record<VenusPhase, string> = {
  [VenusPhase.IDLE]: dinomuncher_image,
  [VenusPhase.OPENMOUTH]: dinomuncheropen_image,
  [VenusPhase.LOOKINGDOWN]: dinomuncherlookingdown_image,
};

function renderVenusTrap(state: GameState): string {
  if (!state.hasVenusTrap) return '';
  const src = VENUS_TRAP_IMAGES[getVenusPhase()];
  return `<img src="${src}" alt="Venus Trap" class="venus-trap-image" style="left: ${VENUS_TRAP_POSITION.x}px; top: ${VENUS_TRAP_POSITION.y}px; width: ${VENUS_TRAP_SIZE}px;" />`;
}

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

  const worldWidth = worldUnlocked ? EXPANDED_WORLD_WIDTH : window.innerWidth;
  const worldHeight = worldUnlocked ? EXPANDED_WORLD_HEIGHT : window.innerHeight;
  document.body.style.overflow = worldUnlocked ? 'auto' : 'hidden';
  document.documentElement.style.overflow = worldUnlocked ? 'auto' : 'hidden';

  app.innerHTML = `
    <div class="world" style="width: ${worldWidth}px; height: ${worldHeight}px; transform: scale(${zoomLevel}); transform-origin: 0 0;">
      <img src="${ground_image}" alt="Ground" class="ground-image" style="width: ${GROUND_WIDTH}px; height: ${GROUND_HEIGHT}px;" />
      <img src="${sun_image}" alt="Sun" class="sun-image" style="left: ${SUN_POSITION.x}px; top: ${SUN_POSITION.y}px; width: ${SUN_SIZE}px; height: ${SUN_SIZE}px;" />
      <img src="${bevis}" alt="Bevis" class="bevis-image" style="left: ${BEVIS_POSITION.x}px; top: ${BEVIS_POSITION.y}px;" />
      <div class="tree-container" style="left: ${TREE_POSITION.x}px; top: ${TREE_POSITION.y}px;">
        <button id="tree" class="tree-button">
          <img src="${tree_image}" alt="Tree" />
        </button>
        ${renderLeaves(state)}
        ${renderFruit(state)}
        ${renderExplosion()}
      </div>
      ${renderDinosaurRoster(state)}
      ${renderVenusTrap(state)}
      <div class="controls" style="left: ${CONTROLS_POSITION.x}px; top: ${CONTROLS_POSITION.y}px; width: ${CONTROLS_WIDTH}px;">
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
        ${!state.hasVenusTrap && state.fruit.length >= TRAP_UNLOCK_FRUIT ? `
          <button id="buy-venus-trap" ${state.lifepoints.lessThan(TRAP_COST) ? 'disabled' : ''}>
            Buy Venus Trap (${TRAP_COST} lifepoints)
          </button>
        ` : ''}
        <button id="toggle-stats">
          ${showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>
      ${showStats ? `
        <div class="stats-panel" style="left: ${STATS_PANEL_POSITION.x}px; top: ${STATS_PANEL_POSITION.y}px;">
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

  updateMeteor(zoomLevel);
  updateActiveDinosaur(state, worldWidth, worldHeight, zoomLevel);
  updatePoop(state, worldWidth, worldHeight, zoomLevel, onChange);
  attachDinosaurClickListenerOnce(state, onChange);

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

  document.querySelector<HTMLButtonElement>('#buy-venus-trap')?.addEventListener('click', () => {
    if (buyTrap(state)) {
      onChange();
    }
  });

  document.querySelector<HTMLButtonElement>('#cheat-button')?.addEventListener('click', () => {
    const input = document.querySelector<HTMLInputElement>('#cheat');
    if (!input) return;

    const amountToAdd = new Decimal(input.value);
    state.lifepoints = state.lifepoints.add(amountToAdd);
    input.value = '';
    onChange();
  });

  document.querySelector<HTMLButtonElement>('#unlock-world-button')?.addEventListener('click', () => {
    worldUnlocked = !worldUnlocked;
    onChange();
  });

  document.querySelectorAll<HTMLButtonElement>('.parked-dinosaur-button').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.dinoIndex);
      selectedDinosaurIndex = selectedDinosaurIndex === index ? null : index;
      onChange();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.sell-dinosaur-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const index = Number(button.dataset.dinoIndex);
      if (state.hasVenusTrap) {
        startDevour(state, index);
      } else {
        sellDinosaurAt(state, index);
      }
      selectedDinosaurIndex = null;
      onChange();
    });
  });

  if (worldUnlocked) {
    document.querySelector<HTMLDivElement>('.world')!.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        zoomLevel = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomLevel - event.deltaY * ZOOM_STEP));
        document.querySelector<HTMLDivElement>('.world')!.style.transform = `scale(${zoomLevel})`;
        updateMeteor(zoomLevel);
        updateActiveDinosaur(state, worldWidth, worldHeight, zoomLevel);
        updatePoop(state, worldWidth, worldHeight, zoomLevel, onChange);
      },
      { passive: false }
    );
  }
}

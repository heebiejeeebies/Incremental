export enum MeteorPhase {
  FALLING,
  FLYING_TO_CENTER,
  EXPLODING,
}

export const SIZE_FOR_BOOM = 60;

const FLY_DURATION_TICKS = 3; 
const EXPLODE_DURATION_TICKS = 1;

let size = 1;
let burnedness = 0;
let phase: MeteorPhase = MeteorPhase.FALLING;
let phaseTicks = 0;

export function getMeteorSize(): number {
  return size;
}

export function getMeteorBurnedness(): number {
  return burnedness;
}

export function getMeteorPhase(): MeteorPhase {
  return phase;
}

function progressMeteor(sizeIncrease: number, burnIncrease: number): void {
  size += sizeIncrease;
  burnedness += burnIncrease;
}

function resetMeteor(): void {
  size = 1;
  burnedness = 0;
  phase = MeteorPhase.FALLING;
  phaseTicks = 0;
}

// Advances the meteor by one tick. Returns true when kablooey finishes
export function tickMeteor(): boolean {
  switch (phase) {
    case MeteorPhase.FALLING:
      progressMeteor(1, 1);
      if (size >= SIZE_FOR_BOOM) {
        phase = MeteorPhase.FLYING_TO_CENTER;
        phaseTicks = 0;
      }
      return false;

    case MeteorPhase.FLYING_TO_CENTER:
      phaseTicks++;
      if (phaseTicks >= FLY_DURATION_TICKS) {
        phase = MeteorPhase.EXPLODING;
        phaseTicks = 0;
      }
      return false;

    case MeteorPhase.EXPLODING:
      phaseTicks++;
      if (phaseTicks >= EXPLODE_DURATION_TICKS) {
        resetMeteor();
        return true;
      }
      return false;
  }
}

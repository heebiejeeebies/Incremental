// import { create, all } from 'mathjs';
// const config = { };
// const Math = create(all, config);
import Decimal from 'break_eternity.js';

export function costLeaf(level: Decimal): Decimal {
  const base = new Decimal (1.2);
  const start_cost = new Decimal('20');
  return start_cost.mul(base.pow(level).floor()); 
}

export function costClickIncrease(level: Decimal): Decimal {
  const base = new Decimal (1.2);
  const start_cost = new Decimal('50');
  return start_cost.mul(base.pow(level).floor()); 
}

export function costFruit(level: number): Decimal {
  const base = new Decimal (10);
  const start_cost = new Decimal('500');
  return start_cost.mul(base.pow(level).floor()); 
}

export function costPhotoSynthesis(level: Decimal): Decimal {
  const base = new Decimal (1.1);
  const start_cost = new Decimal('3000');
  return start_cost.mul(base.pow(level).floor()); 
}

export function costAurafarm(level: Decimal): Decimal {
  const base = new Decimal (1.05);
  const start_cost = new Decimal('10000');
  return start_cost.mul(base.pow(level).floor()); 
}
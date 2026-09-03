// import { create, all } from 'mathjs';
import Decimal from 'break_eternity.js';

export function costClickIncrease(level: Decimal): Decimal {
  const base = new Decimal('2.5');
  const start_cost = new Decimal('1')
  return start_cost.mul((base.pow(1.04).floor()));
}
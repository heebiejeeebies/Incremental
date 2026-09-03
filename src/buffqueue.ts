import {Buff} from "./main"

export function enqueue(array: Buff[], thingtoqueue: Buff) {
    array[array.length] = thingtoqueue;
}

export function dequeue(array: Buff[]): Buff {
    let ret = array[0];
    if (array.length === 0) {
        return ret;
    }
    for (let i = 0; i < array.length - 1; i++) {
        array[i] = array[i + 1];
    }
    array.length--;

    return ret;
}

export function peep(array: Buff[]): string | null {
   if (array.length === 0) return null;
   return array[0].type;
}
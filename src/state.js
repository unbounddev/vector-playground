import { reactiveStore } from './utils';

export const state = reactiveStore({ 
    selected: null,
    inputMode: "rect"
});
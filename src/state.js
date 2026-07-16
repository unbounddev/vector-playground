import { INPUT_MODES, reactiveStore } from './utils';

export const state = reactiveStore({ 
    selected: null,
    inputMode: INPUT_MODES.HAND
});
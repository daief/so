import { writable } from 'svelte/store';
import { LINK_TYPE } from './shared/links';

export const selectedLinkType = writable(LINK_TYPE.google);

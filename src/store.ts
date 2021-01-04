import { get, writable } from 'svelte/store';
import { LS } from './shared';
import { LS_RECENT_USAGE_KEY } from './shared/constants';
import { LINK_TYPE } from './shared/links';

export const recentUsedList = writable<LINK_TYPE[]>(
  LS.get(LS_RECENT_USAGE_KEY, [LINK_TYPE.google]),
);

export const selectedLinkType = writable<LINK_TYPE>(
  get(recentUsedList)?.[0] ?? LINK_TYPE.google,
);

recentUsedList.subscribe(value => {
  LS.set(LS_RECENT_USAGE_KEY, value);
});

import { get, writable } from 'svelte/store';
import { LS } from './shared';
import { LS_IS_DARK_MODE_KEY, LS_RECENT_USAGE_KEY } from './shared/constants';
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

export const isDarkMode = writable<boolean>(
  LS.get(LS_IS_DARK_MODE_KEY) ||
    (__SERVER__
      ? false
      : window.matchMedia?.('(prefers-color-scheme: dark)')?.matches),
);

isDarkMode.subscribe(val => {
  val = !!val;
  LS.set(LS_IS_DARK_MODE_KEY, !!val);
});

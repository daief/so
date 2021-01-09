import { onMount } from 'svelte';
import { Writable, writable } from 'svelte/store';

export function useAsync<T = any>(
  fn: (...args: any) => any,
  {
    defaultValue = null,
    defaultArgs = [],
    skip = false,
  }: { defaultValue?: T; defaultArgs?: any[]; skip?: boolean } = {},
): [
  Writable<{
    loading: boolean;
    data: T;
    error: any;
    callTimes: number;
  }>,
  (...args: any) => Promise<any>,
] {
  let res = writable({
    loading: false,
    data: defaultValue,
    error: null,
    callTimes: 0,
  });

  const call = async (...args: any[]) => {
    try {
      res.update(pre => {
        return { ...pre, loading: true };
      });

      const data = await fn(...(args.length > 0 ? args : defaultArgs));
      res.update(pre => {
        return {
          ...pre,
          loading: false,
          data: data ?? defaultValue,
          error: null,
          callTimes: pre.callTimes + 1,
        };
      });

      return data;
    } catch (error) {
      res.update(pre => {
        return {
          ...pre,
          loading: false,
          data: defaultValue,
          error,
          callTimes: pre.callTimes + 1,
        };
      });

      throw error;
    }
  };

  onMount(() => {
    !skip && call();
  });

  return [res, call];
}

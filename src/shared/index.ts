export const LS = {
  get<T>(key: string, defaultValue?: T): T {
    if (__SERVER__) return defaultValue;
    const rs = localStorage.getItem(key);
    try {
      return JSON.parse(rs) ?? defaultValue;
    } catch (error) {
      return defaultValue;
    }
  },
  set(key: string, value: any) {
    if (__SERVER__) return;
    return localStorage.setItem(key, JSON.stringify(value));
  },
};

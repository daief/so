import { jsonp } from './jsonp';

export enum LINK_TYPE {
  google,
  baidu,
  biying,
  amazon,
  jd,
  tmall,
  zhihu,
  bilibili,
}

export function getAutocompleteWay(type: LINK_TYPE) {
  return (q: string): Promise<string[]> => {
    return jsonp(
      `https://suggestqueries.google.com/complete/search`,
      {
        q,
        client: 'psy-ab',
      },
      'jsonp',
    )
      .then(res => {
        const ls = res?.[1];
        return Array.isArray(ls) ? ls.map(_ => _[0]) : [];
      })
      .catch(() => []);
  };
}

/**
 * q: keywords query
 */
export const linksSchema: Record<
  LINK_TYPE,
  {
    searchSchema: string;
  }
> = {
  [LINK_TYPE.google]: { searchSchema: 'https://www.google.com/search?q=${q}' },
  [LINK_TYPE.baidu]: { searchSchema: 'https://www.baidu.com/s?wd=${q}' },
  [LINK_TYPE.biying]: { searchSchema: 'https://cn.bing.com/search?q=${q}' },
  [LINK_TYPE.amazon]: { searchSchema: 'https://www.amazon.com/s?k=${q}' },
  [LINK_TYPE.jd]: {
    searchSchema: 'https://search.jd.com/Search?keyword=${q}&enc=utf-8',
  },
  [LINK_TYPE.tmall]: {
    searchSchema: 'https://list.tmall.com/search_product.htm?q=${q}',
  },
  [LINK_TYPE.zhihu]: {
    searchSchema: 'https://www.zhihu.com/search?type=content&q=${q}',
  },
  [LINK_TYPE.bilibili]: {
    searchSchema: 'http://search.bilibili.com/all?keyword=${q}',
  },
};

export function getTargetSearchUrl(type: LINK_TYPE, q: string) {
  const res = linksSchema[type] || linksSchema[LINK_TYPE.google];
  return res.searchSchema.replace('${q}', encodeURIComponent(q));
}

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
  gaode,
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
    name: string;
  }
> = {
  [LINK_TYPE.google]: {
    searchSchema: 'https://www.google.com/search?q=${q}',
    name: 'Google',
  },
  [LINK_TYPE.baidu]: {
    searchSchema: 'https://www.baidu.com/s?wd=${q}',
    name: 'Baidu',
  },
  [LINK_TYPE.biying]: {
    searchSchema: 'https://cn.bing.com/search?q=${q}',
    name: 'Biying',
  },
  [LINK_TYPE.amazon]: {
    searchSchema: 'https://www.amazon.com/s?k=${q}',
    name: 'Amazon',
  },
  [LINK_TYPE.jd]: {
    searchSchema: 'https://search.jd.com/Search?keyword=${q}&enc=utf-8',
    name: 'JD',
  },
  [LINK_TYPE.tmall]: {
    searchSchema: 'https://list.tmall.com/search_product.htm?q=${q}',
    name: 'Tmall',
  },
  [LINK_TYPE.zhihu]: {
    searchSchema: 'https://www.zhihu.com/search?type=content&q=${q}',
    name: '知乎',
  },
  [LINK_TYPE.bilibili]: {
    searchSchema: 'http://search.bilibili.com/all?keyword=${q}',
    name: 'Bilibili',
  },
  [LINK_TYPE.gaode]: {
    searchSchema: 'https://ditu.amap.com/search?query=${q}',
    name: '高德',
  },
};

export function getTargetSearchUrl(type: LINK_TYPE, q: string) {
  const res = linksSchema[type] || linksSchema[LINK_TYPE.google];
  return res.searchSchema.replace('${q}', encodeURIComponent(q));
}

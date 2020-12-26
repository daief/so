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

/**
 * q: keywords query
 */
export const linksSchema: Record<LINK_TYPE, string> = {
  [LINK_TYPE.google]: 'https://www.google.com/search?q=${q}',
  [LINK_TYPE.baidu]: 'https://www.baidu.com/s?wd=${q}',
  [LINK_TYPE.biying]: 'https://cn.bing.com/search?q=${q}',
  [LINK_TYPE.amazon]: 'https://www.amazon.com/s?k=${q}',
  [LINK_TYPE.jd]: 'https://search.jd.com/Search?keyword=${q}&enc=utf-8',
  [LINK_TYPE.tmall]: 'https://list.tmall.com/search_product.htm?q=${q}',
  [LINK_TYPE.zhihu]: 'https://www.zhihu.com/search?type=content&q=${q}',
  [LINK_TYPE.bilibili]: 'http://search.bilibili.com/all?keyword=${q}',
};

export function getTargetSearchUrl(type: LINK_TYPE, q: string) {
  return linksSchema[type].replace('${q}', encodeURIComponent(q));
}

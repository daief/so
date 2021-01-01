import qs from 'query-string';

let id = 0;

export function jsonp<T = any>(
  url: string,
  params: Record<string, any> = {},
  cbFieldName = 'cb',
): Promise<T> {
  return new Promise((resolve, reject) => {
    const parseUrlRes = qs.parseUrl(url);
    url = parseUrlRes.url;
    const handlerName = `jsonp_cb_${Date.now()}_${id++}`;
    const script = document.createElement('script');
    script.async = true;
    script.src = `${url}?${qs.stringify({
      ...parseUrlRes.query,
      [cbFieldName]: handlerName,
      ...params,
    })}`;

    script.onerror = reject;

    window[handlerName] = resolve;

    document.body.append(script);
  });
}

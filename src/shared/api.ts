import { axios } from './axios';

export function getHitokoto() {
  return axios.get('https://v1.hitokoto.cn/?encode=json');
}

import 'normalize.css';
import '@/styles/icons.css';
import '@/styles/global.css';
import '@/shared/theme';
import App from './App.svelte';

if (!__SERVER__) {
  // @ts-ignore
  window.______app______ = new App({
    target: document.getElementById('app'),
    props: {},
    hydrate: true,
  });
}

export { App as app };

import 'normalize.css';
import './global.css';
import '@/shared/theme';
import App from './App.svelte';

if (!__SERVER__) {
  // @ts-ignore
  window.______app______ = new App({
    target: document.getElementById('app'),
    props: {
      name: 'world',
    },
    hydrate: true,
  });
}

export { App as app };

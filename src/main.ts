import App from './App.svelte';

if (!__SERVER__) {
  const ins = new App({
    target: document.getElementById('app'),
    props: {
      name: 'world',
    },
    hydrate: true,
  });
}

export { App as app };

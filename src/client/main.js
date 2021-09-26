import App from './App.svelte';

const container = document.createElement('div');
container.classList.add('anisync')
document.body.appendChild(container);

const app = new App({
  target: container,
});

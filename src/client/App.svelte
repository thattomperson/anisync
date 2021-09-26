<script>
  import { connected, hosting, room, rooms, socket } from './stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<SvelteToast options={{ reversed: true, intro: { y: 192 }, theme: {} }} />

<div class="flex flex-col p-2">
  {#if !$room}
    <button
      type="button"
      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      on:click={() => socket.emit('host')}>Host Room</button
    >

    {#each $rooms as room}
      <button
        type="button"
        class="anisync-button"
        on:click={() => socket.emit('join', room.id)}
      >
        {room.id}
      </button>
    {/each}
  {:else if $hosting}
    <h2>You are the host</h2>
    <h3>{$room.id}</h3>
  {:else}
    <h2>Enjoy</h2>
    <h3>You are in room <br />{$room.id}</h3>
  {/if}

  <div
    class="rounded-full w-2 h-2"
    style={`background: ${$connected ? 'green' : 'red'}`}
  />
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --toastContainerTop: auto;
    --toastContainerRight: 1rem;
    --toastContainerBottom: 1rem;
    --toastContainerLeft: auto;
  }

  :global(body) {
    display: flex;
  }

  :global(#app) {
    flex-grow: 1;
  }

  :global(.anisync) {
    width: 200px;
    height: 100vh;
    background: linear-gradient(#181221, #020203);
  }
</style>

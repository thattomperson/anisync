<script>
  import { connected, hosting, room, rooms, socket } from './stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<SvelteToast options={{ reversed: true, intro: { y: 192 }, theme: {} }} />

<div class="sidebar">
  {#if !$room}
    <button
      type="button"
      class="btn"
      on:click={() => socket.emit('host')}>Host Room</button
    >

    {#each $rooms as room}
      <button
        type="button"
        class="btn"
        on:click={() => socket.emit('join', room.id)}
      >
        {room.id}
      </button>
    {/each}
  {:else if $hosting}
    <h2 class="text-white">You are the host</h2>
    <h3 class="text-white">{$room.id}</h3>
  {:else}
    <h2 class="text-white">Enjoy</h2>
    <h3 class="text-white">You are in room <br />{$room.id}</h3>
  {/if}

  <div
    class="status"
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

  * {
    font-family: 'Open Sans', sans-serif;
  }

  .status {
    @apply rounded-full w-2 h-2;
  }

  .sidebar {
    @apply flex flex-col p-2 space-y-2;
  }

  .btn {
    @apply flex justify-center px-3 py-2 border-solid border-white text-white hover:bg-funimation hover:border-funimation font-bold text-sm leading-4 rounded-md;
  }
</style>

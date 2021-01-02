<!-- svelte-ignore missing-declaration -->
{#if !__SERVER__}
  <div bind:this={ref}>
    <slot />
  </div>
{/if}

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  let ref: HTMLDivElement | null;

  onMount(() => {
    if (__SERVER__) return;
    document.body.appendChild(ref);
  });

  onDestroy(() => {
    if (__SERVER__) return;
    document.body.removeChild(ref);
  });
</script>

<style>
</style>

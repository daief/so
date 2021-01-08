<section>{displayTime}</section>

<script lang="ts">
  import { onMount } from 'svelte';

  let now = __SERVER__ ? '----/--/-- --:--:--' : Date.now();

  const fomater = new Intl.DateTimeFormat(['zh-CN', 'en-US'], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  $: displayTime = typeof now === 'string' ? now : fomater.format(now);

  function loop() {
    now = Date.now();
    requestAnimationFrame(loop);
  }

  onMount(() => {
    if (!__SERVER__) {
      loop();
    }
  });
</script>

<style lang="less">
  section {
    text-align: center;
    margin-bottom: 10px;
    font-family: 'IBM Plex Mono', serif;
    white-space: nowrap;
  }
</style>

<main class="wrap">
  <h1 class="wrap-title" on:click={click}>Hello1 {name}!</h1>

  <SearchInput />

  <hr />

  <p>
    Visit the1
    <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
    to learn how to build Svelte apps.
  </p>
</main>

<script lang="ts">
  import SearchInput from '@/components/SearchInput.svelte';
  import { a as foo } from '@/shared';

  export let name: string;

  function click() {
    name = 'ssssss';
    foo();
  }
</script>

<style lang="less">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
  }

  .wrap {
    &-title {
      font-size: 5em;
    }
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

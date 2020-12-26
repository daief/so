<main>
  <div class="ma__input-wrap">
    <SearchInput />
  </div>
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .ma {
    &__input-wrap {
      width: 640px;
      max-width: 100%;
    }
  }
</style>

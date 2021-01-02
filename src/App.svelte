<main>
  <div class="ma__input-wrap">
    <div class="link-type-sl">
      <LinkTypeSelect />
    </div>
    <div class="search-input-cp">
      <SearchInput />
    </div>
  </div>
</main>

<script lang="ts">
  import LinkTypeSelect from '@/components/LinkTypeSelect.svelte';
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
      display: flex;
      align-items: center;
    }
  }

  .link-type-sl {
    margin-right: 10px;
  }
  .search-input-cp {
    flex-grow: 1;
  }
</style>

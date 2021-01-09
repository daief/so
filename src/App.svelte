<main>
  <div style="margin-top: 300px" />
  <div class="ma__darkmode-wrap">
    <DarkMode />
  </div>
  <div>
    <Time />
  </div>
  <div class="ma__usually-wrap">
    <RecentUsage />
  </div>
  <div class="ma__input-wrap" class:focus={isFocus}>
    <div class="link-type-sl">
      <LinkTypeSelect />
    </div>
    <i class="divider-y" />
    <div class="search-input-cp">
      <SearchInput
        on:focus={() => (isFocus = true)}
        on:blur={() => (isFocus = false)}
        bind:this={inputIns} />
    </div>

    <button on:click={inputIns && inputIns.submit} class="search-submit">
      <Icon name="search" size={20} />
    </button>
  </div>
</main>

<script lang="ts">
  import LinkTypeSelect from '@/components/LinkTypeSelect.svelte';
  import SearchInput from '@/components/SearchInput.svelte';
  import RecentUsage from '@/components/RecentUsage.svelte';
  import Time from '@/components/Time.svelte';
  import Icon from './components/Icon.svelte';
  import DarkMode from './components/DarkMode.svelte';

  let isFocus = false;
  let inputIns;
</script>

<style lang="less">
  @import 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@100;300&display=swap';

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .ma {
    &__darkmode-wrap {
      position: absolute;
      top: 40px;
      right: 40px;
    }
    &__usually-wrap {
      width: 640px;
      max-width: 100%;
      margin-bottom: 10px;
      padding: 0 4px;
      white-space: nowrap;
    }
    &__input-wrap {
      width: 640px;
      max-width: 100%;
      display: flex;
      align-items: center;
      padding-right: 10px;

      border-radius: var(--radius);
      border: 1px solid var(--nc);
      transition: all 0.3s;

      &:hover,
      &.focus {
        border-color: var(--color5);
      }
    }
  }

  .link-type-sl {
    margin-right: 10px;
  }
  .divider-y {
    background-color: var(--tc);
    display: block;
    width: 1px;
    height: 20px;
  }
  .search-input-cp {
    flex-grow: 1;
  }
  .search-submit {
    appearance: none;
    padding: 4px 6px;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    color: var(--color6);
    transition: all 0.3s;

    &:hover {
      color: var(--color4);
    }
  }
</style>

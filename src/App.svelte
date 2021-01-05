<main>
  <div style="margin-top: 300px" />
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
        on:blur={() => (isFocus = false)} />
    </div>
  </div>
</main>

<script lang="ts">
  import LinkTypeSelect from '@/components/LinkTypeSelect.svelte';
  import SearchInput from '@/components/SearchInput.svelte';
  import RecentUsage from '@/components/RecentUsage.svelte';
  import Time from '@/components/Time.svelte';

  let isFocus = false;
</script>

<style lang="less">
  @import 'https://fonts.googleapis.com/css2?family=Hanalei+Fill';

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ma {
    &__usually-wrap {
      width: 640px;
      max-width: 100%;
      padding-left: 80px;
      margin-bottom: 10px;
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
    background-color: grey;
    display: block;
    width: 1px;
    height: 20px;
  }
  .search-input-cp {
    flex-grow: 1;
  }
</style>

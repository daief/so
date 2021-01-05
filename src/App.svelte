<main>
  <div style="margin-top: 300px" />
  <div>
    <Time />
  </div>
  <div class="ma__usually-wrap">
    <RecentUsage />
  </div>
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
  import RecentUsage from '@/components/RecentUsage.svelte';
  import Time from '@/components/Time.svelte';
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
    }
  }

  .link-type-sl {
    margin-right: 10px;
  }
  .search-input-cp {
    flex-grow: 1;
  }
</style>

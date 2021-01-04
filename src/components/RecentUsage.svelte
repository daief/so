<section>
  最近使用：
  <ul>
    {#each displayList as item}
      <li
        class:active={item.value === $selectedLinkType}
        on:click={() => selectedLinkType.set(item.value)}>
        {item.name}
      </li>
    {/each}
  </ul>
</section>

<script>
  import { linksSchema } from '@/shared/links';
  import { recentUsedList, selectedLinkType } from '@/store';

  $: displayList = $recentUsedList.map(_ => ({
    ...linksSchema[_],
    value: _,
  }));
</script>

<style lang="less">
  section {
    color: var(--tc);
    font-size: 14px;
    height: 22px;
    display: flex;
    align-items: center;
  }
  ul {
    margin: 0;
    padding: 0;
    display: flex;
  }
  li {
    list-style: none;
    width: 60px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: var(--color4);
    }

    &.active {
      color: var(--primary);
    }
  }
</style>

<div
  class="ls-wrap"
  on:mouseenter={() => (showPanel = true)}
  on:mouseleave={() => (showPanel = false)}>
  <section>{linksSchema[$selectedLinkType].name}</section>
  {#if showPanel}
    <div class="panel-wrap" transition:fade={{ duration: 200 }}>
      <div class="panel-content">
        {#each selectSchema as item}
          <div class="panel-sl-item">
            <strong>{item.title}</strong>
            <ul>
              {#each item.ls as linkItem}
                <li
                  title={linkItem.name}
                  class:selected={linkItem.link === $selectedLinkType}
                  on:click={() => handleSelect(linkItem.link)}>
                  {linkItem.name}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<script lang="ts">
  import { linksSchema, LINK_TYPE } from '@/shared/links';
  import { selectedLinkType } from '@/store';
  import { fade } from 'svelte/transition';

  let showPanel = false;

  function gen(ls: LINK_TYPE[]) {
    return ls.map(_ => ({
      ...linksSchema[_],
      link: _,
    }));
  }

  const selectSchema = [
    {
      title: '🔍',
      ls: gen([LINK_TYPE.google, LINK_TYPE.baidu, LINK_TYPE.biying]),
    },
    {
      title: '🛒',
      ls: gen([LINK_TYPE.tmall, LINK_TYPE.jd]),
    },
    {
      title: '💡',
      ls: gen([LINK_TYPE.zhihu, LINK_TYPE.bilibili, LINK_TYPE.gaode]),
    },
  ];

  function handleSelect(lk: LINK_TYPE) {
    selectedLinkType.set(lk);
    showPanel = false;
  }
</script>

<style lang="less">
  .size() {
    width: 70px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  .ls-wrap {
    position: relative;
  }
  section {
    .size();
    cursor: pointer;
  }
  .panel-wrap {
    position: absolute;
    z-index: 10;
    top: 40px;
    left: 0;
  }
  .panel-content {
    padding: 15px;
    margin-top: 4px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
    width: 300px;
    max-width: 100%;
  }
  .panel-sl-item {
    ul {
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      padding: 0;

      li {
        .size();
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: var(--color4);
        }

        &.selected {
          color: var(--primary);
        }
      } // li
    } // ul
    & + & {
      margin-top: 5px;
    }
  }
</style>

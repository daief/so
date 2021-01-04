<section on:keydown={handleOnWrapKeyDown}>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="text"
    value={displayValue}
    bind:this={elInput}
    on:input={handleOnInput}
    on:keydown={handleOnKeyDown}
    on:compositionstart={() => (hasComposition = true)}
    on:compositionend={() => (hasComposition = false)}
    spellcheck={false}
    autocomplete="off"
    maxlength={2048}
    placeholder="随便搜搜~" />

  <div style="position: relative;">
    {#if suggestionList.length > 0}
      <ul class="sg-wrap el-shadow " transition:fade={{ duration: 200 }}>
        {#each suggestionList as item, idx}
          <li title={item} class:focus={idx + 1 === sgHoverIndex}>{item}</li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<script lang="ts">
  import {
    getAutocompleteWay,
    getTargetSearchUrl,
    LINK_TYPE,
  } from '@/shared/links';
  import { recentUsedList, selectedLinkType } from '@/store';
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';

  $: autoCompleteHandler = getAutocompleteWay(LINK_TYPE.google);

  let elInput: HTMLInputElement | null;

  let value: string = '';
  let hasComposition = false;
  let sgHoverIndex = 0;
  let autoCompleteId: any;

  let suggestionList = [];

  $: trimedValue = value.trim();
  $: displayValue =
    sgHoverIndex === 0 ? value : suggestionList[sgHoverIndex - 1];

  $: if (value && !__SERVER__) {
    clearTimeout(autoCompleteId);
    autoCompleteId = setTimeout(async () => {
      suggestionList = await autoCompleteHandler(value);
    }, 350);
  } else if (!value) {
    clearTimeout(autoCompleteId);
    suggestionList = [];
  }

  $: {
    $selectedLinkType;
    elInput?.focus();
  }

  function handleOnKeyDown(
    e: KeyboardEvent & {
      target: any;
    },
  ) {
    if (!trimedValue) return;
    if (e.key === 'Enter') {
      if (hasComposition) return;
      submitSearch();
    }
  }

  function handleOnInput(
    e: Event & {
      target: any;
    },
  ) {
    value = e.target.value;
    sgHoverIndex = 0;
  }

  const setInputSelectionToEnd = async () => {
    if (!elInput) return;
    await tick();
    elInput.selectionStart = 9999;
    elInput.selectionEnd = 9999;
  };

  function handleOnWrapKeyDown(e: KeyboardEvent) {
    if (!suggestionList.length) {
      return;
    }

    const rangeLength = suggestionList.length + 1;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      sgHoverIndex = (sgHoverIndex + rangeLength - 1) % rangeLength;
      setInputSelectionToEnd();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sgHoverIndex = (sgHoverIndex + 1) % rangeLength;
      setInputSelectionToEnd();
      return;
    }
  }

  function submitSearch() {
    const target = getTargetSearchUrl($selectedLinkType, displayValue);
    window.open(target, '_blank');
    value = '';
    sgHoverIndex = 0;

    recentUsedList.update(pre => {
      const rs = pre.filter(_ => _ !== $selectedLinkType);
      rs.unshift($selectedLinkType);
      return rs;
    });
  }
</script>

<style lang="less">
  section {
    position: relative;
  }
  input {
    appearance: none;
    height: 48px;
    display: block;
    width: 100%;
    padding: 0 10px;
    border-radius: var(--radius);
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-box-direction: normal;
    background-color: #fff;
    background-image: none;
    border: 1px solid var(--nc);
    transition: all 0.3s;
    touch-action: manipulation;
    text-overflow: ellipsis;
    color: var(--tc);

    &:hover {
      border-color: var(--color5);
    }

    &:focus {
      border-color: var(--primary);
    }
  }
  .sg-wrap {
    position: absolute;
    top: 3px;
    width: 100%;
    border-radius: var(--radius);
    border: 1px solid var(--nc);
    margin: 0;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
    padding: 10px 0;

    li {
      height: 32px;
      line-height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      padding: 0 15px;
      position: relative;

      &:hover,
      &.focus {
        background-color: #f4f4f4;
      }
    }
  }
</style>

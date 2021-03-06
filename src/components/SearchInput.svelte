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
    on:focus={handleOnFocus}
    on:blur={handleOnBlur}
    spellcheck={false}
    autocomplete="off"
    maxlength={2048}
    {placeholder} />

  <div style="position: relative;">
    {#if isFocus && suggestionList.length > 0}
      <ul class="sg-wrap el-shadow " transition:fade={{ duration: 200 }}>
        {#each suggestionList as item, idx}
          <li
            title={item}
            class:focus={idx + 1 === sgHoverIndex}
            on:click={() => handleOnClickSuggestion(item)}>
            {item}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<script lang="ts">
  import { getHitokoto } from '@/shared/api';
  import { useAsync } from '@/shared/hooks';
  import {
    getAutocompleteWay,
    getTargetSearchUrl,
    LINK_TYPE,
  } from '@/shared/links';
  import { recentUsedList, selectedLinkType } from '@/store';
  import { createEventDispatcher, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  const [res] = useAsync(getHitokoto);

  $: hitoko = $res.data?.data?.hitokoto;
  $: placeholder = hitoko || '🔍 搜索...';

  $: autoCompleteHandler = getAutocompleteWay(LINK_TYPE.google);

  let elInput: HTMLInputElement | null;

  let value: string = '';
  let hasComposition = false;
  let sgHoverIndex = 0;
  let autoCompleteId: any;
  let isFocus = false;

  let suggestionList = [];

  $: displayValue =
    sgHoverIndex === 0 ? value : suggestionList[sgHoverIndex - 1];

  $: if (!isFocus) {
    sgHoverIndex = 0;
  }

  $: if (value && isFocus && !__SERVER__) {
    clearTimeout(autoCompleteId);
    autoCompleteId = setTimeout(async () => {
      const ls = await autoCompleteHandler(value);
      value && (suggestionList = ls);
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
    if (e.key === 'Enter') {
      if (hasComposition) return;
      submitSearch(displayValue);
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

  function handleOnClickSuggestion(suggest: string) {
    submitSearch(suggest);
  }

  function submitSearch(searchVal: string) {
    searchVal = (searchVal || '').trim();
    searchVal = searchVal || hitoko;
    if (!searchVal) return;
    const target = getTargetSearchUrl($selectedLinkType, searchVal);
    window.open(target, '_blank');
    value = '';
    sgHoverIndex = 0;

    recentUsedList.update(pre => {
      const rs = pre.filter(_ => _ !== $selectedLinkType);
      rs.unshift($selectedLinkType);
      rs.splice(5);
      return rs;
    });
  }

  function handleOnFocus(e: FocusEvent) {
    isFocus = true;
    dispatch('focus', e);
  }

  function handleOnBlur(e: FocusEvent) {
    value = displayValue;
    isFocus = false;
    dispatch('blur', e);
  }

  export function submit() {
    submitSearch(displayValue);
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
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-box-direction: normal;
    background: none;
    background-image: none;
    transition: all 0.3s;
    touch-action: manipulation;
    text-overflow: ellipsis;
    color: var(--tc);
    border: none;

    &:focus {
      border-color: var(--primary);
    }

    &::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: var(--placeholderColor);
      opacity: 1; /* Firefox */
    }
  }

  .sg-wrap {
    position: absolute;
    top: 3px;
    width: 100%;
    border-radius: var(--radius);
    margin: 0;
    background-color: var(--bgColorSecondary);
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
        color: var(--tcD1);
      }
    }
  }
</style>

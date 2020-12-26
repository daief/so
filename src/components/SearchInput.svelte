<!-- svelte-ignore a11y-autofocus -->
<input
  type="text"
  bind:value
  on:keydown={handleOnKeyDown}
  on:compositionstart={() => (hasComposition = true)}
  on:compositionend={() => (hasComposition = false)}
  spellcheck={false}
  autocomplete="off"
  maxlength={2048}
  autofocus
  placeholder="随便搜搜~" />

<script lang="ts">
  import { getTargetSearchUrl, LINK_TYPE } from '@/shared/links';

  let value: string = '';
  let hasComposition = false;

  $: trimedValue = value.trim();

  function handleOnKeyDown(
    e: KeyboardEvent & {
      target: any;
    },
  ) {
    if (!trimedValue) return;
    if (e.key === 'Enter') {
      if (hasComposition) return;
      const target = getTargetSearchUrl(LINK_TYPE.google, trimedValue);
      window.open(target, '_blank');
      value = '';
      return;
    }
  }
</script>

<style lang="less">
  input {
    appearance: none;
    height: 48px;
    display: block;
    width: 100%;
    padding: 0 10px;
    border-radius: 4px;
    outline: none;
    border-radius: grey solid 1px;
    -webkit-tap-highlight-color: transparent;
    -webkit-box-direction: normal;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    transition: all 0.3s;
    touch-action: manipulation;
    text-overflow: ellipsis;

    &:hover {
      border-color: var(--color5);
    }

    &:focus {
      border-color: var(--primary);
    }
  }
</style>

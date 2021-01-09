<span
  class="dark-mode-toggle"
  class:isdark={$isDarkMode}
  on:click={handleOnToggle}>
  <div class="track">
    <div class="thumb">
      <Icon name="moon" />
    </div>
  </div>
</span>

<script>
  import { createThemeForCSS, setThemeStyleToDOM } from '@/shared/theme';
  import { isDarkMode } from '@/store';
  import Icon from './Icon.svelte';

  $: {
    const cssArg = $isDarkMode
      ? {
          tc: '#c9d1d9',
          nc: '#c9d1d9',
          bgColor: '#21252d',
          bgColorSecondary: '#171c21',
          placeholderColor: '#9aa3ad',
        }
      : {};
    setThemeStyleToDOM(createThemeForCSS(cssArg));
  }

  function handleOnToggle() {
    $isDarkMode = !$isDarkMode;
  }
</script>

<style lang="less">
  @dark-color: #6e40c9;

  .dark-mode-toggle {
    position: relative;
    cursor: pointer;
  }

  .track {
    width: 42px;
    height: 24px;
    border-radius: 24px;
    border: 3px solid #d1d5da;
    transition: all 0.3s;
  }

  .thumb {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    background-color: #2f363d;
    transition: all 0.3s;
    color: yellow;
  }

  .isdark {
    .track {
      border-color: darken(@dark-color, 20%);
      background-color: fade(@dark-color, 20%);
    }
    .thumb {
      background-color: @dark-color;
      transform: translateX(18px);
    }
  }
</style>

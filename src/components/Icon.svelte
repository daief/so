<i class={className} {style} />

<script lang="ts">
  import { isNil } from '@/shared/utils';

  export let name: 'moon' | 'moon_stars_fill' | 'search';
  export let size: number | string = null;
  export let color: string = null;

  $: className = `soiconfont so-${name}`;
  $: style = [
    [
      'font-size:' + (typeof size === 'number' ? `${size}px` : size),
      !isNil(size),
    ],
    ['color:' + color, !isNil(color)],
  ]
    .filter(([, show]) => show)
    .map(([line]) => line)
    .join(';');
</script>

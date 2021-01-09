import { generate } from '@ant-design/colors';

const defaultPrimary = '#ff3e00';

export function createThemeForCSS(
  vars: Partial<{
    primary: string;
    mainColors: string[];
    /**
     * normal color
     */
    nc: string;
    /**
     * text color
     */
    tc: string;
    /**
     * text color deeper 1
     */
    tcD1: string;
    radius: string;
    bgColor: string;
    bgColorSecondary: string;
    placeholderColor: string;
    [k: string]: string | string[];
  }> = {},
) {
  const { mainColors, ...rest } = {
    primary: defaultPrimary,
    mainColors: generate(defaultPrimary),
    nc: '#d9d9d9',
    tc: 'rgb(51 51 51 / 85%)',
    tcD1: '#333',
    radius: '4px',
    bgColor: '#fff',
    bgColorSecondary: '#fff',
    placeholderColor: 'rgb(117, 117, 117)',
    ...vars,
  };
  const colorsStr = mainColors.map((c, i) => `--color${i + 1}: ${c};`).join('');
  const restStyle = Object.entries(rest)
    .map(([key, val]) => `--${key}: ${val};`)
    .join('');
  const style = `
    :root {
      ${colorsStr}
      ${restStyle}
    }
  `;
  return style;
}

let styleEl: HTMLStyleElement;

export function setThemeStyleToDOM(style: string) {
  if (__SERVER__) return;
  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.append(styleEl);
  }
  styleEl.innerHTML = style;
}

import * as colors from '@ant-design/colors';

export function createThemeForCSS(color = '#ff3e00') {
  const mainColors = colors.generate(color);
  const paramry = color;
  const colorsStr = mainColors.map((c, i) => `--color${i + 1}: ${c};`).join('');
  const style = `
    :root {
      --primary: ${paramry};
      ${colorsStr}
      --normal-color: #d9d9d9;
      --radius: 4px;
    }
  `;
  return style;
}

if (!__SERVER__) {
  const el = document.createElement('style');
  el.innerHTML = createThemeForCSS();
  document.head.append(el);
}

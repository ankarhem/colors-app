import { derived, writable } from 'svelte/store';
import { colord } from 'colord';

export const background = writable<string>(
  localStorage.getItem('background')
    ? JSON.parse(localStorage.getItem('background'))
    : '#e9e4e6'
);

background.subscribe((bg) => {
  localStorage.setItem('background', JSON.stringify(bg));
});

const defaultSettings = {
  copyWithFunction: true,
};

export const settings = writable<typeof defaultSettings>(
  localStorage.getItem('settings')
    ? JSON.parse(localStorage.getItem('settings'))
    : defaultSettings
);

settings.subscribe((settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
});

export const foreground = derived(background, ($background) => {
  const color = colord($background);
  return color.isDark()
    ? color.lighten(0.5).toHex()
    : color.darken(0.5).toHex();
});

const initialValue = '#fb91e985';
const initialState = {
  hex: initialValue,
  hsl: colord(initialValue).toHslString(),
  rgb: colord(initialValue).toRgbString(),
};

export const colors = writable<typeof initialState>(
  localStorage.getItem('currentColor')
    ? JSON.parse(localStorage.getItem('currentColor'))
    : initialState
);

colors.subscribe((state) => {
  localStorage.setItem('currentColor', JSON.stringify(state));
});

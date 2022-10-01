import { derived, writable } from "svelte/store";
import { colord } from "colord";

export const background = writable<string>(
  localStorage.getItem("background")
    ? JSON.parse(localStorage.getItem("background"))
    : "#242424"
);

background.subscribe((bg) => {
  localStorage.setItem("background", JSON.stringify(bg));
});

export const foreground = derived(background, ($background) => {
  const color = colord($background);
  return color.isDark()
    ? color.lighten(0.5).toHex()
    : color.darken(0.5).toHex();
});

const initialState = {
  hex: "#535bf2f0",
  hsl: "hsla(237, 86%, 64%, 0.94)",
  rgb: "rgba(83, 91, 242, 0.94)",
};

export const colors = writable<typeof initialState>(
  localStorage.getItem("currentColor")
    ? JSON.parse(localStorage.getItem("currentColor"))
    : initialState
);

colors.subscribe((state) => {
  localStorage.setItem("currentColor", JSON.stringify(state));
});

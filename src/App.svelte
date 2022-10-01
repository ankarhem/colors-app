<script lang="ts">
  import { background, colors, foreground } from "./colors";
  import { colord } from "colord";

  background.subscribe((bg) => {
    document.body.style.backgroundColor = bg;
  });
  foreground.subscribe((fg) => {
    document.body.style.color = fg;
  });

  const handleChanged = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const currentValue = e.currentTarget.value;
    const colorType = e.currentTarget.id;
    if (!colord(currentValue).isValid()) {
      $colors[colorType] = currentValue;
    }

    colors.update(() => {
      return {
        hex: colord(currentValue).toHex(),
        hsl: colord(currentValue).toHslString(),
        rgb: colord(currentValue).toRgbString(),
        [colorType]: currentValue,
      };
    });
  };

  $: colorObject = colord($colors.hex).toRgb();
  $: alpha = colorObject.a;
  $: colorWithoutAlpha = colord({
    r: colorObject.r,
    g: colorObject.g,
    b: colorObject.b,
  }).toHex();

  const handleColorPicked = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const currentValue = e.currentTarget.value;
    colors.update(() => {
      return {
        hex: colord(currentValue).alpha(alpha).toHex(),
        hsl: colord(currentValue).alpha(alpha).toHslString(),
        rgb: colord(currentValue).alpha(alpha).toRgbString(),
      };
    });
  };

  const handleOpacityChanged = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const currentValue = parseFloat(e.currentTarget.value);
    console.log(currentValue);
    colors.update(() => {
      return {
        hex: colord(colorWithoutAlpha).alpha(currentValue).toHex(),
        hsl: colord(colorWithoutAlpha).alpha(currentValue).toHslString(),
        rgb: colord(colorWithoutAlpha).alpha(currentValue).toRgbString(),
      };
    });
  };
</script>

<main>
  <h1>Color Format Converter</h1>

  <div class="pickers">
    <div class="canvas" style="--color: {$colors.hex};">
      <label class="hidden" for="currentColor" aria-hidden="false">
        Color wheel for current color</label
      >
      <input
        id="currentColor"
        type="color"
        value={colorWithoutAlpha}
        on:input={handleColorPicked}
      />
    </div>

    <label for="alpha">Opacity</label>
    <input
      id="alpha"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={alpha}
      on:input={handleOpacityChanged}
    />
  </div>

  <div class="container">
    <div>
      <label for="background-color-picker"> Background </label>
      <input
        id="background-color-picker"
        type="color"
        bind:value={$background}
      />
      <label for="background-text-input"> Background hex input </label>
      <input id="background" type="text" bind:value={$background} />
    </div>
    <div>
      <label for="hex">hex</label>
      <input
        id="hex"
        type="text"
        value={$colors.hex}
        on:input={handleChanged}
        aria-invalid={!colord($colors.hex).isValid()}
      />

      <label for="hsl"> hsl </label>
      <input
        id="hsl"
        type="text"
        value={$colors.hsl}
        on:input={handleChanged}
        aria-invalid={!colord($colors.hsl).isValid()}
      />

      <label for="rgb"> rgb </label>
      <input
        id="rgb"
        type="text"
        value={$colors.rgb}
        on:input={handleChanged}
        aria-invalid={!colord($colors.rgb).isValid()}
      />
    </div>
  </div>
</main>

<style>
  main {
    max-width: 40rem;
    margin: auto;
  }

  h1 {
    text-align: center;
  }

  label {
    width: auto;
    text-transform: uppercase;
  }

  input {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[aria-invalid="true"] {
    border: 2px solid red;
  }

  .hidden {
    display: none;
    position: absolute;
  }

  .container {
    display: flex;
    flex-direction: column-reverse;
    margin: 0 1rem;
  }

  .container input {
    width: 100%;
  }

  .pickers {
    padding: 1.5rem;
  }

  .canvas {
    position: relative;
    width: 100%;
    height: 100px;
    background-color: var(--color);
    border-radius: 0.25rem;
    margin-bottom: 0.75rem;
  }
  .canvas input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  @media (min-width: 1200px) {
    .pickers {
      margin: 2.5rem 2.5rem 1rem 2.5rem;
    }

    .container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      grid-template-columns: 1fr 1fr;
    }
  }
</style>

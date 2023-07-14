function rgbToHSL(rgb) {
  // Formula source: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
  // **The luminance was not correct with the above formula, I took that part from this source:
  // https://www.had2know.org/technology/hsl-rgb-color-converter.html
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  let min = Math.min(r, g, b);
  let max = Math.max(r, g, b);
  let delta = max - min;
  let lum = (min + max) / 2; // Luminance
  let sat; // Saturation
  let hue; // Pure color angle degree on color wheel
  if (delta === 0) {
    //If r,g,b are equal we have a shade of gray ranging from pure white to pure black.
    // this range is called neutral color range, meaning there is no color(hue) at all,
    // therefore density(saturation) of the color here is meaningless, there is just
    // light(luminance) as calculated above.
    sat = 0;
    hue = 0;
  } else {
    if (lum > 0) {
      sat = delta / (1 - Math.abs(2 * lum - 1));
    } else {
      sat = 0;
    }

    if (r === max) {
      hue = (g - b) / delta;
    } else if (g === max) {
      hue = 2 + (b - r) / delta;
    } else {
      hue = 4 + (r - g) / delta;
    }

    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  hue = Math.round(hue);
  sat = Math.round(sat * 100);
  lum = Math.round(lum * 100);

  return [hue, sat, lum];
}

function colorHslBox(hsl = []) {
  if (hsl.length === 0) {
    let rgb = rgbFormattoRgbList(rgbBox.style.backgroundColor);
    hsl = rgbToHSL(rgb);
  }
  hslBox.style.backgroundColor = formatHsl(hsl);
  updateHslRepresentation(hsl);
}

function formatHsl(hsl) {
  return (hslBox.style.backgroundColor = `hsl(${hsl[0]} ${hsl[1]}% ${hsl[2]}%)`);
}

function updateRgbRepresentation() {
  rgbRepresentation.innerText = rgbBox.style.backgroundColor;
}

function updateHslRepresentation(hsl) {
  hsl = formatHsl(hsl);
  hslRepresentation.innerText = hsl;
}

function rgbFormattoRgbList(rgb) {
  // rgb =  standard css format: rgb(r, g, b)
  rgb = rgb.slice(4, rgb.length - 1).split(",");
  for (let i = 0; i < 3; i++) {
    rgb[i] = Number.parseInt(rgb[i]);
  }
  return rgb;
}

function lightenHslBox() {
  let rgb = rgbFormattoRgbList(hslBox.style.backgroundColor);
  let hsl = rgbToHSL(rgb);
  hsl[2] = Math.min(99, hsl[2] + 2);
  // We don't want to go completely white here since we will lose the actual color in rgb form
  // so instead of 100 I put 99 here. This way we can go back with darkenHslBox()
  colorHslBox(hsl);
}

function darkenHslBox() {
  let rgb = rgbFormattoRgbList(hslBox.style.backgroundColor);
  let hsl = rgbToHSL(rgb);
  hsl[2] = Math.max(1, hsl[2] - 2);
  // We don't want to go completely black here since we will lose the actual color in rgb form
  // so instead of 0 I put 1 here. This way we can go back with lightenHslBox()
  colorHslBox(hsl);
}

const rgbBox = document.querySelector(".rgb-box");
const hslBox = document.querySelector(".hsl-box");
const colorPicker = document.querySelector(".color-picker");
const rgbRepresentation = document.querySelector(".rgb-representation");
const hslRepresentation = document.querySelector(".hsl-representation");

colorPicker.addEventListener("input", (e) => {
  rgbBox.style.backgroundColor = e.target.value;
  updateRgbRepresentation();
  colorHslBox();
});

hslBox.addEventListener(
  "wheel",
  (e) => {
    if (e.wheelDelta > 0) {
      darkenHslBox();
    } else {
      lightenHslBox();
    }
  },
  { passive: true }
);

rgbBox.style.backgroundColor = "#7665c8";
hslBox.style.backgroundColor = "#7665c8";
colorPicker.value = "#7665c8";

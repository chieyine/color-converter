import tailwindColors from "./tailwindColors.js";

const hexInput = document.getElementById("hexInput");
const rgbInput = document.getElementById("rgbInput");
const tailwindInput = document.getElementById("tailwindInput");
const hexPreview = document.getElementById("hexPreview");
const rgbPreview = document.getElementById("rgbPreview");
const tailwindPreview = document.getElementById("tailwindPreview");

// Converts Hex to RGB
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");

  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

const paletteContainer = document.getElementById("paletteContainer");

function displayTailwindPalette() {
  paletteContainer.innerHTML = "";
  for (const [colorName, shades] of Object.entries(tailwindColors)) {
    for (const [shade, colorHex] of Object.entries(shades)) {
      const colorDiv = document.createElement("div");
      colorDiv.className = "palette-box";
      colorDiv.style.backgroundColor = colorHex;
      colorDiv.title = `${colorName}-${shade}`;
      colorDiv.setAttribute("data-hex", colorHex);
      colorDiv.innerText = `${colorName}-${shade}`;

      // Click Event to fill inputs on click
      colorDiv.addEventListener("click", () => {
        hexInput.value = colorHex;
        const rgbValues = hexToRgb(colorHex);
        const rgbCode = `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;
        rgbInput.value = rgbCode;

        const closestColor = findClosestTailwindColor(colorHex);
        tailwindInput.value = closestColor || "No Tailwind Match Found";

        updatePreviews(colorHex, "hex");
      });

      paletteContainer.appendChild(colorDiv);
    }
  }
}

displayTailwindPalette();

// Converts RGB to Hex
function rgbToHex(r, g, b) {
  const toHex = (c) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Finds the closest Tailwind color using Euclidean distance
function findClosestTailwindColor(hex) {
  let closestColor = null;
  let closestDistance = Infinity;
  const inputRgb = hexToRgb(hex);

  for (const [colorName, shades] of Object.entries(tailwindColors)) {
    for (const [shade, colorHex] of Object.entries(shades)) {
      const currentRgb = hexToRgb(colorHex);
      const distance = Math.sqrt(
        Math.pow(currentRgb.r - inputRgb.r, 2) +
          Math.pow(currentRgb.g - inputRgb.g, 2) +
          Math.pow(currentRgb.b - inputRgb.b, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = `${colorName}-${shade}`;
      }
    }
  }
  return closestColor;
}

function updatePreviews(color, type) {
  if (type === "hex" || type === "tailwind") {
    hexPreview.style.backgroundColor = color;
    rgbPreview.style.backgroundColor = color;
    tailwindPreview.style.backgroundColor = color;
  } else if (type === "rgb") {
    rgbPreview.style.backgroundColor = color;
    hexPreview.style.backgroundColor = color;
    tailwindPreview.style.backgroundColor = color;
  }
}

hexInput.addEventListener("input", () => {
  const hexCode = hexInput.value.trim();
  if (/^#([0-9A-F]{3}){1,2}$/i.test(hexCode)) {
    const rgbValues = hexToRgb(hexCode);
    const rgbCode = `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;
    rgbInput.value = rgbCode;

    const closestColor = findClosestTailwindColor(hexCode);
    tailwindInput.value = closestColor || "No Tailwind Match Found";

    updatePreviews(hexCode, "hex");
  }
});

rgbInput.addEventListener("input", () => {
  const rgbCode = rgbInput.value.trim();
  const match = rgbCode.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);

  if (match) {
    const [_, r, g, b] = match.map(Number);
    if (r <= 255 && g <= 255 && b <= 255) {
      const hexCode = rgbToHex(r, g, b);
      hexInput.value = hexCode;

      const closestColor = findClosestTailwindColor(hexCode);
      tailwindInput.value = closestColor || "No Tailwind Match Found";

      updatePreviews(`rgb(${r}, ${g}, ${b})`, "rgb");
    }
  }
});

tailwindInput.addEventListener("input", () => {
  const tailwindCode = tailwindInput.value.trim().toLowerCase();
  const [colorName, shade] = tailwindCode.split("-");

  if (tailwindColors[colorName] && tailwindColors[colorName][shade]) {
    const hexCode = tailwindColors[colorName][shade];
    const rgbValues = hexToRgb(hexCode);
    const rgbCode = `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;

    hexInput.value = hexCode;
    rgbInput.value = rgbCode;

    updatePreviews(hexCode, "tailwind");
  }
});

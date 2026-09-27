// Procedural pixel-art farm animals (pig, cow, chicken), matching the pixel characters.
// Each kind has side (left; right is mirrored), front (down) and back (up) views,
// plus a walk cycle driven by swapping the leg rows.

const OUT = "#2a1f1a";

// ---- Pig / cow share one 16x12 silhouette; the cow recolors it and adds spots and horns ----
const QUAD_SIDE = [
  "................",
  "..OO............",
  ".OhhO.OOOOOOOO..",
  "OBBBBOBBBBBBBBO.",
  "OBEBBBBBBBBBBBBO",
  "OSSBBBBBBBBBBBBO",
  "ONSBBBBBBBBBBBBO",
  ".OOBBBBBBBBBBBO.",
  "..ObbbbbbbbbbO..",
];
const QUAD_SIDE_LEGS = [
  ["...DD.DD..DD.DD.", "...DD.DD..DD.DD.", "...OO.OO..OO.OO."],
  ["..DD..DD.DD..DD.", "..DD...DD.DD..DD", "..OO...OO.OO..OO"],
  ["...DD..DD..DD.DD", "...DD.DD..DD..DD", "...OO.OO..OO..OO"],
];
const QUAD_FRONT = [
  "................",
  "..OO........OO..",
  "..OhOOOOOOOOhO..",
  ".OBBBBBBBBBBBBO.",
  ".OBBEBBBBBBEBBO.",
  ".OBBBBSSSSBBBBO.",
  ".OBBBBSNNSBBBBO.",
  ".OBBBBSSSSBBBBO.",
  "..ObbbbbbbbbbO..",
];
const QUAD_BACK = [
  "................",
  "..OO........OO..",
  "..OhOOOOOOOOhO..",
  ".OBBBBBBBBBBBBO.",
  ".OBBBBBBBBBBBBO.",
  ".OBBBBBBBBBBBBO.",
  ".OBBBBBBTBBBBBO.",
  ".OBBBBBBBBBBBBO.",
  "..ObbbbbbbbbbO..",
];
const QUAD_FB_LEGS = [
  ["...DD......DD...", "...DD......DD...", "...OO......OO..."],
  ["...DD......DD...", "...OO......DD...", "...........OO..."],
  ["...DD......DD...", "...DD......OO...", "...OO..........."],
];

// Cow spots (body pixels turned black) per view, as [row, col] pairs
const COW_SPOTS = {
  side: [[3, 8], [3, 9], [4, 9], [4, 10], [5, 12], [6, 11], [6, 12], [7, 6], [4, 5]],
  front: [[3, 3], [4, 12], [3, 12], [7, 3]],
  back: [[3, 5], [3, 6], [4, 6], [5, 10], [5, 11], [6, 4], [7, 9]],
};

// ---- Chicken: 12x10 ----
const CHICK_SIDE = [
  "..RR........",
  ".OWWO.......",
  "YOEWO....OO.",
  ".OWWO...OWWO",
  ".OWWWOOOWWWO",
  ".OWWWWWWWWO.",
  "..OWWwwWWO..",
  "...OOOOOO...",
];
const CHICK_SIDE_LEGS = [
  ["....Y..Y....", "...YY.YY...."],
  ["....Y...Y...", "...YY...YY.."],
  ["...Y...Y....", "..YY..YY...."],
];
const CHICK_FRONT = [
  ".....RR.....",
  "....OWWO....",
  "...OEWWEO...",
  "...OWYYWO...",
  "..OWWWWWWO..",
  "..OWWWWWWO..",
  "...OWwwWO...",
  "....OOOO....",
];
const CHICK_BACK = [
  ".....RR.....",
  "....OWWO....",
  "...OWWWWO...",
  "...OWWWWO...",
  "..OWWWWWWO..",
  ".OWWWWWWWWO.",
  "..OWWwwWWO..",
  "...OOOOOO...",
];
const CHICK_FB_LEGS = [
  [".....YY.....", "....Y..Y...."],
  [".....YY.....", "....Y......."],
  [".....YY.....", ".......Y...."],
];

const PALETTES = {
  pig: { O: OUT, B: "#f4a9b8", b: "#e08a9c", h: "#e08a9c", S: "#e68fa2", N: "#9c4a5c", E: OUT, D: "#d98396", T: "#d9738a" },
  cow: { O: OUT, B: "#f4f1ea", b: "#d8d2c6", h: "#d9c9a3", S: "#f2b8c2", N: "#9c4a5c", E: OUT, D: "#4a4038", T: "#4a4038", K: "#2f2a28" },
  chicken: { O: OUT, W: "#fbfaf5", w: "#dcd8cc", R: "#e04a3a", Y: "#f2b33d", E: OUT },
};

const buildGrid = (kind, view, frame) => {
  let rows;
  if (kind === "chicken") {
    const body = view === "side" ? CHICK_SIDE : view === "front" ? CHICK_FRONT : CHICK_BACK;
    const legs = view === "side" ? CHICK_SIDE_LEGS : CHICK_FB_LEGS;
    rows = body.concat(legs[frame]);
  } else {
    const body = view === "side" ? QUAD_SIDE : view === "front" ? QUAD_FRONT : QUAD_BACK;
    const legs = view === "side" ? QUAD_SIDE_LEGS : QUAD_FB_LEGS;
    rows = body.concat(legs[frame]);
  }
  const grid = rows.map((r) => r.split(""));
  if (kind === "cow") {
    COW_SPOTS[view].forEach(([r, c]) => {
      if (grid[r]?.[c] === "B") grid[r][c] = "K";
    });
  }
  return grid;
};

const DIRS = ["up", "down", "left", "right"];
const FRAMES = 3;
const sheetCache = new Map();

const getSheet = (kind) => {
  if (sheetCache.has(kind)) return sheetCache.get(kind);
  const palette = PALETTES[kind];
  const sample = buildGrid(kind, "side", 0);
  const w = sample[0].length;
  const h = sample.length;
  const sheet = document.createElement("canvas");
  sheet.width = w * FRAMES;
  sheet.height = h * DIRS.length;
  const g = sheet.getContext("2d");
  DIRS.forEach((dir, d) => {
    const view = dir === "up" ? "back" : dir === "down" ? "front" : "side";
    for (let f = 0; f < FRAMES; f++) {
      const grid = buildGrid(kind, view, f);
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          const color = palette[grid[r][c]];
          if (!color) continue;
          const px = dir === "right" ? w - 1 - c : c;
          g.fillStyle = color;
          g.fillRect(f * w + px, d * h + r, 1, 1);
        }
      }
    }
  });
  const entry = { sheet, w, h };
  sheetCache.set(kind, entry);
  return entry;
};

/** Frame for the walk cycle (0 = standing). */
export const getAnimalFrame = (walking, animMs) => (walking ? [1, 0, 2, 0][Math.floor(animMs / 120) % 4] : 0);

/**
 * Draw an animal bottom-centred in a `box`-sized square at (x, y).
 * dirIndex: 0 up, 1 down, 2 left, 3 right.
 */
export const drawPixelAnimal = (ctx, kind, dirIndex, frame, x, y, box) => {
  const { sheet, w, h } = getSheet(kind);
  const scale = Math.max(1, Math.floor(box / w)) || 1;
  const dw = w * scale;
  const dh = h * scale;
  const dx = Math.round(x + (box - dw) / 2);
  const dy = Math.round(y + box - dh);
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, frame * w, dirIndex * h, w, h, dx, dy, dw, dh);
  ctx.imageSmoothingEnabled = prev;
};

export const __animalTemplates = { QUAD_SIDE, QUAD_FRONT, QUAD_BACK, QUAD_SIDE_LEGS, QUAD_FB_LEGS, CHICK_SIDE, CHICK_FRONT, CHICK_BACK, CHICK_SIDE_LEGS, CHICK_FB_LEGS };

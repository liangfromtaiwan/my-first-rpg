// Procedural pixel-art characters: 16x20 sprites, 4 directions x 3 walk frames.
// Sprites are generated from ASCII templates and cached per avatar config.

export const SPRITE_W = 16;
export const SPRITE_H = 20;

export const AVATAR_OPTIONS = {
  skin: ["#fbe0c8", "#f1c19b", "#d99b6c", "#a86b43", "#6e4429"],
  hairStyle: ["short", "bob", "long", "spiky"],
  hairColor: ["#2b2118", "#6b3e1f", "#d9a441", "#c2452f", "#ece6dc", "#7b55c7", "#2f8c9a", "#e8729f"],
  shirt: ["#e46f86", "#4c8bd6", "#58a55c", "#f2c14e", "#8e5cc4", "#e8773b", "#f4f1ea", "#3d3829"],
  pants: ["#394a74", "#3d3829", "#7a5a3a", "#5a7d5a", "#8b8b93"],
};

export const HAIR_STYLE_LABELS = {
  short: "短髮",
  bob: "鮑伯",
  long: "長髮",
  spiky: "刺蝟",
};

const OUTLINE = "#2a1f1a";
const SHOES = "#4a3426";

// Templates: . empty, O outline, H/h hair, S/s skin, E eye, R blush, C/c shirt, P pants, B shoes
const UPPER = {
  down: [
    "................",
    ".....OOOOOO.....",
    "....OHHHHHHO....",
    "...OHHHHHHHHO...",
    "...OHHHHHHHHO...",
    "...OHHhhhhHHO...",
    "...OHSSSSSSHO...",
    "...OSSESSESSO...",
    "...OSSESSESSO...",
    "...OsRSSSSRsO...",
    "....OsSSSSsO....",
    ".....OcSScO.....",
    "...OCCCCCCCCO...",
    "...OSCCCCCCSO...",
    "...OScCCCCcSO...",
  ],
  up: [
    "................",
    ".....OOOOOO.....",
    "....OHHHHHHO....",
    "...OHHHHHHHHO...",
    "...OHHHHHHHHO...",
    "...OHHHHHHHHO...",
    "...OHHHHHHHHO...",
    "...OHHHHHHHHO...",
    "...OhHHHHHHhO...",
    "...OShhhhhhSO...",
    "....OsSSSSsO....",
    ".....OcCCcO.....",
    "...OCCCCCCCCO...",
    "...OSCCCCCCSO...",
    "...OScCCCCcSO...",
  ],
  left: [
    "................",
    "......OOOOO.....",
    ".....OHHHHHO....",
    "....OHHHHHHHO...",
    "...OHHHHHHHHO...",
    "...OHhhHHHHHO...",
    "...OSSShHHHHO...",
    "..OSESSSHHHHO...",
    "...OSSSSSSHHO...",
    "...OsSSSSShHO...",
    "....OsSSSSO.....",
    ".....OcCCO......",
    "....OCCCCCCO....",
    "....OCcCCCCO....",
    "....OcSSCCcO....",
  ],
};

const LEGS_FRONT = [
  [
    "...OOPPPPPPOO...",
    "....OPPOOPPO....",
    "....OPPOOPPO....",
    "....OBBOOBBO....",
    "....OOO..OOO....",
  ],
  [
    "...OOPPPPPPOO...",
    "....OPPOOPPO....",
    "....OBBOOPPO....",
    "....OOOOOBBO....",
    ".........OOO....",
  ],
  [
    "...OOPPPPPPOO...",
    "....OPPOOPPO....",
    "....OPPOOBBO....",
    "....OBBOOOOO....",
    "....OOO.........",
  ],
];

const LEGS_SIDE_IDLE = [
  "....OPPPPPPO....",
  ".....OPPPPO.....",
  ".....OPPPPO.....",
  "....OBBBBBO.....",
  "....OOOOOOO.....",
];
const LEGS_SIDE_STRIDE = [
  "....OPPPPPPO....",
  "....OPPOOPPO....",
  "...OPPO..OPPO...",
  "..OBBBO..OBBO...",
  "..OOOOO..OOOO...",
];
const LEGS_SIDE = [LEGS_SIDE_IDLE, LEGS_SIDE_STRIDE, LEGS_SIDE_STRIDE];

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const shade = (hex, amount) => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
};
const mix = (hexA, hexB, t) => {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
};

const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Deterministic default look for a player who hasn't customized (e.g. from uid). */
export const avatarFromSeed = (seed) => {
  let h = hashString(String(seed || "guest"));
  const pick = (list) => {
    const v = list[h % list.length];
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    return v;
  };
  return {
    skin: pick(AVATAR_OPTIONS.skin),
    hairStyle: pick(AVATAR_OPTIONS.hairStyle),
    hairColor: pick(AVATAR_OPTIONS.hairColor),
    shirt: pick(AVATAR_OPTIONS.shirt),
    pants: pick(AVATAR_OPTIONS.pants),
  };
};

export const randomAvatar = () => avatarFromSeed(Math.random().toString(36));

const isHex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);

/** Validate an avatar coming from storage / Firestore; fall back to seed defaults per field. */
export const normalizeAvatar = (raw, seed) => {
  const base = avatarFromSeed(seed);
  if (!raw || typeof raw !== "object") return base;
  return {
    skin: isHex(raw.skin) ? raw.skin : base.skin,
    hairStyle: AVATAR_OPTIONS.hairStyle.includes(raw.hairStyle) ? raw.hairStyle : base.hairStyle,
    hairColor: isHex(raw.hairColor) ? raw.hairColor : base.hairColor,
    shirt: isHex(raw.shirt) ? raw.shirt : base.shirt,
    pants: isHex(raw.pants) ? raw.pants : base.pants,
  };
};

const toGrid = (rows) => rows.map((row) => row.split(""));

const setCell = (grid, r, c, ch) => {
  if (r >= 0 && r < grid.length && c >= 0 && c < SPRITE_W) grid[r][c] = ch;
};

const applyHairStyle = (grid, style, view) => {
  if (style === "spiky") {
    [5, 8, 10].forEach((c) => {
      setCell(grid, 0, c, "O");
      setCell(grid, 1, c, "H");
    });
    return;
  }
  if (style !== "long" && style !== "bob") return;
  const lastRow = style === "long" ? 13 : 10;
  if (view === "down") {
    for (let r = 6; r <= lastRow; r++) {
      const ch = r === lastRow ? "h" : "H";
      if (r >= 10) {
        setCell(grid, r, 3, "O");
        setCell(grid, r, 12, "O");
      }
      setCell(grid, r, 4, ch);
      setCell(grid, r, 11, ch);
    }
  } else if (view === "up") {
    for (let r = 9; r <= lastRow; r++) {
      const ch = r === lastRow ? "h" : "H";
      setCell(grid, r, 3, "O");
      setCell(grid, r, 12, "O");
      for (let c = 4; c <= 11; c++) setCell(grid, r, c, ch);
    }
  } else {
    for (let r = 8; r <= lastRow; r++) {
      const ch = r === lastRow ? "h" : "H";
      setCell(grid, r, 9, ch);
      setCell(grid, r, 10, ch);
      setCell(grid, r, 11, ch);
      setCell(grid, r, 12, "O");
    }
  }
};

const buildGrid = (view, frame, hairStyle) => {
  const upper = toGrid(UPPER[view]);
  applyHairStyle(upper, hairStyle, view);
  const legs = view === "left" ? LEGS_SIDE[frame] : LEGS_FRONT[frame];
  return upper.concat(toGrid(legs));
};

const DIRS = ["down", "left", "right", "up"];
const FRAMES = 3;
const sheetCache = new Map();

const avatarKey = (a) => `${a.skin}|${a.hairStyle}|${a.hairColor}|${a.shirt}|${a.pants}`;

const buildSheet = (avatar) => {
  const palette = {
    O: OUTLINE,
    E: OUTLINE,
    H: avatar.hairColor,
    h: shade(avatar.hairColor, 0.28),
    S: avatar.skin,
    s: shade(avatar.skin, 0.14),
    R: mix(avatar.skin, "#ff7a7a", 0.35),
    C: avatar.shirt,
    c: shade(avatar.shirt, 0.22),
    P: avatar.pants,
    p: shade(avatar.pants, 0.2),
    B: SHOES,
  };
  const sheet = document.createElement("canvas");
  sheet.width = SPRITE_W * FRAMES;
  sheet.height = SPRITE_H * DIRS.length;
  const sctx = sheet.getContext("2d");
  DIRS.forEach((dir, dirIndex) => {
    const view = dir === "right" ? "left" : dir;
    for (let frame = 0; frame < FRAMES; frame++) {
      const grid = buildGrid(view, frame, avatar.hairStyle);
      for (let r = 0; r < SPRITE_H; r++) {
        for (let c = 0; c < SPRITE_W; c++) {
          const color = palette[grid[r][c]];
          if (!color) continue;
          const px = dir === "right" ? SPRITE_W - 1 - c : c;
          sctx.fillStyle = color;
          sctx.fillRect(frame * SPRITE_W + px, dirIndex * SPRITE_H + r, 1, 1);
        }
      }
    }
  });
  return sheet;
};

export const getSpriteSheet = (avatar) => {
  const key = avatarKey(avatar);
  let sheet = sheetCache.get(key);
  if (!sheet) {
    sheet = buildSheet(avatar);
    sheetCache.set(key, sheet);
  }
  return sheet;
};

/** Walk cycle: idle, stepA, idle, stepB. Side views reuse the stride frame. */
export const getWalkFrame = (isWalking, animMs) => {
  if (!isWalking) return 0;
  return [1, 0, 2, 0][Math.floor(animMs / 130) % 4];
};

/**
 * Draw a character so it fills a tile-sized box at (x, y).
 * scale 2 => 32x40 px, horizontally centered in a 40px tile.
 */
export const drawCharacter = (ctx, avatar, facing, frame, x, y, boxSize, scale = 2) => {
  const sheet = getSpriteSheet(avatar);
  const dirIndex = Math.max(0, DIRS.indexOf(facing));
  const w = SPRITE_W * scale;
  const h = SPRITE_H * scale;
  const dx = Math.round(x + (boxSize - w) / 2);
  // 1px hop on stepping frames gives the walk cycle some bounce
  const bob = frame === 0 ? 0 : scale;
  const dy = Math.round(y + boxSize - h - bob);
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, frame * SPRITE_W, dirIndex * SPRITE_H, SPRITE_W, SPRITE_H, dx, dy, w, h);
  ctx.imageSmoothingEnabled = prev;
};

// Exposed for a quick template sanity check.
export const __templates = { UPPER, LEGS_FRONT, LEGS_SIDE };

// "自己的家" — a small pixel cottage interior: living room (left) + bedroom (right).
// Layout, colors and furniture come from the home document (see docs/home-data-model.md).

import { FURNITURE_CATALOG, drawFurnitureItem } from "./furniture.js";

export const HOME_COLS = 20;
export const HOME_ROWS = 14;
export const HOME_SPAWN = { x: 5, y: 10 };
export const HOME_EXIT_TILES = [{ x: 5, y: 12 }, { x: 6, y: 12 }];
const DIVIDER_X = 12;
const DOORWAY_ROWS = [5, 6];

export const DEFAULT_FLOOR_COLOR = "#b98a5e";
export const DEFAULT_WALL_COLOR = "#f1e3c8";

export const FLOOR_COLORS = [
  { color: "#b98a5e", name: "橡木" },
  { color: "#8b5e3c", name: "胡桃木" },
  { color: "#d9b98c", name: "淺木" },
  { color: "#a3a8b0", name: "灰磚" },
  { color: "#c47a4c", name: "磚紅" },
  { color: "#6f8f6a", name: "綠地毯" },
  { color: "#7b7fc4", name: "藍地毯" },
  { color: "#e3c9d6", name: "粉地毯" },
];
export const WALL_COLORS = [
  { color: "#f1e3c8", name: "奶油" },
  { color: "#f6d6de", name: "粉紅" },
  { color: "#d6e8f5", name: "天空藍" },
  { color: "#dcefd8", name: "薄荷" },
  { color: "#e6dcf5", name: "薰衣草" },
  { color: "#fff1b8", name: "檸檬黃" },
  { color: "#dedad4", name: "淺灰" },
  { color: "#4a4666", name: "夜空" },
];
export const DOOR_MODES = {
  open: "🚪 開放：誰都能進來",
  knock: "🔔 敲門：我同意才能進來",
  locked: "🔒 上鎖：暫不接待訪客",
};

// Guestbook corkboard on the living-room wall; stand in front of it and press Enter / X
export const GUESTBOOK_SPOT = { x: 6, y: 0, w: 2 };
export const isNearGuestbook = (px, py, t) => {
  const cx = (GUESTBOOK_SPOT.x + GUESTBOOK_SPOT.w / 2) * t;
  const cy = 1.5 * t;
  return Math.hypot(px - cx, py - cy) < t * 2.3;
};

export const homeMapName = (uid) => `home_${uid}`;
export const isHomeMap = (mapName) => typeof mapName === "string" && mapName.startsWith("home_");
export const homeOwnerFromMap = (mapName) => (isHomeMap(mapName) ? mapName.slice(5) : null);

/** Furniture every new home starts with. */
export const DEFAULT_FURNITURE = [
  { id: "f1", type: "rug", x: 3, y: 4, color: "#8e5cc4" },
  { id: "f2", type: "tv", x: 4, y: 2 },
  { id: "f3", type: "coffeeTable", x: 4, y: 5 },
  { id: "f4", type: "sofa", x: 3, y: 7, facing: "up" },
  { id: "f5", type: "bookshelf", x: 8, y: 2 },
  { id: "f6", type: "prideFlag", x: 10, y: 2 },
  { id: "f7", type: "plant", x: 1, y: 2 },
  { id: "f8", type: "plant", x: 11, y: 11 },
  { id: "f9", type: "wardrobe", x: 13, y: 2 },
  { id: "f10", type: "nightstand", x: 15, y: 2 },
  { id: "f11", type: "bed", x: 16, y: 2 },
  { id: "f12", type: "rug", x: 14, y: 7, color: "#4c8bd6" },
  { id: "f13", type: "cat", x: 15, y: 8 },
];

export const createDefaultHome = (ownerUid, ownerName) => ({
  ownerUid,
  ownerName: ownerName || "Player",
  template: "cozy",
  floorColor: DEFAULT_FLOOR_COLOR,
  wallColor: DEFAULT_WALL_COLOR,
  door: "open",
  furniture: DEFAULT_FURNITURE.map((f) => ({ ...f })),
});

const isHex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);

/** Validate a home doc from Firestore (drops unknown / out-of-bounds furniture). */
export const normalizeHome = (raw, ownerUid, ownerName) => {
  const base = createDefaultHome(ownerUid, ownerName);
  if (!raw || typeof raw !== "object") return base;
  const furniture = Array.isArray(raw.furniture)
    ? raw.furniture.filter((f) => {
        const def = f && FURNITURE_CATALOG[f.type];
        return def && Number.isInteger(f.x) && Number.isInteger(f.y)
          && f.x >= 1 && f.y >= 2 && f.x + def.w <= HOME_COLS - 1 && f.y + def.h <= HOME_ROWS - 1;
      }).slice(0, 80)
    : base.furniture;
  return {
    ...base,
    ownerName: typeof raw.ownerName === "string" && raw.ownerName ? raw.ownerName.slice(0, 24) : base.ownerName,
    floorColor: isHex(raw.floorColor) ? raw.floorColor : base.floorColor,
    wallColor: isHex(raw.wallColor) ? raw.wallColor : base.wallColor,
    door: ["open", "knock", "locked"].includes(raw.door) ? raw.door : base.door,
    kicked: raw.kicked && typeof raw.kicked === "object" ? raw.kicked : {},
    furniture,
  };
};

export const isHomeWallTile = (x, y) => {
  if (y <= 1 || y === HOME_ROWS - 1 || x === 0 || x === HOME_COLS - 1) return true;
  return x === DIVIDER_X && !DOORWAY_ROWS.includes(y);
};

/** Collision grid: walls + blocking furniture = 1. */
export const buildHomeTiles = (home) => {
  const tiles = [];
  for (let y = 0; y < HOME_ROWS; y++) {
    const row = [];
    for (let x = 0; x < HOME_COLS; x++) row.push(isHomeWallTile(x, y) ? 1 : 0);
    tiles.push(row);
  }
  home.furniture.forEach((f) => {
    const def = FURNITURE_CATALOG[f.type];
    if (!def || !def.block) return;
    for (let y = f.y; y < f.y + def.h; y++) {
      for (let x = f.x; x < f.x + def.w; x++) {
        if (tiles[y] && tiles[y][x] !== undefined) tiles[y][x] = 1;
      }
    }
  });
  // Keep the exit mat and doorway walkable no matter what
  HOME_EXIT_TILES.forEach((t) => { tiles[t.y][t.x] = 0; });
  return tiles;
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const shade = (hex, amount) => {
  const [r, g, b] = hexToRgb(hex);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * (1 - amount)))).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
};
const px = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

/** Static pixel-art layer for a home: floor, wallpaper walls, furniture. */
export const buildHomeLayer = (home, t) => {
  const layer = document.createElement("canvas");
  layer.width = HOME_COLS * t;
  layer.height = HOME_ROWS * t;
  const g = layer.getContext("2d");
  const floorA = home.floorColor;
  const floorB = shade(home.floorColor, 0.06);
  const floorLine = shade(home.floorColor, 0.14);
  const wall = home.wallColor;
  const wallStripe = shade(home.wallColor, 0.06);

  // Floor: wooden planks tinted by floorColor
  for (let y = 0; y < HOME_ROWS; y++) {
    for (let x = 0; x < HOME_COLS; x++) {
      if (isHomeWallTile(x, y)) continue;
      const X = x * t;
      const Y = y * t;
      px(g, y % 2 ? floorA : floorB, X, Y, t, t);
      px(g, floorLine, X, Y + t / 2 - 1, t, 2);
      px(g, floorLine, X + ((y * 17) % t), Y, 2, t / 2);
      px(g, floorLine, X + ((y * 17 + 20) % t), Y + t / 2, 2, t / 2);
    }
  }

  // Walls: the top two rows form a tall wallpapered wall; others are dark wall tops
  for (let y = 0; y < HOME_ROWS; y++) {
    for (let x = 0; x < HOME_COLS; x++) {
      if (!isHomeWallTile(x, y)) continue;
      const X = x * t;
      const Y = y * t;
      const isBackWall = y <= 1 && x > 0 && x < HOME_COLS - 1 && x !== DIVIDER_X;
      if (isBackWall) {
        px(g, wall, X, Y, t, t);
        if (x % 2 === 0) px(g, wallStripe, X + 8, Y, 8, t);
        if (y === 0) px(g, "#2e2a45", X, Y, t, 8);
        if (y === 1) {
          px(g, shade(wall, 0.12), X, Y + t - 10, t, 4);
          px(g, "#7c5b3f", X, Y + t - 6, t, 6); // baseboard
        }
      } else {
        const faceVisible = y + 1 < HOME_ROWS && !isHomeWallTile(x, y + 1);
        if (faceVisible) {
          px(g, "#2e2a45", X, Y, t, 10);
          px(g, wall, X, Y + 10, t, t - 16);
          px(g, "#7c5b3f", X, Y + t - 6, t, 6);
        } else {
          px(g, "#2e2a45", X, Y, t, t);
          px(g, "#3a355a", X + 2, Y + 2, t - 4, t - 4);
        }
      }
    }
  }
  // Window on the living-room wall
  px(g, "#2e2a45", 2 * t, 10, t + 8, t + 14);
  px(g, "#9ad4f5", 2 * t + 4, 14, t, t + 6);
  px(g, "#d6f0ff", 2 * t + 8, 18, 10, 12);
  px(g, "#2e2a45", 2 * t + t / 2 + 2, 14, 2, t + 6);

  // Guestbook corkboard
  const gbX = GUESTBOOK_SPOT.x * t + 6;
  px(g, "#2e2a45", gbX, 14, GUESTBOOK_SPOT.w * t - 12, t + 12);
  px(g, "#c49a6c", gbX + 3, 17, GUESTBOOK_SPOT.w * t - 18, t + 6);
  [["#f4e3a1", 6, 6], ["#f29fb0", 26, 10], ["#9ad4f5", 46, 5], ["#dcefd8", 14, 28], ["#f4f1ea", 40, 28]].forEach(([c, ox, oy]) => {
    px(g, c, gbX + 3 + ox, 17 + oy, 14, 11);
    px(g, "#c85a54", gbX + 3 + ox + 6, 17 + oy + 1, 2, 2);
  });
  g.fillStyle = "#2e2a45";
  g.font = "bold 9px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "top";
  g.fillText("GUESTBOOK", gbX + (GUESTBOOK_SPOT.w * t - 12) / 2, 17 + t - 6);

  // Exit door mat
  const [m1] = HOME_EXIT_TILES;
  px(g, "#2e2a45", m1.x * t, m1.y * t + 6, t * 2, t - 12);
  px(g, "#8a6a4a", m1.x * t + 4, m1.y * t + 10, t * 2 - 8, t - 20);
  g.fillStyle = "#f4e3a1";
  g.font = "bold 10px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("EXIT", m1.x * t + t, m1.y * t + t / 2);

  // Furniture: flat items (rugs) first, then the rest top-to-bottom
  const items = [...home.furniture].sort((a, b) => {
    const fa = FURNITURE_CATALOG[a.type]?.flat ? 0 : 1;
    const fb = FURNITURE_CATALOG[b.type]?.flat ? 0 : 1;
    return fa - fb || a.y - b.y;
  });
  items.forEach((f) => drawFurnitureItem(g, f, t));
  return layer;
};

export const homeMinimapColor = (home) => (x, y) => (isHomeWallTile(x, y) ? "#2e2a45" : home.floorColor);

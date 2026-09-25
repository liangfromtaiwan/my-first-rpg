// "EQU 辦公室" indoor map, modeled on a Gather-style office:
// open desks, a meeting room, a lounge, a café and a game corner.
// Everything here is drawn procedurally in pixel-art style into one static layer.

export const OFFICE_COLS = 40;
export const OFFICE_ROWS = 28;
export const OFFICE_SPAWN = { x: 9, y: 24 };
export const OFFICE_EXIT_TILES = [{ x: 9, y: 26 }, { x: 10, y: 26 }];

const inRange = (v, a, b) => v >= a && v <= b;

const isWallTile = (x, y) => {
  if (x === 0 || y === 0 || x === OFFICE_COLS - 1 || y === OFFICE_ROWS - 1) return true;
  // Vertical divider with three doorways
  if (x === 20 && !inRange(y, 5, 6) && !inRange(y, 13, 14) && !inRange(y, 22, 23)) return true;
  // Left: office / game corner
  if (y === 15 && x < 20 && !inRange(x, 9, 10)) return true;
  // Right: meeting / lounge / café
  if ((y === 10 || y === 18) && x > 20 && !inRange(x, 28, 29)) return true;
  return false;
};

// Furniture: { type, x, y, w, h, block } in tiles
const FURNITURE = [];
const add = (type, x, y, w = 1, h = 1, block = true, extra = {}) =>
  FURNITURE.push({ type, x, y, w, h, block, ...extra });

// Open office: 3 rows of desk pairs, chairs below
[3, 7, 11].forEach((row) => {
  [3, 7, 11, 15].forEach((col) => {
    add("desk", col, row, 2, 1);
    add("chair", col, row + 1, 1, 1, false);
    add("chair", col + 1, row + 1, 1, 1, false);
  });
});
add("plant", 1, 1);
add("plant", 19, 1);
add("plant", 1, 14);
add("plant", 19, 14);

// Meeting room: long table with chairs and a wall screen
add("rug", 23, 2, 14, 7, false, { color: "#5b5f9e" });
add("longTable", 25, 4, 10, 2);
for (let c = 25; c <= 34; c += 2) {
  add("chair", c, 3, 1, 1, false, { facing: "down" });
  add("chair", c, 6, 1, 1, false);
}
add("screen", 28, 0, 4, 1, false);
add("plant", 21, 1);
add("plant", 38, 1);

// Lounge: two sofa groups around coffee tables
[[23, 12], [32, 12]].forEach(([x, y]) => {
  add("rug", x - 1, y - 1, 6, 7, false, { color: "#3f8c8a" });
  add("sofa", x, y, 4, 1, true, { facing: "down" });
  add("sofa", x, y + 4, 4, 1, true, { facing: "up" });
  add("coffeeTable", x + 1, y + 2, 2, 1);
});
add("plant", 21, 11);
add("plant", 38, 11);
add("plant", 38, 17);

// Café: counter + round tables
add("counter", 22, 19, 6, 1);
[[25, 23], [31, 22], [35, 25], [30, 25]].forEach(([x, y]) => {
  add("roundTable", x, y);
  add("chair", x - 1, y, 1, 1, false, { facing: "right" });
  add("chair", x + 1, y, 1, 1, false, { facing: "left" });
});
add("plant", 38, 19);
add("plant", 21, 26);

// Game corner: arcade cabinets + rug (tic-tac-toe tables come from spaces.js)
add("rug", 3, 18, 14, 5, false, { color: "#b0643a" });
add("arcade", 2, 16);
add("arcade", 3, 16);
add("arcade", 17, 16);
add("plant", 1, 26);
add("plant", 19, 26);
add("doorMat", 9, 26, 2, 1, false);

export const buildOfficeTiles = () => {
  const tiles = [];
  for (let y = 0; y < OFFICE_ROWS; y++) {
    const row = [];
    for (let x = 0; x < OFFICE_COLS; x++) row.push(isWallTile(x, y) ? 1 : 0);
    tiles.push(row);
  }
  FURNITURE.forEach((f) => {
    if (!f.block) return;
    for (let y = f.y; y < f.y + f.h; y++) for (let x = f.x; x < f.x + f.w; x++) tiles[y][x] = 1;
  });
  return tiles;
};

const floorType = (x, y) => {
  if (x > 20 && y < 10) return "meet";
  if (x > 20 && y > 10 && y < 18) return "lounge";
  if (x > 20 && y > 18) return "cafe";
  if (x < 20 && y > 15) return "game";
  return "wood";
};

const FLOORS = {
  wood: ["#b98a5e", "#b08157", "#a47650"],
  meet: ["#6f73b8", "#686cb0", "#5f63a6"],
  lounge: ["#4f9e9b", "#489693", "#418b88"],
  cafe: ["#ece4d4", "#ddd2bd", "#cfc3ab"],
  game: ["#c47a4c", "#bb7246", "#ad6840"],
};

const px = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

const drawFloor = (g, x, y, t, type) => {
  const [a, b, line] = FLOORS[type];
  const X = x * t;
  const Y = y * t;
  if (type === "wood") {
    // Planks: horizontal boards with staggered seams
    px(g, (y % 2) ? a : b, X, Y, t, t);
    px(g, line, X, Y + t / 2 - 1, t, 2);
    px(g, line, X + ((y * 17) % t), Y, 2, t / 2);
    px(g, line, X + ((y * 17 + 20) % t), Y + t / 2, 2, t / 2);
  } else if (type === "cafe") {
    px(g, (x + y) % 2 ? a : b, X, Y, t, t);
  } else {
    px(g, a, X, Y, t, t);
    // Carpet weave dots
    for (let i = 4; i < t; i += 8) for (let j = 4; j < t; j += 8) px(g, (i + j) % 16 ? b : line, X + i, Y + j, 2, 2);
  }
};

const drawWall = (g, x, y, t) => {
  const X = x * t;
  const Y = y * t;
  // A wall shows its front face when the tile below it is floor
  const faceVisible = y + 1 < OFFICE_ROWS && !isWallTile(x, y + 1);
  if (faceVisible) {
    // Front face of the wall: cream with a baseboard, top edge dark
    px(g, "#2e2a45", X, Y, t, 10);
    px(g, "#e9dfcf", X, Y + 10, t, t - 16);
    px(g, "#d6c9b3", X, Y + 10, t, 3);
    px(g, "#7c5b3f", X, Y + t - 6, t, 6);
  } else {
    px(g, "#2e2a45", X, Y, t, t);
    px(g, "#3a355a", X + 2, Y + 2, t - 4, t - 4);
  }
};

const drawFurniture = (g, f, t) => {
  const X = f.x * t;
  const Y = f.y * t;
  const W = f.w * t;
  const H = f.h * t;
  switch (f.type) {
    case "rug":
      px(g, f.color, X + 4, Y + 4, W - 8, H - 8);
      g.strokeStyle = "rgba(255,255,255,0.35)";
      g.lineWidth = 2;
      g.setLineDash([6, 4]);
      g.strokeRect(X + 10, Y + 10, W - 20, H - 20);
      g.setLineDash([]);
      break;
    case "doorMat":
      px(g, "#2e2a45", X, Y + 4, W, H - 8);
      px(g, "#8a6a4a", X + 4, Y + 8, W - 8, H - 16);
      g.fillStyle = "#f4e3a1";
      g.font = "bold 10px Arial, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("EXIT", X + W / 2, Y + H / 2);
      break;
    case "desk":
      px(g, "#2a1f1a", X, Y + 8, W, H - 10);
      px(g, "#c9955f", X + 2, Y + 10, W - 4, H - 16);
      px(g, "#a8773f", X + 2, Y + H - 8, W - 4, 4);
      // Two monitors
      [X + 8, X + W - 32].forEach((mx) => {
        px(g, "#1d1b2b", mx, Y, 24, 16);
        px(g, "#5fb3e6", mx + 2, Y + 2, 20, 11);
        px(g, "#9ad4f5", mx + 3, Y + 3, 8, 3);
        px(g, "#1d1b2b", mx + 10, Y + 16, 4, 4);
        px(g, "#3d3a52", mx + 4, Y + 22, 16, 4); // keyboard
      });
      break;
    case "chair": {
      const cx = X + 10;
      const cy = Y + 8;
      px(g, "#2a1f1a", cx - 2, cy - 2, 24, 24);
      px(g, "#7b5cc4", cx, cy, 20, 20);
      px(g, "#9677d8", cx, cy, 20, 5);
      break;
    }
    case "longTable":
      px(g, "#2a1f1a", X - 2, Y + 2, W + 4, H - 2);
      px(g, "#8b5e3c", X, Y + 4, W, H - 8);
      px(g, "#a2714a", X, Y + 4, W, 6);
      for (let i = 1; i < f.w; i++) px(g, "#7a5134", X + i * t, Y + 4, 2, H - 8);
      // Laptops / papers
      for (let i = 0; i < f.w; i += 2) {
        px(g, "#e9e4da", X + i * t + 12, Y + 14, 14, 10);
        px(g, "#e9e4da", X + i * t + 14, Y + H - 26, 14, 10);
      }
      break;
    case "screen":
      px(g, "#1d1b2b", X + 6, Y + 4, W - 12, 26);
      px(g, "#3f4a7a", X + 9, Y + 7, W - 18, 20);
      px(g, "#f2c14e", X + 16, Y + 12, 40, 4);
      px(g, "#9ad4f5", X + 16, Y + 19, 70, 3);
      break;
    case "sofa": {
      const back = f.facing === "up" ? Y + H - 12 : Y;
      px(g, "#2a1f1a", X, Y + 2, W, H - 4);
      px(g, "#4c6fc4", X + 2, Y + 4, W - 4, H - 8);
      px(g, "#39579e", X + 2, back + (f.facing === "up" ? 0 : 4), W - 4, 8);
      for (let i = 1; i < f.w; i++) px(g, "#39579e", X + i * t, Y + 12, 2, H - 20);
      px(g, "#39579e", X + 2, Y + 4, 6, H - 8);
      px(g, "#39579e", X + W - 8, Y + 4, 6, H - 8);
      break;
    }
    case "coffeeTable":
      px(g, "#2a1f1a", X + 2, Y + 6, W - 4, H - 12);
      px(g, "#d7b98f", X + 4, Y + 8, W - 8, H - 16);
      px(g, "#f4f1ea", X + 20, Y + 14, 8, 8);
      px(g, "#c85a54", X + 50, Y + 14, 8, 8);
      break;
    case "roundTable":
      g.fillStyle = "#2a1f1a";
      g.beginPath();
      g.arc(X + t / 2, Y + t / 2, 17, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#e8d7b6";
      g.beginPath();
      g.arc(X + t / 2, Y + t / 2, 15, 0, Math.PI * 2);
      g.fill();
      px(g, "#f4f1ea", X + 14, Y + 14, 6, 6);
      px(g, "#7a4b2a", X + 15, Y + 15, 4, 4);
      break;
    case "counter":
      px(g, "#2a1f1a", X, Y + 4, W, H - 4);
      px(g, "#6b4a33", X + 2, Y + 6, W - 4, H - 8);
      px(g, "#e9dfcf", X + 2, Y + 6, W - 4, 8);
      // Coffee machine + pastry case
      px(g, "#3d3a52", X + 10, Y - 6, 22, 24);
      px(g, "#c85a54", X + 14, Y - 2, 6, 6);
      px(g, "#9ad4f5", X + W - 70, Y + 2, 50, 12);
      px(g, "#e8a860", X + W - 64, Y + 6, 8, 6);
      px(g, "#f2c14e", X + W - 50, Y + 6, 8, 6);
      px(g, "#e46f86", X + W - 36, Y + 6, 8, 6);
      break;
    case "arcade":
      px(g, "#2a1f1a", X + 4, Y - 6, t - 8, t + 4);
      px(g, "#8e5cc4", X + 6, Y - 4, t - 12, t);
      px(g, "#1d1b2b", X + 9, Y, t - 18, 14);
      px(g, "#6fe3a8", X + 11, Y + 2, t - 22, 10);
      px(g, "#f2c14e", X + 12, Y + 20, 4, 4);
      px(g, "#e46f86", X + 22, Y + 20, 4, 4);
      break;
    case "plant":
      px(g, "#2a1f1a", X + 10, Y + 22, 20, 16);
      px(g, "#b0643a", X + 12, Y + 24, 16, 12);
      px(g, "#2f7d4f", X + 6, Y + 6, 28, 18);
      px(g, "#43a266", X + 10, Y + 2, 20, 14);
      px(g, "#5cc07f", X + 14, Y + 4, 6, 6);
      break;
    default:
      break;
  }
};

/** Static pixel-art layer: floors, walls and furniture. */
export const buildOfficeLayer = (tiles, t) => {
  const layer = document.createElement("canvas");
  layer.width = OFFICE_COLS * t;
  layer.height = OFFICE_ROWS * t;
  const g = layer.getContext("2d");
  for (let y = 0; y < OFFICE_ROWS; y++) {
    for (let x = 0; x < OFFICE_COLS; x++) {
      if (isWallTile(x, y)) continue;
      drawFloor(g, x, y, t, floorType(x, y));
    }
  }
  // Rugs first, then other furniture, then walls on top (so wall faces overlap cleanly)
  FURNITURE.filter((f) => f.type === "rug").forEach((f) => drawFurniture(g, f, t));
  FURNITURE.filter((f) => f.type !== "rug").forEach((f) => drawFurniture(g, f, t));
  for (let y = 0; y < OFFICE_ROWS; y++) {
    for (let x = 0; x < OFFICE_COLS; x++) {
      if (isWallTile(x, y)) drawWall(g, x, y, t);
    }
  }
  // Screen hangs on the meeting-room wall, so draw it after walls
  FURNITURE.filter((f) => f.type === "screen").forEach((f) => drawFurniture(g, f, t));
  return layer;
};

/** Minimap colors for the office. */
export const officeMinimapColor = (x, y) => {
  if (isWallTile(x, y)) return "#2e2a45";
  return FLOORS[floorType(x, y)][0];
};

/** Pixel "EQU Office" building shown on the world map (4x4 tiles, door at the bottom middle). */
export const drawOfficeBuilding = (g, tileX, tileY, t) => {
  const X = tileX * t;
  const Y = tileY * t;
  const W = 4 * t;
  const H = 4 * t;
  px(g, "rgba(20,30,20,0.25)", X + 4, Y + H - 6, W, 10);
  // Body
  px(g, "#2a1f1a", X, Y + 18, W, H - 18);
  px(g, "#e9dfcf", X + 3, Y + 21, W - 6, H - 24);
  // Roof
  px(g, "#2a1f1a", X - 6, Y + 2, W + 12, 24);
  px(g, "#3f4a7a", X - 3, Y + 5, W + 6, 18);
  px(g, "#5663a0", X - 3, Y + 5, W + 6, 5);
  // Sign
  px(g, "#2a1f1a", X + W / 2 - 34, Y + 30, 68, 20);
  px(g, "#f2c14e", X + W / 2 - 32, Y + 32, 64, 16);
  g.fillStyle = "#2a1f1a";
  g.font = "bold 12px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("EQU", X + W / 2, Y + 40);
  // Windows
  [[12, 60], [W - 40, 60], [12, 96], [W - 40, 96]].forEach(([wx, wy]) => {
    px(g, "#2a1f1a", X + wx, Y + wy, 28, 22);
    px(g, "#9ad4f5", X + wx + 2, Y + wy + 2, 24, 18);
    px(g, "#d6f0ff", X + wx + 4, Y + wy + 4, 8, 5);
  });
  // Glass door (bottom middle, 2 tiles wide)
  px(g, "#2a1f1a", X + t - 2, Y + H - 44, 2 * t + 4, 44);
  px(g, "#5fb3e6", X + t + 2, Y + H - 40, t - 4, 40);
  px(g, "#5fb3e6", X + 2 * t + 2, Y + H - 40, t - 4, 40);
  px(g, "#d6f0ff", X + t + 6, Y + H - 36, 6, 20);
};

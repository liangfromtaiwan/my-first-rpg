// 抱石村 interior: the village map is the inside of a bouldering gym.
// Climbing walls line the top and both sides (with crash pads in front), a freestanding boulder
// stands in the middle and a front desk sits by the exit. Coordinates are in tiles.

const OUT = "#2a1f1a";
const HOLDS = ["#e04a3a", "#f2c14e", "#43a266", "#3f7ad9", "#c85ad9", "#ff8a3d", "#5ee0ff", "#f4f1ea"];
const PANELS = ["#8fa3a8", "#9fb1b5", "#7f959b", "#6f8f99", "#8a96b0"];

export const GYM = {
  topWallRows: [1, 2], // blocked, drawn as the tall back wall (row 0 is the border)
  leftWallCols: [1, 2],
  rightWallCols: [37, 38],
  sideFrom: 3,
  sideTo: 24,
  boulder: { x: 19, y: 9, w: 6, h: 4 }, // freestanding boulder (blocked)
  desk: { x: 32, y: 19, w: 4, h: 1 }, // front desk (blocked)
};

/** Tiles the gym's walls and furniture block. */
export const gymBlockedTiles = (cols) => {
  const out = [];
  GYM.topWallRows.forEach((y) => {
    for (let x = 1; x < cols - 1; x++) out.push([x, y]);
  });
  for (let y = GYM.sideFrom; y <= GYM.sideTo; y++) {
    GYM.leftWallCols.forEach((x) => out.push([x, y]));
    GYM.rightWallCols.forEach((x) => out.push([x, y]));
  }
  const b = GYM.boulder;
  for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) out.push([x, y]);
  const d = GYM.desk;
  for (let x = d.x; x < d.x + d.w; x++) out.push([x, d.y]);
  return out;
};

const isPad = (x, y, cols) => {
  const b = GYM.boulder;
  if (y >= 3 && y <= 4 && x >= 3 && x <= cols - 4) return true; // under the back wall
  if (y >= 5 && y <= GYM.sideTo && (x === 3 || x === 4 || x === cols - 5 || x === cols - 4)) return true; // side walls
  if (x >= b.x - 2 && x < b.x + b.w + 2 && y >= b.y - 2 && y < b.y + b.h + 2) return true; // around the boulder
  return false;
};

export const gymMinimapColor = (tiles) => (x, y) => {
  const cols = tiles[0].length;
  if (tiles[y]?.[x] === 1) return "#8fa3a8";
  if (isPad(x, y, cols)) return "#2f6fb0";
  return "#3d4150";
};

export const buildGymInteriorLayer = (tiles, t) => {
  const rows = tiles.length;
  const cols = tiles[0].length;
  const layer = document.createElement("canvas");
  layer.width = cols * t;
  layer.height = rows * t;
  const g = layer.getContext("2d");
  let seed = 1234;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 8; i++) rand();
  const px = (color, x, y, w, h) => {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  };
  const holds = (x, y, w, h, n) => {
    for (let i = 0; i < n; i++) {
      const hw = 7 + Math.floor(rand() * 7);
      const hh = 6 + Math.floor(rand() * 4);
      const hx = x + 3 + Math.floor(rand() * Math.max(1, w - hw - 6));
      const hy = y + 3 + Math.floor(rand() * Math.max(1, h - hh - 6));
      px(OUT, hx - 2, hy - 2, hw + 4, hh + 4);
      px(HOLDS[Math.floor(rand() * HOLDS.length)], hx, hy, hw, hh);
      px("rgba(255,255,255,0.35)", hx, hy, hw, 2);
    }
  };

  // Rubber floor
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      px((r + c) % 2 ? "#3d4150" : "#40445a", c * t, r * t, t, t);
      for (let i = 0; i < 3; i++) px("#4b5066", c * t + Math.floor(rand() * (t - 3)), r * t + Math.floor(rand() * (t - 3)), 3, 3);
    }
  }
  // Crash pads (blue mats with seams)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!isPad(c, r, cols) || tiles[r][c] === 1) continue;
      px("#2f6fb0", c * t, r * t, t, t);
      px("#3a7fc4", c * t, r * t, t, 4);
      if (c % 2 === 0) px("#255a90", c * t, r * t, 2, t);
      if (r % 2 === 0) px("#255a90", c * t, r * t, t, 2);
    }
  }

  // Back wall (rows 0–2): panels in several greys, holds and a few coloured volumes
  const wallH = 3 * t;
  px("#1f2230", 0, 0, cols * t, wallH);
  for (let c = 1; c < cols - 1; c += 2) {
    const x = c * t;
    px(PANELS[Math.floor(rand() * PANELS.length)], x, 8, 2 * t, wallH - 14);
    px("rgba(255,255,255,0.12)", x, 8, 2 * t, 4);
    px("rgba(0,0,0,0.25)", x, 8, 2, wallH - 14);
    holds(x, 14, 2 * t, wallH - 26, 9);
    if (rand() < 0.35) {
      // Triangular volume
      const vx = x + 10 + Math.floor(rand() * (t - 10));
      const vy = 24 + Math.floor(rand() * (wallH - 70));
      const vc = HOLDS[Math.floor(rand() * 6)];
      g.fillStyle = OUT;
      g.beginPath();
      g.moveTo(vx - 2, vy + 30);
      g.lineTo(vx + 16, vy - 2);
      g.lineTo(vx + 34, vy + 30);
      g.fill();
      g.fillStyle = vc;
      g.beginPath();
      g.moveTo(vx + 2, vy + 28);
      g.lineTo(vx + 16, vy + 3);
      g.lineTo(vx + 30, vy + 28);
      g.fill();
    }
  }
  px("#11131c", 0, wallH - 6, cols * t, 6); // base of the wall
  px("rgba(0,0,0,0.25)", 0, wallH, cols * t, 8); // shadow on the pads

  // Side walls: seen from above, a strip of panels with holds
  const side = (c0) => {
    const x = c0 * t;
    const w = 2 * t;
    for (let r = GYM.sideFrom; r <= GYM.sideTo; r += 2) {
      const y = r * t;
      const h = Math.min(2, GYM.sideTo - r + 1) * t;
      px(PANELS[Math.floor(rand() * PANELS.length)], x, y, w, h);
      px("rgba(0,0,0,0.2)", x, y, w, 2);
      holds(x, y, w, h, 6);
    }
    px("#1f2230", x, (GYM.sideTo + 1) * t - 4, w, 4);
  };
  side(GYM.leftWallCols[0]);
  side(GYM.rightWallCols[0]);
  px("rgba(0,0,0,0.25)", 3 * t, 3 * t, 6, (GYM.sideTo - 2) * t);
  px("rgba(0,0,0,0.25)", (cols - 3) * t - 6, 3 * t, 6, (GYM.sideTo - 2) * t);
  // Outer border walls
  px("#1f2230", 0, 0, t, rows * t);
  px("#1f2230", (cols - 1) * t, 0, t, rows * t);
  px("#1f2230", 0, (rows - 1) * t, cols * t, t);

  // Freestanding boulder: light top-out, front face covered in holds
  const b = GYM.boulder;
  const bx = b.x * t;
  const by = b.y * t;
  const bw = b.w * t;
  const bh = b.h * t;
  px("rgba(0,0,0,0.3)", bx + 6, by + bh, bw, 10);
  px(OUT, bx - 2, by - 2, bw + 4, bh + 4);
  px("#c9d3d6", bx, by, bw, t * 1.4); // top-out
  px("#e0e7e9", bx, by, bw, 6);
  px("#9fb1b5", bx, by + t * 1.4, bw, bh - t * 1.4); // front face
  px("#7f959b", bx, by + t * 1.4, bw, 4);
  for (let i = 1; i < b.w; i++) px("rgba(0,0,0,0.18)", bx + i * t, by + t * 1.4, 2, bh - t * 1.4);
  holds(bx, by + t * 1.4 + 4, bw, bh - t * 1.4 - 6, 22);
  // Route start tags
  for (let i = 0; i < 4; i++) px(HOLDS[i], bx + 16 + i * 60, by + bh - 12, 10, 6);

  // Front desk with a laptop and chalk for sale
  const d = GYM.desk;
  const dx = d.x * t;
  const dy = d.y * t;
  px("rgba(0,0,0,0.3)", dx + 4, dy + t - 2, d.w * t, 8);
  px(OUT, dx - 2, dy - 4, d.w * t + 4, t + 4);
  px("#8b5e3c", dx, dy - 2, d.w * t, t);
  px("#a2714a", dx, dy - 2, d.w * t, 8);
  px(OUT, dx + 16, dy + 4, 26, 16);
  px("#5ee0ff", dx + 18, dy + 6, 22, 11);
  for (let i = 0; i < 4; i++) {
    px(OUT, dx + 70 + i * 16, dy + 6, 12, 14);
    px(HOLDS[i], dx + 72 + i * 16, dy + 8, 8, 10);
  }

  // Benches and chalk buckets along the bottom
  const bench = (x, y, w) => {
    px("rgba(0,0,0,0.25)", x + 4, y + 26, w, 6);
    px(OUT, x, y + 12, w, 14);
    px("#a2714a", x + 2, y + 14, w - 4, 10);
    px("#c98f55", x + 2, y + 14, w - 4, 3);
  };
  bench(5 * t, 25 * t, 3 * t);
  bench(20 * t, 25 * t, 3 * t);
  const bucket = (x, y) => {
    px(OUT, x + 12, y + 12, 18, 18);
    px("#f4f1ea", x + 14, y + 14, 14, 14);
    px("#d8d2c6", x + 14, y + 14, 14, 4);
  };
  bucket(6 * t, 5 * t);
  bucket(18 * t, 5 * t);
  bucket(30 * t, 5 * t);
  bucket(22 * t, 14 * t);

  return layer;
};

// 🏘️ 住宅區 — a street of little houses, one per player home.
// The layout grows with the number of homes: 6 plots per row, each row followed by a street.

export const RES_COLS = 36;
const PLOTS_PER_ROW = 6;
const PLOT_W = 5;
const FIRST_PLOT_X = 3;
const FIRST_ROW_Y = 3;
const BLOCK_H = 5; // house (2) + door/porch (1) + street (2)

const ROOF_COLORS = ["#c85a54", "#3f4a7a", "#58a55c", "#8e5cc4", "#e8773b", "#2f8c9a", "#b0643a", "#4c8bd6"];
const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/**
 * @param {Array<{ownerUid:string}>} homes sorted list
 * @returns layout with plots (house top-left + door tile), size, spawn and exit
 */
export const computeResidentialLayout = (homes) => {
  // Always leave at least two empty lots so newcomers see where their house would go
  const plotCount = Math.max(PLOTS_PER_ROW * 2, Math.ceil((homes.length + 2) / PLOTS_PER_ROW) * PLOTS_PER_ROW);
  const blocks = plotCount / PLOTS_PER_ROW;
  const plazaY = FIRST_ROW_Y + blocks * BLOCK_H;
  const rows = plazaY + 4;
  const plots = [];
  for (let i = 0; i < plotCount; i++) {
    const col = i % PLOTS_PER_ROW;
    const block = Math.floor(i / PLOTS_PER_ROW);
    const x = FIRST_PLOT_X + col * PLOT_W + 1;
    const y = FIRST_ROW_Y + block * BLOCK_H;
    plots.push({ index: i, x, y, doorX: x + 1, doorY: y + 2, home: homes[i] || null });
  }
  const exitY = rows - 2;
  return {
    cols: RES_COLS,
    rows,
    plots,
    plazaY,
    spawn: { x: 17, y: plazaY },
    exitTiles: [{ x: 17, y: exitY }, { x: 18, y: exitY }],
    streetRows: Array.from({ length: blocks }, (_, b) => FIRST_ROW_Y + b * BLOCK_H + 3),
  };
};

const isBorder = (layout, x, y) => x === 0 || y === 0 || x === layout.cols - 1 || y === layout.rows - 1;
// Decorative trees along the side margins (skip the plaza so the exit stays open)
const isMarginTree = (layout, x, y) =>
  (x === 1 || x === layout.cols - 2) && y >= 2 && y < layout.plazaY && y % 3 === 0;

export const buildResidentialTiles = (layout) => {
  const tiles = [];
  for (let y = 0; y < layout.rows; y++) {
    const row = [];
    for (let x = 0; x < layout.cols; x++) row.push(isBorder(layout, x, y) || isMarginTree(layout, x, y) ? 1 : 0);
    tiles.push(row);
  }
  layout.plots.forEach((p) => {
    if (!p.home) return; // empty lots are walkable
    for (let y = p.y; y < p.y + 2; y++) for (let x = p.x; x < p.x + 3; x++) tiles[y][x] = 1;
  });
  // The exit mat sits in the bottom border row's gap
  layout.exitTiles.forEach((t) => { tiles[t.y][t.x] = 0; });
  return tiles;
};

const px = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};
const OUT = "#2a1f1a";

const isStreet = (layout, x, y) =>
  y >= layout.plazaY || layout.streetRows.some((sy) => y === sy || y === sy + 1);

const drawHouse = (g, plot, t) => {
  const X = plot.x * t;
  const Y = plot.y * t;
  const W = 3 * t;
  const H = 2 * t;
  const home = plot.home;
  const wall = home.wallColor || "#f1e3c8";
  const roof = ROOF_COLORS[hashString(home.ownerUid) % ROOF_COLORS.length];
  // Shadow + body
  px(g, "rgba(20,30,20,0.25)", X + 4, Y + H - 4, W, 8);
  px(g, OUT, X + 4, Y + 28, W - 8, H - 28);
  px(g, wall, X + 7, Y + 31, W - 14, H - 34);
  // Roof (stepped pixel gable)
  px(g, OUT, X, Y + 6, W, 28);
  px(g, roof, X + 3, Y + 9, W - 6, 22);
  px(g, OUT, X + 14, Y, W - 28, 10);
  px(g, roof, X + 17, Y + 3, W - 34, 8);
  px(g, "rgba(255,255,255,0.18)", X + 3, Y + 9, W - 6, 4);
  // Windows
  [[X + 14, Y + 42], [X + W - 38, Y + 42]].forEach(([wx, wy]) => {
    px(g, OUT, wx, wy, 24, 20);
    px(g, "#9ad4f5", wx + 2, wy + 2, 20, 16);
    px(g, OUT, wx + 11, wy + 2, 2, 16);
  });
  // Door frame (the door itself is drawn per frame so its lock icon stays current)
  px(g, OUT, X + W / 2 - 14, Y + 46, 28, H - 46);
  // Porch step on the door tile
  px(g, "#b8ad9b", plot.doorX * t + 6, plot.doorY * t, t - 12, 8);
};

const drawEmptyLot = (g, plot, t) => {
  const X = plot.x * t;
  const Y = plot.y * t;
  px(g, "#b39264", X + 6, Y + 10, 3 * t - 12, 2 * t - 14);
  px(g, "#a38357", X + 14, Y + 22, 18, 8);
  px(g, "#a38357", X + 70, Y + 44, 22, 8);
  // Little "for sale" sign
  px(g, OUT, X + 3 * t / 2 - 2, Y + 30, 4, 34);
  px(g, OUT, X + 3 * t / 2 - 24, Y + 18, 48, 22);
  px(g, "#f4f1ea", X + 3 * t / 2 - 22, Y + 20, 44, 18);
  g.fillStyle = OUT;
  g.font = "bold 11px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("空地", X + 3 * t / 2, Y + 29);
};

const drawTree = (g, x, y, t) => {
  const X = x * t;
  const Y = y * t;
  px(g, "rgba(20,30,20,0.25)", X + 6, Y + t - 8, t - 12, 8);
  px(g, "#6b4a33", X + 16, Y + 22, 8, 16);
  px(g, OUT, X + 3, Y - 4, t - 6, 30);
  px(g, "#3f8c55", X + 5, Y - 2, t - 10, 26);
  px(g, "#58a86a", X + 9, Y, 12, 8);
};

/** Static layer: grass, streets, houses (walls in each owner's wallpaper color), trees, plaza. */
export const buildResidentialLayer = (layout, t) => {
  const layer = document.createElement("canvas");
  layer.width = layout.cols * t;
  layer.height = layout.rows * t;
  const g = layer.getContext("2d");
  for (let y = 0; y < layout.rows; y++) {
    for (let x = 0; x < layout.cols; x++) {
      const X = x * t;
      const Y = y * t;
      if (isBorder(layout, x, y)) {
        px(g, "#2f6b4a", X, Y, t, t);
        px(g, "#3d8259", X + 6, Y + 6, 12, 6);
        px(g, "#24553a", X + 20, Y + 22, 12, 6);
        continue;
      }
      if (isStreet(layout, x, y)) {
        px(g, (x + y) % 2 ? "#d3cabb" : "#cbc1b1", X, Y, t, t);
        px(g, "#b8ad9b", X, Y, t, 2);
        px(g, "#b8ad9b", X, Y, 2, t);
      } else {
        px(g, (x + y) % 2 ? "#6fb07e" : "#69a978", X, Y, t, t);
        if ((x * 7 + y * 13) % 5 === 0) px(g, "#5c9a6b", X + 12, Y + 16, 4, 4);
        if ((x * 11 + y * 3) % 9 === 0) px(g, "#f2a7b8", X + 26, Y + 8, 4, 4);
      }
    }
  }
  layout.plots.forEach((p) => (p.home ? drawHouse(g, p, t) : drawEmptyLot(g, p, t)));
  for (let y = 0; y < layout.rows; y++) {
    for (let x = 0; x < layout.cols; x++) if (isMarginTree(layout, x, y)) drawTree(g, x, y, t);
  }
  // Plaza sign + exit mat
  const signX = 17 * t - 60;
  const signY = layout.plazaY * t + 4;
  px(g, OUT, signX - 30, signY, 4, 30);
  px(g, OUT, signX - 50, signY - 4, 44, 16);
  px(g, "#f2c14e", signX - 48, signY - 2, 40, 12);
  g.fillStyle = OUT;
  g.font = "bold 9px \"Noto Sans TC\", Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("住宅區", signX - 28, signY + 4);
  const [m] = layout.exitTiles;
  px(g, OUT, m.x * t, m.y * t + 6, t * 2, t - 12);
  px(g, "#8a6a4a", m.x * t + 4, m.y * t + 10, t * 2 - 8, t - 20);
  g.fillStyle = "#f4e3a1";
  g.font = "bold 10px Arial, sans-serif";
  g.fillText("EXIT", m.x * t + t, m.y * t + t / 2);
  return layer;
};

export const residentialMinimapColor = (layout) => (x, y) => {
  if (isBorder(layout, x, y) || isMarginTree(layout, x, y)) return "#2f6b4a";
  const plot = layout.plots.find((p) => x >= p.x && x < p.x + 3 && y >= p.y && y < p.y + 2);
  if (plot) return plot.home ? ROOF_COLORS[hashString(plot.home.ownerUid) % ROOF_COLORS.length] : "#b39264";
  return isStreet(layout, x, y) ? "#cbc1b1" : "#69a978";
};

const DOOR_ICONS = { open: "🚪", knock: "🔔", locked: "🔒" };

/**
 * Per-frame overlay for one house: door (colored by door mode) and nameplate with presence.
 * presence: { online: boolean, atHome: boolean }
 */
export const drawHouseFront = (ctx, plot, t, { online, atHome, isMine, interests = "" }) => {
  const home = plot.home;
  const X = plot.x * t;
  const Y = plot.y * t;
  const W = 3 * t;
  // Door
  const doorColors = { open: "#8b5e3c", knock: "#c9955f", locked: "#6b6b7a" };
  px(ctx, doorColors[home.door] || doorColors.open, X + W / 2 - 12, Y + 48, 24, 2 * t - 48);
  px(ctx, "#f2c14e", X + W / 2 + 6, Y + 62, 3, 3);
  ctx.save();
  ctx.font = "12px \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(DOOR_ICONS[home.door] || DOOR_ICONS.open, X + W / 2, Y + 60);
  ctx.restore();

  // Nameplate above the roof
  ctx.save();
  ctx.font = "bold 12px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
  const label = `${isMine ? "⭐ " : ""}${home.ownerName || "玩家"} 的家`;
  const tw = Math.min(ctx.measureText(label).width, W + 30);
  const plateW = tw + 26;
  const plateX = Math.round(X + W / 2 - plateW / 2);
  const plateY = Y - 22;
  px(ctx, OUT, plateX, plateY, plateW, 20);
  px(ctx, isMine ? "#fff1b8" : "#f4f1ea", plateX + 2, plateY + 2, plateW - 4, 16);
  ctx.fillStyle = online ? "#1f7a5f" : "#9b9b9b";
  ctx.beginPath();
  ctx.arc(plateX + 10, plateY + 10, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = OUT;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(label, plateX + 18, plateY + 11, tw);
  // Interest wall: the owner's interests as a row of emoji on a little board by the door
  if (interests) {
    ctx.font = "13px \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif";
    const iw = ctx.measureText(interests).width + 10;
    const ix = Math.round(X + W - iw + 6);
    const iy = Y + 2 * t - 20;
    px(ctx, OUT, ix - 1, iy - 1, iw + 2, 20);
    px(ctx, "#fdf6e3", ix, iy, iw, 18);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = OUT;
    ctx.fillText(interests, ix + 5, iy + 10);
  }
  if (atHome) {
    ctx.font = "bold 10px \"Noto Sans TC\", Arial, sans-serif";
    const tag = "🏠 在家";
    const tagW = ctx.measureText(tag).width + 10;
    px(ctx, "#1f7a5f", Math.round(X + W / 2 - tagW / 2), plateY + 20, tagW, 14);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(tag, X + W / 2, plateY + 27);
  }
  ctx.restore();
};

/** World-map arch over the entrance to the residential district (posts at both ends). */
export const drawResidentialGate = (ctx, tileX, tileY, t) => {
  const X = tileX * t;
  const Y = tileY * t;
  const W = 4 * t;
  // Posts
  [X + 8, X + W - 32].forEach((postX) => {
    px(ctx, "rgba(20,30,20,0.25)", postX - 2, Y + t - 6, 28, 8);
    px(ctx, OUT, postX, Y - 50, 24, t + 50);
    px(ctx, "#c9955f", postX + 3, Y - 47, 18, t + 44);
    px(ctx, "#a8773f", postX + 3, Y - 47, 4, t + 44);
  });
  // Beam + sign
  px(ctx, OUT, X, Y - 62, W, 20);
  px(ctx, "#8b5e3c", X + 3, Y - 59, W - 6, 14);
  px(ctx, OUT, X + W / 2 - 50, Y - 78, 100, 26);
  px(ctx, "#f2c14e", X + W / 2 - 47, Y - 75, 94, 20);
  ctx.save();
  ctx.fillStyle = OUT;
  ctx.font = "bold 13px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏘️ 住宅區", X + W / 2, Y - 64);
  ctx.restore();
  // Stone path through the gate
  px(ctx, "#cbc1b1", X + t, Y + 4, 2 * t, t - 8);
  px(ctx, "#b8ad9b", X + t, Y + 4, 2 * t, 2);
};

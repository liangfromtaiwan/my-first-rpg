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
  px(g, OUT, X + 3 * t / 2 - 28, Y + 16, 56, 26);
  px(g, "#f4f1ea", X + 3 * t / 2 - 26, Y + 18, 52, 22);
  g.fillStyle = OUT;
  g.font = "bold 14px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
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
  px(g, OUT, signX - 58, signY - 8, 60, 24);
  px(g, "#f2c14e", signX - 56, signY - 6, 56, 20);
  g.fillStyle = OUT;
  g.font = "bold 14px \"Noto Sans TC\", Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("住宅區", signX - 28, signY + 4);
  const [m] = layout.exitTiles;
  px(g, OUT, m.x * t, m.y * t + 6, t * 2, t - 12);
  px(g, "#8a6a4a", m.x * t + 4, m.y * t + 10, t * 2 - 8, t - 20);
  g.fillStyle = "#f4e3a1";
  g.font = "bold 14px Arial, sans-serif";
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
export const drawHouseFront = (ctx, plot, t, { online, atHome, isMine, interests = "", party = null }) => {
  const home = plot.home;
  const X = plot.x * t;
  const Y = plot.y * t;
  const W = 3 * t;
  // Door
  const doorColors = { open: "#8b5e3c", knock: "#c9955f", locked: "#6b6b7a" };
  px(ctx, doorColors[home.door] || doorColors.open, X + W / 2 - 12, Y + 48, 24, 2 * t - 48);
  px(ctx, "#f2c14e", X + W / 2 + 6, Y + 62, 3, 3);
  ctx.save();
  ctx.font = "14px \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(DOOR_ICONS[home.door] || DOOR_ICONS.open, X + W / 2, Y + 60);
  ctx.restore();

  // Nameplate above the roof
  ctx.save();
  ctx.font = "bold 14px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
  const label = `${isMine ? "⭐ " : ""}${home.ownerName || "玩家"} 的家`;
  const tw = Math.min(ctx.measureText(label).width, W + 30);
  const plateW = tw + 26;
  const plateX = Math.round(X + W / 2 - plateW / 2);
  const plateY = Y - 24;
  px(ctx, OUT, plateX, plateY, plateW, 22);
  px(ctx, isMine ? "#fff1b8" : "#f4f1ea", plateX + 2, plateY + 2, plateW - 4, 18);
  ctx.fillStyle = online ? "#1f7a5f" : "#9b9b9b";
  ctx.beginPath();
  ctx.arc(plateX + 10, plateY + 11, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = OUT;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(label, plateX + 18, plateY + 12, tw);
  // Interest wall: the owner's interests as a row of emoji on a little board by the door
  if (interests) {
    ctx.font = "14px \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif";
    const iw = ctx.measureText(interests).width + 10;
    const ix = Math.round(X + W - iw + 6);
    const iy = Y + 2 * t - 22;
    px(ctx, OUT, ix - 1, iy - 1, iw + 2, 22);
    px(ctx, "#fdf6e3", ix, iy, iw, 20);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = OUT;
    ctx.fillText(interests, ix + 5, iy + 11);
  }
  if (party) {
    // House party: a bright banner that pulses so it's easy to spot from the street
    ctx.font = "bold 14px \"Noto Sans TC\", Arial, sans-serif";
    const tag = `🎉 派對中「${party.title}」`;
    const tagW = Math.min(ctx.measureText(tag).width + 12, W + 60);
    const pulse = 0.75 + 0.25 * Math.sin(performance.now() / 250);
    ctx.globalAlpha = pulse;
    px(ctx, OUT, Math.round(X + W / 2 - tagW / 2) - 1, plateY - 23, tagW + 2, 22);
    px(ctx, "#e46f86", Math.round(X + W / 2 - tagW / 2), plateY - 22, tagW, 20);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tag, X + W / 2, plateY - 12, tagW - 8);
  }
  if (atHome) {
    ctx.font = "bold 14px \"Noto Sans TC\", Arial, sans-serif";
    const tag = "🏠 在家";
    const tagW = ctx.measureText(tag).width + 10;
    px(ctx, "#1f7a5f", Math.round(X + W / 2 - tagW / 2), plateY + 22, tagW, 20);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(tag, X + W / 2, plateY + 32);
  }
  ctx.restore();
};

/** World-map arch over the entrance to the residential district (posts at both ends). */
/**
 * The entrance to the residential district on the world map: a two-storey suburban house
 * (main block 4 tiles wide + a garage wing on the right). Its front door is the two middle
 * tiles of the bottom row (tileX+1, tileX+2), which lead into the district.
 */
export const RES_HOUSE_BLOCKED = (tileX, tileY) => {
  const out = [];
  for (let y = tileY - 3; y < tileY; y++) for (let x = tileX; x <= tileX + 5; x++) out.push([x, y]);
  [tileX, tileX + 3, tileX + 4, tileX + 5].forEach((x) => out.push([x, tileY]));
  return out;
};

export const drawResidentialGate = (ctx, tileX, tileY, t) => {
  const X = tileX * t; // left edge of the main block
  const B = (tileY + 1) * t; // ground line (bottom of the door row)
  const W = 4 * t;
  const WALL = "#f6e7d6";
  const WALL_D = "#e8d3bd";
  const TRIM = "#ffffff";
  const ROOF = "#5b4a5e";
  const ROOF_L = "#6f5c72";
  const GLASS = "#9fd4ee";
  const GLASS_L = "#d5eefa";
  const DOOR = "#7a4a2e";
  const wallTop = B - 3.3 * t;

  // Shadow on the grass
  px(ctx, "rgba(20,40,20,0.22)", X - 6, B - 6, W + 2 * t + 12, 10);

  // ---- Garage wing (right, one storey) ----
  const GX = X + W - 4;
  const GW = 2 * t + 4;
  const gTop = B - 1.9 * t;
  px(ctx, OUT, GX, gTop, GW, B - gTop);
  px(ctx, WALL, GX + 3, gTop + 3, GW - 6, B - gTop - 3);
  // garage roof
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.moveTo(GX - 6, gTop + 4);
  ctx.lineTo(GX + GW / 2, gTop - 0.8 * t);
  ctx.lineTo(GX + GW + 6, gTop + 4);
  ctx.fill();
  ctx.fillStyle = ROOF;
  ctx.beginPath();
  ctx.moveTo(GX - 1, gTop + 1);
  ctx.lineTo(GX + GW / 2, gTop - 0.8 * t + 5);
  ctx.lineTo(GX + GW + 1, gTop + 1);
  ctx.fill();
  // garage door with panels
  px(ctx, OUT, GX + 10, B - 1.2 * t, GW - 20, 1.2 * t);
  px(ctx, "#fbf8f2", GX + 13, B - 1.2 * t + 3, GW - 26, 1.2 * t - 3);
  for (let i = 1; i < 4; i++) px(ctx, "#ddd6ca", GX + 13, B - 1.2 * t + 3 + i * 11, GW - 26, 2);

  // ---- Main block walls ----
  px(ctx, OUT, X, wallTop, W, B - wallTop);
  px(ctx, WALL, X + 3, wallTop + 3, W - 6, B - wallTop - 3);
  px(ctx, WALL_D, X + 3, B - 10, W - 6, 7); // plinth
  px(ctx, TRIM, X + 3, wallTop + 1.55 * t, W - 6, 4); // floor band
  // Roof: hip roof with a front gable in the middle
  const roofTop = wallTop - 1.05 * t;
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.moveTo(X - 10, wallTop + 6);
  ctx.lineTo(X + 0.7 * t, roofTop);
  ctx.lineTo(X + W - 0.7 * t, roofTop);
  ctx.lineTo(X + W + 10, wallTop + 6);
  ctx.fill();
  ctx.fillStyle = ROOF;
  ctx.beginPath();
  ctx.moveTo(X - 4, wallTop + 3);
  ctx.lineTo(X + 0.7 * t + 3, roofTop + 3);
  ctx.lineTo(X + W - 0.7 * t - 3, roofTop + 3);
  ctx.lineTo(X + W + 4, wallTop + 3);
  ctx.fill();
  for (let i = 0; i < 4; i++) px(ctx, ROOF_L, X + 0.8 * t, roofTop + 8 + i * 9, W - 1.6 * t, 2); // shingle lines
  // Front gable above the door
  const gx = X + W / 2;
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.moveTo(gx - 1.15 * t, wallTop + 0.55 * t);
  ctx.lineTo(gx, wallTop - 0.75 * t);
  ctx.lineTo(gx + 1.15 * t, wallTop + 0.55 * t);
  ctx.fill();
  ctx.fillStyle = WALL;
  ctx.beginPath();
  ctx.moveTo(gx - 1.15 * t + 7, wallTop + 0.55 * t - 1);
  ctx.lineTo(gx, wallTop - 0.75 * t + 8);
  ctx.lineTo(gx + 1.15 * t - 7, wallTop + 0.55 * t - 1);
  ctx.fill();
  // Chimney
  px(ctx, OUT, X + 0.9 * t, roofTop - 14, 16, 22);
  px(ctx, "#b86b4b", X + 0.9 * t + 3, roofTop - 11, 10, 18);

  // Windows: white frames, light glass, cross bars
  const win = (wx, wy, ww, wh, arch = false) => {
    px(ctx, OUT, wx - 3, wy - 3, ww + 6, wh + 6);
    px(ctx, TRIM, wx - 1, wy - 1, ww + 2, wh + 2);
    px(ctx, GLASS, wx + 2, wy + 2, ww - 4, wh - 4);
    px(ctx, GLASS_L, wx + 2, wy + 2, ww - 4, 4);
    px(ctx, TRIM, wx + ww / 2 - 1, wy + 2, 2, wh - 4);
    px(ctx, TRIM, wx + 2, wy + wh / 2 - 1, ww - 4, 2);
    if (arch) {
      ctx.fillStyle = TRIM;
      ctx.beginPath();
      ctx.arc(wx + ww / 2, wy, ww / 2, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = GLASS;
      ctx.beginPath();
      ctx.arc(wx + ww / 2, wy, ww / 2 - 3, Math.PI, 0);
      ctx.fill();
    }
  };
  const up = wallTop + 0.5 * t;
  win(X + 0.3 * t, up, 0.9 * t, 0.8 * t);
  win(gx - 0.35 * t, up + 4, 0.7 * t, 0.7 * t, true); // round-top window in the gable
  win(X + W - 1.2 * t, up, 0.9 * t, 0.8 * t);
  const low = wallTop + 1.95 * t;
  win(X + 0.3 * t, low, 0.9 * t, 0.85 * t);
  win(X + W - 1.2 * t, low, 0.9 * t, 0.85 * t);
  // Flower boxes under the ground-floor windows
  [X + 0.3 * t, X + W - 1.2 * t].forEach((fx) => {
    px(ctx, OUT, fx - 2, low + 0.85 * t + 3, 0.9 * t + 4, 8);
    px(ctx, "#8b5e3c", fx, low + 0.85 * t + 4, 0.9 * t, 5);
    for (let i = 0; i < 5; i++) px(ctx, ["#e46f86", "#f2c14e", "#c85ad9"][i % 3], fx + 3 + i * 6, low + 0.85 * t, 4, 4);
  });

  // Front door (the two middle tiles): double door under a little porch roof
  const dx = X + t + 10;
  const dw = 2 * t - 20;
  const dTop = B - 1.25 * t;
  px(ctx, OUT, dx - 4, dTop - 4, dw + 8, B - dTop + 4);
  px(ctx, DOOR, dx, dTop, dw, B - dTop);
  px(ctx, "#8f5a38", dx, dTop, dw, 4);
  px(ctx, OUT, dx + dw / 2 - 1, dTop, 2, B - dTop);
  px(ctx, "#f2c14e", dx + dw / 2 - 6, dTop + 0.6 * t, 3, 5);
  px(ctx, "#f2c14e", dx + dw / 2 + 3, dTop + 0.6 * t, 3, 5);
  px(ctx, GLASS, dx + 6, dTop + 6, dw / 2 - 12, 10);
  px(ctx, GLASS, dx + dw / 2 + 6, dTop + 6, dw / 2 - 12, 10);
  // porch roof + sign
  px(ctx, OUT, dx - 12, dTop - 14, dw + 24, 12);
  px(ctx, ROOF, dx - 9, dTop - 11, dw + 18, 7);
  ctx.save();
  ctx.font = "bold 14px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
  const label = "🏘️ 住宅區";
  const lw = ctx.measureText(label).width + 16;
  const ly = wallTop + 1.55 * t - 13;
  px(ctx, OUT, gx - lw / 2 - 2, ly - 2, lw + 4, 26);
  px(ctx, "#f2c14e", gx - lw / 2, ly, lw, 22);
  ctx.fillStyle = OUT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, gx, ly + 12);
  ctx.restore();
  // Doorstep + little bushes
  px(ctx, "#cbc1b1", dx - 6, B - 4, dw + 12, 6);
  [[X - 10, B - 20], [GX + GW - 12, B - 18]].forEach(([bx, by]) => {
    px(ctx, OUT, bx, by, 24, 20);
    px(ctx, "#43a266", bx + 2, by + 2, 20, 16);
    px(ctx, "#5cc27d", bx + 5, by + 4, 10, 5);
  });
};

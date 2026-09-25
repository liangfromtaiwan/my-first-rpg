// Gather-style spaces: private areas (meeting rooms) and game tables.
// Coordinates are in tiles.

export const ZONES = {
  worldMap: [
    { id: "meeting", name: "會議室", x: 24, y: 20, w: 8, h: 7, private: true, color: "#8e5cc4" },
    { id: "arcade", name: "遊戲區", x: 24, y: 4, w: 12, h: 7, private: false, color: "#e8773b" },
  ],
  villageMap: [
    { id: "lounge", name: "攀岩休息室", x: 10, y: 18, w: 8, h: 6, private: true, color: "#2f8c9a" },
  ],
  // Indoor zones follow the office rooms; their floors are already drawn, so only tags are shown.
  officeMap: [
    { id: "desks", name: "開放辦公區", x: 1, y: 1, w: 19, h: 14, private: false, color: "#8b5e3c", indoor: true },
    { id: "meeting", name: "會議室", x: 21, y: 1, w: 18, h: 9, private: true, color: "#5b5f9e", indoor: true },
    { id: "lounge", name: "休息室", x: 21, y: 11, w: 18, h: 7, private: true, color: "#3f8c8a", indoor: true },
    { id: "cafe", name: "咖啡廳", x: 21, y: 19, w: 18, h: 8, private: false, color: "#b0643a", indoor: true },
    { id: "arcade", name: "遊戲區", x: 1, y: 16, w: 19, h: 11, private: false, color: "#e8773b", indoor: true },
  ],
};

export const GAME_TABLES = {
  worldMap: [
    { id: "t1", name: "井字棋 1 號桌", tileX: 27, tileY: 7 },
    { id: "t2", name: "井字棋 2 號桌", tileX: 32, tileY: 7 },
  ],
  villageMap: [],
  officeMap: [
    { id: "t1", name: "井字棋 A 桌", tileX: 6, tileY: 20 },
    { id: "t2", name: "井字棋 B 桌", tileX: 13, tileY: 20 },
  ],
};

export const getZones = (mapName) => ZONES[mapName] || [];

/** Register zones for maps created at runtime (e.g. each player's home). */
export const registerZones = (mapName, zones) => {
  ZONES[mapName] = zones;
};
export const getGameTables = (mapName) => GAME_TABLES[mapName] || [];

/** True if tile (tx, ty) is inside any zone, optionally expanded by `pad` tiles. */
export const isZoneTile = (mapName, tx, ty, pad = 0) =>
  getZones(mapName).some(
    (z) => tx >= z.x - pad && tx < z.x + z.w + pad && ty >= z.y - pad && ty < z.y + z.h + pad
  );

/** Zone containing world-pixel point (px, py), or null. */
export const zoneAt = (mapName, px, py, tileSize) => {
  const tx = Math.floor(px / tileSize);
  const ty = Math.floor(py / tileSize);
  return getZones(mapName).find((z) => tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h) || null;
};

const hexToRgba = (hex, alpha) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** Carpet + pixel border + name tag for each zone. `activeZoneId` is highlighted. */
export const drawZones = (ctx, mapName, tileSize, activeZoneId) => {
  getZones(mapName).forEach((z) => {
    const x = z.x * tileSize;
    const y = z.y * tileSize;
    const w = z.w * tileSize;
    const h = z.h * tileSize;
    const isActive = z.id === activeZoneId;
    if (z.indoor) {
      // Rooms are already visible from walls/floors: just a tag, plus a soft glow when you're inside
      if (isActive) {
        ctx.fillStyle = hexToRgba("#ffffff", 0.06);
        ctx.fillRect(x, y, w, h);
      }
      if (!z.hideTag) drawZoneTag(ctx, z, x, y);
      return;
    }
    ctx.fillStyle = hexToRgba(z.color, isActive ? 0.28 : 0.18);
    ctx.fillRect(x, y, w, h);
    // Checker carpet texture
    ctx.fillStyle = hexToRgba(z.color, 0.08);
    for (let ty = 0; ty < z.h; ty++) {
      for (let tx = (ty % 2); tx < z.w; tx += 2) {
        ctx.fillRect(x + tx * tileSize, y + ty * tileSize, tileSize, tileSize);
      }
    }
    // Pixel border: dashed 4px blocks
    ctx.fillStyle = hexToRgba(z.color, isActive ? 0.95 : 0.7);
    for (let i = 0; i < w; i += 12) {
      ctx.fillRect(x + i, y, 8, 4);
      ctx.fillRect(x + i, y + h - 4, 8, 4);
    }
    for (let i = 0; i < h; i += 12) {
      ctx.fillRect(x, y + i, 4, 8);
      ctx.fillRect(x + w - 4, y + i, 4, 8);
    }
    drawZoneTag(ctx, z, x, y);
  });
};

const drawZoneTag = (ctx, z, x, y) => {
  ctx.save();
  ctx.font = "bold 13px \"Noto Sans TC\", \"PingFang TC\", Arial, sans-serif";
  const label = `${z.private ? "🔒 " : ""}${z.name}`;
  const tw = ctx.measureText(label).width + 14;
  ctx.fillStyle = "#2a1f1a";
  ctx.fillRect(x + 6, y + 6, tw + 4, 24);
  ctx.fillStyle = z.color;
  ctx.fillRect(x + 8, y + 8, tw, 20);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + 15, y + 18);
  ctx.restore();
};

/** Pixel wooden table with a mini 3x3 board reflecting `board` (9-char string of X/O/.). */
export const drawGameTable = (ctx, table, tileSize, board) => {
  const x = table.tileX * tileSize;
  const y = table.tileY * tileSize;
  const s = tileSize;
  // Legs
  ctx.fillStyle = "#5b3a22";
  ctx.fillRect(x + 6, y + s - 12, 6, 12);
  ctx.fillRect(x + s - 12, y + s - 12, 6, 12);
  // Top
  ctx.fillStyle = "#2a1f1a";
  ctx.fillRect(x - 2, y + 2, s + 4, s - 10);
  ctx.fillStyle = "#b07a45";
  ctx.fillRect(x, y + 4, s, s - 14);
  ctx.fillStyle = "#c98f55";
  ctx.fillRect(x, y + 4, s, 4);
  // Board
  const bx = x + 8;
  const by = y + 9;
  const cell = 8;
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(bx - 1, by - 1, cell * 3 + 2, cell * 3 + 2);
  ctx.fillStyle = "#2a1f1a";
  ctx.fillRect(bx + cell - 1, by, 1, cell * 3);
  ctx.fillRect(bx + cell * 2, by, 1, cell * 3);
  ctx.fillRect(bx, by + cell - 1, cell * 3, 1);
  ctx.fillRect(bx, by + cell * 2, cell * 3, 1);
  const cells = board || ".........";
  for (let i = 0; i < 9; i++) {
    const mark = cells[i];
    if (mark !== "X" && mark !== "O") continue;
    ctx.fillStyle = mark === "X" ? "#c85a54" : "#4c8bd6";
    ctx.fillRect(bx + (i % 3) * cell + 2, by + Math.floor(i / 3) * cell + 2, 4, 4);
  }
};

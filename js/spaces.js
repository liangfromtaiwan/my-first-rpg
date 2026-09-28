// Gather-style spaces: private areas (meeting rooms) and game tables.
// Coordinates are in tiles.

export const ZONES = {
  worldMap: [
    // A furnished room (see drawMeetingRoom), so only its tag is drawn like indoor rooms
    { id: "meeting", name: "會議室", x: 24, y: 20, w: 8, h: 7, private: true, color: "#8e5cc4", indoor: true },
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

// ---- The world map's meeting room: a real little room instead of a bare carpet ----
// Walls on the border (door on the left, where the path comes in), a long table, chairs,
// a wall screen and plants. Walls, table and plants block walking.
export const MEETING_ROOM = { x: 24, y: 20, w: 8, h: 7, doorRows: [23, 24] };

export const meetingRoomBlockedTiles = (room = MEETING_ROOM) => {
  const out = [];
  for (let x = room.x; x < room.x + room.w; x++) {
    out.push([x, room.y]); // back wall
    out.push([x, room.y + room.h - 1]); // front wall
  }
  for (let y = room.y + 1; y < room.y + room.h - 1; y++) {
    if (!room.doorRows.includes(y)) out.push([room.x, y]); // left wall (door gap)
    out.push([room.x + room.w - 1, y]); // right wall
  }
  for (let x = room.x + 2; x <= room.x + 5; x++) {
    out.push([x, room.y + 2]); // table
    out.push([x, room.y + 3]);
  }
  out.push([room.x + 1, room.y + room.h - 2]); // plants (front corners keep the back chairs reachable)
  out.push([room.x + room.w - 2, room.y + room.h - 2]);
  return out;
};

const rpx = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

/** Draw the room into the world floor layer (static). */
export const drawMeetingRoom = (g, t, room = MEETING_ROOM) => {
  const X = room.x * t;
  const Y = room.y * t;
  const W = room.w * t;
  const H = room.h * t;
  const OUT = "#2a1f1a";
  // Wooden floor
  for (let ty = room.y; ty < room.y + room.h; ty++) {
    for (let tx = room.x; tx < room.x + room.w; tx++) {
      const x = tx * t;
      const y = ty * t;
      rpx(g, ty % 2 ? "#b98a5e" : "#b28457", x, y, t, t);
      rpx(g, "#a47650", x, y + t / 2 - 1, t, 2);
      rpx(g, "#a47650", x + ((ty * 17) % t), y, 2, t / 2);
    }
  }
  // Rug under the table
  rpx(g, "#5b5f9e", X + 1.6 * t, Y + 1.6 * t, 4.8 * t, 2.8 * t);
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 2;
  g.setLineDash([6, 4]);
  g.strokeRect(X + 1.8 * t, Y + 1.8 * t, 4.4 * t, 2.4 * t);
  g.setLineDash([]);
  // Back wall (a tall cream wall face) with a big screen
  rpx(g, "#2e2a45", X, Y, W, 10);
  rpx(g, "#e9dfcf", X, Y + 10, W, t - 16);
  rpx(g, "#7c5b3f", X, Y + t - 6, W, 6);
  rpx(g, OUT, X + 2.5 * t, Y + 4, 3 * t, 30);
  rpx(g, "#3f4a7a", X + 2.5 * t + 3, Y + 7, 3 * t - 6, 24);
  rpx(g, "#f2c14e", X + 2.5 * t + 12, Y + 12, 50, 4);
  rpx(g, "#9ad4f5", X + 2.5 * t + 12, Y + 20, 80, 3);
  // Side and front half-walls (dark wood railing), door gap on the left
  const rail = (x, y, w, h) => {
    rpx(g, OUT, x, y, w, h);
    rpx(g, "#8b5e3c", x + 2, y + 2, w - 4, h - 4);
    rpx(g, "#a8773f", x + 2, y + 2, w - 4, 4);
  };
  rail(X, Y + H - t + 8, W, t - 8); // front
  for (let ty = room.y + 1; ty < room.y + room.h - 1; ty++) {
    if (!room.doorRows.includes(ty)) rail(X, ty * t, 16, t);
    rail(X + W - 16, ty * t, 16, t);
  }
  // Door mat
  rpx(g, "#8a6a4a", X + 2, room.doorRows[0] * t + 6, 20, room.doorRows.length * t - 12);
  // Long table
  const tx = (room.x + 2) * t;
  const ty = (room.y + 2) * t;
  rpx(g, OUT, tx - 2, ty + 2, 4 * t + 4, 2 * t - 2);
  rpx(g, "#8b5e3c", tx, ty + 4, 4 * t, 2 * t - 8);
  rpx(g, "#a2714a", tx, ty + 4, 4 * t, 6);
  for (let i = 0; i < 4; i++) {
    rpx(g, "#e9e4da", tx + i * t + 12, ty + 14, 16, 11); // laptops / notes
    rpx(g, "#e9e4da", tx + i * t + 12, ty + 2 * t - 28, 16, 11);
  }
  // Chairs above and below the table
  const chair = (cx, cy) => {
    rpx(g, OUT, cx + 8, cy + 8, 24, 24);
    rpx(g, "#7b5cc4", cx + 10, cy + 10, 20, 20);
    rpx(g, "#9677d8", cx + 10, cy + 10, 20, 5);
  };
  for (let i = 0; i < 4; i++) {
    chair((room.x + 2 + i) * t, (room.y + 1) * t);
    chair((room.x + 2 + i) * t, (room.y + 4) * t);
  }
  // Potted plants in the front corners
  const plant = (px, py) => {
    rpx(g, "rgba(0,0,0,0.18)", px + 6, py + t - 8, t - 12, 6);
    rpx(g, OUT, px + 9, py + t - 20, t - 18, 16);
    rpx(g, "#b0643a", px + 11, py + t - 18, t - 22, 12);
    rpx(g, OUT, px + 3, py + 1, t - 6, t - 18);
    rpx(g, "#2f7d4f", px + 5, py + 3, t - 10, t - 22);
    rpx(g, "#43a266", px + 9, py + 5, t - 20, 8);
    rpx(g, "#5cc27d", px + 13, py + 7, 6, 4);
  };
  plant((room.x + 1) * t, (room.y + room.h - 2) * t);
  plant((room.x + room.w - 2) * t, (room.y + room.h - 2) * t);
  // Whiteboard on the back wall, left of the screen
  rpx(g, OUT, X + t + 4, Y + 8, t - 8, 24);
  rpx(g, "#fbfaf5", X + t + 6, Y + 10, t - 12, 20);
  rpx(g, "#e04a3a", X + t + 10, Y + 14, 14, 2);
  rpx(g, "#3f7ad9", X + t + 10, Y + 20, 20, 2);
};

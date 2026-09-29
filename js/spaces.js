// Gather-style spaces: private areas (meeting rooms) and game tables.
// Coordinates are in tiles.

export const ZONES = {
  worldMap: [
    // A furnished room (see drawMeetingRoom), so only its tag is drawn like indoor rooms
    { id: "meeting", name: "會議室", x: 24, y: 20, w: 8, h: 7, private: true, color: "#8e5cc4", indoor: true },
    { id: "arcade", name: "遊戲區", x: 24, y: 4, w: 12, h: 7, private: false, color: "#e8773b", indoor: true },
    { id: "party", name: "派對房", x: 6, y: 4, w: 8, h: 6, private: false, color: "#ff6fb1", indoor: true },
    { id: "bar", name: "爵士酒吧", x: 15, y: 4, w: 5, h: 6, private: false, color: "#c9a24a", indoor: true },
  ],
  villageMap: [
    // The sofa corner is obviously a lounge, so no name tag on the map (the name still shows in 📍 and chat)
    { id: "lounge", name: "抱石休息室", x: 10, y: 18, w: 8, h: 6, private: true, color: "#2f8c9a", indoor: true, hideTag: true },
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
      // No name tags on the map: furnished rooms speak for themselves (names still show in 📍 and chat)
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
  });
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

// ---- Furnished rooms on the world map (instead of bare carpets) ----
// Each room has walls on its border with a door gap on the left (where the path comes in).
// Walls and furniture block walking; chairs / stools are walkable.
export const MEETING_ROOM = { x: 24, y: 20, w: 8, h: 7, doorRows: [23, 24] };
export const ARCADE_ROOM = { x: 24, y: 4, w: 12, h: 7, doorRows: [7, 8] };
// Village lounge: the path comes down from the main street, so its door is in the back wall
// Village lounge: an open corner of the gym (no walls), you can walk in from every side
export const LOUNGE_ROOM = { x: 10, y: 18, w: 8, h: 6 };

const OUT = "#2a1f1a";
const rpx = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

const roomWallTiles = (room) => {
  const out = [];
  for (let x = room.x; x < room.x + room.w; x++) {
    if (!room.doorCols?.includes(x)) out.push([x, room.y]); // back wall (door gap)
    out.push([x, room.y + room.h - 1]); // front wall
  }
  for (let y = room.y + 1; y < room.y + room.h - 1; y++) {
    if (!room.doorRows.includes(y)) out.push([room.x, y]); // left wall (door gap)
    out.push([room.x + room.w - 1, y]); // right wall
  }
  return out;
};

/** Floor, back wall, side / front half-walls and a door mat. */
const drawRoomShell = (g, t, room, { floor, floorLine, wall, wallTrim, top }) => {
  const X = room.x * t;
  const Y = room.y * t;
  const W = room.w * t;
  const H = room.h * t;
  for (let ty = room.y; ty < room.y + room.h; ty++) {
    for (let tx = room.x; tx < room.x + room.w; tx++) {
      const x = tx * t;
      const y = ty * t;
      rpx(g, floor[(tx + ty) % 2], x, y, t, t);
      rpx(g, floorLine, x, y + t / 2 - 1, t, 2);
      rpx(g, floorLine, x + ((ty * 17) % t), y, 2, t / 2);
    }
  }
  for (let tx = room.x; tx < room.x + room.w; tx++) {
    if (room.doorCols?.includes(tx)) continue;
    rpx(g, top, tx * t, Y, t, 10);
    rpx(g, wall, tx * t, Y + 10, t, t - 16);
    rpx(g, wallTrim, tx * t, Y + t - 6, t, 6);
  }
  if (room.doorCols?.length) {
    const dx = room.doorCols[0] * t;
    const dw = room.doorCols.length * t;
    rpx(g, OUT, dx - 2, Y, 4, t);
    rpx(g, OUT, dx + dw - 2, Y, 4, t);
    rpx(g, "#8a6a4a", dx + 6, Y + 4, dw - 12, 20);
  }
  const rail = (x, y, w, h) => {
    rpx(g, OUT, x, y, w, h);
    rpx(g, "#8b5e3c", x + 2, y + 2, w - 4, h - 4);
    rpx(g, "#a8773f", x + 2, y + 2, w - 4, 4);
  };
  rail(X, Y + H - t + 8, W, t - 8);
  for (let ty = room.y + 1; ty < room.y + room.h - 1; ty++) {
    if (!room.doorRows.includes(ty)) rail(X, ty * t, 16, t);
    rail(X + W - 16, ty * t, 16, t);
  }
  if (room.doorRows.length) rpx(g, "#8a6a4a", X + 2, room.doorRows[0] * t + 6, 20, room.doorRows.length * t - 12);
};

const drawPlant = (g, t, px, py) => {
  rpx(g, "rgba(0,0,0,0.18)", px + 6, py + t - 8, t - 12, 6);
  rpx(g, OUT, px + 9, py + t - 20, t - 18, 16);
  rpx(g, "#b0643a", px + 11, py + t - 18, t - 22, 12);
  rpx(g, OUT, px + 3, py + 1, t - 6, t - 18);
  rpx(g, "#2f7d4f", px + 5, py + 3, t - 10, t - 22);
  rpx(g, "#43a266", px + 9, py + 5, t - 20, 8);
  rpx(g, "#5cc27d", px + 13, py + 7, 6, 4);
};

// ---- 會議室 ----
export const meetingRoomBlockedTiles = (room = MEETING_ROOM) => {
  const out = roomWallTiles(room);
  for (let x = room.x + 2; x <= room.x + 5; x++) {
    out.push([x, room.y + 2]); // table
    out.push([x, room.y + 3]);
  }
  out.push([room.x + 1, room.y + room.h - 2]); // plants (front corners keep the back chairs reachable)
  out.push([room.x + room.w - 2, room.y + room.h - 2]);
  return out;
};

export const drawMeetingRoom = (g, t, room = MEETING_ROOM) => {
  const X = room.x * t;
  const Y = room.y * t;
  drawRoomShell(g, t, room, { floor: ["#b28457", "#b98a5e"], floorLine: "#a47650", wall: "#e9dfcf", wallTrim: "#7c5b3f", top: "#2e2a45" });
  // Rug under the table
  rpx(g, "#5b5f9e", X + 1.6 * t, Y + 1.6 * t, 4.8 * t, 2.8 * t);
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 2;
  g.setLineDash([6, 4]);
  g.strokeRect(X + 1.8 * t, Y + 1.8 * t, 4.4 * t, 2.4 * t);
  g.setLineDash([]);
  // Big screen and whiteboard on the back wall
  rpx(g, OUT, X + 2.5 * t, Y + 4, 3 * t, 30);
  rpx(g, "#3f4a7a", X + 2.5 * t + 3, Y + 7, 3 * t - 6, 24);
  rpx(g, "#f2c14e", X + 2.5 * t + 12, Y + 12, 50, 4);
  rpx(g, "#9ad4f5", X + 2.5 * t + 12, Y + 20, 80, 3);
  rpx(g, OUT, X + t + 4, Y + 8, t - 8, 24);
  rpx(g, "#fbfaf5", X + t + 6, Y + 10, t - 12, 20);
  rpx(g, "#e04a3a", X + t + 10, Y + 14, 14, 2);
  rpx(g, "#3f7ad9", X + t + 10, Y + 20, 20, 2);
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
  drawPlant(g, t, (room.x + 1) * t, (room.y + room.h - 2) * t);
  drawPlant(g, t, (room.x + room.w - 2) * t, (room.y + room.h - 2) * t);
};

// ---- 遊戲區: arcade cabinets on the back wall, rugs + stools around the tic-tac-toe tables ----
const ARCADE_CABINETS = [
  { dx: 2, color: "#e04a3a" },
  { dx: 3, color: "#3f7ad9" },
  { dx: 8, color: "#43a266" },
  { dx: 9, color: "#c85ad9" },
];
export const arcadeRoomBlockedTiles = (room = ARCADE_ROOM) => {
  const out = roomWallTiles(room);
  ARCADE_CABINETS.forEach((c) => out.push([room.x + c.dx, room.y + 1]));
  out.push([room.x + 10, room.y + 1]); // claw machine
  out.push([room.x + 1, room.y + room.h - 2]); // bean bag, vending machine
  out.push([room.x + room.w - 2, room.y + room.h - 2]);
  return out;
};

export const drawArcadeRoom = (g, t, room = ARCADE_ROOM, tables = GAME_TABLES.worldMap) => {
  const X = room.x * t;
  const Y = room.y * t;
  const W = room.w * t;
  drawRoomShell(g, t, room, { floor: ["#3a3553", "#403a5c"], floorLine: "#332e4a", wall: "#2b2745", wallTrim: "#e8773b", top: "#1b1830" });
  // Neon strip + sign on the back wall
  rpx(g, "#ff6fb1", X + 16, Y + 12, W - 32, 2);
  rpx(g, "#5ee0ff", X + 16, Y + t - 10, W - 32, 2);
  rpx(g, OUT, X + 4.6 * t, Y + 6, 2.8 * t, 26);
  rpx(g, "#ff6fb1", X + 4.6 * t + 2, Y + 8, 2.8 * t - 4, 22);
  g.save();
  g.font = "bold 15px \"Press Start 2P\", \"Noto Sans TC\", Arial, sans-serif";
  g.fillStyle = "#fff6c2";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("GAME ON", X + 6 * t, Y + 20);
  g.restore();
  // Checkered rugs under each tic-tac-toe table, with stools on both sides
  tables.forEach((tb) => {
    const rx = (tb.tileX - 1) * t + 6;
    const ry = (tb.tileY - 1) * t + 6;
    const rw = 3 * t - 12;
    const rh = 3 * t - 12;
    rpx(g, OUT, rx - 2, ry - 2, rw + 4, rh + 4);
    for (let cy = 0; cy < 6; cy++) {
      for (let cx = 0; cx < 6; cx++) {
        rpx(g, (cx + cy) % 2 ? "#e8773b" : "#f2a65a", rx + (cx * rw) / 6, ry + (cy * rh) / 6, rw / 6 + 1, rh / 6 + 1);
      }
    }
    const stool = (sx, sy) => {
      rpx(g, "rgba(0,0,0,0.25)", sx + 10, sy + 28, 20, 5);
      rpx(g, OUT, sx + 11, sy + 12, 18, 18);
      rpx(g, "#f2c14e", sx + 13, sy + 14, 14, 14);
      rpx(g, "#fff0a8", sx + 13, sy + 14, 14, 4);
    };
    stool((tb.tileX - 1) * t, tb.tileY * t);
    stool((tb.tileX + 1) * t, tb.tileY * t);
  });
  // Arcade cabinets
  ARCADE_CABINETS.forEach((c) => {
    const cx = (room.x + c.dx) * t;
    const cy = (room.y + 1) * t - 14;
    rpx(g, "rgba(0,0,0,0.3)", cx + 4, cy + t + 8, t - 8, 6);
    rpx(g, OUT, cx + 3, cy, t - 6, t + 12);
    rpx(g, c.color, cx + 5, cy + 2, t - 10, t + 8);
    rpx(g, OUT, cx + 8, cy + 6, t - 16, 16);
    rpx(g, "#5ee0ff", cx + 10, cy + 8, t - 20, 12);
    rpx(g, "#fff6c2", cx + 13, cy + 11, 4, 4);
    rpx(g, OUT, cx + 7, cy + 26, t - 14, 6);
    rpx(g, "#f2c14e", cx + 11, cy + 27, 4, 4);
    rpx(g, "#e04a3a", cx + t - 17, cy + 27, 4, 4);
  });
  // Claw machine
  const mx = (room.x + 10) * t;
  const my = (room.y + 1) * t - 14;
  rpx(g, "rgba(0,0,0,0.3)", mx + 4, my + t + 8, t - 8, 6);
  rpx(g, OUT, mx + 2, my, t - 4, t + 12);
  rpx(g, "#f2c14e", mx + 4, my + 2, t - 8, t + 8);
  rpx(g, "#bfe8f5", mx + 7, my + 6, t - 14, 22);
  rpx(g, OUT, mx + t / 2 - 1, my + 6, 2, 8);
  rpx(g, "#ff6fb1", mx + 10, my + 20, 7, 7);
  rpx(g, "#43a266", mx + 18, my + 21, 7, 6);
  rpx(g, "#3f7ad9", mx + 25, my + 20, 6, 7);
  // Bean bag (front left) and vending machine (front right)
  const bx = (room.x + 1) * t;
  const by = (room.y + room.h - 2) * t;
  rpx(g, OUT, bx + 4, by + 10, t - 8, t - 14);
  rpx(g, "#c85ad9", bx + 6, by + 12, t - 12, t - 18);
  rpx(g, "#dd85ea", bx + 10, by + 14, t - 22, 6);
  const vx = (room.x + room.w - 2) * t;
  const vy = (room.y + room.h - 2) * t - 12;
  rpx(g, OUT, vx + 4, vy, t - 8, t + 8);
  rpx(g, "#3f7ad9", vx + 6, vy + 2, t - 12, t + 4);
  rpx(g, "#bfe8f5", vx + 9, vy + 6, t - 24, 24);
  for (let i = 0; i < 3; i++) rpx(g, ["#e04a3a", "#f2c14e", "#43a266"][i], vx + 11, vy + 9 + i * 7, t - 28, 4);
  rpx(g, "#f4f1ea", vx + t - 14, vy + 8, 4, 8);
};

// ---- 抱石休息室 (village): a small bouldering wall with crash pads, sofa corner, chalk & water ----
export const loungeRoomBlockedTiles = (room = LOUNGE_ROOM) => {
  const out = [];
  out.push([room.x + 3, room.y + 3], [room.x + 4, room.y + 3]); // coffee table
  out.push([room.x + 1, room.y + 1]); // water cooler
  out.push([room.x + 1, room.y + room.h - 2], [room.x + room.w - 2, room.y + room.h - 2]); // plants
  return out;
};

export const drawLoungeRoom = (g, t, room = LOUNGE_ROOM) => {
  const X = room.x * t;
  const Y = room.y * t;
  // Open wooden deck on the gym floor, with a teal trim instead of walls
  const W = room.w * t;
  const H = room.h * t;
  rpx(g, "rgba(0,0,0,0.25)", X + 4, Y + 6, W, H);
  rpx(g, "#2f8c9a", X - 3, Y - 3, W + 6, H + 6);
  for (let ty = room.y; ty < room.y + room.h; ty++) {
    for (let tx = room.x; tx < room.x + room.w; tx++) {
      rpx(g, (tx + ty) % 2 ? "#b98a5e" : "#b28457", tx * t, ty * t, t, t);
      rpx(g, "#a47650", tx * t, ty * t + t / 2 - 1, t, 2);
      rpx(g, "#a47650", tx * t + ((ty * 17) % t), ty * t, 2, t / 2);
    }
  }
  // Water cooler (back-left corner, under the name tag)
  const wx = (room.x + 1) * t;
  const wy = (room.y + 1) * t - 10;
  rpx(g, OUT, wx + 10, wy, t - 20, t + 6);
  rpx(g, "#f4f1ea", wx + 12, wy + 16, t - 24, t - 12);
  rpx(g, "#7fd0f0", wx + 13, wy + 2, t - 26, 16);
  rpx(g, "#3f7ad9", wx + t / 2 - 2, wy + 22, 4, 4);
  // Chalk bucket
  rpx(g, OUT, (room.x + 2) * t + 8, Y + t + 8, 24, 22);
  rpx(g, "#f4f1ea", (room.x + 2) * t + 10, Y + t + 10, 20, 18);
  rpx(g, "#d8d2c6", (room.x + 2) * t + 10, Y + t + 10, 20, 4);
  // Rug + coffee table + sofa + two armchairs
  rpx(g, "#2f8c9a", X + 1.5 * t, Y + 2.6 * t, 5 * t, 2.2 * t);
  rpx(g, "#3fa9b8", X + 1.7 * t, Y + 2.8 * t, 4.6 * t, 4);
  const tx = (room.x + 3) * t;
  const ty = (room.y + 3) * t;
  rpx(g, OUT, tx + 2, ty + 6, 2 * t - 4, t - 12);
  rpx(g, "#8b5e3c", tx + 4, ty + 8, 2 * t - 8, t - 16);
  rpx(g, "#a2714a", tx + 4, ty + 8, 2 * t - 8, 4);
  rpx(g, "#f4f1ea", tx + 14, ty + 14, 10, 8); // mugs
  rpx(g, "#e04a3a", tx + t + 18, ty + 14, 12, 8); // climbing shoes
  const sx = (room.x + 2) * t;
  const sy = (room.y + 4) * t;
  rpx(g, OUT, sx + 4, sy + 4, 4 * t - 8, t - 6);
  rpx(g, "#c85a54", sx + 6, sy + 6, 4 * t - 12, t - 10);
  rpx(g, "#a8453f", sx + 6, sy + t - 14, 4 * t - 12, 8);
  rpx(g, "#dd7a73", sx + 10, sy + 8, 4 * t - 20, 5);
  const arm = (ax, ay) => {
    rpx(g, OUT, ax + 6, ay + 6, t - 12, t - 12);
    rpx(g, "#f2c14e", ax + 8, ay + 8, t - 16, t - 16);
    rpx(g, "#f8d87a", ax + 8, ay + 8, t - 16, 5);
  };
  arm((room.x + 1) * t, (room.y + 3) * t);
  arm((room.x + room.w - 2) * t, (room.y + 3) * t);
  drawPlant(g, t, (room.x + 1) * t, (room.y + room.h - 2) * t);
  drawPlant(g, t, (room.x + room.w - 2) * t, (room.y + room.h - 2) * t);
};

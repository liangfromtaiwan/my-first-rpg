// 🎷 Jazz bar on the world map, right of the party room: a cosy, warm-lit room with a bar
// counter, bottle shelves, stools, a candle-lit table and armchairs. Plays jazz while you're in.

// ---- 🎵 The bar's music: any YouTube link (a live stream keeps everyone in sync) ----
export const BAR_MUSIC = {
  url: "https://www.youtube.com/watch?v=dZz075kjNzE", // FM Jazz Bar · Late Night Deep Bass Jazz (live 24/7)
  title: "爵士酒吧",
  volume: 55,
};

/** Room footprint in tiles; the door is the two middle tiles of the bottom wall. */
// (one tile of grass between it and the party room)
export const BAR_ROOM = { x: 15, y: 4, w: 5, h: 6, doorCols: [17, 18] };
const tableCol = (room) => room.x + Math.floor(room.w / 2);

const OUT = "#2a1f1a";
const rpx = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

export const barRoomBlockedTiles = (room = BAR_ROOM) => {
  const out = [];
  const bottom = room.y + room.h - 1;
  for (let x = room.x; x < room.x + room.w; x++) {
    out.push([x, room.y]); // back wall (shelves)
    if (!room.doorCols.includes(x)) out.push([x, bottom]);
  }
  for (let y = room.y + 1; y < bottom; y++) {
    out.push([room.x, y]);
    out.push([room.x + room.w - 1, y]);
  }
  for (let x = room.x + 1; x < room.x + room.w - 1; x++) out.push([x, room.y + 1]); // bar counter
  out.push([tableCol(room), room.y + 3]); // round table
  out.push([room.x + 1, room.y + 4]); // plant
  return out;
};

/** Static part, drawn into the world floor layer. */
export const drawJazzBar = (g, t, room = BAR_ROOM) => {
  const X = room.x * t;
  const Y = room.y * t;
  const W = room.w * t;
  const H = room.h * t;
  const bottom = room.y + room.h - 1;
  // Warm wooden floor
  for (let ty = room.y; ty < room.y + room.h; ty++) {
    for (let tx = room.x; tx < room.x + room.w; tx++) {
      rpx(g, (tx + ty) % 2 ? "#6b4428" : "#744a2c", tx * t, ty * t, t, t);
      rpx(g, "#5e3b22", tx * t, ty * t + t / 2 - 1, t, 2);
    }
  }
  // Burgundy rug
  rpx(g, "#6e2433", X + 0.9 * t, Y + 2.6 * t, W - 1.8 * t, 2.2 * t);
  rpx(g, "#8a3243", X + 1.1 * t, Y + 2.8 * t, W - 2.2 * t, 1.8 * t);
  rpx(g, "#c9a24a", X + 1.1 * t, Y + 2.8 * t, W - 2.2 * t, 2);
  // Back wall: dark red wallpaper with bottle shelves
  rpx(g, "#3a1620", X, Y, W, t);
  rpx(g, "#4a1d29", X, Y + 6, W, t - 10);
  const bottles = ["#2f7d4f", "#8a3243", "#c9a24a", "#3f7ad9", "#e8d9b0", "#5b3f8c"];
  [Y + 8, Y + 22].forEach((sy, row) => {
    rpx(g, "#8b5e3c", X + 18, sy + 10, W - 36, 3);
    const n = Math.round(W / 16);
    for (let i = 0; i < n; i++) {
      const bx = X + 22 + i * ((W - 44) / (n - 1));
      const h = 7 + ((i + row) % 3) * 2;
      rpx(g, OUT, bx - 1, sy + 10 - h - 1, 5, h + 1);
      rpx(g, bottles[(i + row * 2) % bottles.length], bx, sy + 10 - h, 3, h);
    }
  });
  // Side / front walls (dark wood), door gap at the bottom
  const wall = (x, y, w, h) => {
    rpx(g, OUT, x, y, w, h);
    rpx(g, "#4a2e1c", x + 2, y + 2, w - 4, h - 4);
    rpx(g, "#6b4428", x + 2, y + 2, w - 4, 4);
  };
  for (let ty = room.y + 1; ty < bottom; ty++) {
    wall(X, ty * t, 16, t);
    wall(X + W - 16, ty * t, 16, t);
  }
  for (let tx = room.x; tx < room.x + room.w; tx++) {
    if (!room.doorCols.includes(tx)) wall(tx * t, bottom * t + 8, t, t - 8);
  }
  rpx(g, "#8a6a4a", room.doorCols[0] * t + 6, bottom * t + 10, room.doorCols.length * t - 12, t - 18);
  // Bar counter with glasses
  const cy = (room.y + 1) * t;
  rpx(g, "rgba(0,0,0,0.3)", X + t + 2, cy + t - 2, W - 2 * t, 6);
  rpx(g, OUT, X + t - 2, cy + 4, W - 2 * t + 4, t - 4);
  rpx(g, "#8b5e3c", X + t, cy + 6, W - 2 * t, t - 8);
  rpx(g, "#b07a45", X + t, cy + 6, W - 2 * t, 5);
  for (let i = 0; i < room.w - 2; i++) {
    const gx = X + t + 18 + i * t;
    rpx(g, "#e8f4fb", gx, cy + 12, 5, 7);
    rpx(g, "#c9a24a", gx + 1, cy + 15, 3, 3);
  }
  // Bar stools in front of the counter
  for (let i = 0; i < room.w - 2; i++) {
    const sx = X + (i + 1) * t;
    const sy = (room.y + 2) * t;
    rpx(g, OUT, sx + 12, sy + 8, 16, 14);
    rpx(g, "#8a3243", sx + 14, sy + 10, 12, 10);
    rpx(g, OUT, sx + 19, sy + 22, 2, 10);
  }
  // Round table with a candle, two armchairs
  const tx = tableCol(room) * t;
  const ty = (room.y + 3) * t;
  g.fillStyle = OUT;
  g.beginPath();
  g.arc(tx + t / 2, ty + t / 2, 15, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#8b5e3c";
  g.beginPath();
  g.arc(tx + t / 2, ty + t / 2, 13, 0, Math.PI * 2);
  g.fill();
  rpx(g, "#f4f1ea", tx + t / 2 - 2, ty + t / 2 - 6, 4, 8);
  const chair = (cx, cy2) => {
    rpx(g, OUT, cx + 6, cy2 + 6, t - 12, t - 10);
    rpx(g, "#6e2433", cx + 8, cy2 + 8, t - 16, t - 14);
    rpx(g, "#8a3243", cx + 8, cy2 + 8, t - 16, 5);
  };
  chair((tableCol(room) - 1) * t, ty);
  chair((tableCol(room) + 1) * t, ty);
  // Shop sign over the front of the roof: 🍸 JAZZ BAR
  const signW = 150;
  const sx0 = X + W / 2 - signW / 2;
  const sy0 = Y - 16;
  rpx(g, OUT, sx0 + 18, sy0 + 22, 3, 8); // hangers
  rpx(g, OUT, sx0 + signW - 21, sy0 + 22, 3, 8);
  rpx(g, OUT, sx0 - 2, sy0 - 2, signW + 4, 26);
  rpx(g, "#4a2e1c", sx0, sy0, signW, 22);
  rpx(g, "#6b4428", sx0, sy0, signW, 4);
  rpx(g, "#c9a24a", sx0 + 3, sy0 + 3, signW - 6, 1);
  g.save();
  g.font = `bold 14px "Press Start 2P", "Noto Sans TC", Arial, sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#2a1f1a";
  g.fillText("🍸 JAZZ BAR", X + W / 2 + 1, sy0 + 13);
  g.fillStyle = "#f2c14e";
  g.fillText("🍸 JAZZ BAR", X + W / 2, sy0 + 12);
  g.restore();
  // Plant in the corner
  const px = (room.x + 1) * t;
  const py = (room.y + 4) * t;
  rpx(g, OUT, px + 11, py + t - 18, t - 22, 14);
  rpx(g, "#8b5e3c", px + 13, py + t - 16, t - 26, 10);
  rpx(g, OUT, px + 5, py + 2, t - 10, t - 18);
  rpx(g, "#2f7d4f", px + 7, py + 4, t - 14, t - 22);
  rpx(g, "#43a266", px + 11, py + 6, t - 22, 6);
};

/** Animated: warm pendant lamps and a flickering candle glow. */
export const drawBarLights = (ctx, t, now, room = BAR_ROOM) => {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const flicker = 0.85 + 0.15 * Math.sin(now / 140) * Math.sin(now / 57);
  const glow = (x, y, r, a) => {
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(255, 190, 110, ${a})`);
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const lamps = [room.x + 1.5, room.x + room.w / 2, room.x + room.w - 1.5];
  lamps.forEach((lx) => glow(lx * t, (room.y + 1.6) * t, t * 1.3, 0.16));
  glow((tableCol(room) + 0.5) * t, (room.y + 3.35) * t, t * 0.9, 0.28 * flicker);
  ctx.restore();
  // Pendant lamps
  ctx.save();
  lamps.forEach((lampX) => {
    const lx = lampX * t;
    const ly = (room.y + 1.1) * t;
    ctx.fillStyle = OUT;
    ctx.fillRect(lx - 1, ly - 18, 2, 12);
    ctx.fillRect(lx - 7, ly - 7, 14, 7);
    ctx.fillStyle = "#c9a24a";
    ctx.fillRect(lx - 6, ly - 6, 12, 5);
    ctx.fillStyle = "#ffe7a8";
    ctx.fillRect(lx - 3, ly - 1, 6, 2);
  });
  // Candle flame
  const fx = (tableCol(room) + 0.5) * t;
  const fy = (room.y + 3.5) * t - 8;
  ctx.fillStyle = "#ffb347";
  ctx.fillRect(fx - 2, fy - 4 - Math.round(flicker * 2), 4, 5);
  ctx.fillStyle = "#fff3c4";
  ctx.fillRect(fx - 1, fy - 3, 2, 3);
  ctx.restore();
};

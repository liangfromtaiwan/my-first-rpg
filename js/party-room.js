// 🎉 Party room on the world map: a disco floor, a DJ booth, speakers and string lights.
// Walking in plays music from YouTube (see PARTY_MUSIC below), walking out stops it.

// ---- 🎵 Pick the music here: paste any YouTube link ----
//   a video      https://www.youtube.com/watch?v=VIDEO_ID
//   a playlist   https://www.youtube.com/playlist?list=PLAYLIST_ID
//   a channel's current live stream   https://www.youtube.com/channel/CHANNEL_ID/live
// A live stream or a long mix keeps everyone in sync: people in the room hear the same part.
export const PARTY_MUSIC = {
  url: "https://www.youtube.com/watch?v=nI725iVsyoQ", // Lofi Girl's live radio (placeholder until we pick party songs)
  title: "派對音樂",
  volume: 60, // 0–100
};

/** Room footprint in tiles; the door is the two middle tiles of the bottom wall. */
export const PARTY_ROOM = { x: 6, y: 4, w: 8, h: 6, doorCols: [9, 10] };

const OUT = "#2a1f1a";
const rpx = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

/** Walls, DJ booth and speakers block walking; the dance floor doesn't. */
export const partyRoomBlockedTiles = (room = PARTY_ROOM) => {
  const out = [];
  const bottom = room.y + room.h - 1;
  for (let x = room.x; x < room.x + room.w; x++) {
    out.push([x, room.y]); // back wall
    if (!room.doorCols.includes(x)) out.push([x, bottom]); // front wall with the door gap
  }
  for (let y = room.y + 1; y < bottom; y++) {
    out.push([room.x, y]);
    out.push([room.x + room.w - 1, y]);
  }
  out.push([room.x + 3, room.y + 1], [room.x + 4, room.y + 1]); // DJ booth
  out.push([room.x + 1, room.y + 1], [room.x + room.w - 2, room.y + 1]); // speakers
  return out;
};

/** Parses a YouTube link into { videoId } / { playlistId } / { channelLive }. */
export const parseYouTube = (url) => {
  try {
    const u = new URL(url);
    const live = u.pathname.match(/\/channel\/([^/]+)\/live/);
    if (live) return { channelLive: live[1] };
    const list = u.searchParams.get("list");
    if (list && !u.searchParams.get("v")) return { playlistId: list };
    const v = u.searchParams.get("v") || (u.hostname.includes("youtu.be") ? u.pathname.slice(1) : "") || u.pathname.split("/").pop();
    return { videoId: v, playlistId: list || null };
  } catch {
    return { videoId: String(url || "") };
  }
};

const FLOOR = ["#e04a3a", "#f2c14e", "#43a266", "#3f7ad9", "#c85ad9", "#ff8a3d"];

/** Static part, drawn into the world floor layer. */
export const drawPartyRoom = (g, t, room = PARTY_ROOM) => {
  const X = room.x * t;
  const Y = room.y * t;
  const W = room.w * t;
  const H = room.h * t;
  const bottom = room.y + room.h - 1;
  // Dark floor with a checkered disco dance floor in the middle
  rpx(g, "#1b1830", X, Y, W, H);
  for (let ty = room.y + 2; ty < bottom; ty++) {
    for (let tx = room.x + 1; tx < room.x + room.w - 1; tx++) {
      const c = FLOOR[(tx * 3 + ty * 5) % FLOOR.length];
      rpx(g, OUT, tx * t, ty * t, t, t);
      rpx(g, c, tx * t + 2, ty * t + 2, t - 4, t - 4);
      rpx(g, "rgba(255,255,255,0.28)", tx * t + 2, ty * t + 2, t - 4, 5);
    }
  }
  // Back wall with a neon "PARTY" sign and string lights
  rpx(g, "#120f22", X, Y, W, t - 4);
  rpx(g, "#ff6fb1", X + 8, Y + t - 8, W - 16, 3);
  for (let i = 0; i < 14; i++) {
    const lx = X + 14 + i * ((W - 28) / 13);
    rpx(g, "#3a3450", lx - 1, Y + 6, 2, 4);
    rpx(g, FLOOR[i % FLOOR.length], lx - 3, Y + 10, 6, 6);
  }
  rpx(g, OUT, X + W / 2 - 46, Y + 17, 92, 16);
  rpx(g, "#ff6fb1", X + W / 2 - 44, Y + 19, 88, 12);
  g.save();
  g.font = `bold 14px "Press Start 2P", "Noto Sans TC", Arial, sans-serif`;
  g.fillStyle = "#fff6c2";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("PARTY", X + W / 2, Y + 26);
  g.restore();
  // Side and front walls (purple), door gap at the bottom
  const wall = (x, y, w, h) => {
    rpx(g, OUT, x, y, w, h);
    rpx(g, "#5b3f8c", x + 2, y + 2, w - 4, h - 4);
    rpx(g, "#7b5cc4", x + 2, y + 2, w - 4, 4);
  };
  for (let ty = room.y + 1; ty < bottom; ty++) {
    wall(X, ty * t, 16, t);
    wall(X + W - 16, ty * t, 16, t);
  }
  for (let tx = room.x; tx < room.x + room.w; tx++) {
    if (!room.doorCols.includes(tx)) wall(tx * t, bottom * t + 8, t, t - 8);
  }
  // Door mat
  rpx(g, "#8a6a4a", room.doorCols[0] * t + 6, bottom * t + 10, room.doorCols.length * t - 12, t - 18);
  // DJ booth with turntables
  const dx = (room.x + 3) * t;
  const dy = (room.y + 1) * t;
  rpx(g, "rgba(0,0,0,0.3)", dx + 4, dy + t - 4, 2 * t, 8);
  rpx(g, OUT, dx - 2, dy + 4, 2 * t + 4, t - 4);
  rpx(g, "#2f3558", dx, dy + 6, 2 * t, t - 8);
  rpx(g, "#3d8bf2", dx, dy + 6, 2 * t, 3);
  [dx + 14, dx + 2 * t - 14].forEach((cx) => {
    g.fillStyle = OUT;
    g.beginPath();
    g.arc(cx, dy + 20, 10, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#5a5f7a";
    g.beginPath();
    g.arc(cx, dy + 20, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#e04a3a";
    g.beginPath();
    g.arc(cx, dy + 20, 2, 0, Math.PI * 2);
    g.fill();
  });
  // Speakers
  [(room.x + 1) * t, (room.x + room.w - 2) * t].forEach((sx) => {
    rpx(g, OUT, sx + 6, dy - 4, t - 12, t + 2);
    rpx(g, "#3a3450", sx + 8, dy - 2, t - 16, t - 2);
    g.fillStyle = OUT;
    g.beginPath();
    g.arc(sx + t / 2, dy + 8, 6, 0, Math.PI * 2);
    g.arc(sx + t / 2, dy + 24, 8, 0, Math.PI * 2);
    g.fill();
  });
};

/** Animated part (drawn every frame): a disco ball and coloured light spots moving on the floor. */
export const drawPartyLights = (ctx, t, now, room = PARTY_ROOM) => {
  const cx = (room.x + room.w / 2) * t;
  const cy = (room.y + 1.4) * t;
  const floorTop = (room.y + 2) * t;
  const floorH = (room.h - 3) * t;
  const floorX = (room.x + 1) * t;
  const floorW = (room.w - 2) * t;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    const a = now / 900 + (i * Math.PI * 2) / 5;
    const x = floorX + floorW / 2 + Math.cos(a) * floorW * 0.36;
    const y = floorTop + floorH / 2 + Math.sin(a * 1.3) * floorH * 0.34;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, t * 0.9);
    grd.addColorStop(0, `${["#ff6fb1", "#5ee0ff", "#f2c14e", "#7cff8a", "#b18cff"][i]}66`);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(x - t, y - t, 2 * t, 2 * t);
  }
  ctx.restore();
  // Disco ball
  ctx.save();
  ctx.fillStyle = OUT;
  ctx.fillRect(cx - 1, cy - 20, 2, 12);
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d8dce8";
  ctx.beginPath();
  ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
  ctx.fill();
  const spin = Math.floor(now / 140) % 4;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = (i + spin) % 3 === 0 ? "#ffffff" : "#9aa3bd";
    ctx.fillRect(cx - 6 + (i % 3) * 4, cy - 4 + Math.floor(i / 3) * 4, 3, 3);
  }
  ctx.restore();
};

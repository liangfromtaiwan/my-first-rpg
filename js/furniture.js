// Home furniture catalog: size in tiles, whether it blocks walking, and a pixel-art draw function.
// Used by the home map (and later by build mode).

const px = (g, color, x, y, w, h) => {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};
const OUT = "#2a1f1a";

export const FURNITURE_CATALOG = {
  sofa: {
    name: "沙發", w: 3, h: 1, block: true,
    draw: (g, X, Y, W, H, item) => {
      const up = item.facing === "up";
      px(g, OUT, X, Y + 2, W, H - 4);
      px(g, "#e46f86", X + 2, Y + 4, W - 4, H - 8);
      px(g, "#c9566e", X + 2, up ? Y + H - 14 : Y + 4, W - 4, 10);
      px(g, "#c9566e", X + 2, Y + 4, 6, H - 8);
      px(g, "#c9566e", X + W - 8, Y + 4, 6, H - 8);
      px(g, "#f29fb0", X + 14, Y + (up ? 10 : 18), 14, 8);
      px(g, "#f29fb0", X + W - 28, Y + (up ? 10 : 18), 14, 8);
    },
  },
  coffeeTable: {
    name: "茶几", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X + 4, Y + 8, W - 8, H - 14);
      px(g, "#d7b98f", X + 6, Y + 10, W - 12, H - 18);
      px(g, "#f4f1ea", X + 18, Y + 14, 8, 8);
      px(g, "#7a4b2a", X + 20, Y + 16, 4, 4);
      px(g, "#4c8bd6", X + W - 30, Y + 14, 14, 6);
    },
  },
  rug: {
    name: "地毯", w: 4, h: 3, block: false, flat: true,
    draw: (g, X, Y, W, H, item) => {
      const c = item.color || "#8e5cc4";
      px(g, c, X + 4, Y + 4, W - 8, H - 8);
      g.strokeStyle = "rgba(255,255,255,0.4)";
      g.lineWidth = 2;
      g.setLineDash([6, 4]);
      g.strokeRect(X + 10, Y + 10, W - 20, H - 20);
      g.setLineDash([]);
    },
  },
  plant: {
    name: "盆栽", w: 1, h: 1, block: true,
    draw: (g, X, Y) => {
      px(g, OUT, X + 10, Y + 22, 20, 16);
      px(g, "#b0643a", X + 12, Y + 24, 16, 12);
      px(g, "#2f7d4f", X + 6, Y + 6, 28, 18);
      px(g, "#43a266", X + 10, Y + 2, 20, 14);
      px(g, "#5cc07f", X + 14, Y + 4, 6, 6);
    },
  },
  tv: {
    name: "電視", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X + 2, Y + 22, W - 4, H - 22);
      px(g, "#6b4a33", X + 4, Y + 24, W - 8, H - 28);
      px(g, OUT, X + 8, Y - 10, W - 16, 32);
      px(g, "#3f4a7a", X + 11, Y - 7, W - 22, 26);
      px(g, "#6fe3a8", X + 16, Y - 2, 20, 4);
      px(g, "#9ad4f5", X + 16, Y + 6, 34, 3);
    },
  },
  bookshelf: {
    name: "書櫃", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X + 2, Y - 16, W - 4, H + 14);
      px(g, "#8b5e3c", X + 4, Y - 14, W - 8, H + 10);
      const colors = ["#c85a54", "#4c8bd6", "#f2c14e", "#58a55c", "#8e5cc4", "#e8773b"];
      [Y - 12, Y + 6].forEach((shelfY, row) => {
        px(g, "#5b3a22", X + 4, shelfY + 16, W - 8, 3);
        for (let i = 0; i < 9; i++) {
          px(g, colors[(i + row * 2) % colors.length], X + 8 + i * 7, shelfY + 2 + (i % 3), 5, 14 - (i % 3));
        }
      });
    },
  },
  bed: {
    name: "床", w: 2, h: 2, block: true,
    draw: (g, X, Y, W, H, item) => {
      const c = item.color || "#4c8bd6";
      px(g, OUT, X + 2, Y + 2, W - 4, H - 4);
      px(g, "#8b5e3c", X + 4, Y + 4, W - 8, 14); // headboard
      px(g, "#f4f1ea", X + 8, Y + 18, W - 16, 16); // pillow
      px(g, "#e3dccd", X + 8, Y + 30, W - 16, 4);
      px(g, c, X + 4, Y + 36, W - 8, H - 40); // blanket
      px(g, "rgba(255,255,255,0.25)", X + 4, Y + 36, W - 8, 6);
    },
  },
  nightstand: {
    name: "床頭櫃", w: 1, h: 1, block: true,
    draw: (g, X, Y) => {
      px(g, OUT, X + 6, Y + 12, 28, 26);
      px(g, "#a2714a", X + 8, Y + 14, 24, 22);
      px(g, "#7a5134", X + 8, Y + 24, 24, 2);
      px(g, "#f2c14e", X + 14, Y + 2, 12, 10); // lamp shade
      px(g, OUT, X + 19, Y + 10, 2, 4);
    },
  },
  wardrobe: {
    name: "衣櫃", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X + 2, Y - 18, W - 4, H + 16);
      px(g, "#c9955f", X + 4, Y - 16, W - 8, H + 12);
      px(g, "#a8773f", X + W / 2 - 1, Y - 16, 2, H + 12);
      px(g, "#5b3a22", X + W / 2 - 8, Y, 4, 8);
      px(g, "#5b3a22", X + W / 2 + 4, Y, 4, 8);
    },
  },
  desk: {
    name: "電腦桌", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X, Y + 8, W, H - 10);
      px(g, "#c9955f", X + 2, Y + 10, W - 4, H - 16);
      px(g, "#1d1b2b", X + 22, Y - 4, 36, 20);
      px(g, "#5fb3e6", X + 24, Y - 2, 32, 15);
      px(g, "#1d1b2b", X + 38, Y + 16, 4, 4);
      px(g, "#3d3a52", X + 26, Y + 22, 28, 4);
    },
  },
  prideFlag: {
    name: "彩虹旗", w: 1, h: 1, block: true,
    draw: (g, X, Y) => {
      px(g, OUT, X + 8, Y - 14, 3, 52); // pole
      ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"].forEach((c, i) => {
        px(g, c, X + 11, Y - 12 + i * 4, 24, 4);
      });
      px(g, OUT, X + 4, Y + 34, 12, 4);
    },
  },
  boulderWall: {
    name: "抱石牆", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X + 2, Y - 24, W - 4, H + 22);
      px(g, "#c9b79a", X + 4, Y - 22, W - 8, H + 18);
      const holds = [[10, -16, "#e46f86"], [30, -8, "#4c8bd6"], [52, -18, "#f2c14e"], [18, 4, "#58a55c"], [44, 8, "#8e5cc4"], [62, -2, "#e8773b"], [8, 20, "#4c8bd6"], [34, 22, "#e46f86"]];
      holds.forEach(([hx, hy, c]) => {
        px(g, OUT, X + hx - 1, Y + hy - 1, 8, 7);
        px(g, c, X + hx, Y + hy, 6, 5);
      });
      px(g, "#3d7a5c", X + 4, Y + H - 6, W - 8, 4); // crash pad
    },
  },
  guitar: {
    name: "吉他", w: 1, h: 1, block: true,
    draw: (g, X, Y) => {
      px(g, OUT, X + 18, Y - 8, 4, 22); // neck
      px(g, "#5b3a22", X + 16, Y - 12, 8, 6); // head
      g.fillStyle = OUT;
      g.beginPath();
      g.arc(X + 20, Y + 26, 12, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#e8773b";
      g.beginPath();
      g.arc(X + 20, Y + 26, 10, 0, Math.PI * 2);
      g.fill();
      px(g, OUT, X + 18, Y + 22, 4, 4);
    },
  },
  gameConsole: {
    name: "遊戲機", w: 1, h: 1, block: true,
    draw: (g, X, Y, W) => {
      px(g, OUT, X + 4, Y - 6, W - 8, 44);
      px(g, "#8e5cc4", X + 6, Y - 4, W - 12, 40);
      px(g, "#1d1b2b", X + 9, Y, W - 18, 14);
      px(g, "#6fe3a8", X + 11, Y + 2, W - 22, 10);
      px(g, "#f2c14e", X + 12, Y + 20, 4, 4);
      px(g, "#e46f86", X + 22, Y + 20, 4, 4);
    },
  },
  diningTable: {
    name: "餐桌", w: 2, h: 1, block: true,
    draw: (g, X, Y, W, H) => {
      px(g, OUT, X, Y + 6, W, H - 12);
      px(g, "#a2714a", X + 2, Y + 8, W - 4, H - 16);
      px(g, "#f4f1ea", X + 14, Y + 12, 12, 10);
      px(g, "#f4f1ea", X + W - 26, Y + 12, 12, 10);
      px(g, "#e46f86", X + W / 2 - 3, Y + 12, 6, 6);
    },
  },
  cat: {
    name: "貓咪", w: 1, h: 1, block: false,
    draw: (g, X, Y) => {
      px(g, "#e8773b", X + 10, Y + 20, 20, 12);
      px(g, "#e8773b", X + 24, Y + 12, 12, 12);
      px(g, "#e8773b", X + 24, Y + 8, 3, 4);
      px(g, "#e8773b", X + 33, Y + 8, 3, 4);
      px(g, OUT, X + 27, Y + 16, 2, 2);
      px(g, OUT, X + 32, Y + 16, 2, 2);
      px(g, "#c9562f", X + 6, Y + 18, 6, 4); // tail
      px(g, "#f7c29a", X + 14, Y + 28, 10, 4);
    },
  },
};

export const FURNITURE_TYPES = Object.keys(FURNITURE_CATALOG);

/** Draw one furniture item (tile coords) into `g`. */
export const drawFurnitureItem = (g, item, t) => {
  const def = FURNITURE_CATALOG[item.type];
  if (!def) return;
  def.draw(g, item.x * t, item.y * t, def.w * t, def.h * t, item);
};

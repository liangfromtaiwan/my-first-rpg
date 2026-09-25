// Pre-rendered pixel-art floor layers. Built once per map, then blitted each frame.

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const THEMES = {
  worldMap: {
    base: ["#55a07c", "#539d7a"],
    specks: ["#4a916f", "#62ad88", "#468a69"],
    tufts: "#3f8262",
    accents: ["#f4e3a1", "#f2a7b8", "#ffffff"],
    accentChance: 0.08,
    wall: "#2f6b4a",
    wallLight: "#3d8259",
    wallDark: "#24553a",
  },
  villageMap: {
    base: ["#c4b26a", "#c1af67"],
    specks: ["#b3a05a", "#d2c27f", "#a8954f"],
    tufts: "#9c8a47",
    accents: ["#8d8a80", "#a6a298"],
    accentChance: 0.1,
    wall: "#7b6a3a",
    wallLight: "#8f7d47",
    wallDark: "#62542d",
  },
};

const PX = 4; // terrain "pixel" size in world px

export const buildFloorLayer = (mapName, tiles, tileSize) => {
  const theme = THEMES[mapName] || THEMES.worldMap;
  const rows = tiles.length;
  const cols = tiles[0].length;
  const layer = document.createElement("canvas");
  layer.width = cols * tileSize;
  layer.height = rows * tileSize;
  const g = layer.getContext("2d");
  const rand = mulberry32(mapName.length * 7919 + cols * 31 + rows);
  const cells = tileSize / PX;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * tileSize;
      const y = r * tileSize;
      if (tiles[r][c] === 1) {
        g.fillStyle = theme.wall;
        g.fillRect(x, y, tileSize, tileSize);
        // Hedge bumps
        for (let i = 0; i < 5; i++) {
          const bx = x + Math.floor(rand() * (cells - 2)) * PX;
          const by = y + Math.floor(rand() * (cells - 2)) * PX;
          g.fillStyle = theme.wallLight;
          g.fillRect(bx, by, PX * 2, PX);
          g.fillStyle = theme.wallDark;
          g.fillRect(bx, by + PX, PX * 2, PX);
        }
        continue;
      }
      g.fillStyle = theme.base[(r + c) % 2];
      g.fillRect(x, y, tileSize, tileSize);
      const speckCount = 4 + Math.floor(rand() * 4);
      for (let i = 0; i < speckCount; i++) {
        g.fillStyle = theme.specks[Math.floor(rand() * theme.specks.length)];
        g.fillRect(
          x + Math.floor(rand() * cells) * PX,
          y + Math.floor(rand() * cells) * PX,
          PX,
          PX
        );
      }
      if (rand() < 0.35) {
        // Grass tuft / crack: a small "v" of pixels
        const tx = x + Math.floor(rand() * (cells - 3)) * PX;
        const ty = y + Math.floor(rand() * (cells - 2)) * PX;
        g.fillStyle = theme.tufts;
        g.fillRect(tx, ty, PX, PX);
        g.fillRect(tx + PX, ty + PX, PX, PX);
        g.fillRect(tx + PX * 2, ty, PX, PX);
      }
      if (rand() < theme.accentChance) {
        const ax = x + Math.floor(rand() * (cells - 2)) * PX;
        const ay = y + Math.floor(rand() * (cells - 2)) * PX;
        g.fillStyle = theme.accents[Math.floor(rand() * theme.accents.length)];
        g.fillRect(ax, ay, PX, PX);
        g.fillRect(ax + PX, ay + PX, PX, PX);
      }
    }
  }
  return layer;
};

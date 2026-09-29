// Pixel-art village bulletin board ("告示板"): a little wooden roof, a framed cork board with
// pinned notes and a photo, a name plate and two legs. Rendered once to a canvas and reused.

const OUT = "#2a1f1a";

/** Returns a canvas `size` px square (drawn on a 40-unit grid). */
export const makeNoticeBoardImage = (size = 136) => {
  const N = 40;
  const k = size / N;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const px = (color, x, y, w, h) => {
    g.fillStyle = color;
    g.fillRect(Math.round(x * k), Math.round(y * k), Math.round(w * k), Math.round(h * k));
  };

  // Ground shadow + legs
  px("rgba(0,0,0,0.25)", 6, 37, 28, 3);
  px(OUT, 9, 26, 4, 12);
  px("#8b5e3c", 10, 26, 2, 11);
  px(OUT, 27, 26, 4, 12);
  px("#8b5e3c", 28, 26, 2, 11);

  // Roof (a small plank roof with an overhang)
  px(OUT, 2, 6, 36, 5);
  px("#b0643a", 3, 7, 34, 3);
  px("#c97a4c", 3, 7, 34, 1);
  px(OUT, 5, 3, 30, 4);
  px("#9c5530", 6, 4, 28, 2);

  // Frame + cork
  px(OUT, 4, 10, 32, 19);
  px("#a2714a", 5, 11, 30, 17);
  px("#d8a86c", 7, 13, 26, 13);
  // cork speckles
  [[9, 15], [14, 22], [21, 14], [27, 23], [30, 16], [11, 24], [24, 19]].forEach(([x, y]) => px("#c4935a", x, y, 1, 1));

  // Pinned notes
  const note = (x, y, w, h, color, pin) => {
    px("rgba(0,0,0,0.18)", x + 0.6, y + 0.6, w, h);
    px(color, x, y, w, h);
    px("rgba(255,255,255,0.45)", x, y, w, 1);
    px("rgba(61,56,41,0.45)", x + 1, y + 2.2, w - 2, 0.6);
    if (h > 5) px("rgba(61,56,41,0.45)", x + 1, y + 3.8, w - 3, 0.6);
    px(OUT, x + w / 2 - 0.8, y - 0.8, 1.6, 1.6);
    px(pin, x + w / 2 - 0.5, y - 0.5, 1, 1);
  };
  note(8, 14, 7, 6, "#fff4a8", "#e04a3a");
  note(17, 13.5, 6, 5, "#bfe3ff", "#3f7ad9");
  note(25, 14, 7, 6, "#ffd1dc", "#43a266");
  note(10, 21, 6, 4.5, "#d8f5c8", "#c85ad9");
  // A little photo
  px("rgba(0,0,0,0.18)", 18.6, 20.6, 6, 5);
  px("#ffffff", 18, 20, 6, 5);
  px("#8fd3f4", 18.6, 20.6, 4.8, 2.4);
  px("#43a266", 18.6, 23, 4.8, 1.4);
  px("#f2c14e", 22, 21, 1, 1);
  // Rainbow ribbon in the corner
  ["#e04a3a", "#ff8a3d", "#f2c14e", "#43a266", "#3f7ad9", "#8e5cc4"].forEach((col, i) => px(col, 27, 21 + i * 0.8, 5, 0.8));

  // Pin badge on the roof (no words: the board is drawn small in-game; "看告示板" shows when you're near)
  const plateW = 9;
  px(OUT, 20 - plateW / 2 - 0.6, 0, plateW + 1.2, 6.2);
  px("#f2c14e", 20 - plateW / 2, 0.6, plateW, 5);
  g.font = `${Math.round(4.2 * k)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("📌", 20 * k, 3.3 * k);
  return c;
};

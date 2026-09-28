// Pixel-art bouldering gym ("抱石館") that stands where the castle used to be on the world map.
// Drawn once onto a square canvas (same footprint the castle image had), door centred at the bottom.

const OUT = "#2a1f1a";
const HOLDS = ["#e04a3a", "#f2c14e", "#43a266", "#3f7ad9", "#c85ad9", "#ff8a3d", "#5ee0ff"];

/** Returns a data: URL of the gym, `size` px square (logical pixel grid is 70x70, scaled up). */
export const makeGymImageUrl = (size = 280) => {
  const N = 70;
  const k = size / N;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 8; i++) rand(); // the first values from a small seed are tiny; skip them
  const px = (color, x, y, w, h) => {
    g.fillStyle = color;
    g.fillRect(Math.round(x * k), Math.round(y * k), Math.round(w * k), Math.round(h * k));
  };

  // Ground shadow
  px("rgba(0,0,0,0.22)", 4, 66, 62, 4);

  // Main hall (warehouse) with a sloped roof
  px(OUT, 3, 24, 64, 44);
  px("#e9e4da", 4, 25, 62, 42);
  px("#d6cfc0", 4, 58, 62, 9); // plinth
  px(OUT, 1, 18, 68, 8); // roof
  px("#2f8c9a", 2, 19, 66, 6);
  px("#3fa9b8", 2, 19, 66, 2);
  for (let x = 4; x < 66; x += 6) px("#27737f", x, 21, 1, 4); // roof ribs

  // Overhanging climbing wall on the left: grey panel with lots of colourful holds
  px(OUT, 5, 28, 22, 29);
  px("#8fa3a8", 6, 29, 20, 27);
  px("#7b8f94", 6, 29, 20, 3);
  for (let i = 0; i < 30; i++) {
    const hx = 7 + Math.floor(rand() * 17);
    const hy = 31 + Math.floor(rand() * 23);
    if (hx >= 14 && hx <= 21 && hy >= 35 && hy <= 47) continue; // leave room for the climber
    px(HOLDS[Math.floor(rand() * HOLDS.length)], hx, hy, 2 + (i % 2), 2);
  }
  // A tiny climber on the wall
  px(OUT, 17, 36, 3, 3); // head
  px("#f2c9a0", 17.5, 36.5, 2, 2);
  px("#e04a3a", 17, 39, 3, 5); // shirt
  px("#3f4a7a", 17, 44, 3, 3);
  px(OUT, 15, 38, 2, 1); // arms reaching
  px(OUT, 20, 37, 2, 1);

  // Big windows on the right showing more walls inside
  px(OUT, 44, 29, 20, 16);
  px("#bfe8f5", 45, 30, 18, 14);
  px("#9fd4e8", 45, 30, 18, 3);
  px(OUT, 53.5, 30, 1, 14);
  for (let i = 0; i < 14; i++) px(HOLDS[Math.floor(rand() * HOLDS.length)], 46 + Math.floor(rand() * 16), 33 + Math.floor(rand() * 10), 2, 1);

  // Sign board above the door
  px(OUT, 25, 10, 20, 12);
  px("#f2c14e", 26, 11, 18, 10);
  px("#f8d87a", 26, 11, 18, 2);
  // Pixel "climbing hold + mountain" logo on the sign
  px(OUT, 29, 18, 12, 1);
  px("#e04a3a", 31, 14, 3, 3);
  px("#3f7ad9", 35, 13, 3, 4);
  px("#43a266", 38, 15, 2, 2);
  px(OUT, 35, 21, 1, 3); // posts
  px(OUT, 34, 21, 1, 3);

  // Glass double door, centred
  px(OUT, 28, 45, 14, 22);
  px("#7fd0f0", 29, 46, 12, 21);
  px("#bfe8f5", 29, 46, 5, 21);
  px(OUT, 34.5, 46, 1, 21);
  px("#f2c14e", 33, 56, 1, 3);
  px("#f2c14e", 36, 56, 1, 3);
  // Awning
  px(OUT, 26, 42, 18, 4);
  for (let i = 0; i < 8; i++) px(i % 2 ? "#f4f1ea" : "#e04a3a", 27 + i * 2, 43, 2, 2);

  // Crash pads + chalk bag outside by the door
  px(OUT, 45, 60, 12, 6);
  px("#2f8c9a", 46, 61, 10, 4);
  px("#3fa9b8", 46, 61, 10, 1);
  px(OUT, 58, 60, 5, 6);
  px("#c85ad9", 59, 61, 3, 4);
  px("#f4f1ea", 59, 61, 3, 1);
  // Potted plant on the left of the door
  px(OUT, 21, 60, 5, 6);
  px("#b0643a", 22, 61, 3, 4);
  px("#2f7d4f", 20, 55, 7, 6);
  px("#43a266", 21, 56, 4, 2);

  return c.toDataURL();
};

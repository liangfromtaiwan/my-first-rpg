// Grid A* (4-directional) used for click-to-move.

class MinHeap {
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(node, priority) {
    const items = this.items;
    items.push({ node, priority });
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent].priority <= items[i].priority) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }
  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < items.length && items[l].priority < items[m].priority) m = l;
        if (r < items.length && items[r].priority < items[m].priority) m = r;
        if (m === i) break;
        [items[m], items[i]] = [items[i], items[m]];
        i = m;
      }
    }
    return top.node;
  }
}

/**
 * @param {Uint8Array} blocked cols*rows grid, 1 = blocked
 * @returns {Array<{x:number,y:number}>|null} tile path excluding start, or null
 */
export const findPath = (blocked, cols, rows, start, goal) => {
  const idx = (x, y) => y * cols + x;
  const inBounds = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows;
  if (!inBounds(goal.x, goal.y) || blocked[idx(goal.x, goal.y)]) return null;
  const startI = idx(start.x, start.y);
  const goalI = idx(goal.x, goal.y);
  if (startI === goalI) return [];

  const cameFrom = new Int32Array(cols * rows).fill(-1);
  const gScore = new Float32Array(cols * rows).fill(Infinity);
  gScore[startI] = 0;
  const open = new MinHeap();
  open.push(startI, 0);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (open.size) {
    const current = open.pop();
    if (current === goalI) {
      const path = [];
      let n = current;
      while (n !== startI) {
        path.push({ x: n % cols, y: Math.floor(n / cols) });
        n = cameFrom[n];
      }
      return path.reverse();
    }
    const cx = current % cols;
    const cy = Math.floor(current / cols);
    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny)) continue;
      const ni = idx(nx, ny);
      if (blocked[ni]) continue;
      const tentative = gScore[current] + 1;
      if (tentative < gScore[ni]) {
        cameFrom[ni] = current;
        gScore[ni] = tentative;
        open.push(ni, tentative + Math.abs(nx - goal.x) + Math.abs(ny - goal.y));
      }
    }
  }
  return null;
};

/** Nearest unblocked tile to (x, y) within `radius`, by BFS ring distance. */
export const nearestOpenTile = (blocked, cols, rows, x, y, radius = 4) => {
  let best = null;
  let bestD = Infinity;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (blocked[ny * cols + nx]) continue;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = { x: nx, y: ny };
      }
    }
  }
  return best;
};

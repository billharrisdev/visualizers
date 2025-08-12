export type Coord = { row: number; col: number };

export type DijkstraResult = {
  distance: number; // Number of steps from start to end, or Infinity if unreachable
  path: Coord[]; // Includes start and end if reachable
  visitedCount: number; // How many nodes were popped from the open set
};

// Dijkstra on a 2D grid with 4-directional movement and unit weights.
// `grid[r][c] === true` means the cell is an obstacle (blocked).
export function dijkstraGrid(
  grid: boolean[][],
  start: Coord,
  end: Coord
): DijkstraResult {
  const numRows = grid.length;
  const numCols = numRows > 0 ? grid[0].length : 0;
  if (
    start.row < 0 ||
    start.col < 0 ||
    end.row < 0 ||
    end.col < 0 ||
    start.row >= numRows ||
    end.row >= numRows ||
    start.col >= numCols ||
    end.col >= numCols
  ) {
    return { distance: Infinity, path: [], visitedCount: 0 };
  }

  if (grid[start.row][start.col] || grid[end.row][end.col]) {
    return { distance: Infinity, path: [], visitedCount: 0 };
  }

  type Node = {
    row: number;
    col: number;
    dist: number;
    parent: Node | null;
  };

  const nodes: Node[][] = Array.from({ length: numRows }, (_, r) =>
    Array.from({ length: numCols }, (_, c) => ({
      row: r,
      col: c,
      dist: Infinity,
      parent: null,
    }))
  );

  const open: Node[] = [];
  const closed: boolean[][] = Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => false)
  );

  const s = nodes[start.row][start.col];
  const t = nodes[end.row][end.col];
  s.dist = 0;
  open.push(s);

  let visitedCount = 0;

  const neighbors = (n: Node): Node[] => {
    const out: Node[] = [];
    const r = n.row;
    const c = n.col;
    if (r > 0) out.push(nodes[r - 1][c]);
    if (r + 1 < numRows) out.push(nodes[r + 1][c]);
    if (c > 0) out.push(nodes[r][c - 1]);
    if (c + 1 < numCols) out.push(nodes[r][c + 1]);
    return out.filter((m) => !grid[m.row][m.col]);
  };

  while (open.length > 0) {
    // Extract node with smallest distance (linear scan priority queue)
    let best = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].dist < open[best].dist) best = i;
    }
    const current = open[best];
    open.splice(best, 1);
    if (closed[current.row][current.col]) continue;
    closed[current.row][current.col] = true;
    visitedCount++;

    if (current === t) {
      // Reconstruct path
      const path: Coord[] = [];
      let p: Node | null = current;
      while (p) {
        path.push({ row: p.row, col: p.col });
        p = p.parent;
      }
      path.reverse();
      return { distance: current.dist, path, visitedCount };
    }

    for (const nb of neighbors(current)) {
      if (closed[nb.row][nb.col]) continue;
      const alt = current.dist + 1; // unit weight
      if (alt < nb.dist) {
        nb.dist = alt;
        nb.parent = current;
        // ensure it's in open set; avoid duplicates if already present
        if (!open.includes(nb)) open.push(nb);
      }
    }
  }

  return { distance: Infinity, path: [], visitedCount };
}

import { dijkstraGrid, type Coord } from "@/lib/graph";

describe("dijkstraGrid", () => {
  test("straight path with no obstacles", () => {
    const grid = Array.from({ length: 3 }, () => Array(3).fill(false));
    const start: Coord = { row: 0, col: 0 };
    const end: Coord = { row: 0, col: 2 };
    const res = dijkstraGrid(grid, start, end);
    expect(res.distance).toBe(2);
    expect(res.path).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  test("path around an obstacle", () => {
    const grid = Array.from({ length: 3 }, () => Array(3).fill(false));
    grid[0][1] = true; // block the direct route
    const start: Coord = { row: 0, col: 0 };
    const end: Coord = { row: 0, col: 2 };
    const res = dijkstraGrid(grid, start, end);
    // Shortest detour length should be 4 steps: (0,0)->(1,0)->(1,1)->(1,2)->(0,2)
    expect(res.distance).toBe(4);
    expect(res.path[0]).toEqual(start);
    expect(res.path[res.path.length - 1]).toEqual(end);
  });

  test("unreachable when end is blocked", () => {
    const grid = Array.from({ length: 2 }, () => Array(2).fill(false));
    grid[1][1] = true; // block end
    const start: Coord = { row: 0, col: 0 };
    const end: Coord = { row: 1, col: 1 };
    const res = dijkstraGrid(grid, start, end);
    expect(res.distance).toBe(Infinity);
    expect(res.path).toEqual([]);
  });

  test("invalid coordinates return Infinity", () => {
    const grid = Array.from({ length: 1 }, () => Array(1).fill(false));
    const res = dijkstraGrid(grid, { row: -1, col: 0 }, { row: 0, col: 0 });
    expect(res.distance).toBe(Infinity);
  });
});

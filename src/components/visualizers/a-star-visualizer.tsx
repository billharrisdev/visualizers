"use client"

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 50;

type Node = {
  row: number;
  col: number;
  isObstacle: boolean;
  gScore: number;
  hScore: number;
  fScore: number;
  parent: Node | null;
};

export default function AStarVisualizer() {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [startNode, setStartNode] = useState({ row: 5, col: 5 });
  const [endNode, setEndNode] = useState({ row: 15, col: 15 });
  const [openSet, setOpenSet] = useState<Node[]>([]);
  const [closedSet, setClosedSet] = useState<Node[]>([]);
  const [path, setPath] = useState<Node[]>([]);

  const initializeGrid = useCallback(() => {
    const newGrid: Node[][] = [];
    const newStartNode = {
      row: Math.floor(Math.random() * GRID_SIZE),
      col: Math.floor(Math.random() * GRID_SIZE),
    };
    let newEndNode = {
      row: Math.floor(Math.random() * GRID_SIZE),
      col: Math.floor(Math.random() * GRID_SIZE),
    };

    while (newEndNode.row === newStartNode.row && newEndNode.col === newStartNode.col) {
      newEndNode = {
        row: Math.floor(Math.random() * GRID_SIZE),
        col: Math.floor(Math.random() * GRID_SIZE),
      };
    }

    setStartNode(newStartNode);
    setEndNode(newEndNode);

    for (let row = 0; row < GRID_SIZE; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const isObstacle = Math.random() < 0.2;
        // Ensure start and end nodes are not obstacles
        if (
          (row === newStartNode.row && col === newStartNode.col) ||
          (row === newEndNode.row && col === newEndNode.col)
        ) {
          currentRow.push(createNode(row, col));
        } else {
          const node = createNode(row, col);
          node.isObstacle = isObstacle;
          currentRow.push(node);
        }
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    resetState();
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const createNode = (row: number, col: number): Node => ({
    row,
    col,
    isObstacle: false,
    gScore: Infinity,
    hScore: Infinity,
    fScore: Infinity,
    parent: null,
  });

  const resetState = () => {
    setIsSearching(false);
    setOpenSet([]);
    setClosedSet([]);
    setPath([]);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isSearching) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isSearching) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const getNewGridWithWallToggled = (grid: Node[][], row: number, col: number) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isObstacle: !node.isObstacle,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const heuristic = (nodeA: Node, nodeB: Node) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  };

  const aStarSearch = async () => {
    setIsSearching(true);
    // We clear the path, open and closed sets before starting
    setOpenSet([]);
    setClosedSet([]);
    setPath([]);

    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    start.gScore = 0;
    start.hScore = heuristic(start, end);
    start.fScore = start.gScore + start.hScore;

    const openSetLocal = [start];
    const closedSetLocal: Node[] = [];

    while (openSetLocal.length > 0) {
      let lowestIndex = 0;
      for (let i = 0; i < openSetLocal.length; i++) {
        if (openSetLocal[i].fScore < openSetLocal[lowestIndex].fScore) {
          lowestIndex = i;
        }
      }
      const currentNode = openSetLocal[lowestIndex];

      setOpenSet([...openSetLocal]);
      setClosedSet([...closedSetLocal]);
      await new Promise((resolve) => setTimeout(resolve, 20));

      if (currentNode.row === end.row && currentNode.col === end.col) {
        const tempPath = [];
        let temp = currentNode;
        while (temp !== null) {
          tempPath.push(temp);
          temp = temp.parent!;
        }
        setPath(tempPath.reverse());
        setIsSearching(false);
        return;
      }

      openSetLocal.splice(lowestIndex, 1);
      closedSetLocal.push(currentNode);

      const neighbors = getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (closedSetLocal.some(node => node.row === neighbor.row && node.col === neighbor.col) || neighbor.isObstacle) {
          continue;
        }

        const tentativeGScore = currentNode.gScore + 1;

        if (tentativeGScore < neighbor.gScore) {
          neighbor.parent = currentNode;
          neighbor.gScore = tentativeGScore;
          neighbor.hScore = heuristic(neighbor, end);
          neighbor.fScore = neighbor.gScore + neighbor.hScore;

          if (!openSetLocal.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
            openSetLocal.push(neighbor);
          }
        }
      }
    }

    setIsSearching(false);
  };

  const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
    const neighbors: Node[] = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < GRID_SIZE - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < GRID_SIZE - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const getBoxClass = (node: Node) => {
    if (node.row === startNode.row && node.col === startNode.col) return "bg-green-500";
    if (node.row === endNode.row && node.col === endNode.col) return "bg-red-500";
    if (path.includes(node)) return "bg-yellow-400";
    if (closedSet.some(n => n.row === node.row && n.col === node.col)) return "bg-blue-300";
    if (openSet.some(n => n.row === node.row && n.col === node.col)) return "bg-blue-200";
    if (node.isObstacle) return "bg-gray-700";
    return "bg-white";
  };

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="w-[min(95vw,80vh)]">
          <div
            data-testid="a-star-grid"
            className="grid gap-px"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            }}
            onMouseUp={handleMouseUp}
          >
            {grid.flat().map((node, idx) => (
              <div
                key={idx}
                className={`aspect-square w-full border border-gray-200 ${getBoxClass(node)}`}
                onMouseDown={() => handleMouseDown(node.row, node.col)}
                onMouseEnter={() => handleMouseEnter(node.row, node.col)}
              ></div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={aStarSearch} disabled={isSearching}>
          Start A* Search
        </Button>
        <Button onClick={initializeGrid} disabled={isSearching}>
          Reset Grid
        </Button>
      </div>
    </div>
  );
}

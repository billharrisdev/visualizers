"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const START_NODE = { row: 5, col: 5 };
const END_NODE = { row: 15, col: 15 };

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
  const [isSearching, setIsSearching] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [openSet, setOpenSet] = useState<Node[]>([]);
  const [closedSet, setClosedSet] = useState<Node[]>([]);
  const [path, setPath] = useState<Node[]>([]);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        currentRow.push(createNode(row, col));
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    resetState();
  };

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

    const startNode = grid[START_NODE.row][START_NODE.col];
    const endNode = grid[END_NODE.row][END_NODE.col];

    startNode.gScore = 0;
    startNode.hScore = heuristic(startNode, endNode);
    startNode.fScore = startNode.gScore + startNode.hScore;

    let openSetLocal = [startNode];
    let closedSetLocal: Node[] = [];

    while (openSetLocal.length > 0) {
      let lowestIndex = 0;
      for (let i = 0; i < openSetLocal.length; i++) {
        if (openSetLocal[i].fScore < openSetLocal[lowestIndex].fScore) {
          lowestIndex = i;
        }
      }
      let currentNode = openSetLocal[lowestIndex];

      setOpenSet([...openSetLocal]);
      setClosedSet([...closedSetLocal]);
      await new Promise((resolve) => setTimeout(resolve, 20));

      if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
        let tempPath = [];
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
          neighbor.hScore = heuristic(neighbor, endNode);
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
    if (node.row === START_NODE.row && node.col === START_NODE.col) return "bg-green-500";
    if (node.row === END_NODE.row && node.col === END_NODE.col) return "bg-red-500";
    if (path.includes(node)) return "bg-yellow-400";
    if (closedSet.some(n => n.row === node.row && n.col === node.col)) return "bg-blue-300";
    if (openSet.some(n => n.row === node.row && n.col === node.col)) return "bg-blue-200";
    if (node.isObstacle) return "bg-gray-700";
    return "bg-white";
  };

  return (
    <div className="w-full" onMouseUp={handleMouseUp}>
      <div className="grid gap-px" style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {grid.flat().map((node, idx) => (
          <div
            key={idx}
            className={`w-full aspect-square border border-gray-200 ${getBoxClass(node)}`}
            onMouseDown={() => handleMouseDown(node.row, node.col)}
            onMouseEnter={() => handleMouseEnter(node.row, node.col)}
          ></div>
        ))}
      </div>
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

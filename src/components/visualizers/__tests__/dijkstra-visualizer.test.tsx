import { render, screen } from "@testing-library/react";
import DijkstraVisualizer from "../dijkstra-visualizer";

describe("DijkstraVisualizer", () => {
  it("renders the grid", async () => {
    render(<DijkstraVisualizer />);
    // Wait for initial loading state to disappear
    const grid = await screen.findByTestId("dijkstra-grid");
    expect(grid).toBeInTheDocument();
  });
});

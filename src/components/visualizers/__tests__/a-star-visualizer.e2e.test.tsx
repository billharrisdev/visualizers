import { render, screen, within } from '@testing-library/react';
import AStarVisualizer from '../a-star-visualizer';

// NOTE: This is a lightweight DOM structure test, not a real browser E2E.
// Verifies the grid renders full size (50x50) within a reasonable time.

describe('AStarVisualizer grid rendering', () => {
  it('renders 50 x 50 = 2500 grid cells', async () => {
    render(<AStarVisualizer />);
    const grid = await screen.findByTestId('a-star-grid');
    // Cells are direct child divs inside grid
    const cells = within(grid).getAllByRole('generic');
    // Some divs might not have role generic; fallback to querySelectorAll
    // if count seems off.
    if (cells.length < 2500) {
      const raw = (grid as HTMLElement).querySelectorAll('div');
      expect(raw.length).toBe(2500);
    } else {
      expect(cells.length).toBe(2500);
    }
  }, 15000);
});

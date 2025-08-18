import { render, screen } from '@testing-library/react';
import QuickSortVisualizer from '../quick-sort-visualizer';

// Smoke test replacing former Playwright screenshot script.

describe('QuickSortVisualizer rendering', () => {
  it('renders the visualization container with bars', async () => {
    render(<QuickSortVisualizer />);
    // Container has fixed height h-96; select via role none fallback query.
    const container = document.querySelector('.h-96');
    expect(container).toBeTruthy();
    // Expect some child divs (bars) to be present soon after render.
    const bars = (container as HTMLElement).querySelectorAll('div');
    expect(bars.length).toBeGreaterThan(0);
  });
});

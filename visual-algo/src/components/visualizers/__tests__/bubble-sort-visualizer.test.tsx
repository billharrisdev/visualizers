import React from 'react';
import { render, screen, findAllByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import BubbleSortVisualizer from '../bubble-sort-visualizer';

// Define the constants used by the component, so the test is not brittle
const ARRAY_SIZE = 50;

describe('BubbleSortVisualizer (Simplified)', () => {
  it('should render the initial array of bars after mounting', async () => {
    render(<BubbleSortVisualizer />);

    // The component starts with an empty array, then a useEffect populates it.
    // We need to wait for the bars to appear after the state update.
    // We can do this by finding the container and then finding the bars within it.
    const barContainer = await screen.findByTestId('bar-container');

    // Now that the container is found, let's find all the bars within it.
    const bars = await findAllByTestId(barContainer, 'bar');

    // Assert that the correct number of bars have been rendered.
    expect(bars).toHaveLength(ARRAY_SIZE);
  });
});

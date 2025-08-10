import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BubbleSortVisualizer from '../bubble-sort-visualizer';

import { act } from 'react';

// Mock Framer Motion
jest.mock('framer-motion', () => {
  const original = jest.requireActual('framer-motion');
  return {
    ...original,
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      // Create a mock div that accepts the 'layout' prop without complaining
      div: React.forwardRef(({ children, layout, ...props }, ref) => (
        <div {...props} ref={ref}>{children}</div>
      )),
    },
  };
});

describe('BubbleSortVisualizer', () => {
  it('should disable the start button when sorting begins', async () => {
    render(<BubbleSortVisualizer />);

    const startButton = screen.getByRole('button', { name: /start bubble sort/i });
    const generateButton = screen.getByRole('button', { name: /generate new array/i });

    expect(startButton).toBeEnabled();
    expect(generateButton).toBeEnabled();

    // Wrap the state-updating event in act
    await act(async () => {
      fireEvent.click(startButton);
    });

    // The component re-renders, and the button should now be disabled.
    // No need for waitFor here, as act handles the updates.
    expect(startButton).toBeDisabled();
    expect(generateButton).toBeDisabled();
  });

  it('should re-enable buttons after sorting is complete', async () => {
    jest.useFakeTimers();
    render(<BubbleSortVisualizer />);

    const startButton = screen.getByRole('button', { name: /start bubble sort/i });

    // Wrap state update in act
    await act(async () => {
        fireEvent.click(startButton);
    });

    // The button is now disabled
    expect(startButton).toBeDisabled();

    // Fast-forward all timers, wrapped in act
    await act(async () => {
      jest.runAllTimers();
    });

    // Now, the buttons should be enabled again. We use waitFor to allow
    // for the final state update to propagate after all timers have run.
    await waitFor(() => {
      expect(startButton).toBeEnabled();
    });

    jest.useRealTimers();
  });
});

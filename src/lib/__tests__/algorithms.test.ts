import { bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort, Bar, AnimationStep } from '../algorithms';

const createInitialArray = (arr: number[]): Bar[] => {
    return arr.map((value, id) => ({ id, value }));
};

const getSortedValues = (steps: AnimationStep[]) => {
    if (steps.length === 0) return [];
    return steps[steps.length - 1].array.map((item: Bar) => item.value);
}

describe('Sorting Algorithms', () => {
    const testCases = [
        { name: 'empty array', initial: [], expected: [] },
        { name: 'sorted array', initial: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
        { name: 'reverse sorted array', initial: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
        { name: 'random array', initial: [3, 1, 4, 1, 5, 9, 2, 6], expected: [1, 1, 2, 3, 4, 5, 6, 9] },
        { name: 'array with duplicates', initial: [5, 8, 5, 2, 9, 5], expected: [2, 5, 5, 5, 8, 9] },
        { name: 'array with negative numbers', initial: [-5, -8, -2, -9], expected: [-9, -8, -5, -2] },
    ];

    const algorithms = [
        { name: 'Bubble Sort', fn: bubbleSort },
        { name: 'Insertion Sort', fn: insertionSort },
        { name: 'Selection Sort', fn: selectionSort },
        { name: 'Merge Sort', fn: mergeSort },
        { name: 'Quick Sort', fn: quickSort },
        { name: 'Heap Sort', fn: heapSort },
    ];

    algorithms.forEach(algo => {
        describe(algo.name, () => {
            testCases.forEach(testCase => {
                it(`should sort a ${testCase.name}`, () => {
                    const initialArray = createInitialArray(testCase.initial);
                    const steps = algo.fn(initialArray);
                    if (initialArray.length === 0) {
                        expect(steps).toEqual([]);
                    } else {
                        const sortedValues = getSortedValues(steps);
                        expect(sortedValues).toEqual(testCase.expected);
                    }
                });
            });
        });
    });
});

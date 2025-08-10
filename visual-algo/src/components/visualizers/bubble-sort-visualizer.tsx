"use client"

import { useState, useEffect, useCallback } from "react"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"

const ARRAY_SIZE = 50;
const MIN_VALUE = 5;
const MAX_VALUE = 100;
const ANIMATION_SPEED_MS = 10;

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const generateArray = useCallback(() => {
    if (isSorting) return;
    const newArray = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
      newArray.push(Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE);
    }
    setArray(newArray);
    setSortedIndices([]);
  }, [isSorting]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const bubbleSort = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        flushSync(() => {
          setComparingIndices([j, j + 1]);
        });
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_SPEED_MS));
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          flushSync(() => {
            setArray([...arr]);
          });
          await new Promise((resolve) => setTimeout(resolve, ANIMATION_SPEED_MS));
        }
      }
      flushSync(() => {
        setSortedIndices((prev) => [...prev, arr.length - 1 - i]);
      });
    }
    setSortedIndices((prev) => [...prev, 0]); // The last element is also sorted
    setComparingIndices([]);
    setIsSorting(false);
  }, [array, isSorting]);

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return "bg-green-500"; // Sorted
    }
    if (comparingIndices.includes(index)) {
      return "bg-red-500"; // Comparing
    }
    return "bg-blue-500"; // Default
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-end h-96 border border-gray-200 rounded-lg p-4 bg-gray-50 gap-px">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`flex-grow transition-all duration-200 ${getBarColor(idx)}`}
            style={{ height: `${value}%` }}
          ></div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={generateArray} disabled={isSorting}>
          Generate New Array
        </Button>
        <Button onClick={bubbleSort} disabled={isSorting}>
          Start Bubble Sort
        </Button>
      </div>
    </div>
  );
}

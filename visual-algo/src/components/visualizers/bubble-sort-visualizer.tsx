"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

const ARRAY_SIZE = 50;
const MIN_VALUE = 5;
const MAX_VALUE = 100;

type Bar = {
  id: number;
  value: number;
};

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState<Bar[]>([]);

  const generateArray = useCallback(() => {
    const newArray: Bar[] = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
      newArray.push({
        id: i,
        value: Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
      });
    }
    setArray(newArray);
  }, []);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  return (
    <div className="w-full">
      <div data-testid="bar-container" className="flex justify-center items-end h-96 border border-gray-200 rounded-lg p-4 bg-gray-50 gap-px">
        {array.map(item => (
          <div
            key={item.id}
            data-testid="bar"
            style={{
              height: `${item.value}%`,
              width: `calc(100% / ${ARRAY_SIZE})`,
              backgroundColor: "#3b82f6", // Default blue color
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={generateArray}>
          Generate New Array
        </Button>
        <Button disabled>
          Start Bubble Sort
        </Button>
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const ARRAY_SIZE = 50;
const MIN_VALUE = 5;
const MAX_VALUE = 100;
const ANIMATION_SPEED_MS = 50; // Slower for better visualization

type AnimationStep = {
  array: number[];
  comparing: number[];
  sorted: number[];
}

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);

  const generateArray = useCallback(() => {
    if (isSorting) return;
    const newArray = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
      newArray.push(Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE);
    }
    setArray(newArray);
    setAnimationSteps([]);
    setCurrentStep(0);
  }, [isSorting]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const bubbleSort = () => {
    const arr = [...array];
    const steps: AnimationStep[] = [];
    const sorted: number[] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Step to show comparison
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          sorted: [...sorted],
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          // Step to show the swap
          steps.push({
            array: [...arr],
            comparing: [j, j + 1],
            sorted: [...sorted],
          });
        }
      }
      sorted.push(arr.length - 1 - i);
    }
    sorted.push(0); // The last element is also sorted

    // Final step to show all sorted
    steps.push({
      array: [...arr],
      comparing: [],
      sorted: [...sorted],
    });

    setAnimationSteps(steps);
    setIsSorting(true);
  };

  useEffect(() => {
    if (isSorting && currentStep < animationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, ANIMATION_SPEED_MS);
      return () => clearTimeout(timer);
    } else {
      setIsSorting(false);
    }
  }, [currentStep, isSorting, animationSteps]);

  const currentArray = animationSteps[currentStep]?.array || array;
  const comparingIndices = animationSteps[currentStep]?.comparing || [];
  const sortedIndices = animationSteps[currentStep]?.sorted || [];

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return "#22c55e"; // green-500
    }
    if (comparingIndices.includes(index)) {
      return "#ef4444"; // red-500
    }
    return "#3b82f6"; // blue-500
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-end h-96 border border-gray-200 rounded-lg p-4 bg-gray-50 gap-px">
        <AnimatePresence>
          {currentArray.map((value, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ height: 0 }}
              animate={{
                height: `${value}%`,
                backgroundColor: getBarColor(idx),
              }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            />
          ))}
        </AnimatePresence>
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

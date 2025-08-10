"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const ARRAY_SIZE = 50;
const MIN_VALUE = 5;
const MAX_VALUE = 100;
const ANIMATION_SPEED_MS = 50;

type Bar = {
  id: number;
  value: number;
};

type AnimationStep = {
  array: Bar[];
  comparing: number[];
  sorted: number[];
}

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState<Bar[]>([]);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);

  const generateArray = useCallback(() => {
    if (isSorting) return;
    const newArray: Bar[] = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
      newArray.push({
        id: i,
        value: Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
      });
    }
    setArray(newArray);
    setAnimationSteps([]);
    setCurrentStep(0);
  }, [isSorting]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const bubbleSort = () => {
    // Create a deep copy to avoid mutation issues
    const arr = JSON.parse(JSON.stringify(array));
    const steps: AnimationStep[] = [];
    const sorted: number[] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [arr[j].id, arr[j + 1].id],
          sorted: [...sorted],
        });

        if (arr[j].value > arr[j + 1].value) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparing: [arr[j].id, arr[j + 1].id],
            sorted: [...sorted],
          });
        }
      }
      sorted.push(arr[arr.length - 1 - i].id);
    }
    sorted.push(arr[0].id);

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [],
      sorted: [...sorted],
    });

    setAnimationSteps(steps);
    setIsSorting(true);
  };

  useEffect(() => {
    if (!isSorting) return;
    if (currentStep >= animationSteps.length - 1) {
      setIsSorting(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep(currentStep + 1);
    }, ANIMATION_SPEED_MS);
    return () => clearTimeout(timer);
  }, [currentStep, isSorting, animationSteps]);

  const currentFrame = animationSteps[currentStep];
  const currentArray = currentFrame?.array || array;
  const comparingIds = currentFrame?.comparing || [];
  const sortedIds = currentFrame?.sorted || [];

  const getBarColor = (id: number) => {
    if (sortedIds.includes(id)) return "#22c55e"; // green-500
    if (comparingIds.includes(id)) return "#ef4444"; // red-500
    return "#3b82f6"; // blue-500
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-end h-96 border border-gray-200 rounded-lg p-4 bg-gray-50 gap-px">
        <AnimatePresence>
          {currentArray.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ height: 0 }}
              animate={{
                height: `${item.value}%`,
                backgroundColor: getBarColor(item.id),
              }}
              transition={{ duration: 0.3 }}
              style={{ width: `calc(100% / ${ARRAY_SIZE})` }}
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

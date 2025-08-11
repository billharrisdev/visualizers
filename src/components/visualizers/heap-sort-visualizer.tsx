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

export default function HeapSortVisualizer() {
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

  const heapSort = () => {
    const arr = JSON.parse(JSON.stringify(array));
    const steps: AnimationStep[] = [];
    let n = arr.length;

    function heapify(N: number, i: number) {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [arr[i].id, arr[largest].id],
          sorted: arr.slice(n).map((bar: Bar) => bar.id)
      });

      if (l < N && arr[l].value > arr[largest].value)
        largest = l;

      if (r < N && arr[r].value > arr[largest].value)
        largest = r;

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        steps.push({
            array: JSON.parse(JSON.stringify(arr)),
            comparing: [arr[i].id, arr[largest].id],
            sorted: arr.slice(n).map((bar: Bar) => bar.id)
        });
        heapify(N, largest);
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
      heapify(n, i);

    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
       steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [arr[0].id, arr[i].id],
          sorted: arr.slice(i).map((bar: Bar) => bar.id)
      });
      heapify(i, 0);
    }

    steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [],
        sorted: arr.map(bar => bar.id)
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
        <Button onClick={heapSort} disabled={isSorting}>
          Start Heap Sort
        </Button>
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { insertionSort, Bar, AnimationStep } from "@/lib/algorithms"

const ARRAY_SIZE = 50;
const MIN_VALUE = 5;
const MAX_VALUE = 100;
const ANIMATION_SPEED_MS = 50;

export default function InsertionSortVisualizer() {
  const [array, setArray] = useState<Bar[]>([]);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const generateArray = useCallback(() => {
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
    setIsSorting(false);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    if (!isFinished) {
      generateArray();
    }
  }, [generateArray, isFinished]);

  const startSort = () => {
    const steps = insertionSort(array);
    setAnimationSteps(steps);
    setIsSorting(true);
    setIsFinished(false);
  };

  useEffect(() => {
    if (!isSorting) return;
    if (currentStep >= animationSteps.length) {
      setIsSorting(false);
      setIsFinished(true);
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
  const sortedIds = (currentFrame?.sorted || []).concat(
    (currentStep === animationSteps.length - 1 && animationSteps.length > 0)
      ? currentArray.map(bar => bar.id)
      : []
  );


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
        <Button onClick={startSort} disabled={isSorting}>
          Start Insertion Sort
        </Button>
      </div>
    </div>
  );
}

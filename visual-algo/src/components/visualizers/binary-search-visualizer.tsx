"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ARRAY_SIZE = 20;

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [low, setLow] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generateSortedArray();
  }, []);

  const generateSortedArray = () => {
    if (isSearching) return;
    const newArray = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
      newArray.push(i * 3 + Math.floor(Math.random() * 3)); // Create a roughly sorted array
    }
    setArray(newArray);
    resetState();
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    setTarget(randomTarget);
  };

  const resetState = () => {
    setIsSearching(false);
    setLow(null);
    setMid(null);
    setHigh(null);
    setFoundIndex(null);
    setMessage("");
  };

  const binarySearch = async () => {
    setIsSearching(true);
    resetState();
    setMessage("Starting binary search...");

    let lowPtr = 0;
    let highPtr = array.length - 1;
    setLow(lowPtr);
    setHigh(highPtr);
    await new Promise((resolve) => setTimeout(resolve, 500));

    while (lowPtr <= highPtr) {
      const midPtr = Math.floor((lowPtr + highPtr) / 2);
      setMid(midPtr);
      setMessage(`Is ${array[midPtr]} equal to ${target}?`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (array[midPtr] === target) {
        setFoundIndex(midPtr);
        setMessage(`Found target ${target} at index ${midPtr}!`);
        setIsSearching(false);
        return;
      }

      if (array[midPtr] < target) {
        setMessage(`${array[midPtr]} is less than ${target}. Searching right half.`);
        lowPtr = midPtr + 1;
        setLow(lowPtr);
      } else {
        setMessage(`${array[midPtr]} is greater than ${target}. Searching left half.`);
        highPtr = midPtr - 1;
        setHigh(highPtr);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setMessage(`Target ${target} not found in the array.`);
    setIsSearching(false);
  };

  const getBoxClass = (index: number) => {
    if (index === foundIndex) return "bg-green-500 text-white";
    if (index === mid) return "bg-red-500 text-white";
    if (index >= (low ?? -1) && index <= (high ?? -1)) return "bg-blue-300";
    return "bg-gray-200";
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center h-48 border border-gray-200 rounded-lg p-4 bg-gray-50 gap-2">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded transition-all duration-300 ${getBoxClass(idx)}`}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-end gap-4 mt-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="target">Target Value</Label>
          <Input
            id="target"
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isSearching}
            className="w-32"
          />
        </div>
        <Button onClick={generateSortedArray} disabled={isSearching}>
          New Array
        </Button>
        <Button onClick={binarySearch} disabled={isSearching}>
          Search
        </Button>
      </div>
      <div className="text-center mt-4 font-semibold text-lg h-8">
        {message}
      </div>
    </div>
  );
}

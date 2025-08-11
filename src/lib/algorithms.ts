export type Bar = {
  id: number;
  value: number;
};

export type AnimationStep = {
  array: Bar[];
  comparing: number[];
  sorted: number[];
  pivot?: number;
};

export function bubbleSort(array: Bar[]): AnimationStep[] {
  if (array.length === 0) return [];
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

  return steps;
}

export function insertionSort(array: Bar[]): AnimationStep[] {
  if (array.length === 0) return [];
  const arr = JSON.parse(JSON.stringify(array));
  const steps: AnimationStep[] = [];

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    const key = arr[i];

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [key.id, arr[j - 1].id],
      sorted: arr.slice(0, i).map((bar: Bar) => bar.id),
    });

    while (j > 0 && arr[j - 1].value > key.value) {
      arr[j] = arr[j - 1];
      j = j - 1;

      const newArr = JSON.parse(JSON.stringify(arr));
      newArr[j] = key;
      steps.push({
        array: newArr,
        comparing: [key.id, arr[j > 0 ? j - 1 : 0].id],
        sorted: arr.slice(0, i).map((bar: Bar) => bar.id),
      });
    }
    arr[j] = key;
  }

  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    comparing: [],
    sorted: arr.map((bar: Bar) => bar.id),
  });

  return steps;
}

export function selectionSort(array: Bar[]): AnimationStep[] {
  if (array.length === 0) return [];
  const arr = JSON.parse(JSON.stringify(array));
  const steps: AnimationStep[] = [];
  const sorted: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [arr[min_idx].id, arr[j].id],
        sorted: [...sorted],
      });
      if (arr[j].value < arr[min_idx].value) {
        min_idx = j;
      }
    }
    [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
    sorted.push(arr[i].id);
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [],
      sorted: [...sorted],
    });
  }
  sorted.push(arr[arr.length - 1].id);

  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    comparing: [],
    sorted: [...sorted],
  });

  return steps;
}

export function mergeSort(array: Bar[]): AnimationStep[] {
  if (array.length === 0) return [];
  const arr = JSON.parse(JSON.stringify(array));
  const steps: AnimationStep[] = [];

  function merge(l: number, m: number, r: number) {
    const L: Bar[] = arr.slice(l, m + 1);
    const R: Bar[] = arr.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    const merged: Bar[] = [];

    const pushDisplayStep = (comparing: number[] = []) => {
      // Build a display snapshot that replaces the window [l..r]
      // with the partially merged sequence followed by the remaining
      // elements from L and R, ensuring each id appears exactly once.
      const display = arr.slice();
      const windowSlice = [...merged, ...L.slice(i), ...R.slice(j)];
      for (let t = 0; t < windowSlice.length; t++) {
        display[l + t] = windowSlice[t];
      }
      steps.push({
        array: JSON.parse(JSON.stringify(display)),
        comparing,
        sorted: [],
      });
    };

    while (i < L.length && j < R.length) {
      // Show comparison before choosing
      pushDisplayStep([L[i].id, R[j].id]);
      if (L[i].value <= R[j].value) {
        merged.push(L[i]);
        i++;
      } else {
        merged.push(R[j]);
        j++;
      }
      // Show state after placing one element
      pushDisplayStep([]);
    }

    // Drain remaining elements
    while (i < L.length) {
      merged.push(L[i]);
      i++;
      pushDisplayStep([]);
    }
    while (j < R.length) {
      merged.push(R[j]);
      j++;
      pushDisplayStep([]);
    }

    // Commit the merged window back into the working array
    for (let t = 0; t < merged.length; t++) {
      arr[l + t] = merged[t];
    }
  }

  function sort(l: number, r: number) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }

  sort(0, arr.length - 1);

  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    comparing: [],
    sorted: arr.map((bar: Bar) => bar.id),
  });

  return steps;
}

export function quickSort(array: Bar[]): AnimationStep[] {
  if (array.length === 0) return [];
  const arr = JSON.parse(JSON.stringify(array));
  const steps: AnimationStep[] = [];

  function partition(low: number, high: number) {
    const pivot = arr[high];
    let i = low - 1;
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [],
      sorted: [],
      pivot: pivot.id,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [arr[j].id, pivot.id],
        sorted: [],
        pivot: pivot.id,
      });
      if (arr[j].value < pivot.value) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [arr[i].id, arr[j].id],
          sorted: [],
          pivot: pivot.id,
        });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [],
      sorted: [],
      pivot: pivot.id,
    });
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, arr.length - 1);

  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    comparing: [],
    sorted: arr.map((bar: Bar) => bar.id),
  });

  return steps;
}

export function heapSort(array: Bar[]): AnimationStep[] {
  if (array.length === 0) return [];
  const arr = JSON.parse(JSON.stringify(array));
  const steps: AnimationStep[] = [];
  const n = arr.length;

  function heapify(N: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [arr[i].id, arr[largest].id],
      sorted: arr.slice(n).map((bar: Bar) => bar.id),
    });

    if (l < N && arr[l].value > arr[largest].value) largest = l;

    if (r < N && arr[r].value > arr[largest].value) largest = r;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [arr[i].id, arr[largest].id],
        sorted: arr.slice(n).map((bar: Bar) => bar.id),
      });
      heapify(N, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [arr[0].id, arr[i].id],
      sorted: arr.slice(i).map((bar: Bar) => bar.id),
    });
    heapify(i, 0);
  }

  steps.push({
    array: JSON.parse(JSON.stringify(arr)),
    comparing: [],
    sorted: arr.map((bar: Bar) => bar.id),
  });

  return steps;
}

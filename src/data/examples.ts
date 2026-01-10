export interface CodeExample {
  id: string
  name: string
  category: 'sorting' | 'searching' | 'recursion' | 'data-structures'
  description: string
  code: string
}

export const codeExamples: CodeExample[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Simple comparison-based sorting algorithm',
    code: `// Bubble Sort - O(n²) time complexity
function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

let numbers = [64, 34, 25, 12, 22];
console.log("Before:", numbers);

let sorted = bubbleSort(numbers);
console.log("After:", sorted);
`,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Find minimum element and place at beginning',
    code: `// Selection Sort - O(n²) time complexity
function selectionSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find the minimum element
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap if needed
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }

  return arr;
}

let numbers = [64, 25, 12, 22, 11];
console.log("Before:", numbers);

let sorted = selectionSort(numbers);
console.log("After:", sorted);
`,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Build sorted array one element at a time',
    code: `// Insertion Sort - O(n²) time complexity
function insertionSort(arr) {
  let n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    // Move elements greater than key
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }

  return arr;
}

let numbers = [12, 11, 13, 5, 6];
console.log("Before:", numbers);

let sorted = insertionSort(numbers);
console.log("After:", sorted);
`,
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'Efficient search in sorted array - O(log n)',
    code: `// Binary Search - O(log n) time complexity
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      console.log("Found at index:", mid);
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  console.log("Not found");
  return -1;
}

let sortedArr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log("Array:", sortedArr);

let result = binarySearch(sortedArr, 23);
`,
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    description: 'Simple search through each element',
    code: `// Linear Search - O(n) time complexity
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      console.log("Found at index:", i);
      return i;
    }
  }

  console.log("Not found");
  return -1;
}

let numbers = [10, 23, 45, 70, 11, 15];
console.log("Searching in:", numbers);

let result = linearSearch(numbers, 70);
`,
  },
  {
    id: 'fibonacci-recursive',
    name: 'Fibonacci (Recursive)',
    category: 'recursion',
    description: 'Classic recursive example with call stack visualization',
    code: `// Fibonacci - Recursive implementation
// Watch the call stack grow!
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Calculating fibonacci(6)...");
let result = fibonacci(6);
console.log("Result:", result);
`,
  },
  {
    id: 'factorial',
    name: 'Factorial',
    category: 'recursion',
    description: 'Simple recursive function',
    code: `// Factorial - Recursive implementation
function factorial(n) {
  console.log("factorial(" + n + ")");

  if (n <= 1) {
    return 1;
  }

  return n * factorial(n - 1);
}

let result = factorial(5);
console.log("5! =", result);
`,
  },
  {
    id: 'sum-array-recursive',
    name: 'Sum Array (Recursive)',
    category: 'recursion',
    description: 'Recursively sum array elements',
    code: `// Sum array recursively
function sumArray(arr, index) {
  if (index >= arr.length) {
    return 0;
  }

  let current = arr[index];
  let rest = sumArray(arr, index + 1);

  return current + rest;
}

let numbers = [1, 2, 3, 4, 5];
console.log("Array:", numbers);

let total = sumArray(numbers, 0);
console.log("Sum:", total);
`,
  },
  {
    id: 'reverse-array',
    name: 'Reverse Array',
    category: 'data-structures',
    description: 'In-place array reversal',
    code: `// Reverse array in-place
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Swap elements
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    left = left + 1;
    right = right - 1;
  }

  return arr;
}

let numbers = [1, 2, 3, 4, 5];
console.log("Before:", numbers);

reverseArray(numbers);
console.log("After:", numbers);
`,
  },
  {
    id: 'find-max',
    name: 'Find Maximum',
    category: 'data-structures',
    description: 'Find the largest element in array',
    code: `// Find maximum element
function findMax(arr) {
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}

let numbers = [3, 7, 2, 9, 1, 5];
console.log("Array:", numbers);

let maximum = findMax(numbers);
console.log("Maximum:", maximum);
`,
  },
]

export const exampleCategories = [
  { id: 'sorting', name: 'Sorting', icon: '📊' },
  { id: 'searching', name: 'Searching', icon: '🔍' },
  { id: 'recursion', name: 'Recursion', icon: '🔄' },
  { id: 'data-structures', name: 'Data Structures', icon: '📦' },
]

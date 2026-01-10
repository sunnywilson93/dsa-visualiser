export interface CodeExample {
  id: string
  name: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  code: string
}

export const exampleCategories = [
  { id: 'arrays-hashing', name: 'Arrays & Hashing', icon: '📊' },
  { id: 'two-pointers', name: 'Two Pointers', icon: '👆' },
  { id: 'sliding-window', name: 'Sliding Window', icon: '🪟' },
  { id: 'stack', name: 'Stack', icon: '📚' },
  { id: 'binary-search', name: 'Binary Search', icon: '🔍' },
  { id: 'sorting', name: 'Sorting', icon: '📈' },
  { id: 'recursion', name: 'Recursion', icon: '🔄' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🧮' },
  { id: 'greedy', name: 'Greedy', icon: '💰' },
  { id: 'backtracking', name: 'Backtracking', icon: '↩️' },
  { id: 'graphs', name: 'Graphs', icon: '🕸️' },
  { id: 'trees', name: 'Trees', icon: '🌳' },
  { id: 'heap', name: 'Heap', icon: '⛰️' },
  { id: 'intervals', name: 'Intervals', icon: '📏' },
  { id: 'bit-manipulation', name: 'Bit Manipulation', icon: '🔢' },
  { id: 'math', name: 'Math & Geometry', icon: '➗' },
]

export const codeExamples: CodeExample[] = [
  // ==================== ARRAYS & HASHING ====================
  {
    id: 'two-sum',
    name: 'Two Sum',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Find two numbers that add up to target',
    code: `// Two Sum - Find indices of two numbers that add to target
function twoSum(nums, target) {
  let map = {};

  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];

    if (map[complement] !== undefined) {
      console.log("Found pair at indices:", map[complement], i);
      return [map[complement], i];
    }

    map[nums[i]] = i;
  }

  return [];
}

let nums = [2, 7, 11, 15];
let target = 9;
console.log("Array:", nums);
console.log("Target:", target);

let result = twoSum(nums, target);
console.log("Result:", result);
`,
  },
  {
    id: 'contains-duplicate',
    name: 'Contains Duplicate',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Check if array contains any duplicates',
    code: `// Contains Duplicate
function containsDuplicate(nums) {
  let seen = {};

  for (let i = 0; i < nums.length; i++) {
    if (seen[nums[i]]) {
      console.log("Duplicate found:", nums[i]);
      return true;
    }
    seen[nums[i]] = true;
  }

  console.log("No duplicates found");
  return false;
}

let nums = [1, 2, 3, 1];
console.log("Array:", nums);

let result = containsDuplicate(nums);
console.log("Has duplicates:", result);
`,
  },
  {
    id: 'valid-anagram',
    name: 'Valid Anagram',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Check if two strings are anagrams',
    code: `// Valid Anagram
function isAnagram(s, t) {
  if (s.length !== t.length) {
    return false;
  }

  let count = {};

  for (let i = 0; i < s.length; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
    count[t[i]] = (count[t[i]] || 0) - 1;
  }

  for (let key in count) {
    if (count[key] !== 0) {
      return false;
    }
  }

  return true;
}

let s = "anagram";
let t = "nagaram";
console.log("String 1:", s);
console.log("String 2:", t);

let result = isAnagram(s, t);
console.log("Is anagram:", result);
`,
  },
  {
    id: 'group-anagrams',
    name: 'Group Anagrams',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Group strings that are anagrams of each other',
    code: `// Group Anagrams
function groupAnagrams(strs) {
  let map = {};

  for (let i = 0; i < strs.length; i++) {
    let str = strs[i];
    let sorted = str.split("").sort().join("");

    if (!map[sorted]) {
      map[sorted] = [];
    }
    map[sorted].push(str);
  }

  let result = [];
  for (let key in map) {
    result.push(map[key]);
  }

  return result;
}

let strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log("Input:", strs);

let groups = groupAnagrams(strs);
console.log("Groups:", groups);
`,
  },
  {
    id: 'top-k-frequent',
    name: 'Top K Frequent Elements',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Find k most frequent elements',
    code: `// Top K Frequent Elements
function topKFrequent(nums, k) {
  let freq = {};

  // Count frequencies
  for (let i = 0; i < nums.length; i++) {
    freq[nums[i]] = (freq[nums[i]] || 0) + 1;
  }

  // Create buckets
  let buckets = [];
  for (let i = 0; i <= nums.length; i++) {
    buckets.push([]);
  }

  for (let num in freq) {
    buckets[freq[num]].push(Number(num));
  }

  // Collect top k
  let result = [];
  for (let i = buckets.length - 1; i >= 0; i--) {
    for (let j = 0; j < buckets[i].length; j++) {
      result.push(buckets[i][j]);
      if (result.length === k) {
        return result;
      }
    }
  }

  return result;
}

let nums = [1, 1, 1, 2, 2, 3];
let k = 2;
console.log("Array:", nums);
console.log("K:", k);

let result = topKFrequent(nums, k);
console.log("Top K frequent:", result);
`,
  },
  {
    id: 'product-except-self',
    name: 'Product of Array Except Self',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Product of all elements except current',
    code: `// Product of Array Except Self
function productExceptSelf(nums) {
  let n = nums.length;
  let result = [];

  // Left products
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct = leftProduct * nums[i];
  }

  // Right products
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] = result[i] * rightProduct;
    rightProduct = rightProduct * nums[i];
  }

  return result;
}

let nums = [1, 2, 3, 4];
console.log("Input:", nums);

let result = productExceptSelf(nums);
console.log("Output:", result);
`,
  },
  {
    id: 'longest-consecutive',
    name: 'Longest Consecutive Sequence',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Find longest consecutive elements sequence',
    code: `// Longest Consecutive Sequence
function longestConsecutive(nums) {
  let numSet = {};
  for (let i = 0; i < nums.length; i++) {
    numSet[nums[i]] = true;
  }

  let longest = 0;

  for (let i = 0; i < nums.length; i++) {
    let num = nums[i];

    // Only start counting if num-1 doesn't exist
    if (!numSet[num - 1]) {
      let length = 1;

      while (numSet[num + length]) {
        length++;
      }

      if (length > longest) {
        longest = length;
        console.log("New longest starting at", num, "length:", length);
      }
    }
  }

  return longest;
}

let nums = [100, 4, 200, 1, 3, 2];
console.log("Array:", nums);

let result = longestConsecutive(nums);
console.log("Longest consecutive:", result);
`,
  },
  {
    id: 'majority-element',
    name: 'Majority Element',
    category: 'arrays-hashing',
    difficulty: 'easy',
    description: 'Find element appearing more than n/2 times',
    code: `// Majority Element - Boyer-Moore Voting
function majorityElement(nums) {
  let candidate = nums[0];
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
    console.log("i:", i, "candidate:", candidate, "count:", count);
  }

  return candidate;
}

let nums = [2, 2, 1, 1, 1, 2, 2];
console.log("Array:", nums);

let result = majorityElement(nums);
console.log("Majority element:", result);
`,
  },

  // ==================== TWO POINTERS ====================
  {
    id: 'valid-palindrome',
    name: 'Valid Palindrome',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Check if string is palindrome',
    code: `// Valid Palindrome
function isPalindrome(s) {
  let cleaned = "";
  for (let i = 0; i < s.length; i++) {
    let c = s[i].toLowerCase();
    if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
      cleaned = cleaned + c;
    }
  }

  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      console.log("Not palindrome:", cleaned[left], "!=", cleaned[right]);
      return false;
    }
    left++;
    right--;
  }

  return true;
}

let s = "A man a plan a canal Panama";
console.log("String:", s);

let result = isPalindrome(s);
console.log("Is palindrome:", result);
`,
  },
  {
    id: 'two-sum-ii',
    name: 'Two Sum II - Sorted Array',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Two sum in sorted array',
    code: `// Two Sum II - Input Array Is Sorted
function twoSumII(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    let sum = numbers[left] + numbers[right];
    console.log("Checking:", numbers[left], "+", numbers[right], "=", sum);

    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

let numbers = [2, 7, 11, 15];
let target = 9;
console.log("Array:", numbers);
console.log("Target:", target);

let result = twoSumII(numbers, target);
console.log("Indices (1-based):", result);
`,
  },
  {
    id: 'three-sum',
    name: '3Sum',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Find all triplets that sum to zero',
    code: `// 3Sum - Find triplets that sum to zero
function threeSum(nums) {
  // Sort the array first
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) {
        let temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
      }
    }
  }

  let result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        console.log("Found:", nums[i], nums[left], nums[right]);
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

let nums = [-1, 0, 1, 2, -1, -4];
console.log("Array:", nums);

let triplets = threeSum(nums);
console.log("Triplets:", triplets);
`,
  },
  {
    id: 'container-water',
    name: 'Container With Most Water',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Find container that holds most water',
    code: `// Container With Most Water
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    let width = right - left;
    let h = height[left] < height[right] ? height[left] : height[right];
    let water = width * h;

    console.log("left:", left, "right:", right, "water:", water);

    if (water > maxWater) {
      maxWater = water;
    }

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

let height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
console.log("Heights:", height);

let result = maxArea(height);
console.log("Max water:", result);
`,
  },
  {
    id: 'trapping-rain',
    name: 'Trapping Rain Water',
    category: 'two-pointers',
    difficulty: 'hard',
    description: 'Calculate trapped rain water',
    code: `// Trapping Rain Water
function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
        console.log("Add water at", left, ":", leftMax - height[left]);
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
        console.log("Add water at", right, ":", rightMax - height[right]);
      }
      right--;
    }
  }

  return water;
}

let height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
console.log("Heights:", height);

let result = trap(height);
console.log("Total water:", result);
`,
  },
  {
    id: 'move-zeroes',
    name: 'Move Zeroes',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Move all zeros to end of array',
    code: `// Move Zeroes to end
function moveZeroes(nums) {
  let insertPos = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      console.log("Moving", nums[i], "from", i, "to", insertPos);
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }

  while (insertPos < nums.length) {
    nums[insertPos] = 0;
    insertPos++;
  }

  return nums;
}

let nums = [0, 1, 0, 3, 12];
console.log("Before:", nums);

moveZeroes(nums);
console.log("After:", nums);
`,
  },
  {
    id: 'remove-duplicates',
    name: 'Remove Duplicates from Sorted Array',
    category: 'two-pointers',
    difficulty: 'easy',
    description: 'Remove duplicates in-place from sorted array',
    code: `// Remove Duplicates from Sorted Array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let insertPos = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      console.log("Unique element:", nums[i], "at position", insertPos);
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }

  return insertPos;
}

let nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
console.log("Array:", nums);

let k = removeDuplicates(nums);
console.log("Unique count:", k);
console.log("Result:", nums.slice(0, k));
`,
  },

  // ==================== SLIDING WINDOW ====================
  {
    id: 'best-time-buy-sell',
    name: 'Best Time to Buy and Sell Stock',
    category: 'sliding-window',
    difficulty: 'easy',
    description: 'Find maximum profit from buying and selling',
    code: `// Best Time to Buy and Sell Stock
function maxProfit(prices) {
  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
      console.log("New min price:", minPrice);
    }

    let profit = prices[i] - minPrice;
    if (profit > maxProfit) {
      maxProfit = profit;
      console.log("New max profit:", maxProfit);
    }
  }

  return maxProfit;
}

let prices = [7, 1, 5, 3, 6, 4];
console.log("Prices:", prices);

let profit = maxProfit(prices);
console.log("Max profit:", profit);
`,
  },
  {
    id: 'longest-substring-no-repeat',
    name: 'Longest Substring Without Repeating',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Find longest substring without repeating characters',
    code: `// Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  let charIndex = {};
  let maxLen = 0;
  let start = 0;

  for (let i = 0; i < s.length; i++) {
    let char = s[i];

    if (charIndex[char] !== undefined && charIndex[char] >= start) {
      start = charIndex[char] + 1;
      console.log("Duplicate found, new start:", start);
    }

    charIndex[char] = i;
    let len = i - start + 1;

    if (len > maxLen) {
      maxLen = len;
      console.log("New max length:", maxLen, "substring:", s.substring(start, i + 1));
    }
  }

  return maxLen;
}

let s = "abcabcbb";
console.log("String:", s);

let result = lengthOfLongestSubstring(s);
console.log("Longest length:", result);
`,
  },
  {
    id: 'max-sliding-window',
    name: 'Sliding Window Maximum',
    category: 'sliding-window',
    difficulty: 'hard',
    description: 'Find max in each sliding window',
    code: `// Sliding Window Maximum (Simplified)
function maxSlidingWindow(nums, k) {
  let result = [];

  for (let i = 0; i <= nums.length - k; i++) {
    let max = nums[i];

    for (let j = i; j < i + k; j++) {
      if (nums[j] > max) {
        max = nums[j];
      }
    }

    console.log("Window", i, "to", i + k - 1, "max:", max);
    result.push(max);
  }

  return result;
}

let nums = [1, 3, -1, -3, 5, 3, 6, 7];
let k = 3;
console.log("Array:", nums);
console.log("Window size:", k);

let result = maxSlidingWindow(nums, k);
console.log("Max values:", result);
`,
  },
  {
    id: 'min-window-substring',
    name: 'Minimum Window Substring',
    category: 'sliding-window',
    difficulty: 'hard',
    description: 'Find minimum window containing all characters',
    code: `// Minimum Window Substring (Simplified)
function minWindow(s, t) {
  let need = {};
  let have = {};

  for (let i = 0; i < t.length; i++) {
    need[t[i]] = (need[t[i]] || 0) + 1;
  }

  let needCount = Object.keys(need).length;
  let haveCount = 0;
  let minLen = s.length + 1;
  let result = "";
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    let char = s[right];
    have[char] = (have[char] || 0) + 1;

    if (need[char] && have[char] === need[char]) {
      haveCount++;
    }

    while (haveCount === needCount) {
      let len = right - left + 1;
      if (len < minLen) {
        minLen = len;
        result = s.substring(left, right + 1);
        console.log("New min window:", result);
      }

      let leftChar = s[left];
      have[leftChar]--;
      if (need[leftChar] && have[leftChar] < need[leftChar]) {
        haveCount--;
      }
      left++;
    }
  }

  return result;
}

let s = "ADOBECODEBANC";
let t = "ABC";
console.log("S:", s);
console.log("T:", t);

let result = minWindow(s, t);
console.log("Min window:", result);
`,
  },
  {
    id: 'max-subarray-sum-k',
    name: 'Maximum Sum Subarray of Size K',
    category: 'sliding-window',
    difficulty: 'easy',
    description: 'Find max sum of subarray with size k',
    code: `// Maximum Sum Subarray of Size K
function maxSumSubarray(arr, k) {
  let windowSum = 0;
  let maxSum = 0;

  // Calculate first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  console.log("First window sum:", windowSum);

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    console.log("Window ending at", i, "sum:", windowSum);

    if (windowSum > maxSum) {
      maxSum = windowSum;
    }
  }

  return maxSum;
}

let arr = [2, 1, 5, 1, 3, 2];
let k = 3;
console.log("Array:", arr);
console.log("K:", k);

let result = maxSumSubarray(arr, k);
console.log("Max sum:", result);
`,
  },

  // ==================== STACK ====================
  {
    id: 'valid-parentheses',
    name: 'Valid Parentheses',
    category: 'stack',
    difficulty: 'easy',
    description: 'Check if parentheses are balanced',
    code: `// Valid Parentheses
function isValid(s) {
  let stack = [];
  let pairs = { ')': '(', '}': '{', ']': '[' };

  for (let i = 0; i < s.length; i++) {
    let char = s[i];

    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
      console.log("Push:", char, "Stack:", stack);
    } else {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
        console.log("Invalid at:", char);
        return false;
      }
      stack.pop();
      console.log("Pop for:", char, "Stack:", stack);
    }
  }

  return stack.length === 0;
}

let s = "([{}])";
console.log("String:", s);

let result = isValid(s);
console.log("Is valid:", result);
`,
  },
  {
    id: 'min-stack',
    name: 'Min Stack',
    category: 'stack',
    difficulty: 'medium',
    description: 'Stack that supports getMin in O(1)',
    code: `// Min Stack Implementation
let stack = [];
let minStack = [];

function push(val) {
  stack.push(val);
  if (minStack.length === 0 || val <= minStack[minStack.length - 1]) {
    minStack.push(val);
  }
  console.log("Push:", val, "Stack:", stack, "MinStack:", minStack);
}

function pop() {
  let val = stack.pop();
  if (val === minStack[minStack.length - 1]) {
    minStack.pop();
  }
  console.log("Pop:", val, "Stack:", stack, "MinStack:", minStack);
  return val;
}

function getMin() {
  return minStack[minStack.length - 1];
}

// Test operations
push(-2);
push(0);
push(-3);
console.log("Min:", getMin());
pop();
console.log("Min:", getMin());
`,
  },
  {
    id: 'daily-temperatures',
    name: 'Daily Temperatures',
    category: 'stack',
    difficulty: 'medium',
    description: 'Days until warmer temperature',
    code: `// Daily Temperatures
function dailyTemperatures(temperatures) {
  let n = temperatures.length;
  let answer = [];
  for (let i = 0; i < n; i++) answer.push(0);

  let stack = []; // Stack of indices

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      let prevIdx = stack.pop();
      answer[prevIdx] = i - prevIdx;
      console.log("Day", prevIdx, "waits", answer[prevIdx], "days");
    }
    stack.push(i);
  }

  return answer;
}

let temps = [73, 74, 75, 71, 69, 72, 76, 73];
console.log("Temperatures:", temps);

let result = dailyTemperatures(temps);
console.log("Days to wait:", result);
`,
  },
  {
    id: 'eval-rpn',
    name: 'Evaluate Reverse Polish Notation',
    category: 'stack',
    difficulty: 'medium',
    description: 'Evaluate expression in reverse polish notation',
    code: `// Evaluate Reverse Polish Notation
function evalRPN(tokens) {
  let stack = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (token === '+' || token === '-' || token === '*' || token === '/') {
      let b = stack.pop();
      let a = stack.pop();
      let result;

      if (token === '+') result = a + b;
      else if (token === '-') result = a - b;
      else if (token === '*') result = a * b;
      else result = Math.trunc(a / b);

      console.log(a, token, b, "=", result);
      stack.push(result);
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}

let tokens = ["2", "1", "+", "3", "*"];
console.log("Expression:", tokens);

let result = evalRPN(tokens);
console.log("Result:", result);
`,
  },
  {
    id: 'largest-rect-histogram',
    name: 'Largest Rectangle in Histogram',
    category: 'stack',
    difficulty: 'hard',
    description: 'Find largest rectangle in histogram',
    code: `// Largest Rectangle in Histogram
function largestRectangleArea(heights) {
  let stack = [];
  let maxArea = 0;
  let n = heights.length;

  for (let i = 0; i <= n; i++) {
    let h = i === n ? 0 : heights[i];

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      let height = heights[stack.pop()];
      let width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      let area = height * width;
      console.log("Height:", height, "Width:", width, "Area:", area);

      if (area > maxArea) {
        maxArea = area;
      }
    }
    stack.push(i);
  }

  return maxArea;
}

let heights = [2, 1, 5, 6, 2, 3];
console.log("Heights:", heights);

let result = largestRectangleArea(heights);
console.log("Max area:", result);
`,
  },

  // ==================== BINARY SEARCH ====================
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'binary-search',
    difficulty: 'easy',
    description: 'Classic binary search in sorted array',
    code: `// Binary Search
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    console.log("Searching: left=", left, "mid=", mid, "right=", right);

    if (nums[mid] === target) {
      console.log("Found at index:", mid);
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  console.log("Not found");
  return -1;
}

let nums = [-1, 0, 3, 5, 9, 12];
let target = 9;
console.log("Array:", nums);
console.log("Target:", target);

let result = binarySearch(nums, target);
`,
  },
  {
    id: 'search-2d-matrix',
    name: 'Search a 2D Matrix',
    category: 'binary-search',
    difficulty: 'medium',
    description: 'Binary search in sorted 2D matrix',
    code: `// Search a 2D Matrix
function searchMatrix(matrix, target) {
  let m = matrix.length;
  let n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let row = Math.floor(mid / n);
    let col = mid % n;
    let val = matrix[row][col];

    console.log("Checking [", row, "][", col, "] =", val);

    if (val === target) {
      console.log("Found!");
      return true;
    } else if (val < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
}

let matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
let target = 3;
console.log("Target:", target);

let result = searchMatrix(matrix, target);
console.log("Found:", result);
`,
  },
  {
    id: 'find-min-rotated',
    name: 'Find Minimum in Rotated Sorted Array',
    category: 'binary-search',
    difficulty: 'medium',
    description: 'Find min in rotated sorted array',
    code: `// Find Minimum in Rotated Sorted Array
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    console.log("left:", left, "mid:", mid, "right:", right);

    if (nums[mid] > nums[right]) {
      console.log(nums[mid], ">", nums[right], "- min is in right half");
      left = mid + 1;
    } else {
      console.log(nums[mid], "<=", nums[right], "- min is in left half");
      right = mid;
    }
  }

  console.log("Minimum found:", nums[left]);
  return nums[left];
}

let nums = [3, 4, 5, 1, 2];
console.log("Array:", nums);

let result = findMin(nums);
`,
  },
  {
    id: 'search-rotated',
    name: 'Search in Rotated Sorted Array',
    category: 'binary-search',
    difficulty: 'medium',
    description: 'Search in rotated sorted array',
    code: `// Search in Rotated Sorted Array
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    console.log("left:", left, "mid:", mid, "right:", right);

    if (nums[mid] === target) {
      console.log("Found at index:", mid);
      return mid;
    }

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

let nums = [4, 5, 6, 7, 0, 1, 2];
let target = 0;
console.log("Array:", nums);
console.log("Target:", target);

let result = search(nums, target);
console.log("Index:", result);
`,
  },
  {
    id: 'koko-bananas',
    name: 'Koko Eating Bananas',
    category: 'binary-search',
    difficulty: 'medium',
    description: 'Find minimum eating speed',
    code: `// Koko Eating Bananas
function minEatingSpeed(piles, h) {
  let left = 1;
  let right = piles[0];
  for (let i = 1; i < piles.length; i++) {
    if (piles[i] > right) right = piles[i];
  }

  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    let hours = 0;

    for (let i = 0; i < piles.length; i++) {
      hours += Math.ceil(piles[i] / mid);
    }

    console.log("Speed:", mid, "Hours needed:", hours);

    if (hours <= h) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

let piles = [3, 6, 7, 11];
let h = 8;
console.log("Piles:", piles);
console.log("Hours:", h);

let result = minEatingSpeed(piles, h);
console.log("Min speed:", result);
`,
  },
  {
    id: 'first-bad-version',
    name: 'First Bad Version',
    category: 'binary-search',
    difficulty: 'easy',
    description: 'Find first bad version using binary search',
    code: `// First Bad Version
let badVersion = 4;

function isBadVersion(version) {
  return version >= badVersion;
}

function firstBadVersion(n) {
  let left = 1;
  let right = n;

  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    let isBad = isBadVersion(mid);

    console.log("Version:", mid, "isBad:", isBad);

    if (isBad) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

let n = 5;
console.log("Total versions:", n);
console.log("Bad version starts at:", badVersion);

let result = firstBadVersion(n);
console.log("First bad version:", result);
`,
  },

  // ==================== SORTING ====================
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'easy',
    description: 'Simple comparison-based sorting',
    code: `// Bubble Sort - O(n²)
function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        console.log("Swap:", arr[j + 1], "and", arr[j]);
      }
    }
  }

  return arr;
}

let nums = [64, 34, 25, 12, 22];
console.log("Before:", nums);

bubbleSort(nums);
console.log("After:", nums);
`,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    difficulty: 'easy',
    description: 'Find minimum and place at beginning',
    code: `// Selection Sort - O(n²)
function selectionSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      console.log("Swap arr[" + i + "]=" + arr[i] + " with arr[" + minIdx + "]=" + arr[minIdx]);
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }

  return arr;
}

let nums = [64, 25, 12, 22, 11];
console.log("Before:", nums);

selectionSort(nums);
console.log("After:", nums);
`,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'easy',
    description: 'Build sorted array one element at a time',
    code: `// Insertion Sort - O(n²)
function insertionSort(arr) {
  let n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    console.log("Inserting", key);

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
    console.log("Array:", arr);
  }

  return arr;
}

let nums = [12, 11, 13, 5, 6];
console.log("Before:", nums);

insertionSort(nums);
console.log("After:", nums);
`,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    difficulty: 'medium',
    description: 'Divide and conquer sorting',
    code: `// Merge Sort - O(n log n)
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let mid = Math.floor(arr.length / 2);
  let left = [];
  let right = [];

  for (let i = 0; i < mid; i++) {
    left.push(arr[i]);
  }
  for (let i = mid; i < arr.length; i++) {
    right.push(arr[i]);
  }

  console.log("Split:", left, right);

  left = mergeSort(left);
  right = mergeSort(right);

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  console.log("Merged:", result);
  return result;
}

let nums = [38, 27, 43, 3, 9, 82, 10];
console.log("Before:", nums);

let sorted = mergeSort(nums);
console.log("After:", sorted);
`,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    difficulty: 'medium',
    description: 'Efficient divide and conquer sorting',
    code: `// Quick Sort - O(n log n) average
function quickSort(arr, low, high) {
  if (low < high) {
    let pivot = partition(arr, low, high);
    console.log("Pivot at", pivot, "Array:", arr);

    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;

  return i + 1;
}

let nums = [10, 7, 8, 9, 1, 5];
console.log("Before:", nums);

quickSort(nums, 0, nums.length - 1);
console.log("After:", nums);
`,
  },
  {
    id: 'sort-colors',
    name: 'Sort Colors (Dutch National Flag)',
    category: 'sorting',
    difficulty: 'medium',
    description: 'Sort array of 0s, 1s, and 2s',
    code: `// Sort Colors - Dutch National Flag
function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      let temp = nums[low];
      nums[low] = nums[mid];
      nums[mid] = temp;
      low++;
      mid++;
      console.log("Swap 0 to front:", nums);
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      let temp = nums[mid];
      nums[mid] = nums[high];
      nums[high] = temp;
      high--;
      console.log("Swap 2 to back:", nums);
    }
  }
}

let nums = [2, 0, 2, 1, 1, 0];
console.log("Before:", nums);

sortColors(nums);
console.log("After:", nums);
`,
  },

  // ==================== RECURSION ====================
  {
    id: 'fibonacci',
    name: 'Fibonacci',
    category: 'recursion',
    difficulty: 'easy',
    description: 'Classic recursive fibonacci',
    code: `// Fibonacci - Recursive
function fibonacci(n) {
  console.log("fibonacci(" + n + ")");

  if (n <= 1) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

let n = 6;
let result = fibonacci(n);
console.log("fibonacci(" + n + ") =", result);
`,
  },
  {
    id: 'factorial',
    name: 'Factorial',
    category: 'recursion',
    difficulty: 'easy',
    description: 'Calculate n!',
    code: `// Factorial - Recursive
function factorial(n) {
  console.log("factorial(" + n + ")");

  if (n <= 1) {
    return 1;
  }

  return n * factorial(n - 1);
}

let n = 5;
let result = factorial(n);
console.log(n + "! =", result);
`,
  },
  {
    id: 'power',
    name: 'Power Function',
    category: 'recursion',
    difficulty: 'medium',
    description: 'Calculate x^n recursively',
    code: `// Power - x^n using recursion
function power(x, n) {
  console.log("power(" + x + ", " + n + ")");

  if (n === 0) {
    return 1;
  }

  if (n < 0) {
    return 1 / power(x, -n);
  }

  if (n % 2 === 0) {
    let half = power(x, n / 2);
    return half * half;
  } else {
    return x * power(x, n - 1);
  }
}

let x = 2;
let n = 10;
let result = power(x, n);
console.log(x + "^" + n + " =", result);
`,
  },
  {
    id: 'sum-digits',
    name: 'Sum of Digits',
    category: 'recursion',
    difficulty: 'easy',
    description: 'Sum digits of a number recursively',
    code: `// Sum of Digits - Recursive
function sumDigits(n) {
  console.log("sumDigits(" + n + ")");

  if (n < 10) {
    return n;
  }

  return (n % 10) + sumDigits(Math.floor(n / 10));
}

let n = 12345;
let result = sumDigits(n);
console.log("Sum of digits of", n, "=", result);
`,
  },
  {
    id: 'reverse-string-recursive',
    name: 'Reverse String (Recursive)',
    category: 'recursion',
    difficulty: 'easy',
    description: 'Reverse a string recursively',
    code: `// Reverse String - Recursive
function reverseString(s) {
  console.log("reverseString('" + s + "')");

  if (s.length <= 1) {
    return s;
  }

  return reverseString(s.substring(1)) + s[0];
}

let s = "hello";
let result = reverseString(s);
console.log("Reversed:", result);
`,
  },
  {
    id: 'gcd',
    name: 'GCD (Euclidean)',
    category: 'recursion',
    difficulty: 'easy',
    description: 'Find GCD using Euclidean algorithm',
    code: `// GCD - Euclidean Algorithm
function gcd(a, b) {
  console.log("gcd(" + a + ", " + b + ")");

  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}

let a = 48;
let b = 18;
let result = gcd(a, b);
console.log("GCD of", a, "and", b, "=", result);
`,
  },

  // ==================== DYNAMIC PROGRAMMING ====================
  {
    id: 'climbing-stairs',
    name: 'Climbing Stairs',
    category: 'dynamic-programming',
    difficulty: 'easy',
    description: 'Count ways to climb n stairs',
    code: `// Climbing Stairs - DP
function climbStairs(n) {
  if (n <= 2) return n;

  let dp = [0, 1, 2];

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    console.log("dp[" + i + "] =", dp[i]);
  }

  return dp[n];
}

let n = 5;
console.log("Stairs:", n);

let ways = climbStairs(n);
console.log("Ways to climb:", ways);
`,
  },
  {
    id: 'house-robber',
    name: 'House Robber',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Max money without robbing adjacent houses',
    code: `// House Robber - DP
function rob(nums) {
  let n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  let dp = [nums[0], Math.max(nums[0], nums[1])];
  console.log("dp[0] =", dp[0]);
  console.log("dp[1] =", dp[1]);

  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    console.log("dp[" + i + "] = max(" + dp[i-1] + ", " + dp[i-2] + "+" + nums[i] + ") =", dp[i]);
  }

  return dp[n - 1];
}

let houses = [2, 7, 9, 3, 1];
console.log("Houses:", houses);

let maxMoney = rob(houses);
console.log("Max money:", maxMoney);
`,
  },
  {
    id: 'coin-change',
    name: 'Coin Change',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Minimum coins to make amount',
    code: `// Coin Change - DP
function coinChange(coins, amount) {
  let dp = [0];
  for (let i = 1; i <= amount; i++) {
    dp[i] = amount + 1;
  }

  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      if (coins[j] <= i) {
        dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
      }
    }
    if (dp[i] <= amount) {
      console.log("dp[" + i + "] =", dp[i]);
    }
  }

  return dp[amount] > amount ? -1 : dp[amount];
}

let coins = [1, 2, 5];
let amount = 11;
console.log("Coins:", coins);
console.log("Amount:", amount);

let result = coinChange(coins, amount);
console.log("Min coins:", result);
`,
  },
  {
    id: 'longest-increasing-subseq',
    name: 'Longest Increasing Subsequence',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Find length of longest increasing subsequence',
    code: `// Longest Increasing Subsequence - DP
function lengthOfLIS(nums) {
  let n = nums.length;
  let dp = [];
  for (let i = 0; i < n; i++) dp[i] = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    console.log("dp[" + i + "] =", dp[i]);
  }

  let maxLen = dp[0];
  for (let i = 1; i < n; i++) {
    if (dp[i] > maxLen) maxLen = dp[i];
  }

  return maxLen;
}

let nums = [10, 9, 2, 5, 3, 7, 101, 18];
console.log("Array:", nums);

let result = lengthOfLIS(nums);
console.log("LIS length:", result);
`,
  },
  {
    id: 'max-subarray',
    name: 'Maximum Subarray (Kadane)',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Find contiguous subarray with max sum',
    code: `// Maximum Subarray - Kadane's Algorithm
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  console.log("i=0, current:", currentSum, "max:", maxSum);

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
    console.log("i=" + i + ", current:", currentSum, "max:", maxSum);
  }

  return maxSum;
}

let nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Array:", nums);

let result = maxSubArray(nums);
console.log("Max sum:", result);
`,
  },
  {
    id: 'unique-paths',
    name: 'Unique Paths',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Count unique paths in grid',
    code: `// Unique Paths - DP
function uniquePaths(m, n) {
  let dp = [];
  for (let i = 0; i < m; i++) {
    dp[i] = [];
    for (let j = 0; j < n; j++) {
      dp[i][j] = 1;
    }
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      console.log("dp[" + i + "][" + j + "] =", dp[i][j]);
    }
  }

  return dp[m - 1][n - 1];
}

let m = 3;
let n = 7;
console.log("Grid:", m, "x", n);

let paths = uniquePaths(m, n);
console.log("Unique paths:", paths);
`,
  },
  {
    id: 'word-break',
    name: 'Word Break',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Check if string can be segmented into words',
    code: `// Word Break - DP
function wordBreak(s, wordDict) {
  let wordSet = {};
  for (let i = 0; i < wordDict.length; i++) {
    wordSet[wordDict[i]] = true;
  }

  let dp = [true];
  for (let i = 1; i <= s.length; i++) {
    dp[i] = false;
  }

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      let word = s.substring(j, i);
      if (dp[j] && wordSet[word]) {
        dp[i] = true;
        console.log("Found word:", word, "dp[" + i + "] = true");
        break;
      }
    }
  }

  return dp[s.length];
}

let s = "leetcode";
let wordDict = ["leet", "code"];
console.log("String:", s);
console.log("Dictionary:", wordDict);

let result = wordBreak(s, wordDict);
console.log("Can break:", result);
`,
  },
  {
    id: 'longest-palindrome-substring',
    name: 'Longest Palindromic Substring',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Find longest palindromic substring',
    code: `// Longest Palindromic Substring
function longestPalindrome(s) {
  let n = s.length;
  if (n < 2) return s;

  let start = 0;
  let maxLen = 1;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < n && s[left] === s[right]) {
      let len = right - left + 1;
      if (len > maxLen) {
        start = left;
        maxLen = len;
        console.log("Found palindrome:", s.substring(left, right + 1));
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < n; i++) {
    expandAroundCenter(i, i);     // Odd length
    expandAroundCenter(i, i + 1); // Even length
  }

  return s.substring(start, start + maxLen);
}

let s = "babad";
console.log("String:", s);

let result = longestPalindrome(s);
console.log("Longest palindrome:", result);
`,
  },

  // ==================== GREEDY ====================
  {
    id: 'jump-game',
    name: 'Jump Game',
    category: 'greedy',
    difficulty: 'medium',
    description: 'Check if you can reach the last index',
    code: `// Jump Game - Greedy
function canJump(nums) {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) {
      console.log("Cannot reach index", i);
      return false;
    }

    maxReach = Math.max(maxReach, i + nums[i]);
    console.log("At index", i, "maxReach:", maxReach);

    if (maxReach >= nums.length - 1) {
      console.log("Can reach end!");
      return true;
    }
  }

  return true;
}

let nums = [2, 3, 1, 1, 4];
console.log("Array:", nums);

let result = canJump(nums);
console.log("Can jump:", result);
`,
  },
  {
    id: 'jump-game-ii',
    name: 'Jump Game II',
    category: 'greedy',
    difficulty: 'medium',
    description: 'Minimum jumps to reach end',
    code: `// Jump Game II - Greedy
function jump(nums) {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
      console.log("Jump", jumps, "- can reach up to index", currentEnd);
    }
  }

  return jumps;
}

let nums = [2, 3, 1, 1, 4];
console.log("Array:", nums);

let result = jump(nums);
console.log("Min jumps:", result);
`,
  },
  {
    id: 'gas-station',
    name: 'Gas Station',
    category: 'greedy',
    difficulty: 'medium',
    description: 'Find starting station to complete circuit',
    code: `// Gas Station - Greedy
function canCompleteCircuit(gas, cost) {
  let totalGas = 0;
  let totalCost = 0;
  let tank = 0;
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    tank += gas[i] - cost[i];

    console.log("Station", i, "tank:", tank);

    if (tank < 0) {
      start = i + 1;
      tank = 0;
      console.log("Reset start to", start);
    }
  }

  if (totalGas < totalCost) {
    return -1;
  }

  return start;
}

let gas = [1, 2, 3, 4, 5];
let cost = [3, 4, 5, 1, 2];
console.log("Gas:", gas);
console.log("Cost:", cost);

let start = canCompleteCircuit(gas, cost);
console.log("Start station:", start);
`,
  },
  {
    id: 'activity-selection',
    name: 'Activity Selection',
    category: 'greedy',
    difficulty: 'medium',
    description: 'Select maximum non-overlapping activities',
    code: `// Activity Selection - Greedy
function activitySelection(start, end) {
  let n = start.length;

  // Create activities array and sort by end time
  let activities = [];
  for (let i = 0; i < n; i++) {
    activities.push({ start: start[i], end: end[i], id: i });
  }

  // Simple sort by end time
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (activities[i].end > activities[j].end) {
        let temp = activities[i];
        activities[i] = activities[j];
        activities[j] = temp;
      }
    }
  }

  let selected = [activities[0]];
  let lastEnd = activities[0].end;
  console.log("Select activity", activities[0].id);

  for (let i = 1; i < n; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i].end;
      console.log("Select activity", activities[i].id);
    }
  }

  return selected.length;
}

let start = [1, 3, 0, 5, 8, 5];
let end = [2, 4, 6, 7, 9, 9];
console.log("Start times:", start);
console.log("End times:", end);

let count = activitySelection(start, end);
console.log("Max activities:", count);
`,
  },

  // ==================== BACKTRACKING ====================
  {
    id: 'subsets',
    name: 'Subsets',
    category: 'backtracking',
    difficulty: 'medium',
    description: 'Generate all subsets of array',
    code: `// Subsets - Backtracking
function subsets(nums) {
  let result = [];

  function backtrack(start, current) {
    result.push(current.slice());
    console.log("Subset:", current);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

let nums = [1, 2, 3];
console.log("Array:", nums);

let result = subsets(nums);
console.log("Total subsets:", result.length);
`,
  },
  {
    id: 'permutations',
    name: 'Permutations',
    category: 'backtracking',
    difficulty: 'medium',
    description: 'Generate all permutations',
    code: `// Permutations - Backtracking
function permute(nums) {
  let result = [];
  let used = [];
  for (let i = 0; i < nums.length; i++) used.push(false);

  function backtrack(current) {
    if (current.length === nums.length) {
      result.push(current.slice());
      console.log("Permutation:", current);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      current.push(nums[i]);
      backtrack(current);
      current.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return result;
}

let nums = [1, 2, 3];
console.log("Array:", nums);

let result = permute(nums);
console.log("Total permutations:", result.length);
`,
  },
  {
    id: 'combination-sum',
    name: 'Combination Sum',
    category: 'backtracking',
    difficulty: 'medium',
    description: 'Find combinations that sum to target',
    code: `// Combination Sum - Backtracking
function combinationSum(candidates, target) {
  let result = [];

  function backtrack(start, current, sum) {
    if (sum === target) {
      result.push(current.slice());
      console.log("Found:", current);
      return;
    }

    if (sum > target) return;

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return result;
}

let candidates = [2, 3, 6, 7];
let target = 7;
console.log("Candidates:", candidates);
console.log("Target:", target);

let result = combinationSum(candidates, target);
console.log("Combinations found:", result.length);
`,
  },
  {
    id: 'n-queens',
    name: 'N-Queens',
    category: 'backtracking',
    difficulty: 'hard',
    description: 'Place N queens on NxN board',
    code: `// N-Queens - Backtracking
function solveNQueens(n) {
  let result = [];
  let board = [];
  for (let i = 0; i < n; i++) {
    board.push([]);
    for (let j = 0; j < n; j++) {
      board[i].push('.');
    }
  }

  function isValid(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      let solution = [];
      for (let i = 0; i < n; i++) {
        solution.push(board[i].join(''));
      }
      result.push(solution);
      console.log("Solution found!");
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        console.log("Place Q at [" + row + "][" + col + "]");
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  }

  backtrack(0);
  return result;
}

let n = 4;
console.log("N:", n);

let solutions = solveNQueens(n);
console.log("Solutions:", solutions.length);
`,
  },
  {
    id: 'word-search',
    name: 'Word Search',
    category: 'backtracking',
    difficulty: 'medium',
    description: 'Find word in grid',
    code: `// Word Search - Backtracking
function exist(board, word) {
  let m = board.length;
  let n = board[0].length;

  function dfs(i, j, k) {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n) return false;
    if (board[i][j] !== word[k]) return false;

    console.log("Match:", word[k], "at [" + i + "][" + j + "]");

    let temp = board[i][j];
    board[i][j] = '#';

    let found = dfs(i + 1, j, k + 1) ||
                dfs(i - 1, j, k + 1) ||
                dfs(i, j + 1, k + 1) ||
                dfs(i, j - 1, k + 1);

    board[i][j] = temp;
    return found;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }

  return false;
}

let board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
let word = "ABCCED";
console.log("Word:", word);

let result = exist(board, word);
console.log("Found:", result);
`,
  },

  // ==================== GRAPHS ====================
  {
    id: 'num-islands',
    name: 'Number of Islands',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Count number of islands in grid',
    code: `// Number of Islands - DFS
function numIslands(grid) {
  let m = grid.length;
  let n = grid[0].length;
  let count = 0;

  function dfs(i, j) {
    if (i < 0 || i >= m || j < 0 || j >= n) return;
    if (grid[i][j] !== '1') return;

    console.log("Visit land at [" + i + "][" + j + "]");
    grid[i][j] = '0';

    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        console.log("Found island", count);
        dfs(i, j);
      }
    }
  }

  return count;
}

let grid = [
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1']
];

let result = numIslands(grid);
console.log("Number of islands:", result);
`,
  },
  {
    id: 'flood-fill',
    name: 'Flood Fill',
    category: 'graphs',
    difficulty: 'easy',
    description: 'Fill connected region with new color',
    code: `// Flood Fill - DFS
function floodFill(image, sr, sc, color) {
  let m = image.length;
  let n = image[0].length;
  let originalColor = image[sr][sc];

  if (originalColor === color) return image;

  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (image[r][c] !== originalColor) return;

    console.log("Fill [" + r + "][" + c + "] with", color);
    image[r][c] = color;

    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  dfs(sr, sc);
  return image;
}

let image = [[1,1,1],[1,1,0],[1,0,1]];
let sr = 1, sc = 1, color = 2;
console.log("Before:", image);

floodFill(image, sr, sc, color);
console.log("After:", image);
`,
  },
  {
    id: 'rotting-oranges',
    name: 'Rotting Oranges',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Time until all oranges rot',
    code: `// Rotting Oranges - BFS
function orangesRotting(grid) {
  let m = grid.length;
  let n = grid[0].length;
  let queue = [];
  let fresh = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) queue.push([i, j]);
      if (grid[i][j] === 1) fresh++;
    }
  }

  if (fresh === 0) return 0;

  let directions = [[1,0],[-1,0],[0,1],[0,-1]];
  let minutes = 0;

  while (queue.length > 0) {
    let size = queue.length;
    let rotted = false;

    for (let i = 0; i < size; i++) {
      let curr = queue.shift();

      for (let d = 0; d < 4; d++) {
        let ni = curr[0] + directions[d][0];
        let nj = curr[1] + directions[d][1];

        if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
          grid[ni][nj] = 2;
          queue.push([ni, nj]);
          fresh--;
          rotted = true;
          console.log("Rot orange at [" + ni + "][" + nj + "]");
        }
      }
    }

    if (rotted) minutes++;
  }

  return fresh === 0 ? minutes : -1;
}

let grid = [[2,1,1],[1,1,0],[0,1,1]];
console.log("Grid:", grid);

let result = orangesRotting(grid);
console.log("Minutes:", result);
`,
  },
  {
    id: 'course-schedule',
    name: 'Course Schedule',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Check if all courses can be finished',
    code: `// Course Schedule - Topological Sort
function canFinish(numCourses, prerequisites) {
  let graph = [];
  let inDegree = [];

  for (let i = 0; i < numCourses; i++) {
    graph.push([]);
    inDegree.push(0);
  }

  for (let i = 0; i < prerequisites.length; i++) {
    let course = prerequisites[i][0];
    let prereq = prerequisites[i][1];
    graph[prereq].push(course);
    inDegree[course]++;
  }

  let queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let completed = 0;

  while (queue.length > 0) {
    let course = queue.shift();
    completed++;
    console.log("Complete course:", course);

    for (let i = 0; i < graph[course].length; i++) {
      let next = graph[course][i];
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return completed === numCourses;
}

let numCourses = 4;
let prerequisites = [[1,0],[2,0],[3,1],[3,2]];
console.log("Courses:", numCourses);
console.log("Prerequisites:", prerequisites);

let result = canFinish(numCourses, prerequisites);
console.log("Can finish:", result);
`,
  },
  {
    id: 'max-area-island',
    name: 'Max Area of Island',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Find the largest island',
    code: `// Max Area of Island - DFS
function maxAreaOfIsland(grid) {
  let m = grid.length;
  let n = grid[0].length;
  let maxArea = 0;

  function dfs(i, j) {
    if (i < 0 || i >= m || j < 0 || j >= n) return 0;
    if (grid[i][j] !== 1) return 0;

    grid[i][j] = 0;
    let area = 1 + dfs(i+1, j) + dfs(i-1, j) + dfs(i, j+1) + dfs(i, j-1);
    return area;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        let area = dfs(i, j);
        console.log("Island at [" + i + "][" + j + "], area:", area);
        if (area > maxArea) maxArea = area;
      }
    }
  }

  return maxArea;
}

let grid = [[0,0,1,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,1,0,0]];
console.log("Grid rows:", grid.length);

let result = maxAreaOfIsland(grid);
console.log("Max area:", result);
`,
  },

  // ==================== TREES ====================
  {
    id: 'max-depth-tree',
    name: 'Maximum Depth of Binary Tree',
    category: 'trees',
    difficulty: 'easy',
    description: 'Find max depth of binary tree',
    code: `// Maximum Depth of Binary Tree
// Using array representation: [root, left, right, ...]
function maxDepth(tree, index) {
  if (index >= tree.length || tree[index] === null) {
    return 0;
  }

  let leftDepth = maxDepth(tree, 2 * index + 1);
  let rightDepth = maxDepth(tree, 2 * index + 2);

  let depth = 1 + Math.max(leftDepth, rightDepth);
  console.log("Node", tree[index], "depth:", depth);

  return depth;
}

// Tree: [3,9,20,null,null,15,7]
let tree = [3, 9, 20, null, null, 15, 7];
console.log("Tree:", tree);

let depth = maxDepth(tree, 0);
console.log("Max depth:", depth);
`,
  },
  {
    id: 'invert-tree',
    name: 'Invert Binary Tree',
    category: 'trees',
    difficulty: 'easy',
    description: 'Invert/mirror a binary tree',
    code: `// Invert Binary Tree (array representation)
function invertTree(tree, index) {
  if (index >= tree.length || tree[index] === null) {
    return;
  }

  let leftIdx = 2 * index + 1;
  let rightIdx = 2 * index + 2;

  // Swap children
  if (leftIdx < tree.length || rightIdx < tree.length) {
    let temp = tree[leftIdx];
    tree[leftIdx] = tree[rightIdx];
    tree[rightIdx] = temp;
    console.log("Swapped at", index, ":", tree);
  }

  invertTree(tree, leftIdx);
  invertTree(tree, rightIdx);
}

let tree = [4, 2, 7, 1, 3, 6, 9];
console.log("Before:", tree);

invertTree(tree, 0);
console.log("After:", tree);
`,
  },
  {
    id: 'same-tree',
    name: 'Same Tree',
    category: 'trees',
    difficulty: 'easy',
    description: 'Check if two trees are identical',
    code: `// Same Tree (array representation)
function isSameTree(p, q, index) {
  let pVal = index < p.length ? p[index] : null;
  let qVal = index < q.length ? q[index] : null;

  console.log("Compare index", index, ":", pVal, "vs", qVal);

  if (pVal === null && qVal === null) return true;
  if (pVal === null || qVal === null) return false;
  if (pVal !== qVal) return false;

  return isSameTree(p, q, 2 * index + 1) &&
         isSameTree(p, q, 2 * index + 2);
}

let tree1 = [1, 2, 3];
let tree2 = [1, 2, 3];
console.log("Tree 1:", tree1);
console.log("Tree 2:", tree2);

let result = isSameTree(tree1, tree2, 0);
console.log("Same tree:", result);
`,
  },
  {
    id: 'level-order-traversal',
    name: 'Binary Tree Level Order Traversal',
    category: 'trees',
    difficulty: 'medium',
    description: 'BFS level-by-level traversal',
    code: `// Level Order Traversal (array representation)
function levelOrder(tree) {
  if (tree.length === 0 || tree[0] === null) return [];

  let result = [];
  let queue = [0];

  while (queue.length > 0) {
    let levelSize = queue.length;
    let level = [];

    for (let i = 0; i < levelSize; i++) {
      let idx = queue.shift();
      if (idx < tree.length && tree[idx] !== null) {
        level.push(tree[idx]);
        queue.push(2 * idx + 1);
        queue.push(2 * idx + 2);
      }
    }

    if (level.length > 0) {
      console.log("Level:", level);
      result.push(level);
    }
  }

  return result;
}

let tree = [3, 9, 20, null, null, 15, 7];
console.log("Tree:", tree);

let levels = levelOrder(tree);
console.log("Result:", levels);
`,
  },
  {
    id: 'validate-bst',
    name: 'Validate Binary Search Tree',
    category: 'trees',
    difficulty: 'medium',
    description: 'Check if tree is valid BST',
    code: `// Validate BST (array representation)
function isValidBST(tree, index, min, max) {
  if (index >= tree.length || tree[index] === null) {
    return true;
  }

  let val = tree[index];
  console.log("Check node", val, "min:", min, "max:", max);

  if (val <= min || val >= max) {
    console.log("Invalid:", val);
    return false;
  }

  return isValidBST(tree, 2 * index + 1, min, val) &&
         isValidBST(tree, 2 * index + 2, val, max);
}

let tree = [5, 1, 7, null, null, 3, 8];
console.log("Tree:", tree);

let result = isValidBST(tree, 0, -Infinity, Infinity);
console.log("Is valid BST:", result);
`,
  },

  // ==================== HEAP ====================
  {
    id: 'kth-largest',
    name: 'Kth Largest Element',
    category: 'heap',
    difficulty: 'medium',
    description: 'Find kth largest using min-heap',
    code: `// Kth Largest Element (using sorting)
function findKthLargest(nums, k) {
  // Simple approach: sort and return
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] < nums[j]) {
        let temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
      }
    }
    console.log("After pass", i, ":", nums);
  }

  console.log("Sorted descending:", nums);
  return nums[k - 1];
}

let nums = [3, 2, 1, 5, 6, 4];
let k = 2;
console.log("Array:", nums);
console.log("K:", k);

let result = findKthLargest(nums, k);
console.log("Kth largest:", result);
`,
  },
  {
    id: 'last-stone-weight',
    name: 'Last Stone Weight',
    category: 'heap',
    difficulty: 'easy',
    description: 'Smash stones until one or none remains',
    code: `// Last Stone Weight
function lastStoneWeight(stones) {
  while (stones.length > 1) {
    // Sort descending
    for (let i = 0; i < stones.length; i++) {
      for (let j = i + 1; j < stones.length; j++) {
        if (stones[i] < stones[j]) {
          let temp = stones[i];
          stones[i] = stones[j];
          stones[j] = temp;
        }
      }
    }

    console.log("Stones:", stones);

    let first = stones[0];
    let second = stones[1];

    // Remove first two
    stones = stones.slice(2);

    if (first !== second) {
      stones.push(first - second);
      console.log("Smash", first, "and", second, "->", first - second);
    } else {
      console.log("Smash", first, "and", second, "-> both destroyed");
    }
  }

  return stones.length === 0 ? 0 : stones[0];
}

let stones = [2, 7, 4, 1, 8, 1];
console.log("Stones:", stones);

let result = lastStoneWeight(stones);
console.log("Last stone:", result);
`,
  },
  {
    id: 'k-closest-points',
    name: 'K Closest Points to Origin',
    category: 'heap',
    difficulty: 'medium',
    description: 'Find k closest points to origin',
    code: `// K Closest Points to Origin
function kClosest(points, k) {
  // Calculate distances
  let distances = [];
  for (let i = 0; i < points.length; i++) {
    let dist = points[i][0] * points[i][0] + points[i][1] * points[i][1];
    distances.push({ point: points[i], dist: dist });
    console.log("Point", points[i], "distance^2:", dist);
  }

  // Sort by distance
  for (let i = 0; i < distances.length; i++) {
    for (let j = i + 1; j < distances.length; j++) {
      if (distances[i].dist > distances[j].dist) {
        let temp = distances[i];
        distances[i] = distances[j];
        distances[j] = temp;
      }
    }
  }

  // Return k closest
  let result = [];
  for (let i = 0; i < k; i++) {
    result.push(distances[i].point);
  }

  return result;
}

let points = [[1,3],[-2,2],[5,8],[0,1]];
let k = 2;
console.log("Points:", points);
console.log("K:", k);

let result = kClosest(points, k);
console.log("K closest:", result);
`,
  },

  // ==================== INTERVALS ====================
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    category: 'intervals',
    difficulty: 'medium',
    description: 'Merge overlapping intervals',
    code: `// Merge Intervals
function merge(intervals) {
  if (intervals.length <= 1) return intervals;

  // Sort by start time
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (intervals[i][0] > intervals[j][0]) {
        let temp = intervals[i];
        intervals[i] = intervals[j];
        intervals[j] = temp;
      }
    }
  }

  console.log("Sorted:", intervals);

  let result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    let last = result[result.length - 1];
    let current = intervals[i];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
      console.log("Merged to:", last);
    } else {
      result.push(current);
      console.log("Added:", current);
    }
  }

  return result;
}

let intervals = [[1,3],[2,6],[8,10],[15,18]];
console.log("Intervals:", intervals);

let merged = merge(intervals);
console.log("Merged:", merged);
`,
  },
  {
    id: 'insert-interval',
    name: 'Insert Interval',
    category: 'intervals',
    difficulty: 'medium',
    description: 'Insert and merge new interval',
    code: `// Insert Interval
function insert(intervals, newInterval) {
  let result = [];
  let i = 0;

  // Add all intervals before newInterval
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    console.log("Add before:", intervals[i]);
    i++;
  }

  // Merge overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    console.log("Merge with:", intervals[i], "-> ", newInterval);
    i++;
  }
  result.push(newInterval);

  // Add remaining intervals
  while (i < intervals.length) {
    result.push(intervals[i]);
    console.log("Add after:", intervals[i]);
    i++;
  }

  return result;
}

let intervals = [[1,3],[6,9]];
let newInterval = [2,5];
console.log("Intervals:", intervals);
console.log("New interval:", newInterval);

let result = insert(intervals, newInterval);
console.log("Result:", result);
`,
  },
  {
    id: 'non-overlapping',
    name: 'Non-overlapping Intervals',
    category: 'intervals',
    difficulty: 'medium',
    description: 'Min removals for non-overlapping',
    code: `// Non-overlapping Intervals
function eraseOverlapIntervals(intervals) {
  if (intervals.length <= 1) return 0;

  // Sort by end time
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (intervals[i][1] > intervals[j][1]) {
        let temp = intervals[i];
        intervals[i] = intervals[j];
        intervals[j] = temp;
      }
    }
  }

  console.log("Sorted by end:", intervals);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) {
      count++;
      console.log("Remove:", intervals[i]);
    } else {
      prevEnd = intervals[i][1];
      console.log("Keep:", intervals[i]);
    }
  }

  return count;
}

let intervals = [[1,2],[2,3],[3,4],[1,3]];
console.log("Intervals:", intervals);

let result = eraseOverlapIntervals(intervals);
console.log("Removals needed:", result);
`,
  },

  // ==================== BIT MANIPULATION ====================
  {
    id: 'single-number',
    name: 'Single Number',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Find the number appearing once',
    code: `// Single Number - XOR
function singleNumber(nums) {
  let result = 0;

  for (let i = 0; i < nums.length; i++) {
    result = result ^ nums[i];
    console.log("XOR with", nums[i], "=", result);
  }

  return result;
}

let nums = [4, 1, 2, 1, 2];
console.log("Array:", nums);

let result = singleNumber(nums);
console.log("Single number:", result);
`,
  },
  {
    id: 'counting-bits',
    name: 'Counting Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Count 1s in binary for 0 to n',
    code: `// Counting Bits
function countBits(n) {
  let result = [0];

  for (let i = 1; i <= n; i++) {
    // Number of 1s = result[i/2] + (i % 2)
    result[i] = result[Math.floor(i / 2)] + (i % 2);
    console.log(i, "in binary has", result[i], "ones");
  }

  return result;
}

let n = 5;
console.log("N:", n);

let result = countBits(n);
console.log("Bit counts:", result);
`,
  },
  {
    id: 'missing-number',
    name: 'Missing Number',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Find missing number in range',
    code: `// Missing Number - XOR approach
function missingNumber(nums) {
  let n = nums.length;
  let result = n;

  for (let i = 0; i < n; i++) {
    result = result ^ i ^ nums[i];
    console.log("After i=" + i + ":", result);
  }

  return result;
}

let nums = [3, 0, 1];
console.log("Array:", nums);

let missing = missingNumber(nums);
console.log("Missing number:", missing);
`,
  },
  {
    id: 'reverse-bits',
    name: 'Reverse Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Reverse bits of 32-bit integer',
    code: `// Reverse Bits (simplified for visualization)
function reverseBits(n) {
  let result = 0;

  for (let i = 0; i < 32; i++) {
    let bit = n & 1;
    result = (result << 1) | bit;
    n = n >>> 1;

    if (i < 8) { // Show first 8 iterations
      console.log("Iteration", i, "bit:", bit, "result:", result);
    }
  }

  return result >>> 0; // Convert to unsigned
}

let n = 43261596;
console.log("Input:", n);

let result = reverseBits(n);
console.log("Reversed:", result);
`,
  },
  {
    id: 'number-of-1-bits',
    name: 'Number of 1 Bits',
    category: 'bit-manipulation',
    difficulty: 'easy',
    description: 'Count set bits in integer',
    code: `// Number of 1 Bits (Hamming Weight)
function hammingWeight(n) {
  let count = 0;

  while (n !== 0) {
    count += n & 1;
    console.log("Bit:", n & 1, "count:", count);
    n = n >>> 1;
  }

  return count;
}

let n = 11; // Binary: 1011
console.log("Number:", n);

let result = hammingWeight(n);
console.log("Number of 1 bits:", result);
`,
  },

  // ==================== MATH & GEOMETRY ====================
  {
    id: 'rotate-image',
    name: 'Rotate Image',
    category: 'math',
    difficulty: 'medium',
    description: 'Rotate matrix 90 degrees clockwise',
    code: `// Rotate Image 90 degrees clockwise
function rotate(matrix) {
  let n = matrix.length;

  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  console.log("After transpose:", matrix);

  // Reverse each row
  for (let i = 0; i < n; i++) {
    let left = 0;
    let right = n - 1;
    while (left < right) {
      let temp = matrix[i][left];
      matrix[i][left] = matrix[i][right];
      matrix[i][right] = temp;
      left++;
      right--;
    }
  }
  console.log("After reverse:", matrix);
}

let matrix = [[1,2,3],[4,5,6],[7,8,9]];
console.log("Before:", matrix);

rotate(matrix);
console.log("After:", matrix);
`,
  },
  {
    id: 'spiral-matrix',
    name: 'Spiral Matrix',
    category: 'math',
    difficulty: 'medium',
    description: 'Traverse matrix in spiral order',
    code: `// Spiral Matrix
function spiralOrder(matrix) {
  let result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Right
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;
    console.log("After right:", result);

    // Down
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;
    console.log("After down:", result);

    // Left
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }

    // Up
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }

  return result;
}

let matrix = [[1,2,3],[4,5,6],[7,8,9]];
console.log("Matrix:", matrix);

let result = spiralOrder(matrix);
console.log("Spiral:", result);
`,
  },
  {
    id: 'set-matrix-zeroes',
    name: 'Set Matrix Zeroes',
    category: 'math',
    difficulty: 'medium',
    description: 'Set entire row and column to 0',
    code: `// Set Matrix Zeroes
function setZeroes(matrix) {
  let m = matrix.length;
  let n = matrix[0].length;
  let firstRowZero = false;
  let firstColZero = false;

  // Check first row and column
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) firstColZero = true;
  }
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) firstRowZero = true;
  }

  // Mark zeros in first row/column
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
        console.log("Mark zero at [" + i + "][" + j + "]");
      }
    }
  }

  // Set zeros based on marks
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Handle first row/column
  if (firstColZero) {
    for (let i = 0; i < m; i++) matrix[i][0] = 0;
  }
  if (firstRowZero) {
    for (let j = 0; j < n; j++) matrix[0][j] = 0;
  }
}

let matrix = [[1,1,1],[1,0,1],[1,1,1]];
console.log("Before:", matrix);

setZeroes(matrix);
console.log("After:", matrix);
`,
  },
  {
    id: 'happy-number',
    name: 'Happy Number',
    category: 'math',
    difficulty: 'easy',
    description: 'Check if number eventually equals 1',
    code: `// Happy Number
function isHappy(n) {
  let seen = {};

  while (n !== 1 && !seen[n]) {
    seen[n] = true;
    let sum = 0;

    while (n > 0) {
      let digit = n % 10;
      sum += digit * digit;
      n = Math.floor(n / 10);
    }

    console.log("Sum of squares:", sum);
    n = sum;
  }

  return n === 1;
}

let n = 19;
console.log("Number:", n);

let result = isHappy(n);
console.log("Is happy:", result);
`,
  },
  {
    id: 'plus-one',
    name: 'Plus One',
    category: 'math',
    difficulty: 'easy',
    description: 'Add one to number represented as array',
    code: `// Plus One
function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      console.log("Increment at", i, ":", digits);
      return digits;
    }
    digits[i] = 0;
    console.log("Carry at", i, ":", digits);
  }

  // All 9s case
  let result = [1];
  for (let i = 0; i < digits.length; i++) {
    result.push(0);
  }
  return result;
}

let digits = [1, 2, 9];
console.log("Input:", digits);

let result = plusOne(digits);
console.log("Result:", result);
`,
  },
  {
    id: 'power-of-two',
    name: 'Power of Two',
    category: 'math',
    difficulty: 'easy',
    description: 'Check if n is power of 2',
    code: `// Power of Two
function isPowerOfTwo(n) {
  if (n <= 0) return false;

  console.log("n:", n, "binary:", n.toString(2));
  console.log("n-1:", n-1, "binary:", (n-1).toString(2));
  console.log("n & (n-1):", n & (n-1));

  // Power of 2 has only one 1 bit
  return (n & (n - 1)) === 0;
}

let n = 16;
console.log("Number:", n);

let result = isPowerOfTwo(n);
console.log("Is power of 2:", result);
`,
  },
  {
    id: 'palindrome-number',
    name: 'Palindrome Number',
    category: 'math',
    difficulty: 'easy',
    description: 'Check if integer is palindrome',
    code: `// Palindrome Number
function isPalindrome(x) {
  if (x < 0) return false;

  let original = x;
  let reversed = 0;

  while (x > 0) {
    let digit = x % 10;
    reversed = reversed * 10 + digit;
    x = Math.floor(x / 10);
    console.log("Digit:", digit, "Reversed so far:", reversed);
  }

  console.log("Original:", original, "Reversed:", reversed);
  return original === reversed;
}

let x = 121;
console.log("Number:", x);

let result = isPalindrome(x);
console.log("Is palindrome:", result);
`,
  },
]

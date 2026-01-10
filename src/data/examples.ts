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
  { id: 'linked-list', name: 'Linked List', icon: '🔗' },
  { id: 'strings', name: 'Strings', icon: '📝' },
  { id: 'sorting', name: 'Sorting', icon: '📈' },
  { id: 'recursion', name: 'Recursion', icon: '🔄' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🧮' },
  { id: 'greedy', name: 'Greedy', icon: '💰' },
  { id: 'backtracking', name: 'Backtracking', icon: '↩️' },
  { id: 'graphs', name: 'Graphs', icon: '🕸️' },
  { id: 'trees', name: 'Trees', icon: '🌳' },
  { id: 'trie', name: 'Trie', icon: '🌲' },
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
  // ==================== LINKED LIST ====================
  {
    id: 'reverse-linked-list',
    name: 'Reverse Linked List',
    category: 'linked-list',
    difficulty: 'easy',
    description: 'Reverse a singly linked list',
    code: `// Reverse Linked List
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;

  while (current !== null) {
    let next = current.next;
    current.next = prev;
    console.log("Reversing node:", current.val);
    prev = current;
    current = next;
  }

  return prev;
}

// Create: 1 -> 2 -> 3 -> 4 -> 5
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log("Original list: 1 -> 2 -> 3 -> 4 -> 5");
let reversed = reverseList(head);

// Print reversed
let result = [];
let node = reversed;
while (node) {
  result.push(node.val);
  node = node.next;
}
console.log("Reversed:", result.join(" -> "));
`,
  },
  {
    id: 'merge-two-sorted-lists',
    name: 'Merge Two Sorted Lists',
    category: 'linked-list',
    difficulty: 'easy',
    description: 'Merge two sorted linked lists into one sorted list',
    code: `// Merge Two Sorted Lists
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function mergeTwoLists(l1, l2) {
  let dummy = new ListNode(0);
  let current = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      current.next = l1;
      console.log("Taking from L1:", l1.val);
      l1 = l1.next;
    } else {
      current.next = l2;
      console.log("Taking from L2:", l2.val);
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 !== null ? l1 : l2;
  console.log("Appending remaining list");

  return dummy.next;
}

// Create list1: 1 -> 2 -> 4
let l1 = new ListNode(1);
l1.next = new ListNode(2);
l1.next.next = new ListNode(4);

// Create list2: 1 -> 3 -> 4
let l2 = new ListNode(1);
l2.next = new ListNode(3);
l2.next.next = new ListNode(4);

console.log("List 1: 1 -> 2 -> 4");
console.log("List 2: 1 -> 3 -> 4");

let merged = mergeTwoLists(l1, l2);

let result = [];
while (merged) {
  result.push(merged.val);
  merged = merged.next;
}
console.log("Merged:", result.join(" -> "));
`,
  },
  {
    id: 'linked-list-cycle',
    name: 'Linked List Cycle',
    category: 'linked-list',
    difficulty: 'easy',
    description: 'Detect if a linked list has a cycle',
    code: `// Linked List Cycle Detection (Floyd's Algorithm)
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function hasCycle(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    console.log("Slow at:", slow.val, "Fast at:", fast ? fast.val : "null");

    if (slow === fast) {
      console.log("Cycle detected! Pointers met at:", slow.val);
      return true;
    }
  }

  console.log("No cycle found");
  return false;
}

// Create: 1 -> 2 -> 3 -> 4 -> back to 2
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = head.next; // Create cycle

console.log("List: 1 -> 2 -> 3 -> 4 -> (back to 2)");
let result = hasCycle(head);
console.log("Has cycle:", result);
`,
  },
  {
    id: 'remove-nth-from-end',
    name: 'Remove Nth Node From End',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Remove the nth node from the end of a linked list',
    code: `// Remove Nth Node From End of List
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function removeNthFromEnd(head, n) {
  let dummy = new ListNode(0);
  dummy.next = head;
  let fast = dummy;
  let slow = dummy;

  // Move fast n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
    console.log("Moving fast to:", fast ? fast.val : "null");
  }

  // Move both until fast reaches end
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
    console.log("Slow at:", slow.val);
  }

  console.log("Removing node:", slow.next.val);
  slow.next = slow.next.next;

  return dummy.next;
}

// Create: 1 -> 2 -> 3 -> 4 -> 5
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log("Original: 1 -> 2 -> 3 -> 4 -> 5");
console.log("Removing 2nd from end");

let result = removeNthFromEnd(head, 2);

let arr = [];
while (result) {
  arr.push(result.val);
  result = result.next;
}
console.log("Result:", arr.join(" -> "));
`,
  },
  {
    id: 'reorder-list',
    name: 'Reorder List',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Reorder list to L0→Ln→L1→Ln-1→L2→Ln-2→...',
    code: `// Reorder List
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reorderList(head) {
  if (!head || !head.next) return;

  // Find middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  console.log("Middle found at:", slow.val);

  // Reverse second half
  let prev = null, curr = slow.next;
  slow.next = null;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  console.log("Second half reversed");

  // Merge two halves
  let first = head, second = prev;
  while (second) {
    let tmp1 = first.next, tmp2 = second.next;
    first.next = second;
    second.next = tmp1;
    console.log("Linked:", first.val, "->", second.val);
    first = tmp1;
    second = tmp2;
  }
}

// Create: 1 -> 2 -> 3 -> 4 -> 5
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log("Original: 1 -> 2 -> 3 -> 4 -> 5");
reorderList(head);

let result = [];
let node = head;
while (node) {
  result.push(node.val);
  node = node.next;
}
console.log("Reordered:", result.join(" -> "));
`,
  },
  {
    id: 'add-two-numbers',
    name: 'Add Two Numbers',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Add two numbers represented as linked lists',
    code: `// Add Two Numbers
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function addTwoNumbers(l1, l2) {
  let dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;

  while (l1 !== null || l2 !== null || carry > 0) {
    let sum = carry;

    if (l1 !== null) {
      sum += l1.val;
      l1 = l1.next;
    }
    if (l2 !== null) {
      sum += l2.val;
      l2 = l2.next;
    }

    carry = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
    console.log("Sum:", sum, "Digit:", sum % 10, "Carry:", carry);
  }

  return dummy.next;
}

// Number 342 stored as 2 -> 4 -> 3
let l1 = new ListNode(2);
l1.next = new ListNode(4);
l1.next.next = new ListNode(3);

// Number 465 stored as 5 -> 6 -> 4
let l2 = new ListNode(5);
l2.next = new ListNode(6);
l2.next.next = new ListNode(4);

console.log("Num1: 342 (2 -> 4 -> 3)");
console.log("Num2: 465 (5 -> 6 -> 4)");

let result = addTwoNumbers(l1, l2);

let arr = [];
while (result) {
  arr.push(result.val);
  result = result.next;
}
console.log("Sum: 807 (" + arr.join(" -> ") + ")");
`,
  },
  {
    id: 'copy-list-random-pointer',
    name: 'Copy List with Random Pointer',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Deep copy a linked list with random pointers',
    code: `// Copy List with Random Pointer
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.random = null;
  }
}

function copyRandomList(head) {
  if (!head) return null;

  let map = new Map();

  // First pass: create all nodes
  let current = head;
  while (current) {
    map.set(current, new Node(current.val));
    console.log("Created copy of node:", current.val);
    current = current.next;
  }

  // Second pass: set next and random pointers
  current = head;
  while (current) {
    let copy = map.get(current);
    copy.next = map.get(current.next) || null;
    copy.random = map.get(current.random) || null;
    console.log("Node", copy.val, "-> next:", copy.next?.val, "random:", copy.random?.val);
    current = current.next;
  }

  return map.get(head);
}

// Create: 1 -> 2 -> 3, with randoms
let n1 = new Node(1);
let n2 = new Node(2);
let n3 = new Node(3);
n1.next = n2;
n2.next = n3;
n1.random = n3;
n2.random = n1;
n3.random = n2;

console.log("Original list with random pointers:");
console.log("1 -> 2 -> 3");
console.log("1.random = 3, 2.random = 1, 3.random = 2");

let copy = copyRandomList(n1);
console.log("Deep copy created successfully!");
`,
  },
  {
    id: 'lru-cache',
    name: 'LRU Cache',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Implement Least Recently Used cache',
    code: `// LRU Cache using Map (maintains insertion order)
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    console.log("LRU Cache created with capacity:", capacity);
  }

  get(key) {
    if (!this.cache.has(key)) {
      console.log("GET", key, "-> -1 (not found)");
      return -1;
    }

    // Move to end (most recently used)
    let value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    console.log("GET", key, "->", value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      let lru = this.cache.keys().next().value;
      this.cache.delete(lru);
      console.log("Evicted LRU key:", lru);
    }

    this.cache.set(key, value);
    console.log("PUT", key, "=", value, "| Cache:", [...this.cache.entries()]);
  }
}

let cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);
cache.put(3, 3);  // Evicts key 2
cache.get(2);     // Returns -1
cache.put(4, 4);  // Evicts key 1
cache.get(1);     // Returns -1
cache.get(3);     // Returns 3
cache.get(4);     // Returns 4
`,
  },
  // ==================== STRING PROBLEMS ====================
  {
    id: 'longest-palindromic-substring',
    name: 'Longest Palindromic Substring',
    category: 'strings',
    difficulty: 'medium',
    description: 'Find the longest palindromic substring',
    code: `// Longest Palindromic Substring
function longestPalindrome(s) {
  if (s.length < 2) return s;

  let start = 0, maxLen = 1;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
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

  for (let i = 0; i < s.length; i++) {
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
  {
    id: 'palindromic-substrings',
    name: 'Palindromic Substrings',
    category: 'strings',
    difficulty: 'medium',
    description: 'Count all palindromic substrings',
    code: `// Palindromic Substrings - Count all palindromes
function countSubstrings(s) {
  let count = 0;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      console.log("Palindrome found:", s.substring(left, right + 1));
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i);     // Odd length
    expandAroundCenter(i, i + 1); // Even length
  }

  return count;
}

let s = "aaa";
console.log("String:", s);

let result = countSubstrings(s);
console.log("Total palindromic substrings:", result);
`,
  },
  {
    id: 'generate-parentheses',
    name: 'Generate Parentheses',
    category: 'strings',
    difficulty: 'medium',
    description: 'Generate all valid combinations of n pairs of parentheses',
    code: `// Generate Parentheses
function generateParenthesis(n) {
  let result = [];

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      console.log("Valid combination:", current);
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + '(', open + 1, close);
    }
    if (close < open) {
      backtrack(current + ')', open, close + 1);
    }
  }

  backtrack('', 0, 0);
  return result;
}

let n = 3;
console.log("Generate", n, "pairs of parentheses:");

let result = generateParenthesis(n);
console.log("Total combinations:", result.length);
`,
  },
  {
    id: 'decode-ways',
    name: 'Decode Ways',
    category: 'strings',
    difficulty: 'medium',
    description: 'Count ways to decode a numeric string to letters',
    code: `// Decode Ways
function numDecodings(s) {
  if (s[0] === '0') return 0;

  let n = s.length;
  let dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    let oneDigit = parseInt(s[i - 1]);
    let twoDigit = parseInt(s.substring(i - 2, i));

    if (oneDigit >= 1) {
      dp[i] += dp[i - 1];
    }
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }

    console.log("Position", i, "| OneDigit:", oneDigit, "TwoDigit:", twoDigit, "| Ways:", dp[i]);
  }

  return dp[n];
}

let s = "226";
console.log("String:", s);
console.log("(A=1, B=2, ..., Z=26)");

let result = numDecodings(s);
console.log("Number of ways to decode:", result);
// 226 can be: BZ, VF, BBF
`,
  },
  {
    id: 'minimum-window-substring',
    name: 'Minimum Window Substring',
    category: 'strings',
    difficulty: 'hard',
    description: 'Find minimum window containing all characters of target',
    code: `// Minimum Window Substring
function minWindow(s, t) {
  if (t.length > s.length) return "";

  let need = {};
  for (let c of t) {
    need[c] = (need[c] || 0) + 1;
  }

  let have = {};
  let required = Object.keys(need).length;
  let formed = 0;
  let left = 0;
  let minLen = Infinity;
  let result = "";

  for (let right = 0; right < s.length; right++) {
    let char = s[right];
    have[char] = (have[char] || 0) + 1;

    if (need[char] && have[char] === need[char]) {
      formed++;
    }

    while (formed === required) {
      let windowLen = right - left + 1;
      if (windowLen < minLen) {
        minLen = windowLen;
        result = s.substring(left, right + 1);
        console.log("New minimum window:", result);
      }

      let leftChar = s[left];
      have[leftChar]--;
      if (need[leftChar] && have[leftChar] < need[leftChar]) {
        formed--;
      }
      left++;
    }
  }

  return result;
}

let s = "ADOBECODEBANC";
let t = "ABC";
console.log("String:", s);
console.log("Target:", t);

let result = minWindow(s, t);
console.log("Minimum window:", result);
`,
  },
  // ==================== MORE DYNAMIC PROGRAMMING ====================
  {
    id: 'longest-increasing-subsequence',
    name: 'Longest Increasing Subsequence',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Find length of longest strictly increasing subsequence',
    code: `// Longest Increasing Subsequence
function lengthOfLIS(nums) {
  let dp = new Array(nums.length).fill(1);
  let maxLen = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
    console.log("At index", i, "value", nums[i], "| LIS length:", dp[i]);
  }

  console.log("DP array:", dp);
  return maxLen;
}

let nums = [10, 9, 2, 5, 3, 7, 101, 18];
console.log("Array:", nums);

let result = lengthOfLIS(nums);
console.log("Longest increasing subsequence length:", result);
`,
  },
  {
    id: 'coin-change-ii',
    name: 'Coin Change II',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Count combinations to make up amount',
    code: `// Coin Change II - Number of combinations
function change(amount, coins) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
    console.log("After coin", coin + ":", dp);
  }

  return dp[amount];
}

let amount = 5;
let coins = [1, 2, 5];
console.log("Amount:", amount);
console.log("Coins:", coins);

let result = change(amount, coins);
console.log("Number of combinations:", result);
`,
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Find minimum edits to convert word1 to word2',
    code: `// Edit Distance (Levenshtein Distance)
function minDistance(word1, word2) {
  let m = word1.length, n = word2.length;
  let dp = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1).fill(0);
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i-1][j],    // delete
          dp[i][j-1],    // insert
          dp[i-1][j-1]   // replace
        );
      }
    }
    console.log("Row", i + ":", dp[i]);
  }

  return dp[m][n];
}

let word1 = "horse";
let word2 = "ros";
console.log("Word1:", word1);
console.log("Word2:", word2);

let result = minDistance(word1, word2);
console.log("Minimum edits:", result);
`,
  },
  {
    id: 'partition-equal-subset-sum',
    name: 'Partition Equal Subset Sum',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Check if array can be partitioned into two equal sum subsets',
    code: `// Partition Equal Subset Sum
function canPartition(nums) {
  let total = nums.reduce((a, b) => a + b, 0);

  if (total % 2 !== 0) {
    console.log("Total sum is odd, cannot partition");
    return false;
  }

  let target = total / 2;
  console.log("Need to find subset with sum:", target);

  let dp = new Set([0]);

  for (let num of nums) {
    let newSums = new Set();
    for (let sum of dp) {
      let newSum = sum + num;
      if (newSum === target) {
        console.log("Found subset! Added", num, "to reach", target);
        return true;
      }
      if (newSum < target) {
        newSums.add(newSum);
      }
    }
    for (let s of newSums) {
      dp.add(s);
    }
    console.log("After", num + ":", [...dp]);
  }

  return false;
}

let nums = [1, 5, 11, 5];
console.log("Array:", nums);

let result = canPartition(nums);
console.log("Can partition:", result);
`,
  },
  // ==================== MORE TREES ====================
  {
    id: 'binary-tree-level-order',
    name: 'Binary Tree Level Order Traversal',
    category: 'trees',
    difficulty: 'medium',
    description: 'Return level order traversal of binary tree',
    code: `// Binary Tree Level Order Traversal
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function levelOrder(root) {
  if (!root) return [];

  let result = [];
  let queue = [root];

  while (queue.length > 0) {
    let levelSize = queue.length;
    let currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      let node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    console.log("Level", result.length + 1 + ":", currentLevel);
    result.push(currentLevel);
  }

  return result;
}

//     3
//    / \\
//   9  20
//     /  \\
//    15   7
let root = new TreeNode(3);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);

console.log("Tree structure:");
console.log("    3");
console.log("   / \\\\");
console.log("  9  20");
console.log("    / \\\\");
console.log("   15  7");

let result = levelOrder(root);
console.log("Level order:", result);
`,
  },
  {
    id: 'kth-smallest-bst',
    name: 'Kth Smallest Element in BST',
    category: 'trees',
    difficulty: 'medium',
    description: 'Find the kth smallest element in a BST',
    code: `// Kth Smallest Element in BST
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function kthSmallest(root, k) {
  let count = 0;
  let result = null;

  function inorder(node) {
    if (!node || result !== null) return;

    inorder(node.left);

    count++;
    console.log("Visiting node:", node.val, "| Count:", count);
    if (count === k) {
      result = node.val;
      console.log("Found kth smallest!");
      return;
    }

    inorder(node.right);
  }

  inorder(root);
  return result;
}

//     5
//    / \\
//   3   6
//  / \\
// 2   4
// 1
let root = new TreeNode(5);
root.left = new TreeNode(3);
root.right = new TreeNode(6);
root.left.left = new TreeNode(2);
root.left.right = new TreeNode(4);
root.left.left.left = new TreeNode(1);

console.log("BST inorder: 1, 2, 3, 4, 5, 6");
let k = 3;
console.log("Finding", k + "rd smallest:");

let result = kthSmallest(root, k);
console.log("Result:", result);
`,
  },
  {
    id: 'construct-binary-tree',
    name: 'Construct Binary Tree from Traversals',
    category: 'trees',
    difficulty: 'medium',
    description: 'Build tree from preorder and inorder traversals',
    code: `// Construct Binary Tree from Preorder and Inorder
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function buildTree(preorder, inorder) {
  if (!preorder.length || !inorder.length) return null;

  let rootVal = preorder[0];
  let root = new TreeNode(rootVal);
  let mid = inorder.indexOf(rootVal);

  console.log("Root:", rootVal, "| Left inorder:", inorder.slice(0, mid), "| Right inorder:", inorder.slice(mid + 1));

  root.left = buildTree(
    preorder.slice(1, mid + 1),
    inorder.slice(0, mid)
  );

  root.right = buildTree(
    preorder.slice(mid + 1),
    inorder.slice(mid + 1)
  );

  return root;
}

let preorder = [3, 9, 20, 15, 7];
let inorder = [9, 3, 15, 20, 7];

console.log("Preorder:", preorder);
console.log("Inorder:", inorder);
console.log("\\nBuilding tree:");

let root = buildTree(preorder, inorder);

// Verify with level order
function levelOrder(node) {
  if (!node) return [];
  let result = [], queue = [node];
  while (queue.length) {
    let n = queue.shift();
    result.push(n.val);
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }
  return result;
}

console.log("\\nBuilt tree level order:", levelOrder(root));
`,
  },
  {
    id: 'binary-tree-max-path-sum',
    name: 'Binary Tree Maximum Path Sum',
    category: 'trees',
    difficulty: 'hard',
    description: 'Find maximum path sum in binary tree',
    code: `// Binary Tree Maximum Path Sum
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    let leftMax = Math.max(0, dfs(node.left));
    let rightMax = Math.max(0, dfs(node.right));

    let pathSum = node.val + leftMax + rightMax;
    maxSum = Math.max(maxSum, pathSum);

    console.log("Node:", node.val, "| Left:", leftMax, "| Right:", rightMax, "| Path sum:", pathSum);

    return node.val + Math.max(leftMax, rightMax);
  }

  dfs(root);
  return maxSum;
}

//     -10
//     / \\
//    9  20
//      /  \\
//     15   7
let root = new TreeNode(-10);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);

console.log("Tree:");
console.log("   -10");
console.log("   / \\\\");
console.log("  9  20");
console.log("    / \\\\");
console.log("   15  7");

let result = maxPathSum(root);
console.log("\\nMax path sum:", result);
console.log("Path: 15 -> 20 -> 7");
`,
  },
  {
    id: 'serialize-deserialize-tree',
    name: 'Serialize and Deserialize Binary Tree',
    category: 'trees',
    difficulty: 'hard',
    description: 'Serialize tree to string and deserialize back',
    code: `// Serialize and Deserialize Binary Tree
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function serialize(root) {
  let result = [];

  function dfs(node) {
    if (!node) {
      result.push('null');
      return;
    }
    result.push(node.val.toString());
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);
  let str = result.join(',');
  console.log("Serialized:", str);
  return str;
}

function deserialize(data) {
  let values = data.split(',');
  let index = 0;

  function dfs() {
    if (values[index] === 'null') {
      index++;
      return null;
    }

    let node = new TreeNode(parseInt(values[index]));
    console.log("Created node:", node.val);
    index++;
    node.left = dfs();
    node.right = dfs();
    return node;
  }

  return dfs();
}

//     1
//    / \\
//   2   3
//      / \\
//     4   5
let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.right.left = new TreeNode(4);
root.right.right = new TreeNode(5);

console.log("Original tree:");
let serialized = serialize(root);
console.log("\\nDeserializing:");
let deserialized = deserialize(serialized);
console.log("\\nVerification:", serialize(deserialized));
`,
  },
  // ==================== MORE GRAPHS ====================
  {
    id: 'course-schedule-ii',
    name: 'Course Schedule II',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Return order to take courses (topological sort)',
    code: `// Course Schedule II - Topological Sort Order
function findOrder(numCourses, prerequisites) {
  let graph = {};
  let inDegree = new Array(numCourses).fill(0);

  for (let i = 0; i < numCourses; i++) {
    graph[i] = [];
  }

  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }

  console.log("In-degrees:", inDegree);

  let queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  let order = [];
  while (queue.length > 0) {
    let course = queue.shift();
    order.push(course);
    console.log("Taking course:", course);

    for (let next of graph[course]) {
      inDegree[next]--;
      if (inDegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  if (order.length !== numCourses) {
    console.log("Cycle detected - impossible!");
    return [];
  }

  return order;
}

let numCourses = 4;
let prerequisites = [[1,0], [2,0], [3,1], [3,2]];
console.log("Courses:", numCourses);
console.log("Prerequisites:", prerequisites);
console.log("");

let result = findOrder(numCourses, prerequisites);
console.log("\\nCourse order:", result);
`,
  },
  {
    id: 'graph-valid-tree',
    name: 'Graph Valid Tree',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Check if edges form a valid tree',
    code: `// Graph Valid Tree
function validTree(n, edges) {
  // A valid tree has exactly n-1 edges and is connected
  if (edges.length !== n - 1) {
    console.log("Invalid: tree needs exactly", n-1, "edges, got", edges.length);
    return false;
  }

  // Build adjacency list
  let graph = {};
  for (let i = 0; i < n; i++) graph[i] = [];
  for (let [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }

  // BFS to check connectivity
  let visited = new Set();
  let queue = [0];
  visited.add(0);

  while (queue.length > 0) {
    let node = queue.shift();
    console.log("Visiting node:", node);

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  let isValid = visited.size === n;
  console.log("Visited", visited.size, "of", n, "nodes");
  return isValid;
}

let n = 5;
let edges = [[0,1], [0,2], [0,3], [1,4]];
console.log("Nodes:", n);
console.log("Edges:", edges);
console.log("");

let result = validTree(n, edges);
console.log("\\nIs valid tree:", result);
`,
  },
  {
    id: 'word-ladder',
    name: 'Word Ladder',
    category: 'graphs',
    difficulty: 'hard',
    description: 'Find shortest transformation sequence between words',
    code: `// Word Ladder - BFS Shortest Path
function ladderLength(beginWord, endWord, wordList) {
  let wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) {
    console.log("End word not in dictionary");
    return 0;
  }

  let queue = [[beginWord, 1]];
  let visited = new Set([beginWord]);

  while (queue.length > 0) {
    let [word, length] = queue.shift();
    console.log("Level", length + ":", word);

    if (word === endWord) {
      console.log("Found path!");
      return length;
    }

    // Try all single-letter transformations
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) { // a-z
        let newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);

        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, length + 1]);
        }
      }
    }
  }

  console.log("No path found");
  return 0;
}

let beginWord = "hit";
let endWord = "cog";
let wordList = ["hot","dot","dog","lot","log","cog"];

console.log("Start:", beginWord);
console.log("End:", endWord);
console.log("Dictionary:", wordList);
console.log("");

let result = ladderLength(beginWord, endWord, wordList);
console.log("\\nShortest path length:", result);
`,
  },
  {
    id: 'alien-dictionary',
    name: 'Alien Dictionary',
    category: 'graphs',
    difficulty: 'hard',
    description: 'Derive character order from sorted alien words',
    code: `// Alien Dictionary - Topological Sort
function alienOrder(words) {
  // Build graph from adjacent word comparisons
  let graph = {};
  let inDegree = {};

  // Initialize all characters
  for (let word of words) {
    for (let c of word) {
      if (!graph[c]) {
        graph[c] = new Set();
        inDegree[c] = 0;
      }
    }
  }

  // Compare adjacent words
  for (let i = 0; i < words.length - 1; i++) {
    let w1 = words[i], w2 = words[i + 1];

    // Check for invalid case
    if (w1.length > w2.length && w1.startsWith(w2)) {
      console.log("Invalid order:", w1, "before", w2);
      return "";
    }

    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
      if (w1[j] !== w2[j]) {
        if (!graph[w1[j]].has(w2[j])) {
          graph[w1[j]].add(w2[j]);
          inDegree[w2[j]]++;
          console.log("Found order:", w1[j], "->", w2[j]);
        }
        break;
      }
    }
  }

  // Topological sort
  let queue = [];
  for (let c in inDegree) {
    if (inDegree[c] === 0) queue.push(c);
  }

  let result = "";
  while (queue.length > 0) {
    let c = queue.shift();
    result += c;
    for (let next of graph[c]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  if (result.length !== Object.keys(graph).length) {
    console.log("Cycle detected!");
    return "";
  }

  return result;
}

let words = ["wrt", "wrf", "er", "ett", "rftt"];
console.log("Alien words (sorted):", words);
console.log("");

let result = alienOrder(words);
console.log("\\nAlien alphabet order:", result);
`,
  },
  // ==================== TRIE ====================
  {
    id: 'implement-trie',
    name: 'Implement Trie',
    category: 'trie',
    difficulty: 'medium',
    description: 'Implement a prefix tree (Trie)',
    code: `// Implement Trie (Prefix Tree)
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    console.log("Trie initialized");
  }

  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
    console.log("Inserted:", word);
  }

  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        console.log("Search", word + ":", false);
        return false;
      }
      node = node.children[char];
    }
    console.log("Search", word + ":", node.isEnd);
    return node.isEnd;
  }

  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) {
        console.log("Prefix", prefix + ":", false);
        return false;
      }
      node = node.children[char];
    }
    console.log("Prefix", prefix + ":", true);
    return true;
  }
}

let trie = new Trie();
trie.insert("apple");
trie.insert("app");
trie.insert("application");

console.log("");
trie.search("apple");
trie.search("app");
trie.search("appl");
trie.startsWith("app");
trie.startsWith("apl");
`,
  },
  {
    id: 'word-search-ii',
    name: 'Word Search II',
    category: 'trie',
    difficulty: 'hard',
    description: 'Find all words from dictionary in a grid',
    code: `// Word Search II using Trie
class TrieNode {
  constructor() {
    this.children = {};
    this.word = null;
  }
}

function findWords(board, words) {
  // Build trie
  let root = new TrieNode();
  for (let word of words) {
    let node = root;
    for (let c of word) {
      if (!node.children[c]) {
        node.children[c] = new TrieNode();
      }
      node = node.children[c];
    }
    node.word = word;
  }

  let result = [];
  let rows = board.length, cols = board[0].length;

  function dfs(r, c, node) {
    let char = board[r][c];
    if (char === '#' || !node.children[char]) return;

    node = node.children[char];
    if (node.word) {
      console.log("Found word:", node.word);
      result.push(node.word);
      node.word = null; // Avoid duplicates
    }

    board[r][c] = '#'; // Mark visited

    if (r > 0) dfs(r - 1, c, node);
    if (r < rows - 1) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c < cols - 1) dfs(r, c + 1, node);

    board[r][c] = char; // Restore
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root);
    }
  }

  return result;
}

let board = [
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v']
];
let words = ["oath","pea","eat","rain"];

console.log("Board:");
for (let row of board) console.log(row.join(' '));
console.log("\\nWords to find:", words);
console.log("");

let result = findWords(board, words);
console.log("\\nFound words:", result);
`,
  },
  // ==================== MORE BACKTRACKING ====================
  {
    id: 'letter-combinations',
    name: 'Letter Combinations of Phone Number',
    category: 'backtracking',
    difficulty: 'medium',
    description: 'Generate letter combinations from phone digits',
    code: `// Letter Combinations of a Phone Number
function letterCombinations(digits) {
  if (!digits) return [];

  let mapping = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };

  let result = [];

  function backtrack(index, current) {
    if (index === digits.length) {
      console.log("Combination:", current);
      result.push(current);
      return;
    }

    let letters = mapping[digits[index]];
    for (let letter of letters) {
      backtrack(index + 1, current + letter);
    }
  }

  backtrack(0, '');
  return result;
}

let digits = "23";
console.log("Digits:", digits);
console.log("2 -> abc, 3 -> def");
console.log("");

let result = letterCombinations(digits);
console.log("\\nTotal combinations:", result.length);
`,
  },
  {
    id: 'palindrome-partitioning',
    name: 'Palindrome Partitioning',
    category: 'backtracking',
    difficulty: 'medium',
    description: 'Partition string into palindrome substrings',
    code: `// Palindrome Partitioning
function partition(s) {
  let result = [];

  function isPalindrome(str, left, right) {
    while (left < right) {
      if (str[left] !== str[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  function backtrack(start, current) {
    if (start === s.length) {
      console.log("Partition:", current);
      result.push([...current]);
      return;
    }

    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        current.push(s.substring(start, end + 1));
        backtrack(end + 1, current);
        current.pop();
      }
    }
  }

  backtrack(0, []);
  return result;
}

let s = "aab";
console.log("String:", s);
console.log("");

let result = partition(s);
console.log("\\nTotal partitions:", result.length);
`,
  },
  // ==================== MORE HEAP ====================
  {
    id: 'merge-k-sorted-lists',
    name: 'Merge K Sorted Lists',
    category: 'heap',
    difficulty: 'hard',
    description: 'Merge k sorted linked lists into one',
    code: `// Merge K Sorted Lists using Min Heap simulation
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function mergeKLists(lists) {
  // Simple approach: collect all, sort, rebuild
  let values = [];

  for (let list of lists) {
    let node = list;
    while (node) {
      values.push(node.val);
      node = node.next;
    }
  }

  if (values.length === 0) return null;

  values.sort((a, b) => a - b);
  console.log("Collected and sorted:", values);

  let dummy = new ListNode(0);
  let current = dummy;
  for (let val of values) {
    current.next = new ListNode(val);
    current = current.next;
  }

  return dummy.next;
}

// Create lists: [1,4,5], [1,3,4], [2,6]
function createList(arr) {
  let dummy = new ListNode(0);
  let curr = dummy;
  for (let val of arr) {
    curr.next = new ListNode(val);
    curr = curr.next;
  }
  return dummy.next;
}

let lists = [
  createList([1, 4, 5]),
  createList([1, 3, 4]),
  createList([2, 6])
];

console.log("Lists: [1,4,5], [1,3,4], [2,6]");

let result = mergeKLists(lists);

let arr = [];
while (result) {
  arr.push(result.val);
  result = result.next;
}
console.log("Merged:", arr.join(" -> "));
`,
  },
  {
    id: 'find-median-stream',
    name: 'Find Median from Data Stream',
    category: 'heap',
    difficulty: 'hard',
    description: 'Find median efficiently from streaming data',
    code: `// Find Median from Data Stream
// Simplified without actual heap - uses sorted array
class MedianFinder {
  constructor() {
    this.nums = [];
    console.log("MedianFinder initialized");
  }

  addNum(num) {
    // Binary search insert to maintain sorted order
    let left = 0, right = this.nums.length;
    while (left < right) {
      let mid = Math.floor((left + right) / 2);
      if (this.nums[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    this.nums.splice(left, 0, num);
    console.log("Added:", num, "| Sorted:", this.nums);
  }

  findMedian() {
    let n = this.nums.length;
    let median;
    if (n % 2 === 1) {
      median = this.nums[Math.floor(n / 2)];
    } else {
      median = (this.nums[n/2 - 1] + this.nums[n/2]) / 2;
    }
    console.log("Median:", median);
    return median;
  }
}

let mf = new MedianFinder();
mf.addNum(1);
mf.findMedian();
mf.addNum(2);
mf.findMedian();
mf.addNum(3);
mf.findMedian();
mf.addNum(4);
mf.findMedian();
mf.addNum(5);
mf.findMedian();
`,
  },
  // ==================== MORE INTERVALS ====================
  {
    id: 'meeting-rooms-ii',
    name: 'Meeting Rooms II',
    category: 'intervals',
    difficulty: 'medium',
    description: 'Find minimum meeting rooms required',
    code: `// Meeting Rooms II - Minimum rooms needed
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  let starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  let ends = intervals.map(i => i[1]).sort((a, b) => a - b);

  console.log("Starts:", starts);
  console.log("Ends:", ends);

  let rooms = 0;
  let endPtr = 0;

  for (let i = 0; i < intervals.length; i++) {
    if (starts[i] < ends[endPtr]) {
      rooms++;
      console.log("Meeting at", starts[i], "- need new room. Total:", rooms);
    } else {
      console.log("Meeting at", starts[i], "- reusing room (ended at", ends[endPtr] + ")");
      endPtr++;
    }
  }

  return rooms;
}

let intervals = [[0,30], [5,10], [15,20]];
console.log("Meetings:", intervals);
console.log("");

let result = minMeetingRooms(intervals);
console.log("\\nMinimum rooms needed:", result);
`,
  },
  {
    id: 'non-overlapping-intervals',
    name: 'Non-overlapping Intervals',
    category: 'intervals',
    difficulty: 'medium',
    description: 'Minimum removals for non-overlapping intervals',
    code: `// Non-overlapping Intervals
function eraseOverlapIntervals(intervals) {
  if (intervals.length <= 1) return 0;

  intervals.sort((a, b) => a[1] - b[1]);
  console.log("Sorted by end time:", intervals);

  let count = 0;
  let prevEnd = intervals[0][1];
  console.log("Keep:", intervals[0]);

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) {
      count++;
      console.log("Remove:", intervals[i], "(overlaps)");
    } else {
      console.log("Keep:", intervals[i]);
      prevEnd = intervals[i][1];
    }
  }

  return count;
}

let intervals = [[1,2], [2,3], [3,4], [1,3]];
console.log("Intervals:", intervals);
console.log("");

let result = eraseOverlapIntervals(intervals);
console.log("\\nRemove", result, "interval(s)");
`,
  },
  // ==================== MORE GREEDY ====================
  // ==================== MORE BIT MANIPULATION ====================
  {
    id: 'sum-of-two-integers',
    name: 'Sum of Two Integers',
    category: 'bit-manipulation',
    difficulty: 'medium',
    description: 'Add two integers without + or -',
    code: `// Sum of Two Integers without + or -
function getSum(a, b) {
  console.log("Adding", a, "and", b, "without + or -");

  while (b !== 0) {
    let carry = a & b;
    a = a ^ b;
    b = carry << 1;
    console.log("XOR:", a, "| Carry:", carry, "| Shifted:", b);
  }

  return a;
}

let a = 7, b = 5;
console.log("a =", a, "binary:", a.toString(2));
console.log("b =", b, "binary:", b.toString(2));
console.log("");

let result = getSum(a, b);
console.log("\\nSum:", result);
`,
  },
  // ==================== MORE ARRAYS & HASHING ====================
  {
    id: 'first-missing-positive',
    name: 'First Missing Positive',
    category: 'arrays-hashing',
    difficulty: 'hard',
    description: 'Find smallest missing positive integer',
    code: `// First Missing Positive
function firstMissingPositive(nums) {
  let n = nums.length;

  // Place each number in its correct position
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      let correctIdx = nums[i] - 1;
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
      console.log("Swapped to get:", nums);
    }
  }

  console.log("Final array:", nums);

  // Find first missing
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      console.log("Missing at index", i);
      return i + 1;
    }
  }

  return n + 1;
}

let nums = [3, 4, -1, 1];
console.log("Array:", nums);
console.log("");

let result = firstMissingPositive(nums);
console.log("First missing positive:", result);
`,
  },
  {
    id: 'subarray-sum-k',
    name: 'Subarray Sum Equals K',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Count subarrays with sum equal to k',
    code: `// Subarray Sum Equals K
function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  let prefixMap = { 0: 1 };

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];

    if (prefixMap[prefixSum - k] !== undefined) {
      count += prefixMap[prefixSum - k];
      console.log("Found", prefixMap[prefixSum - k], "subarray(s) ending at index", i);
    }

    prefixMap[prefixSum] = (prefixMap[prefixSum] || 0) + 1;
    console.log("Prefix sum:", prefixSum, "| Count:", count);
  }

  return count;
}

let nums = [1, 1, 1];
let k = 2;
console.log("Array:", nums);
console.log("Target:", k);
console.log("");

let result = subarraySum(nums, k);
console.log("\\nSubarrays with sum", k + ":", result);
`,
  },
  {
    id: 'rotate-array',
    name: 'Rotate Array',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Rotate array to the right by k steps',
    code: `// Rotate Array
function rotate(nums, k) {
  k = k % nums.length;

  function reverse(start, end) {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  }

  console.log("Original:", nums);

  reverse(0, nums.length - 1);
  console.log("After full reverse:", nums);

  reverse(0, k - 1);
  console.log("After first k reverse:", nums);

  reverse(k, nums.length - 1);
  console.log("After remaining reverse:", nums);
}

let nums = [1, 2, 3, 4, 5, 6, 7];
let k = 3;
console.log("Rotate by:", k);
console.log("");

rotate(nums, k);
console.log("\\nResult:", nums);
`,
  },
  {
    id: 'find-duplicate',
    name: 'Find the Duplicate Number',
    category: 'arrays-hashing',
    difficulty: 'medium',
    description: 'Find duplicate using Floyd cycle detection',
    code: `// Find Duplicate - Floyd's Cycle Detection
function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];

  // Find intersection
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
    console.log("Slow:", slow, "Fast:", fast);
  } while (slow !== fast);

  // Find cycle start
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
    console.log("Finding start - Slow:", slow, "Fast:", fast);
  }

  return slow;
}

let nums = [1, 3, 4, 2, 2];
console.log("Array:", nums);
console.log("");

let result = findDuplicate(nums);
console.log("\\nDuplicate:", result);
`,
  },
  // ==================== MORE TWO POINTERS ====================
  {
    id: 'trapping-rain-water',
    name: 'Trapping Rain Water',
    category: 'two-pointers',
    difficulty: 'hard',
    description: 'Calculate trapped rainwater between bars',
    code: `// Trapping Rain Water
function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
        console.log("Water at", left + ":", leftMax - height[left]);
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
        console.log("Water at", right + ":", rightMax - height[right]);
      }
      right--;
    }
  }

  return water;
}

let height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
console.log("Heights:", height);
console.log("");

let result = trap(height);
console.log("\\nTotal water:", result);
`,
  },
  {
    id: 'remove-duplicates-ii',
    name: 'Remove Duplicates II',
    category: 'two-pointers',
    difficulty: 'medium',
    description: 'Remove duplicates allowing at most 2 occurrences',
    code: `// Remove Duplicates from Sorted Array II
function removeDuplicates(nums) {
  if (nums.length <= 2) return nums.length;

  let writeIdx = 2;

  for (let i = 2; i < nums.length; i++) {
    if (nums[i] !== nums[writeIdx - 2]) {
      nums[writeIdx] = nums[i];
      console.log("Keeping", nums[i], "at position", writeIdx);
      writeIdx++;
    }
  }

  return writeIdx;
}

let nums = [1, 1, 1, 2, 2, 3];
console.log("Original:", nums);
console.log("");

let k = removeDuplicates(nums);
console.log("\\nLength:", k);
console.log("Result:", nums.slice(0, k));
`,
  },
  // ==================== MORE SLIDING WINDOW ====================
  {
    id: 'sliding-window-maximum',
    name: 'Sliding Window Maximum',
    category: 'sliding-window',
    difficulty: 'hard',
    description: 'Find maximum in each sliding window',
    code: `// Sliding Window Maximum using Deque
function maxSlidingWindow(nums, k) {
  let result = [];
  let deque = []; // Store indices

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }

    // Remove smaller elements
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    if (i >= k - 1) {
      result.push(nums[deque[0]]);
      console.log("Window:", nums.slice(i - k + 1, i + 1), "Max:", nums[deque[0]]);
    }
  }

  return result;
}

let nums = [1, 3, -1, -3, 5, 3, 6, 7];
let k = 3;
console.log("Array:", nums);
console.log("Window size:", k);
console.log("");

let result = maxSlidingWindow(nums, k);
console.log("\\nMaximums:", result);
`,
  },
  {
    id: 'permutation-in-string',
    name: 'Permutation in String',
    category: 'sliding-window',
    difficulty: 'medium',
    description: 'Check if s2 contains permutation of s1',
    code: `// Permutation in String
function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;

  let count1 = new Array(26).fill(0);
  let count2 = new Array(26).fill(0);

  for (let i = 0; i < s1.length; i++) {
    count1[s1.charCodeAt(i) - 97]++;
    count2[s2.charCodeAt(i) - 97]++;
  }

  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (count1[i] === count2[i]) matches++;
  }

  for (let i = 0; i < s2.length - s1.length; i++) {
    if (matches === 26) {
      console.log("Found permutation at index", i);
      return true;
    }

    let left = s2.charCodeAt(i) - 97;
    let right = s2.charCodeAt(i + s1.length) - 97;

    count2[right]++;
    if (count2[right] === count1[right]) matches++;
    else if (count2[right] === count1[right] + 1) matches--;

    count2[left]--;
    if (count2[left] === count1[left]) matches++;
    else if (count2[left] === count1[left] - 1) matches--;
  }

  console.log("Matches:", matches === 26);
  return matches === 26;
}

let s1 = "ab";
let s2 = "eidbaooo";
console.log("s1:", s1);
console.log("s2:", s2);
console.log("");

let result = checkInclusion(s1, s2);
console.log("Contains permutation:", result);
`,
  },
  // ==================== MORE STACK ====================
  {
    id: 'largest-rectangle-histogram',
    name: 'Largest Rectangle in Histogram',
    category: 'stack',
    difficulty: 'hard',
    description: 'Find largest rectangle area in histogram',
    code: `// Largest Rectangle in Histogram
function largestRectangleArea(heights) {
  let stack = [];
  let maxArea = 0;
  heights.push(0); // Sentinel

  for (let i = 0; i < heights.length; i++) {
    while (stack.length && heights[stack[stack.length - 1]] > heights[i]) {
      let h = heights[stack.pop()];
      let w = stack.length ? i - stack[stack.length - 1] - 1 : i;
      let area = h * w;
      maxArea = Math.max(maxArea, area);
      console.log("Height:", h, "Width:", w, "Area:", area);
    }
    stack.push(i);
  }

  heights.pop();
  return maxArea;
}

let heights = [2, 1, 5, 6, 2, 3];
console.log("Heights:", heights);
console.log("");

let result = largestRectangleArea(heights);
console.log("\\nMax area:", result);
`,
  },
  {
    id: 'next-greater-element',
    name: 'Next Greater Element I',
    category: 'stack',
    difficulty: 'easy',
    description: 'Find next greater element for each number',
    code: `// Next Greater Element I
function nextGreaterElement(nums1, nums2) {
  let nextGreater = {};
  let stack = [];

  for (let num of nums2) {
    while (stack.length && stack[stack.length - 1] < num) {
      nextGreater[stack.pop()] = num;
    }
    stack.push(num);
  }

  console.log("Next greater map:", nextGreater);

  return nums1.map(num => nextGreater[num] || -1);
}

let nums1 = [4, 1, 2];
let nums2 = [1, 3, 4, 2];
console.log("nums1:", nums1);
console.log("nums2:", nums2);
console.log("");

let result = nextGreaterElement(nums1, nums2);
console.log("Result:", result);
`,
  },
  {
    id: 'car-fleet',
    name: 'Car Fleet',
    category: 'stack',
    difficulty: 'medium',
    description: 'Count car fleets reaching target',
    code: `// Car Fleet
function carFleet(target, position, speed) {
  let cars = position.map((p, i) => ({
    pos: p,
    time: (target - p) / speed[i]
  }));

  cars.sort((a, b) => b.pos - a.pos);
  console.log("Cars sorted by position:");
  cars.forEach(c => console.log("Pos:", c.pos, "Time:", c.time.toFixed(2)));

  let fleets = 0;
  let lastTime = 0;

  for (let car of cars) {
    if (car.time > lastTime) {
      fleets++;
      lastTime = car.time;
      console.log("New fleet! Total:", fleets);
    }
  }

  return fleets;
}

let target = 12;
let position = [10, 8, 0, 5, 3];
let speed = [2, 4, 1, 1, 3];
console.log("Target:", target);
console.log("Positions:", position);
console.log("Speeds:", speed);
console.log("");

let result = carFleet(target, position, speed);
console.log("\\nNumber of fleets:", result);
`,
  },
  // ==================== MORE BINARY SEARCH ====================
  {
    id: 'search-rotated-array',
    name: 'Search in Rotated Sorted Array',
    category: 'binary-search',
    difficulty: 'medium',
    description: 'Search in rotated sorted array',
    code: `// Search in Rotated Sorted Array
function search(nums, target) {
  let left = 0, right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    console.log("Left:", left, "Mid:", mid, "Right:", right, "| nums[mid]:", nums[mid]);

    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      // Left half is sorted
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
console.log("");

let result = search(nums, target);
console.log("\\nFound at index:", result);
`,
  },
  // ==================== MORE LINKED LIST ====================
  {
    id: 'middle-linked-list',
    name: 'Middle of Linked List',
    category: 'linked-list',
    difficulty: 'easy',
    description: 'Find middle node of linked list',
    code: `// Middle of Linked List
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function middleNode(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    console.log("Slow at:", slow.val, "| Fast at:", fast ? fast.val : "end");
  }

  return slow;
}

// Create: 1 -> 2 -> 3 -> 4 -> 5
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log("List: 1 -> 2 -> 3 -> 4 -> 5");
console.log("");

let result = middleNode(head);
console.log("\\nMiddle node:", result.val);
`,
  },
  {
    id: 'sort-list',
    name: 'Sort List',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Sort linked list in O(n log n) time',
    code: `// Sort List - Merge Sort
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function sortList(head) {
  if (!head || !head.next) return head;

  // Find middle
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  let mid = slow.next;
  slow.next = null;
  console.log("Split into two halves");

  // Sort halves
  let left = sortList(head);
  let right = sortList(mid);

  // Merge
  let dummy = new ListNode(0);
  let curr = dummy;
  while (left && right) {
    if (left.val < right.val) {
      curr.next = left;
      left = left.next;
    } else {
      curr.next = right;
      right = right.next;
    }
    curr = curr.next;
  }
  curr.next = left || right;

  return dummy.next;
}

let head = new ListNode(4);
head.next = new ListNode(2);
head.next.next = new ListNode(1);
head.next.next.next = new ListNode(3);

console.log("Original: 4 -> 2 -> 1 -> 3");
console.log("");

let sorted = sortList(head);

let result = [];
while (sorted) {
  result.push(sorted.val);
  sorted = sorted.next;
}
console.log("\\nSorted:", result.join(" -> "));
`,
  },
  {
    id: 'intersection-two-lists',
    name: 'Intersection of Two Linked Lists',
    category: 'linked-list',
    difficulty: 'easy',
    description: 'Find node where two linked lists intersect',
    code: `// Intersection of Two Linked Lists
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let ptrA = headA;
  let ptrB = headB;

  while (ptrA !== ptrB) {
    console.log("A:", ptrA ? ptrA.val : "null", "| B:", ptrB ? ptrB.val : "null");
    ptrA = ptrA ? ptrA.next : headB;
    ptrB = ptrB ? ptrB.next : headA;
  }

  return ptrA;
}

// Create intersection: 8 -> 4 -> 5
let common = new ListNode(8);
common.next = new ListNode(4);
common.next.next = new ListNode(5);

// List A: 4 -> 1 -> 8 -> 4 -> 5
let headA = new ListNode(4);
headA.next = new ListNode(1);
headA.next.next = common;

// List B: 5 -> 6 -> 1 -> 8 -> 4 -> 5
let headB = new ListNode(5);
headB.next = new ListNode(6);
headB.next.next = new ListNode(1);
headB.next.next.next = common;

console.log("List A: 4 -> 1 -> 8 -> 4 -> 5");
console.log("List B: 5 -> 6 -> 1 -> 8 -> 4 -> 5");
console.log("Intersection at node 8");
console.log("");

let result = getIntersectionNode(headA, headB);
console.log("\\nIntersection:", result ? result.val : null);
`,
  },
  {
    id: 'odd-even-linked-list',
    name: 'Odd Even Linked List',
    category: 'linked-list',
    difficulty: 'medium',
    description: 'Group odd and even positioned nodes',
    code: `// Odd Even Linked List
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function oddEvenList(head) {
  if (!head || !head.next) return head;

  let odd = head;
  let even = head.next;
  let evenHead = even;

  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
    console.log("Odd list ends at:", odd.val);
  }

  odd.next = evenHead;
  return head;
}

let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

console.log("Original: 1 -> 2 -> 3 -> 4 -> 5");
console.log("");

let result = oddEvenList(head);

let arr = [];
while (result) {
  arr.push(result.val);
  result = result.next;
}
console.log("\\nOdd-Even:", arr.join(" -> "));
`,
  },
  // ==================== MORE STRING PROBLEMS ====================
  {
    id: 'reverse-string',
    name: 'Reverse String',
    category: 'strings',
    difficulty: 'easy',
    description: 'Reverse string in-place',
    code: `// Reverse String
function reverseString(s) {
  let left = 0, right = s.length - 1;

  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    console.log("Swapped", left, "and", right + ":", s.join(''));
    left++;
    right--;
  }
}

let s = ["h", "e", "l", "l", "o"];
console.log("Original:", s.join(''));
console.log("");

reverseString(s);
console.log("\\nReversed:", s.join(''));
`,
  },
  {
    id: 'reverse-words',
    name: 'Reverse Words in a String',
    category: 'strings',
    difficulty: 'medium',
    description: 'Reverse order of words in string',
    code: `// Reverse Words in a String
function reverseWords(s) {
  let words = s.trim().split(/\\s+/);
  console.log("Words:", words);

  let left = 0, right = words.length - 1;
  while (left < right) {
    [words[left], words[right]] = [words[right], words[left]];
    left++;
    right--;
  }

  return words.join(' ');
}

let s = "  the sky is blue  ";
console.log("Original: '" + s + "'");
console.log("");

let result = reverseWords(s);
console.log("Reversed:", result);
`,
  },
  {
    id: 'longest-common-prefix',
    name: 'Longest Common Prefix',
    category: 'strings',
    difficulty: 'easy',
    description: 'Find longest common prefix of strings',
    code: `// Longest Common Prefix
function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";

  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      console.log("Shortened prefix to:", prefix);
      if (prefix === "") return "";
    }
    console.log("Matches with:", strs[i]);
  }

  return prefix;
}

let strs = ["flower", "flow", "flight"];
console.log("Strings:", strs);
console.log("");

let result = longestCommonPrefix(strs);
console.log("\\nLongest common prefix:", result);
`,
  },
  {
    id: 'string-to-integer',
    name: 'String to Integer (atoi)',
    category: 'strings',
    difficulty: 'medium',
    description: 'Implement atoi to convert string to integer',
    code: `// String to Integer (atoi)
function myAtoi(s) {
  let i = 0;
  let sign = 1;
  let result = 0;
  let INT_MAX = Math.pow(2, 31) - 1;
  let INT_MIN = -Math.pow(2, 31);

  // Skip whitespace
  while (i < s.length && s[i] === ' ') i++;

  // Check sign
  if (i < s.length && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1;
    console.log("Sign:", sign);
    i++;
  }

  // Convert digits
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    let digit = s[i].charCodeAt(0) - '0'.charCodeAt(0);
    console.log("Digit:", digit, "| Current result:", result);

    // Check overflow
    if (result > Math.floor((INT_MAX - digit) / 10)) {
      return sign === 1 ? INT_MAX : INT_MIN;
    }

    result = result * 10 + digit;
    i++;
  }

  return sign * result;
}

let s = "   -42";
console.log("Input:", s);
console.log("");

let result = myAtoi(s);
console.log("\\nResult:", result);
`,
  },
  {
    id: 'zigzag-conversion',
    name: 'Zigzag Conversion',
    category: 'strings',
    difficulty: 'medium',
    description: 'Convert string to zigzag pattern',
    code: `// Zigzag Conversion
function convert(s, numRows) {
  if (numRows === 1) return s;

  let rows = new Array(numRows).fill('');
  let currRow = 0;
  let goingDown = false;

  for (let c of s) {
    rows[currRow] += c;
    console.log("Row", currRow + ":", rows[currRow]);

    if (currRow === 0 || currRow === numRows - 1) {
      goingDown = !goingDown;
    }

    currRow += goingDown ? 1 : -1;
  }

  return rows.join('');
}

let s = "PAYPALISHIRING";
let numRows = 3;
console.log("String:", s);
console.log("Rows:", numRows);
console.log("");

let result = convert(s, numRows);
console.log("\\nZigzag:", result);
`,
  },
  // ==================== MORE MATRIX ====================
  // ==================== MORE DP ====================
  {
    id: 'decode-ways-ii',
    name: 'House Robber II',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Rob houses in a circle',
    code: `// House Robber II - Circular
function rob(nums) {
  if (nums.length === 1) return nums[0];

  function robRange(start, end) {
    let prev2 = 0, prev1 = 0;
    for (let i = start; i <= end; i++) {
      let curr = Math.max(prev1, prev2 + nums[i]);
      console.log("House", i, "Value:", nums[i], "Max:", curr);
      prev2 = prev1;
      prev1 = curr;
    }
    return prev1;
  }

  console.log("Option 1: Rob houses 0 to n-2");
  let opt1 = robRange(0, nums.length - 2);

  console.log("\\nOption 2: Rob houses 1 to n-1");
  let opt2 = robRange(1, nums.length - 1);

  return Math.max(opt1, opt2);
}

let nums = [2, 3, 2];
console.log("Houses:", nums);
console.log("");

let result = rob(nums);
console.log("\\nMax money:", result);
`,
  },
  {
    id: 'decode-string',
    name: 'Decode String',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Decode string with nested repetitions',
    code: `// Decode String
function decodeString(s) {
  let stack = [];
  let currNum = 0;
  let currStr = '';

  for (let char of s) {
    if (char >= '0' && char <= '9') {
      currNum = currNum * 10 + parseInt(char);
    } else if (char === '[') {
      stack.push([currStr, currNum]);
      console.log("Push:", currStr, currNum);
      currStr = '';
      currNum = 0;
    } else if (char === ']') {
      let [prevStr, num] = stack.pop();
      currStr = prevStr + currStr.repeat(num);
      console.log("Decode:", currStr);
    } else {
      currStr += char;
    }
  }

  return currStr;
}

let s = "3[a2[c]]";
console.log("Encoded:", s);
console.log("");

let result = decodeString(s);
console.log("\\nDecoded:", result);
`,
  },
  {
    id: 'maximal-square',
    name: 'Maximal Square',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'Find largest square of 1s in matrix',
    code: `// Maximal Square
function maximalSquare(matrix) {
  let m = matrix.length, n = matrix[0].length;
  let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  let maxSide = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (matrix[i-1][j-1] === '1') {
        dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
        maxSide = Math.max(maxSide, dp[i][j]);
        console.log("At [" + (i-1) + "][" + (j-1) + "] side:", dp[i][j]);
      }
    }
  }

  return maxSide * maxSide;
}

let matrix = [
  ['1', '0', '1', '0', '0'],
  ['1', '0', '1', '1', '1'],
  ['1', '1', '1', '1', '1'],
  ['1', '0', '0', '1', '0']
];
console.log("Matrix:");
matrix.forEach(row => console.log(row.join(' ')));
console.log("");

let result = maximalSquare(matrix);
console.log("\\nMax square area:", result);
`,
  },
  {
    id: 'palindrome-partitioning-ii',
    name: 'Palindrome Substrings DP',
    category: 'dynamic-programming',
    difficulty: 'medium',
    description: 'DP approach for palindrome checks',
    code: `// Palindrome DP - Check all substrings
function longestPalindromeDP(s) {
  let n = s.length;
  let dp = Array(n).fill(false).map(() => Array(n).fill(false));
  let start = 0, maxLen = 1;

  // All single chars are palindromes
  for (let i = 0; i < n; i++) dp[i][i] = true;

  // Check length 2
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      start = i;
      maxLen = 2;
    }
  }

  // Check length 3+
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      let j = i + len - 1;
      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        start = i;
        maxLen = len;
        console.log("Palindrome:", s.substring(i, j + 1));
      }
    }
  }

  return s.substring(start, start + maxLen);
}

let s = "babad";
console.log("String:", s);
console.log("");

let result = longestPalindromeDP(s);
console.log("\\nLongest palindrome:", result);
`,
  },
  // ==================== MORE MATH ====================
  {
    id: 'pow-x-n',
    name: 'Pow(x, n)',
    category: 'math',
    difficulty: 'medium',
    description: 'Implement power function',
    code: `// Pow(x, n) - Fast exponentiation
function myPow(x, n) {
  if (n === 0) return 1;

  if (n < 0) {
    x = 1 / x;
    n = -n;
  }

  let result = 1;
  while (n > 0) {
    if (n % 2 === 1) {
      result *= x;
      console.log("Multiply result by", x.toFixed(4), "| Result:", result.toFixed(4));
    }
    x *= x;
    n = Math.floor(n / 2);
    console.log("Square x:", x.toFixed(4), "| n:", n);
  }

  return result;
}

let x = 2.0;
let n = 10;
console.log("x:", x, "n:", n);
console.log("");

let result = myPow(x, n);
console.log("\\nResult:", result);
`,
  },
  {
    id: 'sqrt-x',
    name: 'Sqrt(x)',
    category: 'math',
    difficulty: 'easy',
    description: 'Compute square root using binary search',
    code: `// Sqrt(x) - Binary Search
function mySqrt(x) {
  if (x < 2) return x;

  let left = 1, right = Math.floor(x / 2);

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let square = mid * mid;
    console.log("Mid:", mid, "Square:", square);

    if (square === x) {
      return mid;
    } else if (square < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return right;
}

let x = 8;
console.log("Find sqrt of:", x);
console.log("");

let result = mySqrt(x);
console.log("\\nInteger sqrt:", result);
`,
  },
  {
    id: 'trailing-zeroes',
    name: 'Factorial Trailing Zeroes',
    category: 'math',
    difficulty: 'medium',
    description: 'Count trailing zeros in n!',
    code: `// Factorial Trailing Zeroes
function trailingZeroes(n) {
  let count = 0;
  let powerOf5 = 5;

  while (powerOf5 <= n) {
    let multiples = Math.floor(n / powerOf5);
    count += multiples;
    console.log("Multiples of", powerOf5 + ":", multiples);
    powerOf5 *= 5;
  }

  return count;
}

let n = 25;
console.log("n! where n =", n);
console.log("Count multiples of 5:");
console.log("");

let result = trailingZeroes(n);
console.log("\\nTrailing zeroes:", result);
`,
  },
  // ==================== UNION FIND ====================
  {
    id: 'number-of-provinces',
    name: 'Number of Provinces',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Count connected components using Union-Find',
    code: `// Number of Provinces - Union Find
class UnionFind {
  constructor(n) {
    this.parent = Array(n).fill(0).map((_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let px = this.find(x);
    let py = this.find(y);
    if (px === py) return false;

    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    console.log("Union", x, "and", y);
    return true;
  }
}

function findCircleNum(isConnected) {
  let n = isConnected.length;
  let uf = new UnionFind(n);
  let provinces = n;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) {
        if (uf.union(i, j)) {
          provinces--;
        }
      }
    }
  }

  return provinces;
}

let isConnected = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 1]
];
console.log("Connection matrix:");
isConnected.forEach(row => console.log(row));
console.log("");

let result = findCircleNum(isConnected);
console.log("\\nNumber of provinces:", result);
`,
  },
  {
    id: 'redundant-connection',
    name: 'Redundant Connection',
    category: 'graphs',
    difficulty: 'medium',
    description: 'Find edge that creates cycle in tree',
    code: `// Redundant Connection - Union Find
class UnionFind {
  constructor(n) {
    this.parent = Array(n + 1).fill(0).map((_, i) => i);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let px = this.find(x);
    let py = this.find(y);
    if (px === py) return false;
    this.parent[px] = py;
    return true;
  }
}

function findRedundantConnection(edges) {
  let uf = new UnionFind(edges.length);

  for (let [u, v] of edges) {
    if (!uf.union(u, v)) {
      console.log("Cycle found with edge:", [u, v]);
      return [u, v];
    }
    console.log("Added edge:", [u, v]);
  }

  return [];
}

let edges = [[1, 2], [1, 3], [2, 3]];
console.log("Edges:", edges);
console.log("");

let result = findRedundantConnection(edges);
console.log("\\nRedundant edge:", result);
`,
  },
  // ==================== MORE BINARY TREE ====================
  {
    id: 'diameter-binary-tree',
    name: 'Diameter of Binary Tree',
    category: 'trees',
    difficulty: 'easy',
    description: 'Find longest path between any two nodes',
    code: `// Diameter of Binary Tree
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function diameterOfBinaryTree(root) {
  let maxDiameter = 0;

  function depth(node) {
    if (!node) return 0;

    let left = depth(node.left);
    let right = depth(node.right);

    maxDiameter = Math.max(maxDiameter, left + right);
    console.log("Node:", node.val, "| Left:", left, "Right:", right, "Diameter:", left + right);

    return Math.max(left, right) + 1;
  }

  depth(root);
  return maxDiameter;
}

let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log("Tree:");
console.log("    1");
console.log("   / \\\\");
console.log("  2   3");
console.log(" / \\\\");
console.log("4   5");
console.log("");

let result = diameterOfBinaryTree(root);
console.log("\\nDiameter:", result);
`,
  },
  {
    id: 'symmetric-tree',
    name: 'Symmetric Tree',
    category: 'trees',
    difficulty: 'easy',
    description: 'Check if tree is mirror of itself',
    code: `// Symmetric Tree
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function isSymmetric(root) {
  function isMirror(t1, t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;

    console.log("Comparing:", t1.val, "and", t2.val);

    return t1.val === t2.val &&
           isMirror(t1.left, t2.right) &&
           isMirror(t1.right, t2.left);
  }

  return isMirror(root, root);
}

let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(2);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(4);
root.right.left = new TreeNode(4);
root.right.right = new TreeNode(3);

console.log("Tree:");
console.log("    1");
console.log("   / \\\\");
console.log("  2   2");
console.log(" / \\\\ / \\\\");
console.log("3  4 4  3");
console.log("");

let result = isSymmetric(root);
console.log("\\nIs symmetric:", result);
`,
  },
  {
    id: 'flatten-binary-tree',
    name: 'Flatten Binary Tree to Linked List',
    category: 'trees',
    difficulty: 'medium',
    description: 'Flatten tree to linked list in-place',
    code: `// Flatten Binary Tree to Linked List
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function flatten(root) {
  let prev = null;

  function dfs(node) {
    if (!node) return;

    dfs(node.right);
    dfs(node.left);

    node.right = prev;
    node.left = null;
    prev = node;
    console.log("Processed:", node.val);
  }

  dfs(root);
}

let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(5);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(4);
root.right.right = new TreeNode(6);

console.log("Tree: 1 -> (2 -> 3, 4), (5 -> 6)");
console.log("");

flatten(root);

let result = [];
while (root) {
  result.push(root.val);
  root = root.right;
}
console.log("\\nFlattened:", result.join(" -> "));
`,
  },
  {
    id: 'path-sum-ii',
    name: 'Path Sum II',
    category: 'trees',
    difficulty: 'medium',
    description: 'Find all root-to-leaf paths with target sum',
    code: `// Path Sum II
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function pathSum(root, targetSum) {
  let result = [];

  function dfs(node, sum, path) {
    if (!node) return;

    path.push(node.val);
    sum += node.val;

    if (!node.left && !node.right && sum === targetSum) {
      console.log("Found path:", path);
      result.push([...path]);
    }

    dfs(node.left, sum, path);
    dfs(node.right, sum, path);

    path.pop();
  }

  dfs(root, 0, []);
  return result;
}

let root = new TreeNode(5);
root.left = new TreeNode(4);
root.right = new TreeNode(8);
root.left.left = new TreeNode(11);
root.left.left.left = new TreeNode(7);
root.left.left.right = new TreeNode(2);
root.right.left = new TreeNode(13);
root.right.right = new TreeNode(4);
root.right.right.left = new TreeNode(5);
root.right.right.right = new TreeNode(1);

let targetSum = 22;
console.log("Target sum:", targetSum);
console.log("");

let result = pathSum(root, targetSum);
console.log("\\nPaths found:", result.length);
`,
  },
  {
    id: 'lowest-common-ancestor',
    name: 'Lowest Common Ancestor',
    category: 'trees',
    difficulty: 'medium',
    description: 'Find LCA of two nodes in binary tree',
    code: `// Lowest Common Ancestor of Binary Tree
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) {
    console.log("Base case at:", root ? root.val : null);
    return root;
  }

  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);

  if (left && right) {
    console.log("LCA found at:", root.val);
    return root;
  }

  return left || right;
}

let root = new TreeNode(3);
root.left = new TreeNode(5);
root.right = new TreeNode(1);
root.left.left = new TreeNode(6);
root.left.right = new TreeNode(2);
root.right.left = new TreeNode(0);
root.right.right = new TreeNode(8);

let p = root.left;       // Node 5
let q = root.left.right; // Node 2

console.log("Find LCA of", p.val, "and", q.val);
console.log("");

let result = lowestCommonAncestor(root, p, q);
console.log("\\nLCA:", result.val);
`,
  },
]

// Code and trace snippets for the Kadane lesson. Kept in a separate file
// because MDX frontmatter can't reliably contain template literals with
// `{` and `}` (MDX 3 parses those as JSX expression delimiters).
export const kadaneCode = `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];

    for (int i = 1; i < nums.size(); i++) {
        // Either extend the existing subarray or start new
        currentSum = max(nums[i], currentSum + nums[i]);

        // Update the maximum sum found so far
        maxSum = max(maxSum, currentSum);
    }

    return maxSum;
}

// Alternative implementation with clearer logic
int maxSubArrayAlt(vector<int>& nums) {
    int maxSum = INT_MIN;
    int currentSum = 0;

    for (int num : nums) {
        currentSum += num;
        maxSum = max(maxSum, currentSum);

        // If current sum becomes negative, reset it
        if (currentSum < 0) {
            currentSum = 0;
        }
    }

    return maxSum;
}`;

export const exampleTrace = `Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Step by step:
i=0: current=-2, max=-2
i=1: current=1,  max=1   (start new subarray)
i=2: current=-2, max=1
i=3: current=4,  max=4   (start new subarray)
i=4: current=3,  max=4
i=5: current=5,  max=5
i=6: current=6,  max=6
i=7: current=1,  max=6
i=8: current=5,  max=6

Maximum sum: 6`;

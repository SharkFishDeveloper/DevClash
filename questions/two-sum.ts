export default {
  slug: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  description: `
# Two Sum

## Description

Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

### Example Input
\`\`\`js
nums = [2, 7, 11, 15]
target = 9
\`\`\`

### Expected Output
\`\`\`js
[0, 1]
\`\`\`

### Explanation
\`nums[0] + nums[1] == 9\`, so return \`[0, 1]\`.
  `,

  code: {
    js: {
      boilerplate: `function twoSum(nums, target) {
  // Write your code here
}`,
      wrapper: `
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });
const lines = [];

rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const nums = lines[0].split(' ').map(Number);
  const target = parseInt(lines[1]);
  const result = twoSum(nums, target);
  console.log(JSON.stringify(result));
});
`,
    },

    python: {
      boilerplate: `def two_sum(nums, target):
    # Write your code here
    pass`,
      wrapper: `
if __name__ == "__main__":
    import sys, json
    input_lines = [line.strip() for line in sys.stdin]
    nums = list(map(int, input_lines[0].split()))
    target = int(input_lines[1])
    result = two_sum(nums, target)
    print(json.dumps(result))
`,
    },

    cpp: {
      boilerplate: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}`,
      wrapper: `
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target);

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int num;
    while (iss >> num) nums.push_back(num);

    int target;
    cin >> target;

    vector<int> result = twoSum(nums, target);
    for (int i = 0; i < result.size(); ++i) {
        cout << result[i];
        if (i != result.size() - 1) cout << " ";
    }
    cout << endl;
    return 0;
}
`,
    },

    java: {
      boilerplate: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }`,
      wrapper: `
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] tokens = sc.nextLine().split(" ");
        int[] nums = Arrays.stream(tokens).mapToInt(Integer::parseInt).toArray();
        int target = Integer.parseInt(sc.nextLine());

        int[] result = twoSum(nums, target);
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i != result.length - 1) System.out.print(" ");
        }
        System.out.println();
    }
}
`,
    },
  },

  testcases: [
    {
      input: "2 7 11 15\n9",
      expectedOutput: "[0,1]",
    },
    {
      input: "3 2 4\n6",
      expectedOutput: "[1,2]",
    },
    {
      input: "3 3\n6",
      expectedOutput: "[0,1]",
    }
  ]
};

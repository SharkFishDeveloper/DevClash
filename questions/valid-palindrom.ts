// valid-palindrome.ts
export default {
  slug: 'valid-palindrome',
  title: 'Valid Palindrome',
  difficulty: 'Easy',
  description: `
  # Valid Palindrome

  ## Description
  Check whether a given string is a palindrome after converting all characters to lowercase and removing non-alphanumeric characters.

  ### Example Input
  \`\`\`js
  s = "A man, a plan, a canal: Panama"
  \`\`\`

  ### Expected Output
  \`\`\`js
  true
  \`\`\`

  ### Explanation
  After cleaning the string, it becomes \`amanaplanacanalpanama\`, which is a palindrome.
  `,
  code: {
    js: {
      boilerplate: `function isPalindrome(s) {
  // Write your logic here
}`,
      wrapper: `
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];

rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const s = lines[0];
  const result = isPalindrome(s);
  console.log(result);
});
`,
    },
    python: {
      boilerplate: `def is_palindrome(s):
    # Write your logic here
    pass`,
      wrapper: `
if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    result = is_palindrome(s)
    print(result)
`,
    },
    cpp: {
      boilerplate: `#include <string>
using namespace std;

bool isPalindrome(string s) {
    // Write your logic here
    return false;
}`,
      wrapper: `
#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s);

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    java: {
      boilerplate: `public class Main {
    public static boolean isPalindrome(String s) {
        // Write your logic here
        return false;
    }`,
      wrapper: `
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isPalindrome(s));
    }
}
`,
    },
  },
  testcases: [
    {
      input: "A man, a plan, a canal: Panama",
      expectedOutput: "true",
    },
    {
      input: "race a car",
      expectedOutput: "false",
    }
  ]
};

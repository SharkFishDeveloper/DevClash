// is-anagram.ts
export default {
  slug: 'is-anagram',
  title: 'Valid Anagram',
  difficulty: 'Easy',
  description: `
  # Valid Anagram

  ## Description
  Determine whether two strings are anagrams of each other.

  ### Example Input
  \`\`\`js
  s = "anagram"
  t = "nagaram"
  \`\`\`

  ### Expected Output
  \`\`\`js
  true
  \`\`\`

  ### Explanation
  Both strings contain the same characters with the same frequencies.
  `,
  code: {
    js: {
      boilerplate: `function isAnagram(s, t) {
  // Write your logic here
}`,
      wrapper: `
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];

rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const s = lines[0];
  const t = lines[1];
  const result = isAnagram(s, t);
  console.log(result);
});
`,
    },
    python: {
      boilerplate: `def is_anagram(s, t):
    # Write your logic here
    pass`,
      wrapper: `
if __name__ == "__main__":
    import sys
    lines = [line.strip() for line in sys.stdin]
    s, t = lines[0], lines[1]
    result = is_anagram(s, t)
    print(result)
`,
    },
    cpp: {
      boilerplate: `#include <string>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your logic here
    return false;
}`,
      wrapper: `
#include <iostream>
#include <string>
using namespace std;

bool isAnagram(string s, string t);

int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    cout << (isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    java: {
      boilerplate: `public class Main {
    public static boolean isAnagram(String s, String t) {
        // Write your logic here
        return false;
    }`,
      wrapper: `
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String s = sc.nextLine();
        String t = sc.nextLine();
        System.out.println(isAnagram(s, t));
    }
}
`,
    },
  },
  testcases: [
    {
      input: "anagram\nnagaram",
      expectedOutput: "true",
    },
    {
      input: "rat\ntar",
      expectedOutput: "true",
    }
  ]
};

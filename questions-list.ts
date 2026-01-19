export interface QuestionParams {
  name: string;
  param: string;
  difficulty:string;
  categories: string[];
}

export const questionList: QuestionParams[] = [
  {
    name: "Binary-Search",
    param: "binary-search",
    difficulty: "Easy",
    categories: ["Array", "Binary Search", "Divide and Conquer"]
  },
  {
    name: "Valid-Palindrome",
    param: "valid-palindrome",
    difficulty: "Easy",
    categories: ["String", "Two Pointers"]
  },
  {
    name: "Is-Anagram",
    param: "is-anagram",
    difficulty: "Easy",
    categories: ["String", "HashMap"]
  }
];

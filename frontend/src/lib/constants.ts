export const LANGUAGES = [
  {
    name: 'JavaScript',
    defaultCode: `// Your first JavaScript program
console.log("Hello, World!");`,
  },
  {
    name: 'Python',
    defaultCode: `# Your first Python program
print("Hello, World!")`,
  },
  {
    name: 'Java',
    defaultCode: `// Your first Java program
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    name: 'C++',
    defaultCode: `// Your first C++ program
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
];

export type LANGUAGE_TYPE = (typeof LANGUAGES)[number];

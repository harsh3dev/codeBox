export const LANGUAGES = [
  {
    name: 'Python',
    defaultCode: `# Your first Python program
print("Hello, World!")`,
    symbol: 'PY'
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
  symbol: 'CPP'
  },
];

export type LANGUAGE_TYPE = (typeof LANGUAGES)[number];

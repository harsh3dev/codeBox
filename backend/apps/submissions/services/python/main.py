class Solution:
    def removeStars(s: str) -> str:
        char_stack = []
        star_stack = []

        for i, ch in enumerate(s):
            if ch == '*':
                if char_stack:
                    char_stack.pop()
                star_stack.append(i)
            else:
                char_stack.append(ch)

        return ''.join(char_stack)


if _name_ == "_main_":
    s = input().strip()
    
    solution = Solution()
    result = solution.removeStars(s)
    
    print(result)
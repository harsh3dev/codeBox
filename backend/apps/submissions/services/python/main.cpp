def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

# Test with input from test_cases
if __name__ == "__main__":
    nums = [int(x) for x in input().split()]
    target = int(input())
    result = two_sum(nums, target)
    print(result)
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> two_sum(const vector<int>& nums, int target) {
    unordered_map<int, int> num_map;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (num_map.find(complement) != num_map.end()) {
            return {num_map[complement], i};
        }
        num_map[nums[i]] = i;
    }
    return {}; // Return an empty vector if no solution
}

int main() {
    // Example usage
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;

    vector<int> result = two_sum(nums, target);

    if (!result.empty()) {
        cout << "Indices: [" << result[0] << ", " << result[1] << "]" << endl;
    } else {
        cout << "No solution found" << endl;
    }

    return 0;
}
#include <bits/stdc++.h>
using namespace std;

bool uniqueOccurrences(vector<int>& arr) {
    // Sort the input array to group identical elements
    sort(arr.begin(), arr.end());
    vector<int> v;

    for (int i = 0; i < arr.size(); i++) {
        int cnt = 1;

        // Count occurrences of the current element
        while (i + 1 < arr.size() && arr[i] == arr[i + 1]) {
            cnt++;
            i++;
        }

        // Push the count into the occurrences vector
        v.push_back(cnt);
    }

    // Sort the occurrences vector
    sort(v.begin(), v.end());

    // Debugging: Print the occurrences after sorting
    // cout << "Occurrences: ";
    // for (int i = 0; i < v.size(); i++) {
    //     cout << v[i] << " ";
    // }
    // cout << endl;

    // Check for duplicate occurrences
    for (int i = 1; i < v.size(); i++) {
        if (v[i] == v[i - 1]) {
            return false;
        }
    }

    return true;
}

int main() {
    string input_data;
    getline(cin, input_data);  // Read the entire line as input

    vector<int> arr;
    stringstream ss(input_data);
    int num;

    // Parse the input string and extract integers
    while (ss >> num) {
        arr.push_back(num);
    }

    // cout << "Input array: ";
    // for (int i = 0; i < arr.size(); i++) {
    //     cout << arr[i] << " ";
    // }
    // cout << endl;

    // Call the function and print the result
    if (uniqueOccurrences(arr)) {
        cout << "true";
    } else {
        cout << "false";
    }

    return 0;
}
function missingInteger(nums: number[]): number {
    let i = 1
    let sum = nums[0]
    const numSet = new Set(nums)

    while (i < nums.length + 1) {
        if (nums[i-1] + 1 === nums[i]) { sum += nums[i]; i++ }
        else {
            if (numSet.has(sum)) { sum += 1 }
            else { return sum }
        }
    }
}

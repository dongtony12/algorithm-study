function missingInteger(nums: number[]): number {
    let x = nums[0]
    let numsSet = new Set(nums)

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i-1] + 1) {
            x += nums[i]
        } else {
            break
        }
    }

    while (numsSet.has(x)) {
        x++
    }

    return x
}

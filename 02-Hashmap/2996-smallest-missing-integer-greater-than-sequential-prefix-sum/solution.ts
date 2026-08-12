function missingInteger(nums: number[]): number {
    let x = nums[0]
    let i = 1

    while (nums[i] === nums[i - 1] + 1) {
        x += nums[i]
        i++
    }

    for (let j = i - 1; j < nums.length; j++) {   // i-1 부터
        if (x === nums[j]) {
            j = i - 1                              // 되돌려서 재스캔
            x++
        }
    }

    return x
}

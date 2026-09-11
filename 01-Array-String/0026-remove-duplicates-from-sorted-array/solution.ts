function removeDuplicates(nums: number[]): number {
    let i = 1
    let k = 1

    while (i < nums.length) {
        if (nums[i-1] !== nums[i]) {
            nums[k] = nums[i]
            k++
        }
        i++
    }
    return k
}

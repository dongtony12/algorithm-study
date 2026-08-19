function removeDuplicates(nums: number[]): number {
    let i = 1
    let k = 1

    while (i < nums.length) {
        if (nums[k-1] !== nums[i]) {
            nums[k++] = nums[i]
        }
        i++
    }

    return k
}

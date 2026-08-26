function removeElement(nums: number[], val: number): number {
    let i = 0
    let k = 0

    while (i < nums.length) {
        if (nums[i] !== val) {
            nums[k] = nums[i]
            i++
            k++
        } else {
            i++
        }
    }

    return k
}

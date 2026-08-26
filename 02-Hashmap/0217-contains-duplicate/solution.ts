function containsDuplicate(nums: number[]): boolean {
    const numSet = new Set(nums)

    if (nums.length === numSet.size) {
        return false
    } else {
        return true
    }
}

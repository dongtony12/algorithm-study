function containsNearbyDuplicate(nums: number[], k: number): boolean {
    const numsSet = new Set()

    for (let i = 0; i < nums.length; i++) {
        if (numsSet.has(nums[i])) return true
        numsSet.add(nums[i])
        if (numsSet.size > k) numsSet.delete(nums[i-k])
    }
    return false
}

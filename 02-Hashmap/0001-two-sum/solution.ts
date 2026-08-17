function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>()   // 지금까지 본 값 → 그 인덱스

    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i]
        if (seen.has(need)) {
            return [seen.get(need)!, i]
        }
        seen.set(nums[i], i)
    }

    return []
}

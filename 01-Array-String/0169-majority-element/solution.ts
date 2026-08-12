function majorityElement(nums: number[]): number {
    let candidate = Infinity
    let count = 0

    for (const num of nums) {
        if (count === 0) {
            candidate = num
        }

        if (candidate === num) {
            count++
        } else {
            count--
        }
    }

    return candidate
}

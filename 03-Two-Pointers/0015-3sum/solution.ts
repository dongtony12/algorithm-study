function threeSum(nums: number[]): number[][] {
    const sortedNums = nums.sort((a,b)=>a-b)
    const result = []

    for (let i = 0; i < sortedNums.length - 2; i++) {
        if (i > 0 && sortedNums[i] === sortedNums[i-1]) continue      // ① a 중복

        let left = i + 1
        let right = sortedNums.length - 1

        while (left < right) {
            let sum = sortedNums[i] + sortedNums[left] + sortedNums[right]

            if (sum === 0) {
                result.push([sortedNums[i], sortedNums[left], sortedNums[right]])

                while (left < right && sortedNums[left]  === sortedNums[left + 1])  left++   // ② b 중복
                while (left < right && sortedNums[right] === sortedNums[right - 1]) right--  // ③ c 중복

                left++
                right--
            } else if (sum < 0) { left++ }                            // ④
            else                { right-- }
        }
    }
    return result
}

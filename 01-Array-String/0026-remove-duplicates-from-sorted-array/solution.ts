function removeDuplicates(nums: number[]): number {
  let k = 1                                  // nums[0]은 무조건 살아남음 → 확정 처리
  for (let i = 1; i < nums.length; i++) {    // 읽기도 1부터 (k와 앞뒤 맞춤)
    if (nums[k-1] !== nums[i]) {
      nums[k++] = nums[i]
    }
  }
  return k
}

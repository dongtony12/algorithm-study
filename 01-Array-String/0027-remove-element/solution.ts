function removeElement(nums: number[], val: number): number {
  let i = 0        // ⚠️ 미사용
  let k = 0

  for (const num of nums) {
    if (num === val) {
      continue
    } else {
      nums[k++] = num
    }
  }
  return k
}

function twoSum(numbers: number[], target: number): number[] {
  let i = 0
  let k = numbers.length - 1

  while (i < k) {
    if (numbers[i] + numbers[k] < target) {
        i++
    } else if (numbers[i] + numbers[k] > target) {
        k--
    } else {
        return [i+1, k+1]
    }
  }
}                                    // ← return 이 없다

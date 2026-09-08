function twoSum(numbers: number[], target: number): number[] {
    let i = 0
    let k = numbers.length - 1

    while (numbers[i] + numbers[k] !== target) {
        if (numbers[i] + numbers[k] > target) k--
        else i++
    }

    return [i + 1, k + 1]
}

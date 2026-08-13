function twoSum(numbers: number[], target: number): number[] {
    let i = 0
    let k = numbers.length - 1

    while (target - (numbers[i] + numbers[k]) !== 0){
        if(numbers[i] + numbers[k] > target) {
            k--
        }
        else if(numbers[i] + numbers[k] < target) {
            i++
        }
    }

    return [i+1, k+1] // 1-indexed이기때문에 i와 k에 +1 씩
}

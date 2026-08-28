function maxArea(height: number[]): number {
    let left = 0
    let right = height.length - 1
    let area = 0

    while (left < right) {
        let width = right - left
        let curArea = width * Math.min(height[left], height[right])
        if (curArea > area) area = curArea

        if (height[left] < height[right]) left++
        else right--
    }
    return area
}

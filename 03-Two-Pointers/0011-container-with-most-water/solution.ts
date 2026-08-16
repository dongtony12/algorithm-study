function maxArea(height: number[]): number {
    let i = 0
    let k = height.length - 1

    let maxArea = 0

    //x가 최대고 height가 클때인데 height는 2개의 value중 작은값
    while (k > i){
        let x = k - i
        let y = 0

        if(height[i] > height[k]){
            y = height[k]
            k--
        }else {
            y = height[i]
            i++
        }

        let area = x * y

        if(maxArea <= area) {
            maxArea = area
        }
    }

    return maxArea
}

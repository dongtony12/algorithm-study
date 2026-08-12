function maxProfit(prices: number[]): number {
    let profit = 0
    let min = Infinity // 구매하는날의 최솟값

    for (const price of prices) {
        if (price < min) {
            min = price
        }
        if (profit < price - min) {
            profit = price - min
        }
    }

    return profit
}

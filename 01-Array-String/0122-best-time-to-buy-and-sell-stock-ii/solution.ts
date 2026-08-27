function maxProfit(prices: number[]): number {
    let totalProfit = 0
    let buyPrice = Infinity

    for (const price of prices) {
        if (price < buyPrice) {
            buyPrice = price
        } else if (price > buyPrice) {
            totalProfit += price - buyPrice
            buyPrice = price
        }
    }

    return totalProfit
}

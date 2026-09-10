function maxProfit(prices: number[]): number {
    let maxProfitPrice = 0

    for (let i = 1; i < prices.length; i++) {
        let sellPrice = prices[i]
        if (sellPrice > prices[i-1]) {
            maxProfitPrice += sellPrice - prices[i-1]
        }
    }
    return maxProfitPrice
}

function maxProfit(prices: number[]): number {
  let profit = 0
  let minBuyPrice = Infinity

  for (const price of prices) {
    if (price < minBuyPrice) {
        minBuyPrice = price
    }

    if (profit < price - minBuyPrice) {
        profit = price - minBuyPrice
    }
  }

  return profit
}

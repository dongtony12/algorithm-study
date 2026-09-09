function isHappy(n: number): boolean {
    const nSet = new Set()
    let sum = 0

    while (n !== 1) {
        let numToString = n.toString()
        let stringLength = numToString.length

        for (let i = 0; i < stringLength; i++) {
            sum += (Number(numToString[i]) * Number(numToString[i]))
        }

        if (nSet.has(sum)) { return false } else { nSet.add(sum) }

        n = sum
        sum = 0
    }

    return true
}

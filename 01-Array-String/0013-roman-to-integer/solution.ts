function romanToInt(s: string): number {
    const symbolValue = [
        ["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1000],
    ] as const

    const symbolObj = new Map<string,number>(symbolValue)

    let result = 0

    for (let i = 0; i < s.length; i++) {
        let curVal = symbolObj.get(s[i])

        if (symbolObj.get(s[i+1]) > curVal) {
            result += symbolObj.get(s[i+1]) - curVal
            i++
        } else {
            result += curVal
        }
    }

    return result
}

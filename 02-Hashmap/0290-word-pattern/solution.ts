function wordPattern(pattern: string, s: string): boolean {
    const patternToSMap = new Map()
    const sToPatternMap = new Map()
    const length = pattern.length
    const sWord = s.split(' ')

    for (let i = 0; i < length; i++)
        if (!patternToSMap.has(pattern[i])) patternToSMap.set(pattern[i], sWord[i])

    for (let i = 0; i < length; i++)
        if (!sToPatternMap.has(sWord[i])) sToPatternMap.set(sWord[i], pattern[i])

    if (sWord.length !== pattern.length) return false

    for (let i = 0; i < length; i++) {
        if (patternToSMap.get(pattern[i]) === sWord[i]) {
            if (sToPatternMap.get(sWord[i]) !== pattern[i]) return false
        } else return false
    }
    return true
}

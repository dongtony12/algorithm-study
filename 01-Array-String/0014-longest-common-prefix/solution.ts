function longestCommonPrefix(strs: string[]): string {
    const strLength = strs.length
    let minWordLength = strs[0].length
    let result = ''

    for (let i = 0; i < strLength; i++) {
        minWordLength = Math.min(minWordLength, strs[i].length)
    }

    for (let i = 0; i < minWordLength; i++) {
        let currentChar = strs[0][i]
        for (let j = 0; j < strLength; j++) {
            if (strs[j][i] !== currentChar) return result
        }
        result += currentChar
    }
    return result
}

function lengthOfLastWord(s: string): number {
    let result = 0
    let isStartChar = false

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i].charCodeAt(0) !== 32) {
            isStartChar = true
            result++
        }
        if (s[i].charCodeAt(0) === 32 && isStartChar) {
            return result
        }
    }
    return result
}

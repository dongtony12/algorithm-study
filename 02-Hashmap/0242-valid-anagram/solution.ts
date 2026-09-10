function isAnagram(s: string, t: string): boolean {
    const letterArray = new Array<number>(26).fill(0)

    for (const sChar of s) letterArray[sChar.charCodeAt(0) - 97] += 1
    for (const tChar of t) letterArray[tChar.charCodeAt(0) - 97] -= 1

    for (const letterNum of letterArray) if (letterNum !== 0) return false

    return true
}

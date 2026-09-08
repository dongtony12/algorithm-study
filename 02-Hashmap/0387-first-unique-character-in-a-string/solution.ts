function firstUniqChar(s: string): number {
    const charMap = new Map()

    for (let i = 0; i < s.length; i++) {
        if (charMap.has(s[i])) charMap.set(s[i], charMap.get(s[i]) + 1)
        else charMap.set(s[i], 1)
    }

    for (let i = 0; i < s.length; i++) {
        if (charMap.get(s[i]) === 1) return i
    }

    return -1
}

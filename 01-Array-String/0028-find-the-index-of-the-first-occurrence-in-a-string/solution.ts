function strStr(haystack: string, needle: string): number {
    const m = haystack.length
    const n = needle.length

    for (let i = 0; i < m - n + 1; i++) {
        let isOccur = false

        for (let j = 0; j < needle.length; j++) {
            if (haystack[i+j] !== needle[j]) { isOccur = false; break }
            else { isOccur = true }
        }

        if (isOccur) return i
    }
    return -1
}

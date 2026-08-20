function strStr(haystack: string, needle: string): number {
    const n = haystack.length
    const m = needle.length

    for (let i = 0; i <= n-m; i++) {
        let occurCount = 0

        for (let j = i; j < m + i; j++) {
            if (haystack[j] === needle[j-i]) {
                occurCount++
            }
        }

        if (occurCount === m) {
            return i
        }
    }

    return -1
}

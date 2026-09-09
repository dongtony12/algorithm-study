function isSubsequence(s: string, t: string): boolean {
    let i = 0
    let j = 0

    while (i < s.length) {
        if (s[i] === t[j]) { i++; j++ }
        else               {      j++ }

        if (j > t.length) return false
    }
    return true
}

function strStr(haystack: string, needle: string): number {
    for (let i = 0; i < haystack.length; i++) {
        let isCorrect = false

        if (haystack[i] === needle[0]) {          // 첫 글자가 맞을 때만 안쪽 진입
            for (let j = 0; j < needle.length; j++) {
                if (haystack[i+j] !== needle[j]) { isCorrect = false; break }
                else { isCorrect = true }
            }
        }

        if (isCorrect) return i
    }
    return -1
}

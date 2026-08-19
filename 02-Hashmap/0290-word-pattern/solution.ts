function wordPattern(pattern: string, s: string): boolean {
    const wordArray = s.split(' ')            // n개 공간
    const patternToWord = new Map()
    const wordToPattern = new Map()

    if (pattern.length !== wordArray.length) {
        return false
    }

    for (let i = 0; i < pattern.length; i++) {
        if (patternToWord.has(pattern[i])) {              // pattern[i]가 key에 있고
            if (patternToWord.get(pattern[i]) !== wordArray[i]) {
                return false                               // 가져온 value가 현재 단어와 다르면
            }
        } else {                                           // key에 없다면
            if (wordToPattern.has(wordArray[i])) {         // 역방향이 이미 쓰였는지 먼저 확인
                return false
            }
            patternToWord.set(pattern[i], wordArray[i])
            wordToPattern.set(wordArray[i], pattern[i])
        }
    }

    return true
}

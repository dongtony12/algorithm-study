function longestCommonPrefix(strs: string[]): string {
    let minLength = Infinity
    let result = ''

    for (const str of strs) {
        if (str.length < minLength) {
            minLength = str.length
        }
    }

    for (let i = 0; i < minLength; i++) {          // i = 글자 위치 (열)
        let targetChar = strs[0][i]

        for (let j = 0; j < strs.length; j++) {    // j = 문자열 번호 (행)
            if (strs[j][i] !== targetChar) {
                return result
            }
        }

        result += targetChar
    }

    return result
}

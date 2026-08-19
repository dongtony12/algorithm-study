function longestCommonPrefix(strs: string[]): string {
    let minJLength = strs[0].length
    let prefix = ''

    for (const str of strs) {
        minJLength = Math.min(minJLength, str.length)
    }

    for (let i = 0; i < minJLength; i++) {          // i = 글자 위치 (열)
        let target = strs[0][i]
        for (let j = 0; j < strs.length; j++) {     // j = 문자열 번호 (행)
            if (target !== strs[j][i]) {
                return prefix
            }
        }
        prefix += target
    }

    return prefix
}

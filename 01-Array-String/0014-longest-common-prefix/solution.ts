function longestCommonPrefix(strs: string[]): string {
    let minJLength = strs[0].length
    let prefix = ''

    for (const str of strs) {
        minJLength = Math.min(minJLength, str.length)
    }

    // i는 글자들의 개수          ← ⚠️ "문자열의 개수" 가 맞다 (오기)
    // i는 strs.length만큼 비교
    // j는 각 글자들의 열을 하나씩 비교
    // j는 minJLength만큼 비교

    for (let j = 0; j < minJLength; j++) {         // j = 글자 위치 (열)
        let char = strs[0][j]

        for (let i = 0; i < strs.length; i++) {    // i = 문자열 번호 (행)
            if (strs[i][j] !== char) {
                return prefix
            }
        }

        prefix += char
    }

    return prefix
}

function isSubsequence(s: string, t: string): boolean {
    let k = 0   // s의 포인터
    let i = 0   // t의 포인터

    while (k < s.length) {
        if (i === t.length) {
            return false          // t를 다 썼는데 s가 남음
        }

        if (s[k] === t[i]) {
            i++
            k++
        } else {
            i++
        }
    }

    return true                   // s를 다 소진 = 성공
}

function isAlphanumeric(s: string): boolean {
    const ch = s.charCodeAt(0)
    return (ch >= 'A'.charCodeAt(0) && ch <= 'Z'.charCodeAt(0))
        || (ch >= 'a'.charCodeAt(0) && ch <= 'z'.charCodeAt(0))
        || (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0))
}

function isPalindrome(s: string): boolean {
    let left = 0
    let right = s.length - 1

    while (left < right) {
        if (!isAlphanumeric(s[left]))  { left++;  continue }
        if (!isAlphanumeric(s[right])) { right--; continue }

        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false

        left++
        right--
    }

    return true
}

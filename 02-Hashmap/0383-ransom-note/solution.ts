function canConstruct(ransomNote: string, magazine: string): boolean {
    const array = new Array(26).fill(0)

    for (let i = 0; i < ransomNote.length; i++) array[ransomNote[i].charCodeAt(0) - 97] += 1
    for (let i = 0; i < magazine.length; i++)   array[magazine[i].charCodeAt(0) - 97]   -= 1

    for (const num of array) if (num > 0) return false

    return true
}

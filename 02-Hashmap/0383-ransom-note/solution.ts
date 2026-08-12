function canConstruct(ransomNote: string, magazine: string): boolean {
    const arr1 = new Map()      // ⚠️ 이름: noteCount 가 맞다
    const arr2 = new Map()      // ⚠️ 이름: magazineCount 가 맞다

    for (let i = 0; i < ransomNote.length; i++) {
        if (arr1.has(ransomNote[i])) {
            arr1.set(ransomNote[i], arr1.get(ransomNote[i]) + 1)
        } else {
            arr1.set(ransomNote[i], 1)
        }
    }

    for (let j = 0; j < magazine.length; j++) {
        if (arr2.has(magazine[j])) {
            arr2.set(magazine[j], arr2.get(magazine[j]) + 1)
        } else {
            arr2.set(magazine[j], 1)
        }
    }

    for (let [key, value] of arr1) {
        if (arr2.has(key) && (value <= arr2.get(key))) {
            continue
        } else {
            return false
        }
    }

    return true
}

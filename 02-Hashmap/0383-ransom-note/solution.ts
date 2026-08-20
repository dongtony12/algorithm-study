function canConstruct(ransomNote: string, magazine: string): boolean {
    const noteMap = new Map()
    const magazineMap = new Map()

    for (let i = 0; i < ransomNote.length; i++) {
        if (noteMap.has(ransomNote[i])) {
            noteMap.set(ransomNote[i], noteMap.get(ransomNote[i]) + 1)
        } else {
            noteMap.set(ransomNote[i], 1)
        }
    }

    for (let i = 0; i < magazine.length; i++) {
        if (magazineMap.has(magazine[i])) {
            magazineMap.set(magazine[i], magazineMap.get(magazine[i]) + 1)
        } else {
            magazineMap.set(magazine[i], 1)
        }
    }

    for (const [nk, nv] of noteMap) {
        if (nv > (magazineMap.get(nk) ?? 0)) {
            return false
        }
    }

    return true
}

function isIsomorphic(s: string, t: string): boolean {
    const stringMap = new Map()

    for (let i = 0; i < s.length; i++) {
        if (!stringMap.has(s[i])) {              // 해당 키값이 없다면
            // 키가 없으면서 이전에 mapping된 value도 없어야 함
            if ([...stringMap.values()].includes(t[i])) {
                return false
            }
            stringMap.set(s[i], t[i])
        } else {                                  // 키가 있다면
            if (stringMap.get(s[i]) !== t[i]) {
                return false
            }
        }
    }

    return true
}

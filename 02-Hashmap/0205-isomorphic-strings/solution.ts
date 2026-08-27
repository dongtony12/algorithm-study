function isIsomorphic(s: string, t: string): boolean {
    const sToTMap = new Map()
    const tToSMap = new Map()
    const length = s.length

    for (let i = 0; i < length; i++) if (!sToTMap.has(s[i])) sToTMap.set(s[i], t[i])
    for (let i = 0; i < length; i++) if (!tToSMap.has(t[i])) tToSMap.set(t[i], s[i])

    for (let i = 0; i < length; i++) {
        if (sToTMap.get(s[i]) === t[i]) {
            if (tToSMap.get(t[i]) !== s[i]) return false
        } else return false
    }
    return true
}

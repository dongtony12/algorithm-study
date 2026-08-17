function isAnagram(s: string, t: string): boolean {
    const mapS = new Map()
    const mapT = new Map()

    for (const char of s) {
        let num = 0
        if (mapS.has(char)) {
            num = mapS.get(char)
        }
        mapS.set(char, num + 1)
    }

    for (const char of t) {
        let num = 0
        if (mapT.has(char)) {
            num = mapT.get(char)
        }
        mapT.set(char, num + 1)
    }

    if (mapS.size !== mapT.size) return false

    for (const [sk, sv] of mapS) {
        if (!mapT.has(sk) || sv !== mapT.get(sk)) {
            return false
        }
    }

    return true
}

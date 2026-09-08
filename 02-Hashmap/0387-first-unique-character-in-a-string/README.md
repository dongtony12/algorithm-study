# 387. First Unique Character in a String

- **난이도**: Easy
- **유형**: 해시맵 (개수 세기 + 순서)
- **링크**: https://leetcode.com/problems/first-unique-character-in-a-string/
- **최초 풀이**: 2026-09-08 / **결과**: 통과 (**피드백 0회**)

---

## 문제 요약

문자열 `s` 에서 **반복되지 않는 첫 번째 문자의 인덱스**를 반환. 없으면 `-1`.

```
"leetcode"      →  0      ('l' 이 한 번만, 인덱스 0)
"loveleetcode"  →  2      ('v' 가 첫 유일 문자)
"aabb"          →  -1
```

```
1 <= s.length <= 10^5
s는 소문자 영문자로만 구성
```

---

## 내 풀이 (통과)

```ts
function firstUniqChar(s: string): number {
    const charMap = new Map()

    for (let i = 0; i < s.length; i++) {
        if (charMap.has(s[i])) charMap.set(s[i], charMap.get(s[i]) + 1)
        else charMap.set(s[i], 1)
    }

    for (let i = 0; i < s.length; i++) {
        if (charMap.get(s[i]) === 1) return i
    }

    return -1
}
```

- 검증: 고정 12건 · 랜덤 30만건 불일치 0건
- **시간 `O(n)` 정확** / 공간은 오판 (아래)

---

## ⭐ 핵심 — 세는 것과 찾는 것을 **두 패스로 분리**

이 구조가 정확하다. 문제가 묻는 건 *"유일한 문자가 있나"* 가 아니라 **"첫 번째 유일한 문자의 인덱스"** 다.

**두 번째 루프를 `s` 순서대로 도는 게 핵심.**
`charMap` 을 순회하면 **삽입 순서**가 나와 우연히 맞는 것처럼 보이지만, *"첫 번째"* 를 보장하는 건 **문자열을 다시 훑는 것**이다.

> 1패스로는 불가능하다. `s[0]` 이 유일한지 알려면 **끝까지 다 봐야** 하기 때문. → 반드시 세기가 먼저 끝나야 한다.

---

## ⚠️ 공간복잡도 `O(n)` → **`O(1)`** · `#공간복잡도오판` 4회

```
s는 소문자 영문자로만 구성    →  |Σ| = 26
n 최대 10^5

min(100000, 26) = 26  →  O(1)
```

**같은 날 [0242. Valid Anagram](../0242-valid-anagram/README.md) 에서는 `O(1)` 이라고 정확히 답했다.** 같은 소문자 26개 제약인데 여기선 `O(n)` 이라 했다.

차이는 **자료구조뿐**이다:

| | 자료구조 | 최대 엔트리 | 공간 |
|---|---|---|---|
| [0242. Valid Anagram](../0242-valid-anagram/README.md) | `new Array(26)` | 26 (**눈에 보임**) | `O(1)` ✅ |
| **387** | **`new Map()`** | **26 (안 보임)** | **`O(1)`** — `O(n)` 이라 답함 ❌ |

> ### 🔑 **`Map` 이라서 `O(n)` 이 아니다**
> `Map` 에 들어갈 수 있는 키는 **소문자 26가지뿐**이다. `s` 가 10만 자여도 엔트리는 26개를 못 넘는다.
> `new Array(26)` 을 썼으면 바로 보였을 텐데, **`Map` 은 상한이 코드에 안 드러나서** 놓치기 쉽다.

**오늘의 패턴**: 규칙(`O(min(n, |Σ|))`)은 알고 있는데 **자료구조 모양에 판단이 끌려간다.**
→ [시간·공간 복잡도](../../concepts/complexity.md) 「`O(min(n, |Σ|))`」

---

## 성능 — `Map` 대신 26칸 배열 (6.5배)

```
최대 입력 10만 (전부 반복 = 최악) × 2000회
  Map (제출본)      : 2348ms
  26칸 배열         :  362ms      ← 6.5배
  인덱스 저장 (2패스): 269ms      ← 8.7배
```

같은 날 [0242. Valid Anagram](../0242-valid-anagram/README.md) · [0383. Ransom Note](../0383-ransom-note/README.md) 에서는 26칸 배열을 썼는데 여기선 `Map` 으로 갔다.

```ts
function firstUniqChar(s: string): number {
    const counts = new Array<number>(26).fill(0)
    for (let i = 0; i < s.length; i++) counts[s.charCodeAt(i) - 97]++
    for (let i = 0; i < s.length; i++) if (counts[s.charCodeAt(i) - 97] === 1) return i
    return -1
}
```

> 💡 `if/else` 로 초기값을 다루던 4줄도 사라진다 — **배열은 `fill(0)` 으로 미리 초기화**되므로.
> `Map` 은 *"키가 없으면 1, 있으면 +1"* 을 매번 분기해야 한다. `Map` 을 유지하더라도 이렇게 줄일 수 있다:
> ```ts
> charMap.set(s[i], (charMap.get(s[i]) ?? 0) + 1)
> ```

→ [해시맵](../../concepts/hashmap.md) 「배열이 Map을 10배 이긴다」

---

## 한 단계 더 — 두 번째 루프를 26번만

```ts
function firstUniqChar(s: string): number {
    const cnt   = new Array<number>(26).fill(0)
    const first = new Array<number>(26).fill(-1)

    for (let i = 0; i < s.length; i++) {
        const x = s.charCodeAt(i) - 97
        cnt[x]++
        if (first[x] < 0) first[x] = i        // 첫 등장 위치를 같이 기록
    }

    let best = -1
    for (let x = 0; x < 26; x++) {            // ← n 이 아니라 26번
        if (cnt[x] === 1 && (best < 0 || first[x] < best)) best = first[x]
    }
    return best
}
```

**첫 등장 인덱스를 세면서 같이 기록**하면 두 번째 루프가 `n` 이 아니라 **26번**으로 줄어든다.
`O(n + 26)` = `O(n)` 으로 차수는 같지만, **최악 입력(전부 반복)에서 두 번째 패스가 통째로 사라진다.**

> 검증: 랜덤 30만건에서 제출본과 불일치 0건.
> ⚠️ **면접에서는 위의 26칸 배열 2패스가 더 좋은 답** — 짧고 의도가 명확하다.
> 이건 *"더 줄일 수 있나?"* 라고 물어올 때 꺼낼 카드다.

---

## 실수 노트

- **`Map` 을 썼다는 이유로 공간을 `O(n)` 으로 오판** `#공간복잡도오판` — 키가 소문자 26가지뿐이면 `Map` 이어도 `O(1)`
- 같은 날 [0242. Valid Anagram](../0242-valid-anagram/README.md) 에서는 배열이라 `O(1)` 을 맞혔다 → **판단이 자료구조 모양에 끌려감**
- ✅ 두 패스 분리 구조 정확 · 시간복잡도 정확 · 접근 피드백 0회

---

## 복습 기록

**다음 복습**: 2026-09-09 (`1일` 단계)

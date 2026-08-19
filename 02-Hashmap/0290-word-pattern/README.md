# 290. Word Pattern

- **난이도**: Easy
- **유형**: 문자열, **해시맵 양방향 매핑** (문자 ↔ 단어)
- **링크**: https://leetcode.com/problems/word-pattern/
- **최초 풀이**: 2026-08-19 / **결과**: 통과 (접근 피드백 1회 — 무엇의 길이를 비교하는지)

---

## 문제 요약

`s` 가 `pattern` 을 따르는가 = **`pattern` 의 문자와 `s` 의 단어 사이에 일대일 대응(bijection)이 존재하는가.**

```
"abba" / "dog cat cat dog"   →  true
"abba" / "dog cat cat fish"  →  false
"aaaa" / "dog cat cat dog"   →  false
```

- **Constraints**: `1 <= pattern.length <= 300` (소문자만), `1 <= s.length <= 3000` (소문자+공백, 앞뒤 공백 없음, 단어는 공백 1개로 구분)
- **두 입력의 크기가 독립**이다 — `pattern` 이 3글자인데 `s` 가 3000자일 수 있다

---

## [0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) 와의 관계

**구조가 완전히 같다.** 대응 단위만 다르다.

| | 대응 단위 | 알파벳 크기 |
|---|---|---|
| [0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) | 문자 ↔ 문자 | **ASCII 128개 (상한 있음)** |
| **290 (이 문제)** | **문자 ↔ 단어** | **단어 종류는 `n`에 비례 (상한 없음)** |

### 🔑 그래서 `205`의 `[...values()].includes()` 를 그대로 가져오면 안 된다

`205` 에서는 그 스캔이 **최대 128번만** 실행돼 `O(n)` 이었다.
여기는 단어 종류에 상한이 없어 **진짜 `O(n²)`** 이 된다.

> **전제가 깨지면 무너진다.** 같은 날 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 에서 배운 `#패턴오적용` 의 확인 절차가 그대로 적용된 자리.

---

## ⚠️ `205` 에 없던 함정 — 길이 검사

```
pattern = "abc",  s = "dog cat"
          문자 3개        단어 2개   →  대응 자체가 불가능
```

`205` 는 `t.length == s.length` 가 **Constraints로 보장**됐지만, 여기는 보장이 없다.

**`pattern.length` 만큼 순회하면 `wordArray[2]` 가 `undefined` 가 된다.**
→ **루프 진입 전에 `pattern.length !== wordArray.length` 를 검사**해야 한다.

접근 1차에서 *"두 개의 사이즈가 다르면 false"* 라고 했는데, **맵 두 개의 `size`** 를 뜻하는 거였다면 아무것도 못 잡는다 — 양방향 맵은 항상 짝지어 넣으므로 크기가 같다.
비교해야 하는 건 **`pattern.length` vs 단어 개수**.

---

## 최종 정답

```ts
function wordPattern(pattern: string, s: string): boolean {
    const wordArray = s.split(' ')            // n개 공간
    const patternToWord = new Map()
    const wordToPattern = new Map()

    if (pattern.length !== wordArray.length) {
        return false
    }

    for (let i = 0; i < pattern.length; i++) {
        if (patternToWord.has(pattern[i])) {              // pattern[i]가 key에 있고
            if (patternToWord.get(pattern[i]) !== wordArray[i]) {
                return false                               // 가져온 value가 현재 단어와 다르면
            }
        } else {                                           // key에 없다면
            if (wordToPattern.has(wordArray[i])) {         // 역방향이 이미 쓰였는지 먼저 확인
                return false
            }
            patternToWord.set(pattern[i], wordArray[i])
            wordToPattern.set(wordArray[i], pattern[i])
        }
    }

    return true
}
```

- **시간 `O(m + n)` / 공간 `O(n)`** (`m` = pattern.length, `n` = s.length)
  - `split` 이 `s` 전체를 훑어 `O(n)`, 대응 검사가 `O(m)`
  - **공간은 `split` 이 만든 단어 배열 + 맵의 키로 들어가는 단어 문자열** → `O(n)`
- 검증: 고정 14건 + 랜덤 30만건 불일치 0. 최대 입력(300글자/300단어) 2만회 147ms

**`else` 분기에서 역방향을 먼저 확인하고 나서 둘 다 `set`** — 순서가 정확하다. 먼저 넣으면 자기 자신이 걸린다.

---

## 알아야 할 상식

### 1. 공간이 `O(1)` 이 아닌 이유

[0383. Ransom Note](../0383-ransom-note/README.md) · [0242. Valid Anagram](../0242-valid-anagram/README.md) 은 소문자 26개, [0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) 는 ASCII 128개로 **고정**이라 `O(1)` 이었다.
여기는 **단어**가 키라서 종류도 길이도 입력에 비례한다 → `O(n)`.

> 🔑 기준은 늘 같다 — **"입력이 커지면 이것도 같이 커지나?"** → [시간·공간 복잡도](../../concepts/complexity.md)

### 2. `split(' ')` 이 안전한 이유

Constraints가 **앞뒤 공백 없음 + 단어 사이 공백 정확히 1개**를 보장한다.
그 보장이 없으면 [0058. Length of Last Word](../../01-Array-String/0058-length-of-last-word/README.md) 처럼 빈 문자열이 섞인다:

```js
"  fly me  ".split(' ')            // ['', '', 'fly', 'me', '', '']
"  fly me  ".trim().split(/\s+/)   // ['fly', 'me']   ← 보장이 없을 때의 관용구
```

### 3. 대안 — 첫 등장 인덱스 비교

[0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) 와 마찬가지로 *"같은 것의 첫 등장 위치 패턴이 같다"* 로도 풀린다.
`indexOf` 가 `O(n)` 이라 전체 `O(n²)` — 면접 언급용 카드로만.

---

## 실수 노트

- **"두 개의 사이즈"가 모호했다** → 맵 크기가 아니라 **`pattern.length` vs 단어 개수**. 양방향 맵은 항상 짝지어 넣으므로 크기가 같아서 검사 의미가 없다
- ✅ **입력이 두 개임을 인식하고 `O(m + n)` 으로 정확히 답함** — 바로 앞 [0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) 에서는 *"길이가 같음이 보장되니 축 하나"* 를 판단했고, 여기서는 *"보장이 없으니 축 둘"* 을 판단. **`#복잡도차원뭉개기` 를 두 문제 연속 안 밟음**
- ✅ **`split` 비용을 공간에 잡음** — 단어들이 맵의 키가 되므로 `O(n)`
- ✅ **길이 검사를 루프 진입 전에 배치** — `undefined` 접근이 원천 차단
- ✅ **`205` 의 `values()` 스캔을 그대로 가져오지 않고 맵 2개로 감** — 전제(알파벳 상한)가 없다는 걸 인지

---

## 복습 기록

**다음 복습**: 2026-08-20 (`1일` 단계) — **왜 길이 검사가 `205` 에는 없고 여기만 있는지**를 먼저 말할 것

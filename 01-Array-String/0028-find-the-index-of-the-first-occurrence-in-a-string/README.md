# 28. Find the Index of the First Occurrence in a String

- **난이도**: Easy
- **유형**: 문자열 매칭, 브루트포스 슬라이딩
- **링크**: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
- **최초 풀이**: 2026-08-03 / **결과**: 통과

---

## 문제 요약

`haystack` 안에서 `needle`이 **처음 등장하는 인덱스** 반환. 없으면 `-1`.
- **Constraints**: `1 <= haystack.length, needle.length <= 10⁴`, 소문자 영문자만

```
"sadbutsad", "sad"  →  0
"leetcode",  "leeto" →  -1
```

---

## 접근 — 시작 위치를 한 칸씩 밀기

```
haystack = "a b a b c"
needle   = "a b c"

i=0 → "aba" vs "abc" → 3번째 불일치 ❌
i=1 → "bab" vs "abc" → 첫 글자 불일치 ❌
i=2 → "abc" vs "abc" → 일치 ✅ → 2 반환
```

### ⚠️ 핵심 off-by-one — 시작 위치는 몇 개인가

```
haystack = "s a d b u t s a d"   (n = 9)
            0 1 2 3 4 5 6 7 8
needle   = "s a d"               (m = 3)

시작 가능:  0 1 2 3 4 5 6
                        ↑
             6에서 시작 → 6,7,8 = 딱 3글자 ✅
             7에서 시작 → 7,8   = 2글자뿐 ❌
```

**마지막 시작 위치 = `n - m`** → **시작 위치 개수 = `n - m + 1`**

```ts
for (let i = 0; i <= n - m; i++)          // 등호 필요
for (let i = 0; i < n - m + 1; i++)       // 또는 +1
```

`+1`을 빠뜨리면 `haystack === needle` 인 경우(`n - m = 0`)에 루프가 아예 안 돈다.

---

## 최종 정답

```ts
function strStr(haystack: string, needle: string): number {
    const compareLength = haystack.length - needle.length + 1

    for (let i = 0; i < compareLength; i++) {
        for (let j = 0; j < needle.length; j++) {
            if (haystack[i+j] !== needle[j]) break        // 불일치 → 다음 시작 위치로

            if (j === needle.length - 1) return i         // 마지막까지 일치 → 찾음
        }
    }
    return -1
}
```

- **시간 `O(n × m)` / 공간 `O(1)`**
- `needle`이 `haystack`보다 길면 `compareLength ≤ 0` 이라 루프가 안 돌고 `-1` 반환 ✅

### 인덱스 설계

```ts
haystack[i + j]   vs   needle[j]
         ↑                    ↑
   시작위치 + 오프셋      0부터 세는 기준
```
`j`를 **`needle` 기준 0부터** 세고 `haystack` 쪽만 `i`를 더하는 게 실수가 적다.
(`j`를 `i`부터 시작시키면 매번 `j - i`를 계산해야 해서 헷갈린다)

---

## ⚠️ 복잡도 — `O(n²)`가 아니라 `O(n × m)`

[0014. Longest Common Prefix](../0014-longest-common-prefix/README.md) 와 **똑같은 실수를 반복.**

| 기호 | 뜻 |
|---|---|
| `n` | `haystack.length` |
| `m` | `needle.length` |

```
바깥 루프  →  (n - m + 1)번
  안쪽 루프 →  최대 m번
             →  O((n-m+1) × m)  ≈  O(n × m)
```

### 숫자로 보면 차이가 크다

```
haystack 10,000글자, needle 3글자

O(n × m) = 10,000 × 3        =        30,000   ← 실제
O(n²)    = 10,000 × 10,000   =   100,000,000   ← 3000배 과대평가
```

> **`n`과 `m`은 별개의 값이다. 하나로 뭉치면 완전히 다른 결론이 나온다.**
> 입력이 두 개면 변수도 두 개. → [시간·공간 복잡도](../../concepts/complexity.md)

### 최악의 경우는 언제인가

```
haystack = "aaaaaaaaab",  needle = "aaab"
```
매 시작 위치에서 **거의 끝까지 일치하다가 마지막에 실패** → 안쪽 루프가 매번 `m`번 다 돈다.
반대로 첫 글자부터 다르면 안쪽은 1번만 돌아 `O(n)`.

---

## 알아야 할 상식

### 1. `indexOf` 한 줄로도 통과한다

```ts
return haystack.indexOf(needle);   // 통과 ✅
```

**제출은 되지만 문제의 의도가 아니다.** 면접에서 이걸 쓰면 "그 함수를 직접 구현해보세요"가 따라온다.
`indexOf`가 내부적으로 하는 게 바로 위 브루트포스(또는 그 최적화 버전)다.

### 2. "끝까지 일치했다"를 판정하는 세 가지 패턴

```ts
// ① 내 방식 — 마지막 인덱스 도달을 안쪽에서 확인
if (j === needle.length - 1) return i;

// ② while + j 확인 (가장 읽기 쉬움)
let j = 0;
while (j < m && haystack[i+j] === needle[j]) j++;
if (j === m) return i;

// ③ 라벨 continue (짧지만 JS에선 드물게 쓰임)
outer: for (let i = 0; i <= n - m; i++) {
  for (let j = 0; j < m; j++) {
    if (haystack[i+j] !== needle[j]) continue outer;
  }
  return i;
}
```

셋 다 정답. **②번이 "루프가 끝까지 갔는가"를 `j === m` 하나로 판정해서 가장 명확하다.**

### 3. `slice` 로 비교하면?

```ts
if (haystack.slice(i, i + m) === needle) return i;   // 동작은 하지만
```
매 반복마다 **길이 `m`짜리 새 문자열을 할당** → 공간 `O(m)`, 상수도 커진다. 인덱스 비교가 낫다.

### 4. KMP — `O(n + m)` (지금은 이름만)

브루트포스는 불일치하면 **`i`를 1칸 밀고 처음부터 다시** 비교한다. 이미 비교한 정보를 버리는 셈.

**KMP(Knuth–Morris–Pratt)** 는 `needle` 안의 반복 구조를 미리 계산(실패 함수)해서, 불일치 시 **얼마나 건너뛸 수 있는지**를 알고 점프한다 → `O(n + m)`.

지금 단계에서 구현할 필요는 없다. **이름과 "왜 더 빠른지"만 기억.**

---

## 실수 노트

- ✅ 경계 `n - m + 1` 정확히 처리 (힌트 후)
- ✅ `split('')` 제거해서 공간 `O(1)` 달성
- ❌ **`O(n × m)` 을 `O(n²)` 로 뭉갬 — [0014. Longest Common Prefix](../0014-longest-common-prefix/README.md) 에 이어 2회 연속**
  → **입력이 두 개면 변수도 두 개**

---

## 복습 기록

**다음 복습**: 2026-08-23 (통과 → `3일` 단계)

### 2026-08-12 (1회차) — 통과, 접근 피드백 2회 (전부 복잡도 표기)

백지 재작성 **통과**. 고정 15건 + 랜덤 30만건 불일치 0. 최악 케이스(10⁴ × 501) 20회 314ms.

```ts
function strStr(haystack: string, needle: string): number {
    for (let i = 0; i < haystack.length; i++) {
        let isCorrect = false

        if (haystack[i] === needle[0]) {          // 첫 글자가 맞을 때만 안쪽 진입
            for (let j = 0; j < needle.length; j++) {
                if (haystack[i+j] !== needle[j]) { isCorrect = false; break }
                else { isCorrect = true }
            }
        }

        if (isCorrect) return i
    }
    return -1
}
```

최초 풀이와 달리 **첫 글자 선검사**(`haystack[i] === needle[0]`)를 넣어 안쪽 루프 진입 자체를 줄인 변형. 복잡도는 그대로 `O(n × m)`.

---

#### ⚠️ `#복잡도차원뭉개기` — 또 `O(n²)`

이 문제는 그 태그의 **2회차**였고, 08-03에 본인이 이렇게 써뒀다:

> ❌ **`O(n × m)` 을 `O(n²)` 로 뭉갬 — [0014. Longest Common Prefix](../0014-longest-common-prefix/README.md) 에 이어 2회 연속**
> → **입력이 두 개면 변수도 두 개**

그런데 복습 1차 답변이 또 `O(n²)` 였다. (같은 날 [0014. Longest Common Prefix](../0014-longest-common-prefix/README.md) 에서 지적받은 **직후**)

**카운트는 안 올림** — 같은 세션의 연장선이고 이미 4회로 올리며 대책을 박아뒀다. 다음 세션에서 또 나오면 무조건 올린다.

#### 기호는 "루프 횟수"가 아니라 "입력 크기"로 정의한다

2차 답변에서 `M = 첫 원소를 찾는 index 순회 개수`, `K = needle length 만큼 도는 순회 개수` 라고 정의했다. 의미는 맞지만 **한 단계 덜 갔다.**

```
n = haystack.length      (≤ 10⁴)      ← 입력 크기
m = needle.length        (≤ 10⁴)      ← 입력 크기

바깥 순회 개수 = n - m + 1  ≈ n       ← 입력 크기에서 유도됨
안쪽 순회 개수 = m                     ← 유도됨

→ O(n × m)
```

> 🔑 **기호는 항상 "입력의 무엇"으로 정의한다.**
> 루프 횟수는 입력 크기에서 **유도되는 값**이다. 루프 횟수로 정의하면 "그 횟수가 입력에 따라 어떻게 변하는지"를 다시 설명해야 한다.

---

#### 개선 ① 바깥 루프 상한 — `n - m + 1`

```ts
for (let i = 0; i < haystack.length; i++)              // 지금
for (let i = 0; i <= haystack.length - needle.length; i++)   // 경계 명시
```

**동작은 지금도 맞다.** `haystack[i+j]` 가 범위를 넘으면 `undefined` 가 되어 `needle[j]` 와 달라 `break` 되니까.
하지만 `undefined !== string` 에 의존하는 건 `#우연히맞는코드` 계열이다.

**차이가 나는 지점**: `needle` 이 `haystack` 보다 길면 —
- 지금 코드: `haystack` 전체를 훑고 `-1`
- 경계 있음: 루프가 **아예 안 돌고** 즉시 종료

08-03 노트에 이 경계를 정확히 정리해뒀다 (`마지막 시작 위치 = n - m` → `시작 위치 개수 = n - m + 1`).

#### 개선 ② `isCorrect` 플래그 제거

08-03 노트의 "끝까지 일치했다 판정 3패턴" 중 ②번:

```ts
let j = 0;
while (j < m && haystack[i+j] === needle[j]) j++;
if (j === m) return i;      // "루프가 끝까지 갔는가"를 j 하나로 판정
```

플래그 대입(`isCorrect = false` / `= true`)이 매 반복 사라지고, **`j === m` 하나로 판정**되어 의도가 더 명확하다.

#### 이전 실수 노트와 대조

| 08-03 | 08-12 |
|---|---|
| ✅ 경계 `n - m + 1` 정확히 처리 (힌트 후) | `i < haystack.length` 로 감 (동작은 맞음) |
| ✅ `split('')` 제거해 공간 `O(1)` | 배열 생성 없음 ✅ |
| ❌ `O(n × m)` 을 `O(n²)` 로 뭉갬 | **재발** ❌ (지적 후 수정) |

### 2026-08-20 (2회차) — 통과, **피드백 0회** · 두 약점 모두 첫 클리어

고정 15건 + 랜덤 30만건 불일치 0. 복잡도 `O(n × m)` / `O(1)` **처음부터 정확**.

```ts
function strStr(haystack: string, needle: string): number {
    const n = haystack.length
    const m = needle.length

    for (let i = 0; i <= n-m; i++) {
        let occurCount = 0

        for (let j = i; j < m + i; j++) {
            if (haystack[j] === needle[j-i]) {
                occurCount++
            }
        }

        if (occurCount === m) {
            return i
        }
    }

    return -1
}
```

#### ✅ 두 실수 모두 첫 클리어

| 실수 | 08-03 | 08-12 복습 | **08-20 복습** |
|---|---|---|---|
| `O(n×m)` 을 `O(n²)` 로 뭉갬 `#복잡도차원뭉개기` | ❌ | ❌ 재발 | ✅ **처음부터 정확** |
| 경계 `n - m + 1` `#인덱스오프바이원` | ❌ (힌트 후) | `i < haystack.length` | ✅ **`i <= n - m`** |

- **입력 개수부터 세고 시작**했다 (*"크기를 결정하는 입력은 2개"*) — 이 문제에서 3번째 만에 정확
- **마지막 시작 위치 `n-m`, 부등호 `<=`** 를 스스로 도출
- `const n`, `const m` 으로 **접근에서 정의한 기호를 코드에 그대로 선언** — 좋은 습관

#### 개선 — 조기 종료

```ts
for (let j = i; j < m + i; j++) {
    if (haystack[j] === needle[j-i]) occurCount++
}
if (occurCount === m) return i
```

**첫 글자부터 틀려도 `m`번을 끝까지 센다.**

실측 (최악 케이스 `"aaa…"` × `"aa…b"`, 20회):

| | 시간 |
|---|---|
| 제출본 (항상 `m`번) | 280ms |
| 조기 종료 (`break`) | 287ms |

**최악 케이스에서는 차이가 없다** — 어차피 끝까지 가야 하므로.
하지만 **일반 입력에서는 조기 종료가 훨씬 유리**하다 (`"leetcode"`/`"zzz"` 면 매 위치에서 1번만 비교).

08-03 노트의 "끝까지 일치했다 판정 3패턴" 중 ②번:

```ts
let j = 0
while (j < m && haystack[i+j] === needle[j]) j++
if (j === m) return i        // 루프가 끝까지 갔는가를 j 하나로 판정
```

`occurCount` 변수가 사라지고 **조기 종료가 조건에 자연스럽게 들어간다.**

**판정**: 피드백 0회 + 실수 미재발 → `1일` → **`3일` 단계** (다음 복습 08-23)

### 2026-09-09 (3회차) — 통과 · **복잡도 3연속 클리어** · `3일` → `7일` 단계

```
고정 15/15  (needle이 더 김 · 길이 1 · 전부 동일 · 부분 일치 후 실패 포함)
랜덤 40만건 불일치 0건
```

```ts
function strStr(haystack: string, needle: string): number {
    const m = haystack.length
    const n = needle.length

    for (let i = 0; i < m - n + 1; i++) {
        let isOccur = false

        for (let j = 0; j < needle.length; j++) {
            if (haystack[i+j] !== needle[j]) { isOccur = false; break }
            else { isOccur = true }
        }

        if (isOccur) return i
    }
    return -1
}
```

#### ⭐ `#복잡도차원뭉개기` 3연속 클리어

```
m = haystack.length
n = needle.length
시간 O(m × n) / 공간 O(1)      ✅
```

**이 문제는 `#복잡도차원뭉개기` 가 처음 기록된 자리다** (08-03, `O(n × m)` 을 `O(n²)` 로).
08-03 ❌ → 08-20 ✅ → **09-09 ✅**. 두 축을 정의하고 곱셈으로 셌다.

같은 날 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 에서는 힌트 3회로 리셋이 났는데 **여기서는 첫 시도에 맞혔다.**
차이는 **입력이 눈에 띄게 둘**(haystack / needle)이라는 것 — 392는 둘 다 문자열이라 뭉개기 쉬웠다.

**실측 — 최악은 부분 일치가 길게 이어지다 마지막에 실패할 때:**

```
교차 패턴 (m=10000, n=5000)  →  12,502,501회 비교
                                 ≈ (m-n+1) × n = 5001 × 5000
a×10000 / a×9999+b            →     10,000회   (첫 글자부터 어긋나면 빨리 끝남)
```

> 💡 `i < m - n + 1` 로 **범위를 정확히 잘라낸 것도 좋다.**
> `i < m` 으로 두면 뒤쪽에서 `haystack[i+j]` 가 `undefined` 가 되고, 답은 맞아도 `#우연히맞는코드` 가 된다.
> 같은 날 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 에서 지적한 그 형태.

---

#### ⚠️ `isOccur` 플래그가 불필요

```ts
let isOccur = false
for (let j = 0; j < needle.length; j++) {
    if (haystack[i+j] !== needle[j]) { isOccur = false; break }
    else { isOccur = true }        // ← 매 반복 true 를 다시 씀
}
if (isOccur) return i
```

**`else` 에서 `true` 를 `n`번 반복 대입**한다. `break` 직전의 `isOccur = false` 는 **이미 false거나 곧 버려질 값**이다.

정보는 이미 `j` 가 갖고 있다:

```
j === n  →  끝까지 갔다   →  일치
j < n    →  중간에 break  →  불일치
```

```ts
function strStr(haystack: string, needle: string): number {
    const m = haystack.length, n = needle.length

    for (let i = 0; i + n <= m; i++) {
        let j = 0
        while (j < n && haystack[i + j] === needle[j]) j++
        if (j === n) return i
    }
    return -1
}
```

> 검증: 랜덤 40만건에서 제출본과 불일치 0건.
>
> ### 🔑 루프 변수가 이미 답을 갖고 있으면 플래그를 따로 두지 않는다
> `#죽은코드방치`(4회)와 같은 계열 — 동작엔 문제없지만 *"이 변수가 왜 있지"* 를 읽는 사람이 되묻게 된다.

작은 것 하나 더 — **`n` 을 정의해놓고 안쪽 루프에선 `needle.length` 를 다시 쓴다.** 기호를 정의했으면 끝까지 쓸 것.

---

#### 참고 — 실무에서는 내장 함수

```
최악 입력 (m=10000, n=10000) × 100회
  제출본       : 2ms
  j===n 버전   : 2ms
  indexOf 내장 : 0ms
```

`haystack.indexOf(needle)` 은 엔진이 **Boyer-Moore-Horspool** 계열을 쓰기 때문에 훨씬 빠르다.

> ⚠️ 면접에서는 **직접 구현을 요구**한다. 다만 *"실무면 `indexOf` 를 쓰고, 여기서는 직접 구현하겠습니다"* 한 줄을 붙이면 좋다.
> *"더 빠르게 할 수 있나요?"* 가 나오면 **KMP `O(m + n)`** 이 답 — 실패 함수로 이미 비교한 부분을 다시 안 보는 방식이고, 이 문제의 정식 후속이다.

**판정**: 정답 · 복잡도 정확(3연속) · 범위 계산 정확 / 플래그는 스타일 → `3일` → **`7일` 단계** (다음 09-18)

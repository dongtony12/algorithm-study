# 58. Length of Last Word

- **난이도**: Easy
- **유형**: 문자열, 뒤에서부터 순회
- **링크**: https://leetcode.com/problems/length-of-last-word/
- **최초 풀이**: 2026-08-03 / **결과**: 통과 (첫 시도)

---

## 문제 요약

영문자와 공백으로만 이루어진 `s`에서 **마지막 단어의 길이** 반환.
- **Constraints**: `1 <= s.length <= 10⁴`, 단어 최소 1개 보장
- **함정**: 앞/뒤/중간에 **공백이 여러 개** 있을 수 있다

```
"   fly me   to   the moon  "  →  4  ("moon")
```

---

## 내 풀이 (통과)

```ts
function lengthOfLastWord(s: string): number {
    const arr = s.split(' ')
    const test = arr.filter((word) => word !== '')
    return test.at(-1).split('').length
}
```

- **시간 `O(n)` / 공간 `O(n)`**

### 동작 과정

```
"  fly me  "
  .split(' ')                → ['', '', 'fly', 'me', '', '']
  .filter(w => w !== '')     → ['fly', 'me']
  .at(-1)                    → 'me'
```

`split(' ')`은 **연속된 공백마다 빈 문자열을 만든다.** 그래서 `filter`로 걸러내는 게 필요.

### 피드백

| # | 내용 |
|---|---|
| ✅ | 공백 여러 개 케이스를 `filter`로 정확히 처리 |
| ✅ | **복잡도 시간·공간 둘 다 정확히 판단** (13번의 `O(1)` 기준을 제대로 적용) |
| ⚠️ | `.split('').length` 는 **완전히 불필요** — `.length` 만으로 충분 |
| ⚠️ | `.at(-1)` 은 TS에서 `string \| undefined` 반환 |

### `.split('')` 이 왜 불필요한가

```ts
'moon'.split('').length   // ['m','o','o','n'] 배열을 새로 만들고 길이를 잼  ← O(n) 할당
'moon'.length             // 문자열 길이는 이미 O(1)로 알 수 있음            ← 즉시
```

**문자열은 자기 길이를 이미 알고 있다.** 배열로 쪼갤 이유가 없다.

### `.at(-1)` 타입 이슈

`Array.prototype.at` 의 TS 반환 타입은 **`T | undefined`** 다.
`strictNullChecks` 가 켜진 프로젝트에서는 `.split` 호출 시 컴파일 에러.

```ts
test[test.length - 1].length      // 인덱스 접근 (TS가 number로 봄)
test.at(-1)!.length               // non-null 단언
```

---

## `O(1)` 공간 해법 — 뒤에서부터 스캔

```ts
function lengthOfLastWord(s: string): number {
  let i = s.length - 1;

  while (i >= 0 && s[i] === ' ') i--;        // ① 뒤쪽 공백 건너뛰기

  let len = 0;
  while (i >= 0 && s[i] !== ' ') {           // ② 글자 세기
    len++;
    i--;
  }
  return len;
}
```

- **시간 `O(n)` / 공간 `O(1)`**
- 새 배열·새 문자열을 하나도 만들지 않는다

### 핵심 — 왜 뒤에서부터인가

찾는 게 **마지막** 단어다. 앞에서 가면 문자열 전체를 훑어야 하지만, 뒤에서 가면 **마지막 단어를 지나는 순간 끝난다.**

```
"   fly me   to   the moon  "
                          ↑↑  ① 공백 2칸 건너뛰기
                      ↑↑↑↑    ② 4글자 세고 종료
                              앞쪽 20여 글자는 볼 필요조차 없음
```

최악(전체가 한 단어)에는 `O(n)`이지만, **실제로는 훨씬 적게 본다.**

### 2단계로 나뉘는 이유

뒤에서부터 갈 때 **처음 만나는 게 알파벳이라는 보장이 없다.** 끝에 공백이 있을 수 있으니까.
→ ① 공백을 먼저 다 건너뛰고 → ② 그다음부터 글자를 센다

`while` 두 개로 분리한 게 이 문제의 전부.

---

## 알아야 할 상식

### 1. ⚠️ JS 문자열은 불변(immutable)이다

```js
let s = "hello";
s[0] = "H";        // 아무 일도 안 일어남 (에러도 안 남)
console.log(s);    // "hello"
```

**문자열을 "수정"하는 메서드는 전부 새 문자열을 만든다.** 즉 **`O(n)` 할당이 발생**한다.

| 메서드 | 새로 할당 |
|---|---|
| `trim`, `trimEnd`, `trimStart` | ✅ `O(n)` |
| `slice`, `substring`, `replace` | ✅ `O(n)` |
| `toUpperCase`, `toLowerCase` | ✅ `O(n)` |
| `split` | ✅ `O(n)` (배열까지) |
| `s[i]`, `s.length`, `charAt`, `indexOf` | ❌ 할당 없음 |

> **문자열 문제에서 `O(1)` 공간을 요구하면, 문자열 메서드를 거의 못 쓴다.**
> 인덱스로 직접 읽는 수밖에 없다.

그래서 `s.trimEnd()` 를 쓴 아래 코드도 **`O(1)`이 아니다**:
```ts
const t = s.trimEnd();                      // ← 새 문자열 O(n)
return t.length - t.lastIndexOf(' ') - 1;
```

### 2. `split(' ')` vs 정규식

```js
"  fly me  ".split(' ')       // ['', '', 'fly', 'me', '', '']   ← 빈 문자열 발생
"  fly me  ".split(/\s+/)     // ['', 'fly', 'me', '']           ← 여전히 앞뒤 빈칸
"  fly me  ".trim().split(/\s+/)  // ['fly', 'me']               ✅ 깔끔
```

**`trim()` 먼저 하고 정규식으로 나누는 게 관용구.** 단 `trim`이 `O(n)` 할당이라 공간은 `O(n)`.

### 3. ⚠️ `split('')` 과 이모지 (프론트 실무 함정)

```js
"👨‍👩‍👧".length              // 8  ← 사람이 세는 1과 다르다
"héllo".split('').length     // 결합문자 있으면 깨짐
[..."👍"].length             // 2 → 스프레드는 코드포인트 단위 (조금 나음)
[...new Intl.Segmenter().segment("👨‍👩‍👧")].length  // 1 ✅ 진짜 글자 수
```

JS의 `.length`는 **UTF-16 코드 유닛 개수**다. 이 문제는 영문자만 나와서 무관하지만,
실무에서 **글자 수 카운터·입력 제한** 만들 때 반드시 터진다.

---

## 실수 노트

- `.split('').length` — **문자열은 이미 `.length`를 안다.** 불필요한 `O(n)` 할당
- `.at(-1)` 의 TS 타입이 `T | undefined` 인 점 (strict 환경에서 에러)
- ✅ **복잡도 시간·공간 둘 다 정확히 판단** (누적 개선 중)

---

## 복습 기록

**다음 복습**: 2026-08-17 (마지막 풀이일 + 5일)

### 2026-08-12 (1회차) — 통과, 피드백 0회 · **공간 `O(n)` → `O(1)` 개선**

백지 재작성 **통과**. 고정 13건 + 랜덤 20만건 불일치 0. 복잡도 `O(n)` / `O(1)` 정확.

```ts
function lengthOfLastWord(s: string): number {
    let result = 0
    let isStartChar = false

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i].charCodeAt(0) !== 32) {
            isStartChar = true
            result++
        }

        if (s[i].charCodeAt(0) === 32 && isStartChar) {
            return result
        }
    }

    return result
}
```

#### ⭐ 노트가 실제로 작동한 사례

| | 08-03 (최초) | 08-12 (복습) |
|---|---|---|
| 방식 | `split(' ')` → `filter` → `at(-1)` | **뒤에서부터 인덱스 스캔** |
| 공간 | `O(n)` (배열 2개 생성) | **`O(1)`** ✅ |
| 힌트 | — | **0회** |

08-03 노트에 *"`O(1)` 공간 해법 — 뒤에서부터 스캔"* 을 적어뒀는데, 복습에서 **그 방식이 먼저 나왔다.**
`isStartChar` 플래그로 "뒤쪽 공백 건너뛰기 / 글자 세기" 2단계를 while 두 개 대신 플래그 하나로 합친 변형.

#### 이전 실수 노트와 대조 — **둘 다 미재발** ✅

| 08-03 실수 | 08-12 |
|---|---|
| `.split('').length` — 불필요한 `O(n)` 할당 `#죽은코드방치` | 배열 생성 자체가 없음 ✅ |
| `.at(-1)` 의 TS 타입이 `T \| undefined` | `.at()` 안 씀 ✅ |

---

#### 개선 ① `s[i].charCodeAt(0)` → `s.charCodeAt(i)`

```ts
s[i].charCodeAt(0)    // ① s[i]로 1글자 문자열을 새로 만들고 ② 그 0번 코드를 읽음
s.charCodeAt(i)        // 원본에서 바로 읽음 — 중간 문자열 생성 없음
```

게다가 한 반복에 **두 번** 호출하고 있다. 한 번 읽어 변수에 담고 `else if` 로:

```ts
for (let i = s.length - 1; i >= 0; i--) {
    const c = s.charCodeAt(i)
    if (c !== 32) { isStartChar = true; result++ }
    else if (isStartChar) return result
}
```

**실측** (1만 글자 × 2만회):

| | 시간 |
|---|---|
| `s[i].charCodeAt(0)` 2회 | 349ms |
| `s.charCodeAt(i)` 1회 | 229ms |

> 두 `if` 가 **서로 배타적**(`!== 32` / `=== 32`)인데 `if` 두 개면 매번 둘 다 평가한다. `else if` 면 하나만.

#### 개선 ② `charCodeAt` 이 꼭 필요한가

```ts
s[i] !== ' '      // 더 짧고 읽기 쉽다
```

[0125. Valid Palindrome](../../03-Two-Pointers/0125-valid-palindrome/README.md) 에서는 **영숫자 범위 판정**(48~57 / 65~90 / 97~122)이 필요해서 `charCodeAt` 이 맞았다.
여기선 **공백 하나만** 비교하므로 문자 그대로가 낫다.

> 🔑 **목적에 맞는 도구를 고른다.** `32` 라는 매직 넘버를 쓰면 읽는 사람이 "32가 뭐지?"를 한 번 거쳐야 한다.

### 2026-08-28 (2회차) — 통과, 지적 3건(전부 스타일) · `3일` → `7일` 단계

```
고정 14/14  ·  랜덤 30만건 불일치 0건
최악 입력 (1만자 단일 단어) × 2만회: 402ms
```

```ts
function lengthOfLastWord(s: string): number {
    let result = 0
    let isStartChar = false

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i].charCodeAt(0) !== 32) {
            isStartChar = true
            result++
        }
        if (s[i].charCodeAt(0) === 32 && isStartChar) {
            return result
        }
    }
    return result
}
```

#### ✅ 08-12의 `O(n)` → `O(1)` 개선을 지켜냈다

`split()` · `trimEnd()` 로 새 배열/문자열을 만들지 않고 **뒤에서부터 훑어 `O(1)`** 로 끝냈다. 이 문제의 핵심.
복잡도 `O(n)` / `O(1)` 스스로 정확히 제시.

> 시간은 최악 `O(n)`(전체가 한 단어)이지만 실제로는 **`후행 공백 + 마지막 단어`** 만큼만 돈다. 조기 반환이 살아 있다.

---

#### ⚠️ 1. `charCodeAt(0) !== 32` 는 매직 넘버

```
charCodeAt(0) !== 32 : 7ms
s[i] !== ' '         : 7ms      ← 동일
```

**성능 이득이 0.** `32`가 공백이라는 걸 아는 사람만 읽을 수 있는 코드가 됐다.

> 💡 `charCodeAt` 이 **정당한 경우**는 따로 있다 — **문자를 인덱스로 쓸 때**.
> ```ts
> counts[s.charCodeAt(i) - 97]++      // 'a'~'z' → 0~25 배열 인덱스
> ```
> 이건 대체 불가능하다. 반면 **단순 비교**에 쓰면 얻는 것 없이 가독성만 잃는다.

#### ⚠️ 2. 두 `if` 가 상호배타적 — `else if` 여야 한다

```ts
if (s[i].charCodeAt(0) !== 32) { … }                  // 공백이 아닐 때
if (s[i].charCodeAt(0) === 32 && isStartChar) return  // 공백일 때
```

**같은 문자를 두 번 검사**한다. 첫 번째가 참이면 두 번째는 **반드시** 거짓이다.

```ts
if (s[i] !== ' ') { inWord = true; result++ }
else if (inWord) return result
```

`=== 32` 검사가 통째로 사라지고 *"공백이 아니면 세고, 공백인데 이미 단어를 만났으면 끝"* 이 그대로 읽힌다.

> [0027. Remove Element](../0027-remove-element/README.md) · [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 의 **"양쪽 분기에 똑같은 줄이 있으면 밖으로 뺀다"** 의 반대 형태:
> **한쪽 분기의 조건이 다른 쪽의 부정이면 `else` 로 묶는다.**

#### ⚠️ 3. `isStartChar` 라는 이름

*"이 문자가 시작 문자인가"* 가 아니라 **"단어에 진입했는가"** 라는 **순회의 상태 플래그**다. 문자의 속성이 아니다.

```ts
let inWord = false        // 또는 foundWord
```

*(`#변수명불명확` 계열이나 동작 영향 없고 의도는 읽히므로 **카운트 미포함**)*

---

### 정리본

```ts
function lengthOfLastWord(s: string): number {
    let result = 0
    let inWord = false

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] !== ' ') { inWord = true; result++ }
        else if (inWord) return result
    }
    return result
}
```

**판정**: 정답 + 공간 `O(1)` 유지 ✅ / 지적 전부 스타일 → `3일` → **`7일` 단계** (다음 **09-08** — 간격을 평일로 계산)

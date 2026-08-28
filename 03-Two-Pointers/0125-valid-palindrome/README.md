# 125. Valid Palindrome

- **난이도**: Easy
- **유형**: 투 포인터 (양끝 → 안쪽)
- **링크**: https://leetcode.com/problems/valid-palindrome/
- **최초 풀이**: 2026-08-03 / **결과**: 통과
- **챕터**: Two Pointers 첫 문제

---

## 문제 요약

**영숫자만 남기고 대소문자를 무시**했을 때 회문(palindrome)인지 판정.

```
"A man, a plan, a canal: Panama"  →  "amanaplanacanalpanama"  →  true
"race a car"                      →  "raceacar"               →  false
" "                               →  ""                       →  true
```

- **Constraints**: `1 <= s.length <= 2×10⁵`, 출력 가능한 ASCII 전부
- **alphanumeric = 영문자 + 숫자.** 숫자를 빠뜨리면 틀린다

---

## 핵심 — 전처리하지 않는다

처음엔 "정제된 문자열을 먼저 만들어야 투 포인터를 쓸 수 있는 것 아닌가?"라고 생각했지만 **아니다.**

> **포인터가 움직이면서 무시할 문자를 그때그때 건너뛴다.**

```
"race a car"
 0 1 2 3 4 5 6 7 8 9
 r a c e _ a _ c a r
```

| 단계 | left | right | 동작 |
|---|---|---|---|
| 1 | 0 `r` | 9 `r` | 둘 다 영숫자, 일치 ✅ → 좁힘 |
| 2 | 1 `a` | 8 `a` | 일치 ✅ → 좁힘 |
| 3 | 3 `e` | 6 `_` | **공백!** 비교 없이 `right--` |
| 4 | 3 `e` | 5 `a` | `e` vs `a` → **불일치 → false** |

3단계에서 새 문자열을 만들지 않고 **포인터만 한 칸 더 밀었다.** → 공간 `O(1)`

---

## 최종 정답

```ts
function isAlnum(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return (c >= 48 && c <= 57)     // 0-9
      || (c >= 65 && c <= 90)     // A-Z
      || (c >= 97 && c <= 122);   // a-z
}

function isPalindrome(s: string): boolean {
    let left = 0
    let right = s.length - 1

    while (left < right) {
        if (!isAlnum(s[left]))  { left++;  continue }
        if (!isAlnum(s[right])) { right--; continue }

        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false

        left++
        right--
    }
    return true
}
```

- **시간 `O(n)` / 공간 `O(1)`**

### 엣지 케이스 검증

| 입력 | 동작 | 결과 |
|---|---|---|
| `" "` | `left=0, right=0` → `while` 조건 거짓 | `true` ✅ |
| `",.,"` | left가 밀려 right와 만남 | `true` ✅ |
| `"0P"` | `'0'` vs `'p'` | `false` ✅ (숫자 포함해야 맞음) |

**영숫자가 하나도 없으면 `true`** — 빈 문자열은 회문이다. `while` 조건이 자연스럽게 처리해준다.

---

## ⚠️ 실수 — `isAlnum &&` (함수 참조 vs 호출)

```ts
if (isAlnum && (s[left].toLowerCase() !== s[right].toLowerCase()))
//  ^^^^^^^ 함수 객체 자체. 호출이 아니다!
```

**함수 이름만 쓰면 함수 객체를 참조하는 것**이고, 함수 객체는 **항상 truthy** 다.
→ `isAlnum && X` 는 그냥 `X` 와 같다. 우연히 동작했을 뿐 **아무 의미 없는 코드.**

```js
isAlnum          // [Function: isAlnum]  ← 객체
isAlnum(ch)      // true / false          ← 호출 결과
Boolean(isAlnum) // 항상 true
```

**게다가 이 시점에는 검사 자체가 불필요하다.** 위의 두 `continue` 를 통과했다면 `s[left]`, `s[right]` 는 **이미 영숫자임이 보장**된다.

> 실무 관련 함정 — React에서도 같은 실수가 난다:
> ```jsx
> {isLoading && <Spinner />}      // ✅
> {checkLoading && <Spinner />}   // ❌ 함수 참조 → 항상 렌더
> ```

---

## 알아야 할 상식

### 1. ASCII 코드 (외울 것)

| 문자 | 코드 |
|---|---|
| `'0'` ~ `'9'` | **48 ~ 57** |
| `'A'` ~ `'Z'` | **65 ~ 90** |
| `'a'` ~ `'z'` | **97 ~ 122** |

대소문자 차이는 정확히 **32**. (`'a'` 97 − `'A'` 65)
→ `c | 32` 로 소문자화, `c & ~32` 로 대문자화하는 비트 트릭도 있다.

### 2. 정규식 없이도 풀린다

```js
// 정규식 없이
(ch >= 'a' && ch <= 'z')       // 문자 비교도 코드 순서를 따르므로 가능
ch.charCodeAt(0)               // 코드 직접 비교

// 정규식으로
/[a-z0-9]/i.test(ch)           // 영숫자 하나인가
s.replace(/[^a-z0-9]/gi, '')   // 영숫자 아닌 것 전부 제거
```

**코테용 정규식 5개**: `[abc]` 문자클래스 / `[^abc]` 부정 / `\d \w \s` / `+ *` / 플래그 `g i`

### 3. `toLowerCase()` — 전체 vs 글자 하나

```js
s.toLowerCase()             // 새 문자열 n개 → O(n) 공간
s[left].toLowerCase()       // 1글자 문자열 → O(1)
```
**글자 단위로 변환하면 공간이 안 늘어난다.** 이게 `O(1)`을 유지하는 포인트.

### 4. 전처리 방식과의 비교

```ts
const t = s.replace(/[^a-z0-9]/gi, '').toLowerCase();
return t === t.split('').reverse().join('');   // 통과하지만 O(n) 공간
```

| | 전처리 | 투 포인터 |
|---|---|---|
| 공간 | `O(n)` | **`O(1)`** |
| 조기 종료 | 전처리는 무조건 전체 순회 | **불일치 즉시 중단** |

→ [투 포인터](../../concepts/two-pointers.md)

### 5. 제출 전 `console.log` 제거

```ts
console.log('0'.toLowerCase())   // 디버깅 잔재
```
동작에는 영향 없지만, **대량 테스트케이스에서 출력이 쌓이면 시간 초과 원인이 되기도 한다.**

---

## 실수 노트

- **`isAlnum`을 호출하지 않고 참조만 함** → 함수 객체는 항상 truthy. `()` 확인
- 1차 시도에서 **숫자(48~57) 범위 누락** → "alphanumeric"은 영문자 + **숫자**
- `s.[left]` 오타 (점 불필요)
- 디버깅용 `console.log` 방치
- ✅ **시간·공간 복잡도 둘 다 정확** (2문제 연속)

---

## 복습 기록

**다음 복습**: 2026-08-17 (마지막 풀이일 + 5일)

### 2026-08-12 (1회차) — 통과, 접근 피드백 2회

백지 재작성 **통과**. 고정 17건 + 랜덤 30만건 불일치 0. 최대 입력(2×10⁴) 500회 40ms.
복잡도 `O(n)` / `O(1)` 정확.

```ts
function isAlphanumeric(s: string): boolean {
    const ch = s.charCodeAt(0)
    return (ch >= 'A'.charCodeAt(0) && ch <= 'Z'.charCodeAt(0))
        || (ch >= 'a'.charCodeAt(0) && ch <= 'z'.charCodeAt(0))
        || (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0))
}

function isPalindrome(s: string): boolean {
    let left = 0
    let right = s.length - 1

    while (left < right) {
        if (!isAlphanumeric(s[left]))  { left++;  continue }
        if (!isAlphanumeric(s[right])) { right--; continue }

        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false

        left++
        right--
    }

    return true
}
```

#### 접근 경로

1차 접근은 **전처리 방식**(영숫자만 남긴 새 문자열을 만들고 `i` vs `len-1-i` 비교) — `O(n)` / **`O(n)`**.
*"투 포인터가 움직이면서 무시할 문자를 그 자리에서 건너뛰면 안 되나?"* 를 묻자 바로 `O(1)` 버전으로 전환.

#### ⚠️ 막힌 지점 — 루프 종료 조건

*"`i`와 `j`가 같아지는 순간"* 으로 잡았다가, `",,,,"` 처럼 **영숫자가 하나도 없으면 포인터가 정확히 만나지 않고 서로 지나쳐버린다**는 걸 발견.

그다음 **`i <= s.length / 2`** 를 제안했는데 이것도 틀렸다:

```
s = ",,,,,,ab"          길이 8, 절반 = 4
정제하면 "ab" → 회문 아님 → 정답 false

i=0~4 전부 ',' 건너뜀 → i=5 → 조건 5 <= 4 거짓 → 루프 종료 → true ❌
'a'와 'b'를 비교해보지도 못하고 끝난다
```

> ### 🔑 무시할 문자를 건너뛰는 투 포인터는 **대칭으로 움직이지 않는다**
> `i`만 여러 번 움직일 수도, `j`만 여러 번 움직일 수도 있다.
> 따라서 **"`i`가 어디까지 갔는가"는 아무 의미가 없다.** 종료 조건은 반드시 **두 포인터의 관계**로 쓴다.
>
> **"언제 멈추나" 대신 "언제 계속 도나"로 뒤집으면** 답이 하나로 나온다:
> ```ts
> while (left < right)     // 만나는 경우(===)와 지나친 경우(>)가 둘 다 처리됨
> ```
> 그리고 **건너뛰는 안쪽에도 같은 가드가 필요**하다.

#### 이전 실수 노트와 대조 — **4개 전부 미재발** ✅

| 08-03 실수 | 08-12 |
|---|---|
| `isAlnum` 을 호출하지 않고 참조만 (`isAlnum &&`) `#함수참조vs호출` | `isAlphanumeric(s[left])` 정확히 호출 ✅ |
| 숫자(48~57) 범위 누락 `#엣지케이스누락` | `'0'~'9'` 포함 ✅ (`"0P"` 통과) |
| `s.[left]` 오타 | 없음 ✅ |
| 디버깅용 `console.log` 방치 `#죽은코드방치` | 없음 ✅ |

#### ✅ 개선된 점 — 매직 넘버 제거

```ts
// 08-03
return (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122)

// 08-12
return (ch >= 'A'.charCodeAt(0) && ch <= 'Z'.charCodeAt(0)) || ...
```

**읽는 사람이 "65가 뭐지?"를 안 거쳐도 된다.** 같은 날 [0058. Length of Last Word](../../01-Array-String/0058-length-of-last-word/README.md) 에서 `32`(공백)를 매직 넘버로 쓴 것과 대비.

다만 `'A'.charCodeAt(0)` 이 **매 호출마다 실행**된다. 상수라 모듈 스코프로 빼거나, 아예 문자 비교로:

```ts
(ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')
```
문자 비교도 **코드 순서를 따르므로** 동일하게 동작한다. `charCodeAt` 자체가 불필요.

### 2026-08-28 (2회차) — 통과, **피드백 0회** · `3일` → `7일` 단계

```
고정 16/16  ·  랜덤 30만건 불일치 0건 (특수문자 30종 랜덤 조합)
20만자 입력 교차검증 통과
```

```ts
function isAlphanumeric(s: string): boolean {
    const ch = s.charCodeAt(0)
    return (ch >= 'A'.charCodeAt(0) && ch <= 'Z'.charCodeAt(0))
        || (ch >= 'a'.charCodeAt(0) && ch <= 'z'.charCodeAt(0))
        || (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0))
}

function isPalindrome(s: string): boolean {
    let left = 0
    let right = s.length - 1

    while (left < right) {
        if (!isAlphanumeric(s[left]))  { left++;  continue }
        if (!isAlphanumeric(s[right])) { right--; continue }
        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false
        left++; right--
    }
    return true
}
```

#### ✅ 실수 4개 **2연속** 미재발

| 08-03 실수 | 08-12 | **08-28** |
|---|---|---|
| `isAlnum` 호출 안 하고 참조만 `#함수참조vs호출` | ✅ | ✅ `isAlphanumeric(s[left])` |
| 숫자(`0~9`) 범위 누락 `#엣지케이스누락` | ✅ | ✅ (`"0P"` 통과) |
| `s.[left]` 오타 | ✅ | ✅ |
| 디버깅 `console.log` 방치 `#죽은코드방치` | ✅ | ✅ |

---

#### 👀 같은 세션의 [0058. Length of Last Word](../../01-Array-String/0058-length-of-last-word/README.md) 와 **정반대 스타일**

15분 사이에 푼 두 문제에서 정확히 반대로 썼다.

```ts
// 0058 — 몇 분 전
if (s[i].charCodeAt(0) !== 32)                        // 32가 뭔지 모름   ❌

// 0125 — 지금
ch >= 'A'.charCodeAt(0) && ch <= 'Z'.charCodeAt(0)    // 뭘 비교하는지 보임  ✅
```

**여기 방식이 맞다.** 08-12에 매직 넘버 `65/90/97/122/48/57` 을 걷어내며 얻은 개선인데,
**그게 이 문제에만 남아 있고 0058엔 적용되지 않았다.** → 원칙을 **문제별로 따로 기억**하고 있다는 신호.

---

#### 성능 — 흥미로운 결과 3가지 (20만자 × 50회)

```
제출본 ('A'.charCodeAt(0) 매번):  39ms
상수로 뽑기                    :  33ms      ← 18% 빠름
정규식 /[a-z0-9]/i.test        : 105ms      ← 2.7배 느림 (!)
charCode 직접 소문자화         :  18ms      ← 2.2배 빠름
```

**① `'A'.charCodeAt(0)` 은 매번 다시 계산된다**

호출마다 리터럴에서 `charCodeAt` 을 6번 호출한다. 상수로 뽑으면 가독성은 그대로 두고 그 비용만 사라진다.

```ts
const CODE_A = 'A'.charCodeAt(0), CODE_Z = 'Z'.charCodeAt(0)
const CODE_a = 'a'.charCodeAt(0), CODE_z = 'z'.charCodeAt(0)
const CODE_0 = '0'.charCodeAt(0), CODE_9 = '9'.charCodeAt(0)
```

> **매직 넘버를 없애는 방법이 "계산식으로 바꾸기"만 있는 게 아니다.** 이름을 주는 게 본질이고, 상수로 뽑으면 이름도 얻고 계산도 한 번만 한다.

**② 정규식이 제일 느리다**

`/[a-z0-9]/i.test(c)` 는 짧아서 많이 쓰지만, **문자 하나 검사하려고 정규식 엔진을 매번 호출**하는 비용이 범위 비교보다 훨씬 크다.

> 🔑 **짧은 코드 ≠ 빠른 코드.** 정규식은 *"패턴이 복잡할 때"* 이득이지 `a-z0-9` 같은 단순 범위엔 손해다.

**③ `s[left]` 는 문자열 객체를 만든다**

JS엔 char 타입이 없어 `s[left]` 는 **길이 1짜리 새 문자열**이다. `.toLowerCase()` 가 거기서 또 하나 만든다.

```ts
s.charCodeAt(left)          // 숫자 하나 — 할당 없음
```

이게 2.2배 차이의 정체다. 다만 **가독성을 크게 해치므로 지금 코드로 충분** — `O(n)` 안의 상수 배수일 뿐이고 면접에서도 지금 버전이 더 좋은 답이다.

**판정**: 정답 · 피드백 0회 · 실수 4개 2연속 미재발 · 매직 넘버 개선 유지 → `3일` → **`7일` 단계** (다음 **09-08** — 간격을 평일로 계산)

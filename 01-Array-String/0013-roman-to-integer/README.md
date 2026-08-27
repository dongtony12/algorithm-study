# 13. Roman to Integer

- **난이도**: Easy
- **유형**: 문자열, 해시맵
- **링크**: https://leetcode.com/problems/roman-to-integer/
- **최초 풀이**: 2026-08-03 / **결과**: 통과 (첫 시도)

---

## 문제 요약

로마 숫자 문자열을 정수로 변환. **Constraints: `1 <= s.length <= 15`** → 복잡도 압박 없음, **정확성이 전부**.

| 기호 | I | V | X | L | C | D | M |
|---|---|---|---|---|---|---|---|
| 값 | 1 | 5 | 10 | 50 | 100 | 500 | 1000 |

**빼기 표기 6가지**: `IV=4  IX=9  XL=40  XC=90  CD=400  CM=900`

---

## 핵심 규칙

```
VI = 5 + 1 = 6      ← 큰 것 먼저 = 덧셈
IV = 5 − 1 = 4      ← 작은 것 먼저 = 뺄셈
```

같은 글자인데 **순서만 다르면 값이 완전히 달라진다.**

---

## 내 풀이 (통과) — 2글자 우선 매칭

```ts
const map = {
  'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000,
  'IV':4,'IX':9,'XL':40,'XC':90,'CD':400,'CM':900
}

let sum = 0;
for (let i = 0; i < s.length; ) {
    const index = s[i] + s[i+1];
    const word = map[index] ? index : s[i];   // 2글자 먼저 시도, 없으면 1글자
    sum += map[word];
    i += word.length;                          // 매칭된 길이만큼 점프
}
return sum;
```

- **시간 `O(n)` / 공간 `O(1)`**
- `i`를 `word.length`만큼 건너뛰는 게 핵심. 2글자 매칭이면 두 칸 점프.

---

## ⚠️ 공간복잡도 — `map`은 `O(1)`이다

**틀리게 센 부분**: `map` 객체가 있으니 `O(n)`이라고 판단 → **아니다.**

> **공간복잡도는 "입력 크기 `n`이 커질 때 추가 공간이 같이 커지는가"를 본다.**

| | 크기 | 복잡도 |
|---|---|---|
| `map` | **항상 13개.** `s`가 1글자든 15글자든 13개 | **`O(1)`** |
| `index`, `word` | 최대 2글자 문자열 | `O(1)` |
| `sum` | 숫자 하나 | `O(1)` |

### [0169. Majority Element](../0169-majority-element/README.md) 와 비교

```js
// 169번 — 입력에 따라 커진다
const counts = new Map();
for (const num of nums) counts.set(num, ...);   // 고유값 개수만큼 증가 → O(n)

// 13번 — 입력과 무관하게 고정
const map = { I:1, V:5, ... };                   // 항상 13개 → O(1)
```

> ### 🔑 자료구조가 있다고 자동으로 `O(n)`이 아니다.
> **"입력이 커지면 이것도 같이 커지나?"** 를 물어야 한다. 안 커지면 `O(1)`.
>
> 예: 알파벳 26칸 배열, 십진수 10칸 배열, 고정 룩업 테이블 → 전부 `O(1)`

---

## 대안 해법 — 규칙 하나로 통합

빼기 6가지를 따로 등록하지 않고 **한 줄 규칙**으로 처리할 수 있다.

> **현재 값이 다음 값보다 작으면 빼고, 아니면 더한다.**

```ts
function romanToInt(s: string): number {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let sum = 0;

  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = map[s[i+1]];              // 마지막이면 undefined
    sum += (next !== undefined && cur < next) ? -cur : cur;
  }
  return sum;
}
```

### 왜 되나

빼기 표기 6가지를 나란히 보면 **전부 "작은 값 + 큰 값" 순서**다.

```
IV: I(1) < V(5)   →  -1 + 5 = 4   ✅
IX: I(1) < X(10)  →  -1 + 10 = 9  ✅
CM: C(100) < M(1000) → -100 + 1000 = 900 ✅
```

그리고 **정상 표기에서는 절대 작은 게 앞에 오지 않는다** (`VI`, `XI`, `MC`...).
→ "작은 게 앞에 오면 빼기"라는 규칙이 **예외 없이** 성립한다.

| | 맵 크기 | 특수 케이스 |
|---|---|---|
| 내 풀이 | 13개 | 6가지를 명시적으로 등록 |
| 대안 | **7개** | **없음** (규칙으로 흡수) |

둘 다 정답. 대안은 짧고, 내 풀이는 의도가 눈에 보인다. **면접에선 어느 쪽이든 무방.**

---

## 알아야 할 상식

### 1. ⚠️ truthy 체크로 "존재 여부"를 판단하지 말 것

```ts
const word = map[index] ? index : s[i];      // ⚠️ 값이 0이면 깨진다
```

여기선 모든 값이 `1` 이상이라 안전하지만, **값에 `0`, `""`, `false`가 있으면 "없음"으로 오판**한다.

```ts
// 안전한 대안
const word = (index in map) ? index : s[i];
const word = map[index] !== undefined ? index : s[i];
```

> **"키가 있나?" 와 "값이 참인가?" 는 다른 질문이다.** 실무에서도 자주 터진다.

### 2. `s[i] + s[i+1]` 의 마지막 글자 처리

`i`가 마지막이면 `s[i+1]`은 `undefined` → `"I" + undefined === "Iundefined"`
→ `map["Iundefined"]`는 없으므로 1글자로 후퇴 → **결과적으로 동작한다.**

하지만 [0088. Merge Sorted Array](../0088-merge-sorted-array/README.md) 에서 본 **"우연히 맞는 코드"** 패턴이다. 더 명확한 방법:

```ts
const pair = s.slice(i, i + 2);   // 마지막이면 자동으로 1글자만 반환
```
`slice`는 범위를 벗어나면 알아서 잘라준다. `undefined` 문자열 결합에 의존하지 않는다.

### 3. 객체 `{}` vs `Map` — 언제 뭘 쓰나

[0169. Majority Element](../0169-majority-element/README.md) 에서는 `Map`을 권했는데 여기선 객체가 자연스럽다. 기준:

| 상황 | 선택 |
|---|---|
| 키가 **원래 문자열**이고 **집합이 고정**됨 (룩업 테이블) | **객체** `{}` ✅ |
| 키가 **숫자·객체**거나 **런타임에 늘어남** (카운팅) | **`Map`** ✅ |

TS라면 타입을 붙여두면 좋다:
```ts
const map: Record<string, number> = { ... };
```

### 4. 문자열 인덱싱

```js
s[i]          // 문자 하나 (없으면 undefined)
s.charAt(i)   // 문자 하나 (없으면 "" 빈 문자열)  ← 차이 주의
s.slice(i, j) // 부분 문자열, 범위 초과해도 안전
```

---

## 실수 노트

- **고정 크기 룩업 테이블을 `O(n)` 공간으로 오판** → "입력이 커지면 같이 커지나?"를 물을 것
- `map[key] ? ... : ...` truthy 체크 → `in` 연산자나 `!== undefined` 로
- 변수명 `index`가 실제로는 인덱스가 아니라 **키 문자열** → `pair`, `key` 등으로

---

## 복습 기록

**다음 복습**: 2026-09-03 (통과 → `7일` 단계)

### 2026-08-12 (1회차) — 통과, 접근 피드백 1회

백지 재작성 **통과**. 고정 14건 + **1~3999 전수 검사** 불일치 0건. 복잡도 `O(n)` / `O(1)` 정확.

**최초 풀이(08-03)의 "2글자 우선 매칭" 대신 대안 해법이었던 "규칙 통합" 방식으로 풀었다.** 맵이 7개로 줄고 특수 케이스가 사라진 쪽.

```ts
function romanToInt(s: string): number {
    const symbolValue = [
        ["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1000],
    ] as const

    const symbolObj = new Map<string,number>(symbolValue)

    let result = 0

    for (let i = 0; i < s.length; i++) {
        let curVal = symbolObj.get(s[i])

        if (symbolObj.get(s[i+1]) > curVal) {
            result += symbolObj.get(s[i+1]) - curVal
            i++
        } else {
            result += curVal
        }
    }

    return result
}
```

#### 접근 단계에서 잡힌 것 — 문자 비교 vs 값 비교

1차 접근이 **`s[i] < s[i+1]`** 이었다. 이건 **문자 코드 비교**다.

| 쌍 | 문자 코드 | 결과 | 필요한 값 |
|---|---|---|---|
| `IV` | I(73) < V(86) | ✅ true | true |
| `IX` | I(73) < X(88) | ✅ true | true |
| **`XL`** | **X(88) < L(76)** | **❌ false** | **true** |
| **`XC`** | **X(88) < C(67)** | **❌ false** | **true** |
| `CD` | C(67) < D(68) | ✅ true | true |
| `CM` | C(67) < M(77) | ✅ true | true |

`"XL"` 이 `40`이 아니라 `60`이 된다. 지적하자 바로 **값 비교(`.get()`)** 로 수정.

> 🔑 **문자열끼리 `<` 는 사전순(문자 코드) 비교다.** 값을 비교하려면 반드시 매핑을 거칠 것.

#### "왜 되는가" — 스스로 논증함

빼기 6가지는 **전부 "작은 값이 앞, 큰 값이 뒤"** 이고, **정상 표기에서는 절대 그 순서가 안 나온다**(`VI`, `XI`, `MC` … 전부 큰 게 앞).
→ *"작은 게 앞에 오면 뺀다"* 규칙이 **예외 없이** 성립.

#### 이전 실수 노트와 대조

| 08-03 실수 | 08-12 |
|---|---|
| 고정 크기 룩업 테이블을 `O(n)` 공간으로 오판 `#공간복잡도오판` | **`O(1)` 정확** + *"맵 크기가 고정이라 n만큼 차지할 수 없다"* 고 이유까지 설명 ✅ |
| `map[key] ? :` truthy 체크 | truthy 체크 안 씀 ✅ |
| 변수명 `index`가 실제로는 키 문자열 `#변수명불명확` | `symbolValue`, `symbolObj`, `curVal` — 역할이 드러남 ✅ |

**3개 전부 미재발.**

---

#### 📌 TypeScript — `Map.get()` 은 `T | undefined`

```ts
symbolObj.get("I")     // number | undefined   ← 키가 있는지 컴파일 타임에 모르므로
```

`strictNullChecks` 가 켜진 환경에서는 이 코드가 **컴파일되지 않는다**:

```
error TS2532: Object is possibly 'undefined'.
error TS18048: 'curVal' is possibly 'undefined'.
```

| 환경 | 결과 |
|---|---|
| LeetCode (strictNullChecks off) | ✅ 통과 |
| `tsc --strictNullChecks false` | ✅ 통과 |
| **TypeScript 7 기본값** (strict가 기본 on) | ❌ 에러 5건 |

**대응 3가지**
```ts
const curVal = symbolObj.get(s[i]) ?? 0     // (a) 기본값 — 이 문제엔 이게 최적
const curVal = symbolObj.get(s[i])!          // (b) non-null 단언 — 보장을 내가 진다
const map: Record<string, number> = {...}    // (c) 객체는 number로 나옴
const curVal = map[s[i]]
```

**(a)가 이 문제에 특히 맞는 이유**: `s[i+1]` 이 문자열 끝을 넘어가는 건 **정상 동작**인데, 그때 `0`이 되면 `0 > curVal` 이 자연스럽게 `false` → 지금 로직이 그대로 유지된다.
지금 코드는 **`undefined > number` 가 `false`인 것에 의존**하고 있다(`#우연히맞는코드` 계열). `?? 0` 은 그 의존을 명시적으로 만든다.

> ⚠️ 회사 프로젝트(Next.js/TS)는 대부분 `strict: true` 다. `Map.get()` 쓸 때 바로 만나는 문제.

### 2026-08-27 (2회차) — 통과, **피드백 0회** · `3일` → `7일` 단계

**1~3999 전수 검사 불일치 0건.** 복잡도 `O(n)` / `O(1)` — 요구 없이 먼저 제시.
08-12와 동일한 "규칙 통합" 방식(맵 7개)을 백지에서 재현.

#### ✅ 08-12에 피드백이 필요했던 지점 — 이번엔 통과

| 08-12 | 08-27 |
|---|---|
| 접근 1차가 **문자 비교** (`s[i] < s[i+1]`) → `XL`·`XC` 깨짐 | ✅ **처음부터 값 비교** (`.get()`) |
| 고정 룩업 테이블을 `O(n)` 공간으로 오판 `#공간복잡도오판` | ✅ `O(1)` |
| 변수명 `index` 가 실제로는 키 문자열 `#변수명불명확` | ✅ |

#### 📌 TS 함정은 그대로 (08-12 노트에 이미 정리됨)

```
strictNullChecks off (LeetCode) :  ✅ 통과
strict (실무 기본)              :  ❌ 에러 5건
```

`Map.get()` 이 `number | undefined` 를 반환하는 건 **TS 버전과 무관한 시그니처**다.

**`?? 0` 이 왜 이 문제에 최적인지 스스로 설명함:**

> *"존재하지 않는 값을 0으로 넣으면 어차피 `if (symbolObj.get(s[i+1]) > curVal)` 를 자동으로 pass하게 되기 때문"*

모든 로마 숫자 값이 `1` 이상이므로 **`0 > curVal` 은 항상 거짓** → 자연스럽게 `else` 로 간다.
지금 코드는 `undefined > number` 가 `false` 인 것에 **의존**하는데(`#우연히맞는코드` 계열), `?? 0` 은 **같은 결과를 명시적으로** 만든다.

**판정**: 로직·복잡도 정확 + 문자비교 함정 회피 → `3일` → **`7일` 단계** (다음 복습 09-03)
*(TS 이슈는 LeetCode 제출에 지장 없고 노트에 이미 정리돼 있어 감점 요소로 보지 않음)*

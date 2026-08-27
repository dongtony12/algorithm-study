# 205. Isomorphic Strings

- **난이도**: Easy
- **유형**: 문자열, **해시맵 양방향 매핑**
- **링크**: https://leetcode.com/problems/isomorphic-strings/
- **최초 풀이**: 2026-08-19 / **결과**: 통과 (접근 피드백 1회 — 역방향 검사 누락)

---

## 문제 요약

`s` 의 문자들을 치환해 `t` 를 만들 수 있으면 **isomorphic**.

- 한 문자의 **모든 등장**은 **같은 문자로** 치환
- **서로 다른 두 문자가 같은 문자로 치환될 수 없다** ← 이게 함정
- 자기 자신으로의 치환은 허용, 순서는 유지

```
"egg"   / "add"    →  true    (e→a, g→d)
"foo"   / "bar"    →  false   (o가 a와 r 둘로 가야 함)
"paper" / "title"  →  true
```

- **Constraints**: `1 <= s.length <= 5*10^4`, **`t.length == s.length`**(길이 같음 보장), **임의의 유효한 ASCII 문자**
  ← **소문자 26개가 아니다.** 26칸 배열 패턴을 그대로 가져오면 안 된다

---

## ⚠️ 접근 1차 — 단방향만 검사했다

> *"`key: s[i]`, `value: t[i]` 로 Map에 넣고, 키가 있으면 값이 `t[i]`와 같은지 확인"*

**반례:**

```
s = "ab",  t = "aa"

i=0:  'a' 없음  →  set('a', 'a')
i=1:  'b' 없음  →  set('b', 'a')     ← 그냥 넣어버린다
→ true 반환      ❌  정답은 false
```

`'a'` 와 `'b'` **서로 다른 두 문자가 둘 다 `'a'` 로** 치환됐다. 문제의 세 번째 규칙 위반.

> ### 🔑 `s → t` 맵만 있으면 **`t` 쪽에서 본 충돌을 알 수 없다**
> *"두 문자가 같은 문자로 갈 수 없다"* 는 **역방향 제약**이므로 역방향을 볼 수단이 필요하다.

---

## 최종 정답 (제출본)

```ts
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
```

- **시간 `O(n)` / 공간 `O(1)`** (`n` = s.length, `t.length == s.length` 이므로 축 하나)
- 검증: 고정 14건 + 랜덤 30만건 불일치 0

---

## ⚠️ `[...values()].includes()` 가 왜 `O(n²)` 이 아닌가

루프 안에서 **배열을 만들고 선형 탐색**하니 느릴 것 같지만, 실측은 차이가 없었다.

```
values() 스캔 (제출본) : 86ms
맵 2개                 : 85ms      (n = 5×10⁴, 200회)
```

**이유 — 그 분기가 상수 번만 실행된다:**

```
[...values()] 는 !has 분기 안에만 있다
  → "s에 처음 등장하는 문자"일 때만 실행
  → ASCII는 최대 128종  →  분기 실행 횟수 ≤ 128번  (n과 무관!)
  → 각 실행 비용도 ≤ 128
  → 총합 128 × 128 = 상수
```

> ### 🔑 [0169. Majority Element](../../01-Array-String/0169-majority-element/README.md) 의 `#숨은반복문` 과 겉모습은 같은데 결론이 다르다
> | | 안쪽 `O(n)` 연산이 몇 번 실행되나 | 결과 |
> |---|---|---|
> | [0169. Majority Element](../../01-Array-String/0169-majority-element/README.md) (`for` 안의 `filter`) | **`n`에 비례** | `O(n²)` |
> | **205 (`!has` 안의 `values()` 스캔)** | **최대 128번 (상수)** | `O(n)` |
>
> **"루프 안에 `O(n)` 연산이 있다"가 아니라 "그게 몇 번 실행되는가"를 봐야 한다.**

**알파벳이 유한하다는 전제가 이 코드를 구해준다.** 유니코드처럼 무제한이면 `O(n²)` 이 된다.

---

## 개선 — 맵 2개 (양방향)

```ts
function isIsomorphic(s: string, t: string): boolean {
    const sToT = new Map<string, string>()
    const tToS = new Map<string, string>()

    for (let i = 0; i < s.length; i++) {
        const x = s[i], y = t[i]
        if (sToT.has(x)) {
            if (sToT.get(x) !== y) return false
        } else {
            if (tToS.has(y)) return false      // 역방향 충돌 — O(1) 조회
            sToT.set(x, y)
            tToS.set(y, x)
        }
    }
    return true
}
```

- **의도가 코드에 드러난다** — *"양방향 매핑이 필요하다"* 가 자료구조로 표현됨
- **전제가 깨져도 안전하다** — 알파벳이 무제한이어도 `O(n)` 유지

> 오늘 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 에서 배운 것과 같은 얘기 — **지금 되는 이유가 "전제" 덕분이면, 그 전제를 알고 써야 한다.**

---

## 알아야 할 상식

### 1. 왜 26칸 배열을 쓰면 안 되나

Constraints가 **"임의의 유효한 ASCII 문자"** 다. `'!'`, `'3'`, `' '` 전부 들어온다.
`charCodeAt(0) - 97` 로 인덱싱하면 **음수 인덱스**가 나온다.

ASCII 전체를 쓰려면 `new Array(128).fill(-1)` 처럼 **오프셋 없이 코드값 그대로** 인덱싱해야 한다.

| | 배열 크기 | 오프셋 |
|---|---|---|
| 소문자만 ([0383. Ransom Note](../0383-ransom-note/README.md), [0242. Valid Anagram](../0242-valid-anagram/README.md)) | 26 | `-97` |
| **ASCII 전체 (이 문제)** | **128** | **없음** |

→ [해시맵](../../concepts/hashmap.md) · 오늘 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 의 `#패턴오적용` 과 같은 확인 절차

### 2. `290. Word Pattern` 과 같은 문제다

다음 목록의 `290. Word Pattern` 은 **문자 ↔ 단어** 양방향 매핑이다. 구조가 완전히 동일하고 단위만 다르다.

### 3. 대안 — 첫 등장 인덱스 비교

```ts
function isIsomorphic(s: string, t: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.indexOf(s[i]) !== t.indexOf(t[i])) return false
  }
  return true
}
```
**아이디어**: 동형이면 같은 문자의 **첫 등장 위치 패턴**이 같다. 짧고 예쁘지만 `indexOf` 가 `O(n)` 이라 **전체 `O(n²)`** — `n = 5×10⁴` 에서 위험하다. 면접 언급용 카드로만.

---

## 실수 노트

- **역방향 검사 누락** → `s → t` 맵만으로는 *"두 문자가 같은 문자로 갈 수 없다"* 를 못 잡는다. `"ab"`/`"aa"` 반례
- ✅ **복잡도 `O(n)` / `O(1)` 을 처음부터 정확히** — 길이가 같음이 보장되니 축 하나, ASCII 128 고정이니 공간 상수. **오늘 지적받은 두 가지(축 개수·고정 알파벳)를 바로 반영**
- ✅ 지적 후 역방향 검사를 **스스로 추가** (`values()` 스캔 방식)
- ✅ 주석으로 의도를 남김 (*"키가 없으면서 이전에 mapping된 value도 없어야 함"*)

---

## 복습 기록

**다음 복습**: 2026-08-20 (`1일` 단계) — **왜 양방향이 필요한지**를 먼저 말한 뒤 코드로 갈 것

### 2026-08-27 (1회차) — 통과, 지적 2건 · `1일` → `3일` 단계

고정 16건 + **랜덤 30만건 불일치 0건**. (`ab`/`aa`, `aa`/`ab`, `badc`/`baba`, ASCII 기호 포함)

```ts
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
```

#### ✅ 08-19 핵심 피드백 — **역방향 검사 획득**

08-19에는 `sToT` 한 방향만 만들어 `"ab"`/`"aa"` 를 놓쳤다. 이번엔 `tToS` 를 처음부터 같이 세웠다.

```
sToT: a→a, b→a      tToS: a→a
i=1: sToT['b']='a' === t[1]='a'  ✅ 정방향 통과
     tToS['a']='a' !== s[1]='b'  ❌ 역방향에서 잡힘
```

*"첫 등장만 기록(`if(!has)`) → 나중에 전수 확인"* 구조도 논리적으로 맞다. 첫 등장이 곧 그 문자의 확정 짝이고, 이후 등장이 그와 어긋나면 3번째 루프에서 걸린다.

---

#### ⚠️ 공간복잡도 `O(n)` → **`O(1)`** · `#공간복잡도오판` 재발

```
Constraints: s와 t는 임의의 유효한 ASCII 문자로 구성
```

ASCII는 **128개**뿐. `s.length` 가 5만이든 500만이든 **맵 엔트리는 128개를 넘을 수 없다.**

| 자료구조 | 상한 | 복잡도 |
|---|---|---|
| [0169. Majority Element](../../01-Array-String/0169-majority-element/README.md) 의 `counts` | 고유 **숫자** 개수 → `n`까지 증가 | `O(n)` |
| [0013. Roman to Integer](../../01-Array-String/0013-roman-to-integer/README.md) 의 룩업 테이블 | 항상 7개 | `O(1)` |
| **여기 두 맵** | **ASCII 128개** | **`O(1)`** |

> 🔑 **알파벳이 유한하면 그 위에 세운 맵/배열은 `O(1)`.**
> 26칸 알파벳 배열, 10칸 십진수 배열, 128칸 ASCII 맵 — 전부 상수.
> 판단 기준은 **"입력이 커지면 이것도 같이 커지나?"** 하나뿐이다.

---

#### ⚠️ 루프 3개 → 1개 (2배 차이)

```
3패스 (제출본): 170ms
1패스        :  86ms
```

*"전부 기록해두고 → 나중에 확인"* 대신 **기록하는 그 순간 확인**할 수 있다.

```ts
function isIsomorphic(s: string, t: string): boolean {
    const sToT = new Map<string, string>()
    const tToS = new Map<string, string>()

    for (let i = 0; i < s.length; i++) {
        const a = s[i], b = t[i]
        if (sToT.has(a)) { if (sToT.get(a) !== b) return false }   // 이미 본 짝 → 일치 확인
        else {
            if (tToS.has(b)) return false                          // b가 다른 문자에 이미 예약됨
            sToT.set(a, b); tToS.set(b, a)                         // 새 짝 → 양방향 동시 등록
        }
    }
    return true
}
```

**`else` 안의 `if (tToS.has(b)) return false` 가 역방향 검사다.** *"새로 짝지으려는데 `b` 는 이미 임자가 있다"* → 서로 다른 두 문자가 같은 문자로 치환되는 상황.
두 맵을 **항상 같이 넣으므로** 짝이 어긋날 수 없다.

**부수 효과**: `"ab..."`/`"aa..."` 는 **2번째 문자에서 즉시 종료**. 3패스는 어떤 입력이든 `3n` 번을 다 돈다.

---

#### ⚠️ 조건문 중첩 — 드모르간

```ts
if (sToTMap.get(s[i]) === t[i]) {
    if (tToSMap.get(t[i]) !== s[i]) return false
} else return false
```

*"A면 (B 아니면 실패), 아니면 실패"* = **A가 아니거나 B가 아니면 실패**

```ts
if (sToT.get(s[i]) !== t[i] || tToS.get(t[i]) !== s[i]) return false
```

한 줄이고 *"양방향 둘 다 맞아야 한다"* 는 의도가 그대로 읽힌다.

---

**판정**: 정답 + 역방향 검사 획득 ✅ / 공간복잡도 오판 재발 → `1일` → **`3일` 단계** (다음 복습 08-31, 08-30이 일요일이라 월요일로 이동)

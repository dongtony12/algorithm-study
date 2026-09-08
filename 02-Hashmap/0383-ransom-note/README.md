# 383. Ransom Note

- **난이도**: Easy
- **유형**: 문자열, **해시맵 카운팅**
- **링크**: https://leetcode.com/problems/ransom-note/
- **최초 풀이**: 2026-08-12 / **결과**: 통과 (**접근 설계 3회 피드백 후 구현 1발**)
- **비고**: **접근 설계를 먼저 받는 방식으로 바꾼 첫 문제.** 접근에서 복잡도까지 확정하고 들어가니 구현 후 수정이 0회였다

---

## 문제 요약

`magazine`의 글자로 `ransomNote`를 만들 수 있는가. **각 글자는 한 번씩만 사용.**

```
"a",  "b"    → false
"aa", "ab"   → false   ('a'가 하나뿐)
"aa", "aab"  → true
```

- **Constraints**: `1 <= ransomNote.length, magazine.length <= 10^5`, **소문자 영문자로만 구성**
  ← **"소문자만"이 공간복잡도를 `O(1)`로 만든다.** 이걸 놓치면 `O(n)`으로 오판한다

---

## 접근 설계 (구현 전에 확정한 것)

| 기준 | 내용 |
|---|---|
| ① 자료구조 | `Map` 카운팅 — 값→개수 매핑을 `O(1)`로 |
| ② 단계 | 글자별 개수를 세고 → `ransomNote`의 각 글자를 비교 → 하나라도 실패 시 즉시 `false` |
| ③ 왜 되는가 | **글자의 순서·위치가 답에 영향을 주지 않으므로 개수만 비교하면 충분** |
| ④ 복잡도 | 시간 `O(m + n)` / 공간 `O(1)` — `10⁵` 상한 여유 있게 통과 |

### 비교 조건 — `<` 가 아니라 `<=`

```
ransomNote = "a",  magazine = "a"
개수 1 vs 1  →  `1 < 1` 은 false ❌   정답은 true
```
**필요한 만큼 "이상" 있으면 되므로 `<=`.**

### magazine에 없는 글자

`map.get('b')` → `undefined`. 비교 연산자가 `undefined`를 숫자로 바꾸려다 **`NaN`이 되고, `NaN`과의 모든 비교는 `false`**.
```js
undefined <= 1   // false
undefined >= 1   // false    ← 어느 방향이든 false
```
이 문제에선 **우연히 정답**이다(없으면 어차피 false여야 하므로). 하지만 `?? 0` 으로 명시해야 `#우연히맞는코드` 가 안 된다.

⚠️ **`?? 0` 이지 `|| 0` 이 아니다.** 개수가 `0`인 키가 들어 있을 때 `||`는 그걸 "없음"으로 오판한다 → `#센티널값` 과 같은 뿌리

---

## 최종 정답 (제출본)

```ts
function canConstruct(ransomNote: string, magazine: string): boolean {
    const arr1 = new Map()      // ⚠️ 이름: noteCount 가 맞다
    const arr2 = new Map()      // ⚠️ 이름: magazineCount 가 맞다

    for (let i = 0; i < ransomNote.length; i++) {
        if (arr1.has(ransomNote[i])) {
            arr1.set(ransomNote[i], arr1.get(ransomNote[i]) + 1)
        } else {
            arr1.set(ransomNote[i], 1)
        }
    }

    for (let j = 0; j < magazine.length; j++) {
        if (arr2.has(magazine[j])) {
            arr2.set(magazine[j], arr2.get(magazine[j]) + 1)
        } else {
            arr2.set(magazine[j], 1)
        }
    }

    for (let [key, value] of arr1) {
        if (arr2.has(key) && (value <= arr2.get(key))) {
            continue
        } else {
            return false
        }
    }

    return true
}
```

- **시간 `O(m + n)` / 공간 `O(1)`**
- 검증: 고정 12건 + 랜덤 20만건 불일치 0. 최대 입력(각 10⁵) 20회 40ms

---

## ⚠️ 복잡도 — 순차는 더하고, 중첩은 곱한다

**막혔던 지점**: *"두 문자열을 각각 한 번씩 훑으면 `O(n²)`인가?"* → **아니다.**

```
① 순차 (나란히)  →  더한다
   for (ransomNote) { ... }     // m번
   for (magazine)   { ... }     // n번
   → O(m + n)

② 중첩 (안에)   →  곱한다
   for (ransomNote) {           // m번
       for (magazine) { ... }   //   그 안에서 매번 n번
   }
   → O(m × n)
```

```
m = 5, n = 3
순차: 5번 하고 → 3번 한다     = 8번
중첩: 5번 × 각각 3번씩        = 15번
```

> **차이는 "안에 들어 있느냐" 하나뿐이다.**
> [0028. Find the Index of the First Occurrence in a String](../../01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) 에서는 **중첩**이라 곱셈이 맞았다. 여기는 **순차**다.

```
m = n = 10⁵ 일 때
O(m + n) =         200,000   ← 통과
O(m × n) =  10,000,000,000   ← TLE
```

세 번째 루프(`arr1` 순회)는 키가 최대 26개라 `O(1)`. 총합은 `O(m + n)`.

### 공간이 `O(1)`인 이유

`Map`의 키로 올 수 있는 값은 **`'a'`~`'z'` 26개뿐** (Constraints: 소문자 영문자만).
두 Map을 합쳐도 최대 **52개 엔트리**. 입력이 10글자든 10만 글자든 안 늘어난다.

> 🔑 **"입력이 커지면 이것도 같이 커지나?"** 안 커지면 `O(1)`.
> [0013. Roman to Integer](../../01-Array-String/0013-roman-to-integer/README.md) 의 고정 룩업 테이블(13개)과 완전히 같은 상황. → [해시맵](../../concepts/hashmap.md)

---

## 개선 ① — Map 하나로 (차감 방식)

`ransomNote`를 따로 셀 필요가 없다. **`magazine` 개수만 세어두고 `ransomNote`를 훑으며 한 장씩 뜯어 쓴다.**

```ts
function canConstruct(ransomNote: string, magazine: string): boolean {
    const count = new Map<string, number>();
    for (const ch of magazine) count.set(ch, (count.get(ch) ?? 0) + 1);

    for (const ch of ransomNote) {
        const n = count.get(ch) ?? 0;
        if (n === 0) return false;     // 없거나 다 썼으면 실패
        count.set(ch, n - 1);          // 한 장 뜯어 씀
    }
    return true;
}
```

- `?? 0` 하나로 **"key가 없음"과 "다 써서 0"을 같은 처리로 묶은 것**이 포인트. 두 경우를 분기할 필요가 없다
- **첫 실패에서 즉시 종료.** 원래 코드는 두 Map을 다 만든 뒤에야 비교를 시작했다

---

## 개선 ② — 배열 26칸 (실측 10배)

소문자 26개는 **정수 인덱스로 딱 떨어진다.** 해싱이 필요 없다.

```ts
function canConstruct(ransomNote: string, magazine: string): boolean {
    const count = new Array(26).fill(0);          // 'a'~'z' → 0~25

    for (let i = 0; i < magazine.length; i++) {
        count[magazine.charCodeAt(i) - 97]++;
    }
    for (let i = 0; i < ransomNote.length; i++) {
        const idx = ransomNote.charCodeAt(i) - 97;
        if (count[idx] === 0) return false;
        count[idx]--;
    }
    return true;
}
```

```js
'a'.charCodeAt(0) - 97   // 0
'z'.charCodeAt(0) - 97   // 25
```
→ ASCII 표는 [0125. Valid Palindrome](../../03-Two-Pointers/0125-valid-palindrome/README.md) 노트에 정리해둠

### 실측 (m = n = 10⁵, 100회 · 교차검증 10만건 불일치 0)

| 버전 | 시간 |
|---|---|
| Map 2개 (제출본) | 293ms |
| Map 1개 + 차감 | 258ms |
| **배열 26칸** | **28ms** |

**복잡도는 셋 다 `O(m + n)` / `O(1)` 로 동일한데 실측은 10배 차이.**

| | 비용 |
|---|---|
| `Map.set(ch, …)` | 문자열 **해싱** → 버킷 탐색 → 객체 프로퍼티 갱신 |
| `count[idx]++` | 배열 인덱스 **직접 접근** (연속 메모리, 캐시 친화적) |

> ### 🔑 키의 종류가 적고 정수로 매핑 가능하면 **배열이 항상 이긴다**
> 소문자 26 · 대소문자+숫자 62 · ASCII 128 · 숫자 0~9 → 전부 배열로.
> **`Map`은 키가 뭐가 올지 모를 때** 쓰는 것.
>
> [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](../2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) 에서는 `n=50`이라 Set의 고정 비용이 오히려 손해였다. 방향은 반대지만 교훈은 같다 — **Big-O가 같아도 상수가 다르다.**

---

## 알아야 할 상식

### 1. 용어 — `substring` ≠ `character`

접근 설명에서 "각 substring과 개수를 저장"이라고 썼는데, **substring은 연속된 부분 문자열**이다 (`"abc"` → `"ab"`, `"bc"`, `"abc"` …). 이 문제가 세는 단위는 **글자 하나(character)**.
면접에서 이 둘을 섞으면 면접관이 **완전히 다른 알고리즘**을 떠올린다.

### 2. `continue` + `else` 는 중복

```ts
if (조건) { continue } else { return false }    // ⚠️
if (!조건) return false                          // ✅ 절반이 사라진다
```
`continue`가 "아무것도 안 하고 다음으로"인데 뒤에 `else`가 붙으면 의미가 겹친다.
→ [0027. Remove Element](../../01-Array-String/0027-remove-element/README.md) 실수 노트에 같은 지적이 있다

### 3. 대안 — 정렬 비교는 왜 안 쓰나

```ts
[...ransomNote].sort().join('') // 과 magazine을 비교? ❌ 이 문제엔 부적합
```
`magazine`이 더 길어도 되므로 **문자열 전체 비교가 성립하지 않는다.** 카운팅이 정답.
(단 `242. Valid Anagram` 은 길이가 같아야 하므로 정렬 비교가 성립 — `O(n log n)`)

---

## 실수 노트

- **변수명 `arr1`, `arr2`** — `arr`인데 실제로는 `Map`이라 **타입을 오인하게 만든다.** `noteCount` / `magazineCount` 처럼 역할이 드러나야 한다. [0169. Majority Element](../../01-Array-String/0169-majority-element/README.md) 실수 노트에 **`arr1`이라는 이름이 문자 그대로 이미 적혀 있다** `#변수명불명확`
- **`continue` + `else` 중복** — 조건을 뒤집으면 절반이 사라진다. [0027. Remove Element](../../01-Array-String/0027-remove-element/README.md) 와 같은 형태
- **복잡도: 순차와 중첩을 혼동** — "두 문자열을 각각 훑으면 `O(n²)`인가?" → 순차는 **덧셈**. 다만 이건 개념을 몰랐던 것이지 실수는 아니라 태그 없음
- **접근 단계에서 `<` 로 썼다가 반례(`"a"`/`"a"`)로 `<=` 로 수정** — 부등호는 **등호 포함 여부를 반드시 예시로 확인**할 것
- ✅ **접근 설계에서 시간·공간 복잡도를 확정하고 들어가 구현 후 수정 0회** — 새 방식의 첫 성과
- ✅ **"순서·위치가 답에 영향 없으므로 개수만 비교하면 충분"** 을 스스로 논증
- ✅ 공간복잡도 `O(1)` 정확 (5문제 연속)

---

## 복습 체크

- [ ] +1일 (2026-08-13) — 백지 재작성. **Map 하나 + 차감 방식**으로
- [ ] +7일 (2026-08-19) — 배열 26칸 버전으로. `charCodeAt(i) - 97` 을 안 보고 쓸 수 있는지
- [ ] +30일 (2026-09-11)

### 2026-08-20 (1회차) — 통과, 접근 피드백 1회 + **구현 버그 1회**

고정 14건 + 랜덤 30만건 불일치 0. 최대 입력(각 10⁵) 20회 34ms. 복잡도 `O(m + n)` / `O(1)` 정확.

```ts
function canConstruct(ransomNote: string, magazine: string): boolean {
    const noteMap = new Map()
    const magazineMap = new Map()

    for (let i = 0; i < ransomNote.length; i++) {
        if (noteMap.has(ransomNote[i])) {
            noteMap.set(ransomNote[i], noteMap.get(ransomNote[i]) + 1)
        } else {
            noteMap.set(ransomNote[i], 1)
        }
    }

    for (let i = 0; i < magazine.length; i++) {
        if (magazineMap.has(magazine[i])) {
            magazineMap.set(magazine[i], magazineMap.get(magazine[i]) + 1)
        } else {
            magazineMap.set(magazine[i], 1)
        }
    }

    for (const [nk, nv] of noteMap) {
        if (nv > (magazineMap.get(nk) ?? 0)) {
            return false
        }
    }

    return true
}
```

#### ✅ `#변수명불명확` 클리어

이 문제가 그 태그의 **4회차**를 찍었던 자리(`arr1`, `arr2` — Map인데 `arr`)인데, 이번엔 **`noteMap` / `magazineMap`** 으로 역할이 드러나게 썼다.

| 08-12 실수 | 08-20 |
|---|---|
| `arr1`, `arr2` `#변수명불명확` | **`noteMap`, `magazineMap`** ✅ |
| `continue` + `else` 중복 | 없음 ✅ |
| 복잡도 축 2개 정확 | ✅ 유지 |

#### ⚠️ 접근 — `242` 의 "동일" 조건을 가져왔다 `#패턴오적용`

1차 접근: *"magazine의 key value와 ransomNote의 key value가 **동일하면** true"*

```
ransomNote = "a",  magazine = "ab"
noteMap = { a: 1 },  magMap = { a: 1, b: 1 }   →  동일하지 않지만 정답은 true
```

| | 묻는 것 | 조건 |
|---|---|---|
| [0242. Valid Anagram](../0242-valid-anagram/README.md) | "정확히 같은 구성인가" | 개수 일치 + 키 집합 일치 |
| **383 (이 문제)** | **"만들 수 있나"** | **`noteCount[ch] <= magCount[ch]`** |

사흘 전 [0242. Valid Anagram](../0242-valid-anagram/README.md) 을 풀며 그쪽 패턴이 덮어씌워졌다. 어제 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 와 같은 형태.

지적 후 *"포함"* 의 의미였다고 정정했고, `"aa"`/`"ab"` 로 **개수까지 포함해야** 함을 확인하자 `<=` 로 확정.

#### 🆕 새 실수 — 복사 후 한 곳 미변경 `#복사후미변경`

```ts
// 첫 루프 (정확)
noteMap.set(ransomNote[i], noteMap.get(ransomNote[i]) + 1)

// 둘째 루프 (버그)
magazineMap.set(magazine[i], noteMap.get(magazine[i]) + 1)
//                           ^^^^^^^ magazineMap 이어야 함
```

**루프를 복사하면서 `has`/`set` 은 바꿨는데 `get` 하나만 안 바뀌었다.**

```
note="aaa" mag="aa"   →  noteMap={a:3}
  i=0: 'a' 없음 → magMap.set('a', 1)
  i=1: 'a' 있음 → magMap.set('a', noteMap.get('a') + 1) = 3+1 = 4   ← 엉뚱한 맵
  → magMap = {a:4},  3 > 4 거짓  →  true      ❌  정답 false
```

**랜덤 20만건 중 7,030건 불일치.** 눈으로는 거의 안 보이는 종류다.

> ### 🔑 같은 구조를 복사할 때는 **"바꿔야 할 이름이 몇 군데인지" 먼저 센다**
> 여기선 `magazine[i]` · `magazineMap.has` · `magazineMap.set` · `magazineMap.get` — **네 군데**였고 세 군데만 바뀌었다.

**관용구로 원천 차단된다** (08-12 노트에 이미 정리해둔 것):

```ts
magazineMap.set(magazine[i], (magazineMap.get(magazine[i]) ?? 0) + 1)
```

`has` 분기가 사라지면서 **바꿀 이름이 한 줄에 모인다.** 실제로 세 번째 루프에서는 `?? 0` 을 썼으면서 카운팅 루프에는 안 썼다.

**판정**: 구현 버그 1회 → `1일` 단계 유지 (다음 복습 08-21)

### 2026-09-08 (2회차) — 통과, **피드백 0회** · `1일` → `3일` 단계

```
고정 13/13  ·  랜덤 30만건 불일치 0건
```

```ts
function canConstruct(ransomNote: string, magazine: string): boolean {
    const array = new Array(26).fill(0)

    for (let i = 0; i < ransomNote.length; i++) array[ransomNote[i].charCodeAt(0) - 97] += 1
    for (let i = 0; i < magazine.length; i++)   array[magazine[i].charCodeAt(0) - 97]   -= 1

    for (const num of array) if (num > 0) return false

    return true
}
```

---

#### ⭐ `#패턴오적용` 을 끊었다 — 08-20 재발 지점

**같은 세션에서 15분 전에 [0242. Valid Anagram](../0242-valid-anagram/README.md) 을 `!== 0` 으로 고쳤는데, 여기서는 `> 0` 을 썼다.** 이게 정확히 맞다.

| | 조건 | 검사 |
|---|---|---|
| [0242. Valid Anagram](../0242-valid-anagram/README.md) | *"정확히 **같은가**"* | `!== 0` — **양쪽 다** 남으면 안 됨 |
| **383 랜섬노트** | *"**만들 수 있는가**"* | **`> 0`** — magazine 이 **남는 건 괜찮음** |

실측 대조:

```
[대조] 242의 !== 0 을 그대로 쓰면 불일치 533건
       예: note="a", mag="aa"   기대=true  실제=false
```

`magazine` 에 `a` 가 하나 남았다고 실패 처리하면 안 된다. **여분은 그냥 안 쓰면 된다.**

> 08-20 복습에서 **정확히 이 자리**에서 `#패턴오적용` 이 났었다(242의 "정확히 동일" 조건을 가져옴).
> **오늘은 방금 그 문제를 풀고 온 상태에서도 안 끌려왔다.** 같은 날 242에서 4회로 올라간 것을 여기서 끊었다.

#### 부호의 방향도 정확

242와 **반대로** `ransomNote` 를 먼저 더하고 `magazine` 을 뺐다.

```
array[i] > 0   →  note 에 더 필요한데 magazine 에 없다   →  실패 ✅
array[i] < 0   →  magazine 이 남는다                    →  괜찮음
```

**`>` 가 "부족하다"를 뜻하도록 부호를 맞춰둔 것.** 반대로 넣었으면 `< 0` 을 검사해야 했고, 그게 헷갈림의 원천이 된다.

---

#### 개선 여지 — 조기 종료

```
최악 입력 (note = "a"×10만, mag = "b"×10만) × 2000회
  전부 세고 검사 (제출본): 461ms
  조기 종료          : 173ms      ← 2.7배
```

지금은 **20만 글자를 전부 센 뒤에야** 판단한다. `note` 의 첫 글자 `a` 를 만나는 순간 이미 답이 나오는데도.

```ts
function canConstruct(ransomNote: string, magazine: string): boolean {
    if (ransomNote.length > magazine.length) return false      // ← 가드

    const counts = new Array<number>(26).fill(0)
    for (let i = 0; i < magazine.length; i++) counts[magazine.charCodeAt(i) - 97]++

    for (let i = 0; i < ransomNote.length; i++) {
        if (--counts[ransomNote.charCodeAt(i) - 97] < 0) return false   // ← 부족해지는 즉시
    }
    return true
}
```

세 가지가 바뀐다:

1. **`magazine` 을 먼저 세고** → `ransomNote` 로 차감 (순서를 뒤집음)
2. `--counts[...] < 0` — **감소 직후 바로 확인**해서 부족해지는 순간 종료
3. **길이 가드** — `note` 가 더 길면 볼 것도 없이 `false`

> 검증: 랜덤 30만건에서 제출본과 **불일치 0건**.
> 복잡도는 여전히 `O(n + m)`. **최악은 동일하고 평균이 빨라지는** 종류의 개선이다.

> 💡 `if (r.length > m.length) return false` 는 같은 날 [0242. Valid Anagram](../0242-valid-anagram/README.md) 에서 놓쳤던 그 가드다.
> 여기서도 같은 자리에 들어가되 **`!==` 가 아니라 `>`** 인 게 차이 — 조건이 *"같아야"* 가 아니라 *"충분해야"* 이므로.

**판정**: 정답 · 복잡도 정확 · 피드백 0회 · **`#패턴오적용` 회피** → `1일` → **`3일` 단계** (다음 09-11)

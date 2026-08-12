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

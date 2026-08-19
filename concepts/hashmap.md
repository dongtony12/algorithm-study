# 해시맵 · Set

> **공간 `O(n)`을 내주고 시간을 산다.** 해시 계열 문제의 본질은 전부 이 거래다.
> "이 값 있나? 몇 개지? 짝은 뭐지?" 를 `O(n)` 탐색에서 **`O(1)` 조회**로 바꾼다.

---

## 언제 쓰나 — 신호 3가지

| 신호 | 예 |
|---|---|
| **"있나 없나"를 반복해서 묻는다** | [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](../02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) |
| **개수를 세야 한다** | [0169. Majority Element](../01-Array-String/0169-majority-element/README.md), [0242. Valid Anagram](../02-Hashmap/0242-valid-anagram/README.md) |
| **짝/대응을 찾아야 한다** | [0001. Two Sum](../02-Hashmap/0001-two-sum/README.md), [0205. Isomorphic Strings](../02-Hashmap/0205-isomorphic-strings/README.md) |

> 🔑 **루프 안에서 `includes` / `indexOf` / `filter` / `find` 를 부르고 있다면 거의 항상 해시로 바꿀 수 있다.**
> 그 순간 `O(n²)` 이 `O(n)` 이 된다. → [0169. Majority Element](../01-Array-String/0169-majority-element/README.md) 의 `#숨은반복문`
>
> ⚠️ **단, "루프 안에 있다"가 아니라 "몇 번 실행되는가"를 봐야 한다.**
> | | 안쪽 `O(n)` 연산이 몇 번 실행되나 | 결과 |
> |---|---|---|
> | [0169. Majority Element](../01-Array-String/0169-majority-element/README.md) — `for` 안의 `filter` | **`n`에 비례** | `O(n²)` |
> | [0205. Isomorphic Strings](../02-Hashmap/0205-isomorphic-strings/README.md) — `!has` 분기 안의 `[...values()].includes()` | **최대 128번(ASCII 종류 수, 상수)** | `O(n)` |
>
> 205는 **알파벳이 유한하다는 전제**가 구해준다. 유니코드라면 `O(n²)` 이 된다.

---

## 조회 비용 표 (외울 것)

| | 복잡도 |
|---|---|
| `Set.has` · `Map.get` · `Map.set` · `Map.has` | **`O(1)` 평균** |
| `Array.includes` · `indexOf` · `find` · `some` · `every` | `O(n)` |
| `filter` · `map` · `forEach` · `reduce` | `O(n)` |
| `new Set(arr)` · `new Map(...)` 생성 | `O(n)` — **한 번만** |

⚠️ **`new Set(...)` 을 루프 안에서 만들면 그 순간 `O(n²)`.** 반드시 루프 밖에서 한 번.

---

## 객체 `{}` vs `Map` vs `Set` vs **배열**

| 상황 | 선택 |
|---|---|
| **키 종류가 적고 정수로 매핑 가능** (알파벳·숫자·ASCII) | **배열** — [0383. Ransom Note](../02-Hashmap/0383-ransom-note/README.md) |
| **존재 여부만** 필요 (값 불필요) | **`Set`** — [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](../02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) |
| 키가 **원래 문자열**이고 **집합이 고정**됨 (룩업 테이블) | **객체 `{}`** — [0013. Roman to Integer](../01-Array-String/0013-roman-to-integer/README.md) |
| 키가 **숫자·객체**거나 **런타임에 늘어남** (카운팅) | **`Map`** — [0169. Majority Element](../01-Array-String/0169-majority-element/README.md) |

### ⭐ 배열이 `Map`을 10배 이긴다 — 키 종류가 적을 때

```ts
const count = new Array(26).fill(0);        // 'a'~'z' → 0~25
count[ch.charCodeAt(0) - 97]++;
```

```js
'a'.charCodeAt(0) - 97   // 0
'z'.charCodeAt(0) - 97   // 25
```

**실측** ([0383. Ransom Note](../02-Hashmap/0383-ransom-note/README.md), m = n = 10⁵, 100회):

| 버전 | 시간 |
|---|---|
| `Map` 2개 | 293ms |
| `Map` 1개 + 차감 | 258ms |
| **배열 26칸** | **28ms** |

[0242. Valid Anagram](../02-Hashmap/0242-valid-anagram/README.md) (m = n = 5×10⁴, 500회) — **같은 결론**:

| 버전 | 시간 | 복잡도 |
|---|---|---|
| `Map` 2개 | 507ms | `O(m+n)` |
| `Map` 1개 + 차감 | 511ms | `O(m+n)` |
| **배열 26칸 `+/-`** | **40ms** | `O(m+n)` |
| 정렬 비교 | 1658ms | **`O(n log n)`** |

> ⚠️ **`Map` 개수를 줄여도 속도는 그대로다.** 병목은 "맵 개수"가 아니라 **문자열 해싱** 자체.
> 배열로 바꿔야 10배가 나온다.

복잡도는 셋 다 `O(m + n)` / `O(1)` 로 **동일한데 실측은 10배 차이.**

| | 비용 |
|---|---|
| `Map.set(ch, …)` | 문자열 **해싱** → 버킷 탐색 → 객체 프로퍼티 갱신 |
| `count[idx]++` | 배열 인덱스 **직접 접근** (연속 메모리, 캐시 친화적) |

> ### 🔑 `Map`은 **키가 뭐가 올지 모를 때** 쓰는 것
> 소문자 26 · 대소문자+숫자 62 · ASCII 128 · 숫자 0~9 → **전부 배열로.**
> 오프셋: 소문자 `-97`, 대문자 `-65`, 숫자 `-48` (→ [0125. Valid Palindrome](../03-Two-Pointers/0125-valid-palindrome/README.md) ASCII 표)
>
> ⚠️ **전제가 깨지면 `Map`으로 돌아간다.** [0242. Valid Anagram](../02-Hashmap/0242-valid-anagram/README.md) Follow-up(유니코드 입력)이 그 예 —
> `'가'.charCodeAt(0) - 97` 은 26을 훌쩍 넘으므로 26칸 배열이 즉시 무너진다.
> 이모지·결합문자까지 정확히 세려면 `Intl.Segmenter` 가 필요하다 (→ [0058. Length of Last Word](../01-Array-String/0058-length-of-last-word/README.md))

---

## ⚠️ 두 맵이 같은지 비교하기

`Map` 에는 **깊은 비교가 없다.**

```js
mapA === mapB    // 항상 false (참조 비교)
mapA == mapB     // 마찬가지
```

**확인할 게 두 가지다** — 하나만 보면 틀린다:

```js
if (mapA.size !== mapB.size) return false          // ① 키 개수
for (const [k, v] of mapA) {                        // ② 키별 값
  if (v !== mapB.get(k)) return false
}
return true
```

**왜 ①이 필요한가** ([0242. Valid Anagram](../02-Hashmap/0242-valid-anagram/README.md)):
```
mapA = { a: 1 }          (s = "a")
mapB = { a: 1, b: 1 }    (t = "ab")

mapA의 키만 돌면 → a 하나뿐, 1 === 1 → true  ❌   정답은 false
```
> **한쪽 맵의 키만 도는 건, 반대쪽에만 있는 키를 못 본다.**

`Map` 은 `size` · `keys()` · `entries()` 를 이미 제공하므로 **별도 `Set` 을 만들 필요가 없다.**

---

## ⚠️ `Map`을 만드는 순간 중복 키는 하나로 뭉쳐진다

```js
map.set(3, 0)      // {3 → 0}
map.set(3, 1)      // {3 → 1}   ← 덮어써짐. 인덱스 0이 사라진다
```

**원본 개수만큼 순회해야 한다면, 배열을 순회하고 맵은 조회용으로만 쓴다.**

[0001. Two Sum](../02-Hashmap/0001-two-sum/README.md) 에서 맵을 순회했다가 중복 케이스가 전부 깨졌다:

| 입력 | 정답 | 맵 순회 방식 |
|---|---|---|
| `[3,3]` t=6 | `[0,1]` | undefined ❌ |
| `[0,4,3,0]` t=0 | `[0,3]` | undefined ❌ |
| `[-1,-1]` t=-2 | `[0,1]` | undefined ❌ |

### 🔑 "조회 후 삽입" 1패스 관용구

```js
const seen = new Map()                    // 지금까지 본 값 → 인덱스
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i]
  if (seen.has(need)) return [seen.get(need), i]   // ① 먼저 조회
  seen.set(nums[i], i)                              // ② 그다음 삽입
}
```

**순서가 핵심이다.** 삽입을 먼저 하면 자기 자신이 조회에 걸린다.

```
i번째에서 조회할 때 seen에는 i보다 앞선 인덱스만 있다
   → 자기 자신과 짝지을 일이 원천적으로 없다   (조건 추가 불필요)
   → 중복 값도 안전하다
```

**맵의 방향도 확인할 것** — 조회하려는 게 "값"이면 **`값 → 인덱스`** 여야 한다.
`인덱스 → 값` 으로 만들면 그냥 배열과 같아서 조회가 `O(n)` 이다.

### 객체를 카운팅에 쓰면 안 되는 이유

| | 객체 `{}` | `Map` |
|---|---|---|
| 키 타입 | **문자열로 강제 변환** (`1` → `"1"`) | 원본 타입 유지 |
| 프로토타입 오염 | `"__proto__"`, `"constructor"` 위험 | 없음 |
| 크기 | `Object.keys(o).length` → `O(n)` | `map.size` → `O(1)` |
| 순회 순서 | 정수형 키가 먼저 정렬됨 (애매) | 삽입 순서 보장 |

**코테에서 카운팅 = `Map`** 을 기본값으로.

---

## 관용구

```js
// 카운팅
const counts = new Map();
for (const x of arr) counts.set(x, (counts.get(x) ?? 0) + 1);

// 존재 여부
const seen = new Set(arr);
if (seen.has(target)) ...

// 중복 탐지 (한 번 순회)
const seen = new Set();
for (const x of arr) {
  if (seen.has(x)) return true;
  seen.add(x);
}

// 고유값 개수
new Set(arr).size
```

⚠️ **`counts.get(x) || 0` 이 아니라 `?? 0`.** 값이 `0`이면 `||`는 "없음"으로 오판한다. → `#센티널값` 과 같은 뿌리

---

## ⚠️ 공간복잡도는 "입력에 비례하는가"로 판단

자료구조가 있다고 자동으로 `O(n)`이 아니다.

```js
const map = { I:1, V:5, X:10, ... };   // 항상 13개 → O(1)   [0013. Roman to Integer](../01-Array-String/0013-roman-to-integer/README.md)
const counts = new Map();               // 입력 따라 증가 → O(n)  [0169. Majority Element](../01-Array-String/0169-majority-element/README.md)
const alphabet = new Array(26).fill(0); // 항상 26칸 → O(1)
```

> **"입력이 커지면 이것도 같이 커지나?"** 안 커지면 `O(1)`. → [시간·공간 복잡도](complexity.md)

---

## 문제

| 문제 | 쓰는 것 | 포인트 |
|---|---|---|
| [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](../02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) | `Set` | 재스캔 `O(n²)` → `Set` `O(n)` |
| [0169. Majority Element](../01-Array-String/0169-majority-element/README.md) | `Map` | 단, 최적해는 Boyer-Moore로 `O(1)` 공간 |
| [0013. Roman to Integer](../01-Array-String/0013-roman-to-integer/README.md) | 객체 (고정 룩업) | 고정 크기 = `O(1)` 공간 |
| [0383. Ransom Note](../02-Hashmap/0383-ransom-note/README.md) | `Map` 카운팅 → **배열 26칸** | `<=` (같으면 통과), `?? 0` 으로 "없음"과 "0" 통합 |
| [0242. Valid Anagram](../02-Hashmap/0242-valid-anagram/README.md) | `Map` 카운팅 → **배열 26칸 `+/-`** | **`size` 비교 + 키별 값 비교** 둘 다 필요 |
| [0001. Two Sum](../02-Hashmap/0001-two-sum/README.md) | `Map` (**값 → 인덱스**) | **조회 후 삽입** 1패스 — 자기 자신·중복 문제가 동시에 해결 |
| [0205. Isomorphic Strings](../02-Hashmap/0205-isomorphic-strings/README.md) / 290. Word Pattern | `Map` **양방향** | `"ab"`/`"aa"` — 단방향만 하면 통과해버린다 |
| 202. Happy Number | `Set` (사이클 탐지) | |
| 219. Contains Duplicate II | `Map` (값 → 최근 인덱스) | |
| 217. Contains Duplicate | `Set` | |
| 349. Intersection of Two Arrays | `Set` | |
| 387. First Unique Character in a String | `Map` 카운팅 | |

---

## 관련 노트

- [시간·공간 복잡도](complexity.md) · [투 포인터](two-pointers.md) · [00-실수패턴](../mistakes.md)

# 169. Majority Element

- **난이도**: Easy
- **유형**: 배열, 카운팅, **Boyer-Moore Voting**
- **링크**: https://leetcode.com/problems/majority-element/
- **최초 풀이**: 2026-08-03 / **결과**: 통과 (브루트포스 → Boyer-Moore까지 도달)

---

## 문제 요약

크기 `n` 배열에서 **`⌊n/2⌋`번보다 많이** 등장하는 원소를 반환. **반드시 존재한다고 보장.**
Follow-up: `O(n)` 시간 + `O(1)` 공간으로 풀 수 있는가?

---

## 세 가지 풀이 비교

| | 방법 | 시간 | 공간 |
|---|---|---|---|
| 1차 | Set으로 고유값 뽑고 값마다 `filter`로 카운트 | **`O(n²)`** ❌ | `O(n)` |
| 2차 | `Map`으로 한 번 순회하며 카운트 | `O(n)` | `O(n)` |
| 3차 | **Boyer-Moore Voting** | `O(n)` | **`O(1)`** ✅ |

---

## 1차 시도 — 통과했지만 `O(n²)`

```ts
function majorityElement(nums: number[]): number {
    const newArr = new Set(nums)
    const arr1 = Array.from(newArr)
    let count = 0, result = 0

    for (let i = 0; i < arr1.length; i++) {
       let temp = nums.filter((num) => num === arr1[i]).length   // ← 여기
       if (count < temp) { count = temp; result = arr1[i] }
    }
    return result
}
```

### ⚠️ 숨어 있는 반복문 — 이 문제의 최대 교훈

```ts
for (let i = 0; i < arr1.length; i++) {   // u번
   nums.filter(...)                        // × n번  ← filter가 O(n)
}
```

`for`문이 하나뿐이라 `O(n)`처럼 보이지만 **실제로는 `O(u × n)`**.
`u`(고유값 개수)는 최악 `n/2`까지 가므로 → **`O(n²)`**

`n = 50,000` 이면 `25,000 × 50,000 = 12.5억 번`. **원래는 시간 초과가 나야 정상.**
통과한 건 LeetCode 테스트케이스가 악랄하지 않았을 뿐.

> ### 🔑 복잡도는 `for`문 개수가 아니라 "총 원소 방문 횟수"로 센다
>
> 반복문 **안에서** 아래 메서드를 부르면 그 순간 중첩 반복문이다.
>
> | 메서드 | 복잡도 |
> |---|---|
> | `filter` / `map` / `forEach` / `reduce` | `O(n)` |
> | `includes` / `indexOf` / `find` / `some` / `every` | `O(n)` |
> | `Set.has` / `Map.get` / `Map.set` | `O(1)` ✅ |

---

## 2차 — Map 카운팅

```ts
function majorityElement(nums: number[]): number {
  const counts = new Map<number, number>();
  const half = nums.length / 2;

  for (const num of nums) {
    const c = (counts.get(num) ?? 0) + 1;
    if (c > half) return num;     // 과반 넘는 순간 조기 반환
    counts.set(num, c);
  }
  return -1;                       // 문제 보장상 도달 불가
}
```
시간 `O(n)` / 공간 `O(n)` — Follow-up의 공간 조건은 아직 미충족

### 카운팅은 객체 `{}` 말고 `Map`

| | 객체 `{}` | `Map` |
|---|---|---|
| 키 타입 | **문자열로 강제 변환** (`1` → `"1"`) | 원본 타입 유지 |
| 프로토타입 오염 | `"__proto__"`, `"constructor"` 위험 | 없음 |
| 크기 | `Object.keys(o).length` → `O(n)` | `map.size` → `O(1)` |
| 순회 순서 | 정수형 키가 먼저 정렬됨 (애매) | 삽입 순서 보장 |

**코테에서 카운팅 = `Map`** 을 기본값으로.

---

## 3차 — Boyer-Moore Voting (최종 정답)

```ts
function majorityElement(nums: number[]): number {
    let candidate = 0
    let count = 0

    for (const num of nums) {
        if (count === 0) {
            candidate = num
        }
        candidate === num ? count++ : count--
    }
    return candidate
}
```
**시간 `O(n)` / 공간 `O(1)`** ✅ Follow-up 충족

### 아이디어 — 1:1 소거

> 과반수 원소는 **나머지 전부를 합친 것보다 많다.**
> 서로 다른 값 둘을 짝지어 동시에 소거하면, 과반수 원소는 **절대 전멸할 수 없다.**

```
[7, 7, 5, 7, 3, 7, 7]   →  7이 5개, 나머지 2개
 └──┘ 소거              →  [7, 7, 3, 7, 7]
      └──┘ 소거          →  [7, 7, 7]  ← 살아남음
```

`count` 변수의 의미:
> **"현재 후보 진영에 아직 짝을 못 만난 병력이 몇 명 남았나"**

- `count++` → 아군 합류
- `count--` → 적군과 1:1 교환
- `count === 0` → 후보 진영 전멸, 다음 값이 새 후보

**개수만 따지므로 값들이 붙어 있을 필요가 없다.** 위치 무관.

### 증명

`7`이 `k`번, 나머지가 `n-k`번. 과반이므로 `k > n-k`.
- 소거 1회 = `7` 하나 + `7 아닌 것` 하나가 동시 제거
- `7 아닌 것`은 `n-k`개뿐 → 소거는 최대 `n-k`번
- 살아남는 `7` = `k - (n-k) = 2k - n > 0` ✅

역으로 `7`이 아닌 값이 최후 후보가 되려면 `7`을 전부 지워야 하는데, 그러려면 `k`개의 병력이 필요. 상대는 `n-k < k`뿐 → **불가능**

### 트레이스: `[5, 7, 3, 7, 7]`

| num | count | 판단 | 결과 |
|---|---|---|---|
| 5 | 0 | 0이니 후보 교체 | cand=5, count=1 |
| 7 | 1 | 다름 → 소거 | count=**0** |
| 3 | 0 | 0이니 후보 교체 | cand=3, count=1 |
| 7 | 1 | 다름 → 소거 | count=**0** |
| 7 | 0 | 0이니 후보 교체 | **cand=7**, count=1 |

후보가 `5 → 3 → 7` 로 두 번 바뀌고도 수렴. **가짜 후보는 아군이 없어 첫 소거에서 무너진다.**

---

## ⚠️ 알고리즘의 경계 — 과반수가 없으면?

`[5, 7, 3, 7]` (n=4, 과반은 3번 이상 필요 → `7`은 2번뿐 = **과반수 없음**)
→ Boyer-Moore는 `3`을 반환한다. **쓰레기값.**

> **Boyer-Moore는 "과반수가 존재할 때만" 정답을 보장한다.**

보장이 없다면 **2차 검증**을 붙인다 (면접 단골 후속 질문):

```ts
// 1단계: Boyer-Moore로 후보 찾기
// 2단계: 후보가 진짜 과반인지 다시 세기
let occurrences = 0;
for (const num of nums) if (num === candidate) occurrences++;
return occurrences > nums.length / 2 ? candidate : -1;
```
여전히 `O(n)` / `O(1)`

---

## 스타일 지적

### 삼항 연산자를 "문장"으로 쓰지 말 것

```ts
candidate === num ? count++ : count--        // ⚠️ ESLint no-unused-expressions 위반
```

삼항 연산자는 **값을 만드는 표현식(expression)** 이지 동작을 수행하는 문장(statement)이 아니다.
반환값을 버리고 부수효과만 쓰는 건 안티패턴. ESLint 기본 설정에서 에러다 (`allowTernary: false`).

```ts
if (candidate === num) count++;              // ✅
else count--;
```

### `candidate` 초기값

`let candidate = 0` 은 동작상 안전하다 (첫 반복에서 `count === 0` 이라 반드시 덮어씀).
다만 의도가 드러나게 `nums[0]` 을 쓰거나, 아래처럼 분기를 명시하는 쪽이 읽기 좋다.

```ts
for (const num of nums) {
  if (count === 0)          { candidate = num; count = 1; }
  else if (num === candidate) count++;
  else                        count--;
}
```

---

## 실수 노트

- **`filter`를 반복문 안에서 호출해 `O(n²)`을 만들었다** → 메서드 안의 숨은 반복문을 항상 의식할 것
- 삼항 연산자를 문장처럼 사용 → `if/else`로
- 변수명 `newArr`, `arr1`, `temp` → 역할이 드러나는 이름으로 (`uniqueValues`, `frequency`)
- **복잡도 명시 누락** (Boyer-Moore 제출 시)

---

## 복습 기록

**다음 복습**: 2026-08-17 (마지막 풀이일 + 5일)

### 2026-08-12 (1회차) — 통과, 접근 피드백 3회

백지 재작성 **통과**. node 고정 11건 + 랜덤 30만건(과반 보장 생성 후 셔플) 불일치 0. 최대 입력 300회 10ms.
복잡도 `O(n)` / `O(1)` 정확 — Follow-up 조건 충족.

```ts
function majorityElement(nums: number[]): number {
    let candidate = Infinity
    let count = 0

    for (const num of nums) {
        if (count === 0) {
            candidate = num
        }

        if (candidate === num) {
            count++
        } else {
            count--
        }
    }

    return candidate
}
```

#### 접근 도달 경로 (피드백 3회 전부 사용)

| 회차 | 사용자 접근 | 피드백 |
|---|---|---|
| 시작 | 원소 하나 고정 + 전체 순회로 카운트 → `O(n²)` / `O(1)` | **복잡도는 스스로 정확히 판단.** `n = 5×10⁴` → 25억 → TLE |
| 1 | `Map` 카운팅 → `O(n)` / `O(n)` ✅ · `k > n-k` 성질 ✅ | 두 방향 제시: 공간 쓰면? / 공간도 `O(1)`이면? |
| 2 | — | Boyer-Moore 이름 + **1:1 소거 논증** 제공 |
| 3 | `2n`, `2n+1` 인덱스 짝? ❌ | **소거는 위치가 아니라 개수의 문제.** 의사코드 뼈대 제공(조건식 공란) |
| 구현 | 빈칸 3개 정확히 채움 | `infinity` 오타(대문자 `I`)만 지적 |

> 🔑 **막힌 지점: "짝을 짓는다"를 위치(인덱스)로 해석했다.**
> 실제로는 **배열을 지우지 않고 `count` 하나로 흉내내는 것.** 서로 다른 값이면 그냥 `count--` 하면 끝.

#### 이전 실수 노트와 대조 — **4개 전부 미재발** ✅

| 08-03 실수 | 08-12 |
|---|---|
| `filter`를 반복문 안에서 호출 → `O(n²)` `#숨은반복문` | 반복문 하나, 숨은 반복문 없음 ✅ |
| 삼항 연산자를 문장처럼 사용 | `if/else` ✅ |
| 변수명 `newArr`, `arr1`, `temp` `#변수명불명확` | `candidate`, `count` — 역할이 드러남 ✅ |
| 복잡도 명시 누락 | 명시함 (한 번 요구받은 뒤) ✅ |

같은 날 [0383. Ransom Note](../../02-Hashmap/0383-ransom-note/README.md) 에서 `arr1`/`arr2` 로 `#변수명불명확` 4회를 찍은 **직후**인데, 여기서는 정확히 썼다.

**새로 나온 것**: `let candidate = infinity` — 소문자. JS 전역은 **`Infinity`** (대문자 `I`). 단순 오타라 태그 없음.

#### `Infinity` 초기값에 대해

동작에는 문제없다. `count = 0` 으로 시작하므로 **첫 반복에서 반드시 덮어써진다.** 초기값이 뭐든 무관.
다만 [0121. Best Time to Buy and Sell Stock](../0121-best-time-to-buy-and-sell-stock/README.md) 의 `Infinity` 관용구는 **최솟값 탐색용**이고 여기선 그 의미가 아니다. 의도가 드러나는 건 `let candidate = nums[0]`.
→ **"이 초기값이 왜 안전한가"를 설명할 수 있으면 둘 다 정답.**

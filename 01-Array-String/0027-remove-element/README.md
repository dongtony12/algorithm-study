# 27. Remove Element

- **난이도**: Easy
- **유형**: 배열, 투 포인터 (읽기-쓰기 포인터)
- **링크**: https://leetcode.com/problems/remove-element/
- **최초 풀이**: 2026-08-02 / **결과**: 통과 (첫 시도)

---

## 문제 요약

배열 `nums`에서 `val`과 같은 값을 **in-place로 모두 제거**하고, 남은 원소 개수 `k`를 반환하라.
- 채점은 **앞쪽 `k`칸만** 확인. 뒤쪽은 무엇이든 무관
- **순서 무관**

---

## 접근 사고 흐름

**신호 — "in-place로 걸러내고 개수를 반환"**
→ **읽기-쓰기 포인터(read-write pointer)** 패턴.

배열을 처음부터 훑으면서 **살릴 값만 앞쪽에 차곡차곡 다시 쌓는다.**
쌓인 개수가 곧 답. 뒤에 남은 쓰레기는 채점 대상이 아니므로 정리 불필요.

---

## 내 풀이 (통과)

```ts
function removeElement(nums: number[], val: number): number {
  let i = 0        // ⚠️ 미사용
  let k = 0

  for (const num of nums) {
    if (num === val) {
      continue
    } else {
      nums[k++] = num
    }
  }
  return k
}
```

- 시간 `O(n)` / 공간 `O(1)`

### 피드백

| # | 내용 |
|---|---|
| ✅ | 읽기-쓰기 포인터 패턴을 스스로 도출 |
| ✅ | `for...of`로 읽기 인덱스를 감춰서 오히려 실수 여지를 줄임 |
| ✅ | 뒤쪽을 정리하지 않아도 된다는 문제 조건을 정확히 활용 |
| ⚠️ | `let i = 0` **미사용 변수** — 제거 |
| ⚠️ | `continue` + `else` 는 중복. 둘 중 하나면 충분 |

### 정리된 버전

```ts
function removeElement(nums: number[], val: number): number {
  let k = 0
  for (const num of nums) {
    if (num !== val) nums[k++] = num
  }
  return k
}
```

---

## 핵심 — 왜 앞에서부터 가도 안전한가

[0088. Merge Sorted Array](../0088-merge-sorted-array/README.md) 는 **뒤에서부터** 가야 했는데 이 문제는 앞에서 가도 된다. 차이는 하나다.

### 불변식: `k ≤ i` (쓰기 위치 ≤ 읽기 위치)

`k`는 **원소를 살릴 때만** 증가하고, 읽기 위치는 **매 반복마다** 증가한다.
→ 쓰기 포인터는 읽기 포인터를 **절대 추월할 수 없다.**
→ `nums[k]`에 쓸 때 그 칸은 **이미 읽고 지나온 자리** → 덮어써도 손실 없음.

### 88번과의 대비

| | 원소 수 변화 | 쓰기 vs 읽기 | 진행 방향 |
|---|---|---|---|
| 27. Remove Element | **줄어듦** (`k ≤ i`) | 쓰기가 뒤처짐 | **앞 → 뒤** ✅ |
| 88. Merge Sorted Array | **늘어남** | 쓰기가 앞설 수 있음 | **뒤 → 앞** ✅ |

> ### 🔑 재사용 규칙
> **데이터가 줄어드는 방향이면 앞에서부터, 늘어나는 방향이면 뒤에서부터.**
>
> 판단 기준은 딱 하나 — **"쓰기 포인터가 아직 안 읽은 데이터를 밟을 수 있는가?"**

---

## 알아야 할 상식

### 1. 읽기-쓰기 포인터 패턴 (= in-place filter)

이 패턴 하나로 아래 문제들이 전부 풀린다. **템플릿으로 외워둘 것.**

```js
let k = 0;                       // 쓰기 포인터 = 살아남은 개수
for (let i = 0; i < nums.length; i++) {   // 읽기 포인터
  if (조건을_만족하면_살린다) {
    nums[k++] = nums[i];
  }
}
return k;
```

| 문제 | `조건` 부분만 바뀜 |
|---|---|
| 27. Remove Element | `nums[i] !== val` |
| 26. Remove Duplicates from Sorted Array | `k === 0 \|\| nums[i] !== nums[k-1]` |
| 80. Remove Duplicates II | `k < 2 \|\| nums[i] !== nums[k-2]` |
| 283. Move Zeroes | `nums[i] !== 0` (+ 뒤를 0으로 채움) |

**뼈대는 동일하고 조건문만 바뀐다.**

### 2. 대안 해법 — 마지막 원소와 스왑

제거할 값이 **드물 때** 쓰기 횟수를 줄이는 방법.

```js
function removeElement(nums, val) {
  let i = 0, n = nums.length;
  while (i < n) {
    if (nums[i] === val) {
      nums[i] = nums[n - 1];   // 마지막 값을 끌어옴
      n--;                     // 배열 끝을 줄임 (i는 그대로 → 끌어온 값 재검사)
    } else {
      i++;
    }
  }
  return n;
}
```

| | 쓰기 횟수 |
|---|---|
| 읽기-쓰기 포인터 | 살아남는 원소 수만큼 |
| 스왑 방식 | **제거되는 원소 수만큼** |

순서가 무관하다는 조건이 있어야 쓸 수 있다. 복잡도는 둘 다 `O(n)`.

### 3. `for...of` 중 배열 변형 — 여기선 안전한 이유

일반적으로 순회 중 배열을 바꾸는 건 위험하다. 하지만 이 코드는 안전하다.

- `for...of`는 매 스텝 **인덱스로 읽는다**
- 우리가 쓰는 위치는 `k ≤ i` → **이미 읽고 지나간 칸**
- 다음에 읽을 `i+1`은 건드리지 않음

⚠️ 단, **길이를 바꾸는 연산**(`push`/`splice`)을 순회 중에 하면 순회 자체가 깨진다. 값 덮어쓰기와는 다른 얘기.

---

## 실수 노트

- 미사용 변수 `let i = 0` 방치 → 처음 구상한 구조의 잔재. **다 풀고 나면 한 번 훑어서 죽은 코드 제거**
- **복잡도를 또 안 적었다** → 매 문제 시간/공간 복잡도 명시하는 습관 (2회 연속 누락)

---

## 복습 체크

- [x] ~~+1일 (2026-08-03)~~ — 미실시. +7일 복습에 흡수
- [x] +7일 (2026-08-09 예정 → **08-10 실시**) — **통과**. 아래 기록 참조
- [ ] +30일 (2026-09-01)

### +7일 복습 기록 — 2026-08-10

백지에서 읽기-쓰기 포인터 템플릿 정확히 재현. node 11/11 통과 (빈 배열, 전부 제거, 값 `0` 제거 포함).
복잡도 `O(n)` / `O(1)` 정확.

**08-02 실수 2개 미재발**: 미사용 변수 `let i = 0` → 실제 사용 ✅ / `continue` + `else` 중복 → `if`/`else`만 ✅

**이번 코드**
```ts
while (i < nums.length) {
    if (nums[i] !== val) {
        nums[k++] = nums[i++]     // i++
    } else {
        i++                        // i++
    }
}
```

**지적 (버그 아님, 스타일)**: `if`/`else` 양쪽에 `i++`가 중복.
같은 날 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 에서 지적한 `else { i++ }` 와 **정확히 같은 형태**다.

```ts
while (i < nums.length) {
    if (nums[i] !== val) nums[k++] = nums[i]
    i++                            // 밖으로 빼면 "i는 무조건 전진"이 드러난다
}
```

> **양쪽 분기에 똑같은 줄이 있으면 밖으로 뺀다.**
> 08-02에 쓴 `for (const num of nums)` 버전은 읽기 인덱스를 언어에 맡겨 이 문제가 아예 없었다.

*(정답 코드이고 스타일 이슈라 `#죽은코드방치` 카운트에는 포함하지 않음)*

### 2026-08-26 (2회차) — 통과, **피드백 0회** · `3일` → `7일` 단계

고정 12건 + 랜덤 30만건 불일치 0. 최대 입력 20만회 20ms. 복잡도 `O(n)` / `O(1)` 정확.

```ts
function removeElement(nums: number[], val: number): number {
    let i = 0
    let k = 0

    while (i < nums.length) {
        if (nums[i] !== val) {
            nums[k] = nums[i]
            i++
            k++
        } else {
            i++
        }
    }

    return k
}
```

#### ✅ 실수 2개 두 번 연속 미재발

| 08-02 실수 | 08-10 복습 | **08-26 복습** |
|---|---|---|
| `let i = 0` 미사용 변수 `#죽은코드방치` | ✅ | ✅ `i` 를 실제로 사용 |
| `continue` + `else` 중복 | ✅ | ✅ |

쓰기 동작(`nums[k] = nums[i]`)도 정확히 있고, 불변식 `k ≤ i` 도 지켜진다.
같은 날 [0026. Remove Duplicates from Sorted Array](../0026-remove-duplicates-from-sorted-array/README.md) 에서 `#쓰기동작누락` 을 클리어한 것과 일관된다.

#### 스타일 — `i++` 가 양쪽 분기에 중복 (08-10에도 같은 지적)

```ts
if (nums[i] !== val) { nums[k] = nums[i]; i++; k++ }
else                 { i++ }
```

**양쪽 분기에 똑같은 줄이 있으면 밖으로 뺀다:**

```ts
while (i < nums.length) {
    if (nums[i] !== val) nums[k++] = nums[i]
    i++
}
```

`else` 분기가 통째로 사라지고 *"`i` 는 무조건 전진한다"* 는 불변식이 코드에 드러난다.
→ 같은 형태를 [0392. Is Subsequence](../../03-Two-Pointers/0392-is-subsequence/README.md) 에서도 지적했다.

*(정답 코드의 스타일이라 카운트 미포함 — 08-10 판단과 동일)*

**판정**: 피드백 0회 + 실수 미재발 → `3일` → **`7일` 단계** (다음 복습 09-02)

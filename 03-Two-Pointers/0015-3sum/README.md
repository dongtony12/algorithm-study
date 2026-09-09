# 15. 3Sum

- **난이도**: **Medium**
- **유형**: 투 포인터 (**정렬 + 중복 제거**)
- **링크**: https://leetcode.com/problems/3sum/
- **최초 풀이**: 2026-09-09 / **결과**: 통과 (**접근 피드백 3회 → 구현 1발**)

---

## 문제 요약

정수 배열 `nums` 에서 `nums[i] + nums[j] + nums[k] == 0` 인 **모든 삼중항**을 반환.
`i != j != k` 이고 **결과에 중복된 삼중항이 있으면 안 된다.**

```
[-1,0,1,2,-1,-4]  →  [[-1,-1,2], [-1,0,1]]
[0,0,0,0]         →  **0,0,0**      ← 중복 제거
```

```
3 <= nums.length <= 3000
-10^5 <= nums[i] <= 10^5
```

- **`n = 3000`** → `O(n³)` 은 **270억 번**으로 불가. `O(n²)` = 900만은 넉넉히 통과

---

## 접근 — a 를 고정하면 Two Sum이 된다

```
a + b + c = 0
↓  a 를 고정
b + c = -a          ← 이게 정확히 [0167. Two Sum II - Input Array Is Sorted](../0167-two-sum-ii-input-array-is-sorted/README.md)
```

### 왜 [0001. Two Sum](../../02-Hashmap/0001-two-sum/README.md)(해시맵)이 아니라 [0167. Two Sum II - Input Array Is Sorted](../0167-two-sum-ii-input-array-is-sorted/README.md)(투 포인터)인가

| | [0001. Two Sum](../../02-Hashmap/0001-two-sum/README.md) 해시맵 | [0167. Two Sum II - Input Array Is Sorted](../0167-two-sum-ii-input-array-is-sorted/README.md) 투 포인터 |
|---|---|---|
| 필요한 것 | `O(n)` 추가 공간 | **정렬된 배열** |
| 3Sum에서 | `a` 마다 맵을 새로 만듦 | 포인터만 움직임 |
| **중복 제거** | **어려움** | **쉬움** ← 결정적 |

**중복 제거가 이 문제의 진짜 난관**인데, **정렬해두면 같은 값이 옆에 붙어 있어서** 훨씬 다루기 쉽다.

> ### 🔑 "정렬돼 있으면 투 포인터"를 뒤집으면 **"투 포인터를 쓰고 싶으면 정렬한다"**
> 정렬 `O(n log n)` 은 `O(n²)` 안에서 **공짜**다. 167은 문제가 정렬을 보장해줬지만 여기선 직접 만든다.

```
정렬 O(n log n)  +  (a 고정 n번 × 투 포인터 O(n))  =  O(n²)
```

---

## 최종 정답

```ts
function threeSum(nums: number[]): number[][] {
    const sortedNums = nums.sort((a,b)=>a-b)
    const result = []

    for (let i = 0; i < sortedNums.length - 2; i++) {
        if (i > 0 && sortedNums[i] === sortedNums[i-1]) continue      // ① a 중복

        let left = i + 1
        let right = sortedNums.length - 1

        while (left < right) {
            let sum = sortedNums[i] + sortedNums[left] + sortedNums[right]

            if (sum === 0) {
                result.push([sortedNums[i], sortedNums[left], sortedNums[right]])

                while (left < right && sortedNums[left]  === sortedNums[left + 1])  left++   // ② b 중복
                while (left < right && sortedNums[right] === sortedNums[right - 1]) right--  // ③ c 중복

                left++
                right--
            } else if (sum < 0) { left++ }                            // ④
            else                { right-- }
        }
    }
    return result
}
```

- **시간 `O(n²)` / 공간 `O(1)`** (출력 제외)

```
고정 16/16        (값 일치 + 결과 내 중복 없음 동시 검사)
랜덤 20만건 — 값 불일치 0건 · 중복 삼중항 0건
최대 입력 3000 × 50회: 514ms  (1회 약 10ms)
```

---

## ⭐ 중복 제거 — 이 문제의 핵심

### ① `a` 는 **중복 그룹의 첫 번째**를 남긴다

접근 단계에서 `nums[i] === nums[i+1]` (뒤와 비교)로 답했다가 **틀렸다.**

```
제출 ① (뒤와 비교) : 고정 4/10, 랜덤 5만건 중 7,736건 불일치
수정 ① (앞과 비교) : 고정 10/10, 불일치 0건
```

**반례 `nums = [-1, -1, 2]`:**

```
i=0:  nums[0]=-1 === nums[1]=-1   →  continue  (건너뜀)
i=1:  nums[1]=-1 === nums[2]=2 ?  →  아니오, 진행
      left = i+1 = 2,  right = 2
      while (left < right)  →  2 < 2 거짓  →  루프가 아예 안 돌음
결과: []          정답: **-1,-1,2**
```

**중복 그룹의 첫 번째를 버리고 마지막을 남기면 오른쪽에 볼 게 없다.**

```
[-1, -1, 2]
  ↑          i=0 을 남겨야  left, right 가 [-1, 2] 를 훑을 수 있다
      ↑      i=1 을 남기면  오른쪽에 [2] 하나뿐 → 짝을 못 만든다
```

> ### 🔑 `left` 는 `i` 오른쪽에서만 움직인다 → **중복 그룹의 첫 번째를 남겨야** 나머지 중복이 전부 탐색 범위에 들어온다

`i > 0` 가드도 필수 — `i = 0` 에서 `nums[-1]` 을 보면 안 된다. `#인덱스오프바이원`(4회) 이 걸린 자리.

### ②③ 은 반대로 **"다음으로 갈 곳"** 을 본다

```ts
while (left < right && sortedNums[left] === sortedNums[left + 1]) left++
```

②③ 은 **이미 답을 찾은 뒤 다음 후보로 넘어가는** 상황이라 방향이 반대인 게 정상이다.
①만 *"이미 처리했나"* 를 묻는 자리라 **뒤가 아니라 앞**을 본다.

### ⚠️ `new Set(nums)` 로 입력 중복을 지우면 안 된다

```
[0, 0, 0]      →  Set  →  {0}         원소 1개, 삼중항 자체가 불가능
[-1,-1,0,1,2]  →  Set  →  {-1,0,1,2}  두 번째 -1 이 사라져 [-1,-1,2] 를 못 찾음
```

> **제거해야 할 건 "입력의 중복 값"이 아니라 "결과의 중복 삼중항"이다.** 둘은 다르다.

---

## 왜 `O(n²)` 가 전수 탐색과 같은 답을 내나 — 지배 논증

[0011. Container With Most Water](../0011-container-with-most-water/README.md) · [0167. Two Sum II - Input Array Is Sorted](../0167-two-sum-ii-input-array-is-sorted/README.md) 의 논증이 그대로 적용된다.

```
sum < 0  →  left++
```

`nums[right]` 는 남은 구간의 **최댓값**이다. 그런데도 합이 모자라면 **`nums[left]` 는 어떤 짝과도 목표에 못 미친다.**

```
(left, right-1), (left, right-2), … (left, left+1)
   ← 전부 nums[right] 이하의 값과의 조합 → 더 작아지기만 함
```

**`left` 를 버리는 순간 `O(n)` 개의 후보가 함께 지워진다.** 그래서 이중 루프가 삼중 루프와 같은 답을 낸다.

---

## ⚠️ `#입력훼손` — 원본이 정렬된다

```
호출 전 [3,-1,-2,0,1]  →  호출 후 [-2,-1,0,1,3]
```

```ts
const sortedNums = nums.sort((a,b) => a-b)
```

**`sortedNums` 와 `nums` 는 같은 배열이다.** `sort` 는 새 배열을 만들지 않고 **원본을 정렬한 뒤 그 원본을 반환**한다.
이름이 `sortedNums` 라 새 배열처럼 읽히는 게 함정.

```ts
const sorted = [...nums].sort((a, b) => a - b)   // 복사본 (공간 O(n))
nums.sort((a, b) => a - b)                        // 원본 정렬 (공간 O(1))
```

> **LeetCode에서는 in-place가 맞다** — 공간 `O(1)` 을 지키므로. 다만 이름을 `nums` 그대로 두거나 정렬이 의도적임을 드러낼 것.
> 실무에서 인자로 받은 배열을 말없이 정렬하면 **호출한 쪽 데이터가 바뀐다.** → [0088. Merge Sorted Array](../../01-Array-String/0088-merge-sorted-array/README.md)
>
> *(정답 코드이고 문제 조건상 허용되므로 카운트 미포함. 이름이 동작을 가린다는 점에서 `#변수명불명확` 과도 닿아 있다)*

---

## 알아야 할 상식

### 1. JS `sort` 는 기본이 **문자열 비교**

```js
[10, 9, 1, -5].sort()                 // → [-5, 1, 10, 9]   ❌ 사전순
[10, 9, 1, -5].sort((a, b) => a - b)  // → [-5, 1, 9, 10]   ✅
```

`"10" < "9"` 라서 `10` 이 `9` 앞에 온다. **숫자 배열엔 항상 `(a,b) => a-b`.**

### 2. 조기 종료 — `nums[i] > 0` 이면 `break`

```ts
if (sortedNums[i] > 0) break
```

정렬돼 있으니 `nums[i] > 0` 이면 **뒤의 두 수도 전부 양수** → 합이 `0` 이 될 수 없다. 남은 `i` 를 전부 건너뛴다.

```
랜덤 3000     : 514ms  (50회)   ← 최악
전부 0        :   1ms
중복 많음      :  11ms
```

> 복잡도는 여전히 `O(n²)`. **최악은 그대로고 평균이 빨라지는** 개선이라, 면접에서도 *"복잡도는 같지만 실측이 줄어듭니다"* 라고 정확히 말할 것.

### 3. 후속 문제

| 문제 | 차이 |
|---|---|
| `16. 3Sum Closest` | 정확히 0이 아니라 **가장 가까운** 합 |
| `18. 4Sum` | 루프를 하나 더 → `O(n³)` |
| `259. 3Sum Smaller` | 합이 target **미만**인 개수 |

전부 **정렬 + (k-2)중 루프 + 투 포인터** 구조. 3Sum이 원형이다.

---

## 실수 노트

- **중복 제거 ①에서 방향을 반대로** — 뒤(`i+1`)와 비교해 중복 그룹의 **첫 번째를 버림**. `left` 가 `i` 오른쪽만 보므로 **첫 번째를 남겨야** 한다 (`[-1,-1,2]` 반례)
- `sort` 가 **원본을 훼손**하는데 `sortedNums` 라는 이름이 그걸 가림 `#입력훼손`
- ✅ **②③④ 는 힌트 없이 스스로 채움** · 구현 1발 · 복잡도 `O(n²)`/`O(1)` 정확

---

## 복습 기록

**다음 복습**: 2026-09-10 (`1일` 단계) — **중복 제거 ①의 방향**을 재작성 포인트로

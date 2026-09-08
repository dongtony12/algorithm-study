# 167. Two Sum II - Input Array Is Sorted

- **난이도**: **Medium** ← Easy 라운드 중 사용자 지정으로 조기 투입 (2026-08-12)
- **유형**: 배열, **투 포인터(양끝 → 안쪽)**, 지배 논증
- **링크**: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
- **최초 풀이**: 2026-08-12 / **결과**: 통과 (접근 피드백 2회 — 전부 "왜 되는가" 논증)

---

## 문제 요약

**오름차순 정렬된** 배열에서 합이 `target` 인 두 수의 **인덱스**를 반환.

- ⚠️ **1-indexed.** 반환값은 `[index1, index2]`, `1 <= index1 < index2 <= numbers.length`
- 정답은 **정확히 하나** 존재함이 보장됨
- **추가 공간을 상수만 써야 한다** ← 문제에 명시된 조건. 해시맵 풀이를 막는 장치다

```
[2,7,11,15], target=9   →  [1,2]
[2,3,4],     target=6   →  [1,3]
[-1,0],      target=-1  →  [1,2]
```

- **Constraints**: `2 <= numbers.length <= 3*10^4`, `-1000 <= numbers[i], target <= 1000`, **non-decreasing 정렬**

---

## 접근 — 양끝에서 안쪽으로

```
numbers = [2, 7, 11, 15]     target = 9
           ↑           ↑
           i           k

2 + 15 = 17  >  9   →  k--     (너무 크니 큰 쪽을 줄인다)
2 + 11 = 13  >  9   →  k--
2 +  7 =  9  =  9   →  [i+1, k+1] = [1, 2]
```

**규칙 두 줄이 전부다.**
- 합이 `target` 보다 **크면** → `k--`
- 합이 `target` 보다 **작으면** → `i++`

---

## 🔑 왜 되는가 — 지배 논증 (dominance argument)

이 문제의 핵심. **"버려도 안전한 이유"** 를 증명하지 못하면 그냥 감으로 푼 것이다.

### `k--` 가 안전한 이유

```
numbers[k] 와 짝지을 수 있는 남은 수 중 가장 작은 것이 numbers[i]     ← ① (정렬 덕분)
그 조합조차 target을 초과했다                                          ← ②
→ numbers[k] 는 남은 어떤 수와 짝지어도 target을 넘는다                 ← ①+②
→ numbers[k] 는 답에 포함될 수 없다  →  영원히 버려도 안전
```

### `i++` 가 안전한 이유 (완전 대칭)

```
numbers[i] 와 짝지을 수 있는 남은 수 중 가장 큰 것이 numbers[k]
그 조합조차 target에 미달했다
→ numbers[i] 는 남은 어떤 수와 짝지어도 target에 못 미친다
→ numbers[i] 는 답에 포함될 수 없다  →  버려도 안전
```

> ### 🔑 **"지금 최선의 조합조차 안 되면, 나머지는 볼 필요도 없다."**
> [0121. Best Time to Buy and Sell Stock](../../01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) 의 *"새 최저가가 나오면 예전 최저가는 어떤 시나리오에서도 다시 쓸 일이 없다"* 와 **완전히 같은 구조.** → [그리디 알고리즘](../../concepts/greedy.md)

⚠️ **이 논증이 성립하는 유일한 이유는 "정렬되어 있다"** 는 것이다.
정렬이 없으면 `numbers[i]` 가 남은 것 중 가장 작다는 보장이 사라지고 **논증 전체가 무너진다.**

**매 반복 최소 하나의 후보를 확정적으로 제거**하므로 최대 `n`번 만에 끝난다 → `O(n)`.

### ❌ 이유가 아닌 것들 (접근 단계에서 틀리게 답한 부분)

| 틀린 논거 | 왜 아닌가 |
|---|---|
| *"해가 하나뿐이라서"* | 해가 여러 개여도 이 버리기는 똑같이 성립한다. **유일성은 "어떤 답을 반환할지"의 문제**이지 "버려도 안전한가"와 무관 |
| *"결과 배열 length가 2라서 i를 늘려 조정"* | 출력 형태는 버리기의 근거가 아니다. 근거는 **"미달했다 → 더 큰 짝이 없다"** |

---

## 최종 정답 (제출본)

```ts
function twoSum(numbers: number[], target: number): number[] {
    let i = 0
    let k = numbers.length - 1

    while (target - (numbers[i] + numbers[k]) !== 0){
        if(numbers[i] + numbers[k] > target) {
            k--
        }
        else if(numbers[i] + numbers[k] < target) {
            i++
        }
    }

    return [i+1, k+1] // 1-indexed이기때문에 i와 k에 +1 씩
}
```

- **시간 `O(n)` / 공간 `O(1)`** — 문제가 명시한 상수 공간 조건 충족
- 검증: 고정 10건 + 랜덤 **299,998건** 불일치 0. 포인터 완주 케이스(3×10⁴) 1회당 25μs

---

## 개선 — 조건식이 한 겹 돌아간다

### ① `A - B !== 0` 은 그냥 `A !== B`

```ts
while (target - (numbers[i] + numbers[k]) !== 0)   // 뺄셈이 아무것도 안 해준다
while (numbers[i] + numbers[k] !== target)          // ✅
```

### ② 같은 덧셈을 한 반복에 최대 3번 계산한다

### ③ `else if` → `else` — `=== target` 은 이미 걸러졌으므로 남은 건 `<` 뿐

### ④ 종료 조건을 포인터 관계로

```ts
function twoSum(numbers: number[], target: number): number[] {
    let i = 0
    let k = numbers.length - 1

    while (i < k) {
        const sum = numbers[i] + numbers[k]
        if (sum === target) return [i + 1, k + 1]
        if (sum > target) k--
        else i++
    }
    return []
}
```

**`i < k` 가드가 왜 필요한가** — 지금 코드는 **정답이 없으면 무한 루프**다:

```
i와 k가 서로 지나침 → numbers[i] 또는 numbers[k] 가 undefined
→ undefined + number = NaN
→ target - NaN !== 0  은  true      ← 루프가 절대 안 끝난다
```

문제가 *"정답은 정확히 하나 존재"* 를 보장하므로 실전에선 안 터진다. 하지만 [0125. Valid Palindrome](../0125-valid-palindrome/README.md) 복습에서 정리한 것과 같은 얘기 — **종료 조건은 포인터 관계로 쓴다.** → [투 포인터](../../concepts/two-pointers.md)

---

## 알아야 할 상식

### 1. 왜 해시맵으로 풀면 안 되나

[0383. Ransom Note](../../02-Hashmap/0383-ransom-note/README.md) 처럼 `Map` 에 "이미 본 값 → 인덱스"를 담으면 **정렬이 없어도** `O(n)` / `O(n)` 으로 풀린다 (이게 원조 `1. Two Sum`).

하지만 이 문제는 **`O(1)` 공간을 명시적으로 요구**한다. 그래서 "정렬되어 있다"는 정보를 반드시 써야 한다.

> 🔑 **"정렬되어 있다"는 조건은 공간을 `O(n)` → `O(1)` 로 만든다.**
> [0026. Remove Duplicates from Sorted Array](../../01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) 에서 *"정렬 안 돼 있으면 지금까지 나온 모든 값을 Set에 기억해야 한다"* 고 정리한 것과 같은 이득.

### 2. 다음 단계 — 3Sum

`15. 3Sum` 은 **하나를 고정하고 나머지 둘을 이 문제로 푸는 것**이다.
```
for (고정할 첫 번째 수) {
    나머지 구간에서 twoSum(target = -고정값)      ← 이 문제
}
```
→ `O(n²)`. 그래서 167이 15의 전제가 된다.

### 3. `11. Container With Most Water` 와의 차이

같은 양끝 포인터지만 **움직이는 규칙의 근거가 다르다.**

| | 움직임 규칙 | 근거 |
|---|---|---|
| 167 | 합이 크면 `k--`, 작으면 `i++` | **정렬** — 남은 것 중 최소/최대가 보장됨 |
| 11 | **높이가 낮은 쪽**을 안으로 | 낮은 쪽을 두면 폭만 줄어 넓이가 절대 안 커짐 |

---

## 실수 노트

- **"왜 되는가"를 논증하지 못했다** → *"해가 하나뿐이라서"*, *"결과 배열 length가 2라서"* 는 근거가 아니다. **지배 논증**(지금 최선의 조합조차 안 되면 나머지는 볼 필요 없다)으로 설명해야 한다. 접근 피드백 2회가 전부 이것 때문
- **`target - (a + b) !== 0`** — 뺄셈이 아무 역할도 안 한다. `a + b !== target` 으로 `#죽은코드방치` (카운트 미포함 — 정답 코드의 스타일)
- **종료 조건이 포인터 관계가 아니다** → 정답이 없으면 무한 루프. `i < k` 로. [0125. Valid Palindrome](../0125-valid-palindrome/README.md) 복습에서 같은 교훈을 정리한 직후인데 여기선 안 적용했다
- ✅ **1-indexed를 접근 단계부터 인지하고 주석까지 달았다** — `#인덱스오프바이원` 3회 🔴 인데 안 밟음
- ✅ 양끝 포인터 규칙(`> target → k--`, `< target → i++`)을 힌트 없이 도출
- ✅ 복잡도 `O(n)` / `O(1)` 정확 (6문제 연속 공간복잡도 정확)

---

## 복습 기록

**다음 복습**: 2026-08-21 (`return` 누락 → `1일` 단계 유지)

### 2026-08-20 (1회차) — 동작 통과, **TS 컴파일 실패(`return` 누락)**

고정 10건 + 랜덤 30만건(해 유일 입력) 실패 0. 포인터 완주(3×10⁴) 2000회 45ms.
복잡도 `O(n)` / `O(1)` 정확.

```ts
function twoSum(numbers: number[], target: number): number[] {
  let i = 0
  let k = numbers.length - 1

  while (i < k) {
    if (numbers[i] + numbers[k] < target) {
        i++
    } else if (numbers[i] + numbers[k] > target) {
        k--
    } else {
        return [i+1, k+1]
    }
  }
}                                    // ← return 이 없다
```

#### ✅ 08-12 개선점 반영

| 08-12에 남긴 개선점 | 08-20 |
|---|---|
| `A - B !== 0` → `A !== B` | **`else` 로 정리** ✅ 뺄셈 사라짐 |
| **`i < k` 가드** (없으면 무한루프) | **반영** ✅ |
| 1-indexed `+1` | ✅ 유지 |
| 같은 덧셈 반복 계산 | 3회 → 2회 (부분 개선) |

08-12 코드는 `target - (...) !== 0` 이라 **정답이 없으면 무한루프**였는데, 이번엔 `i < k` 로 종료 조건을 포인터 관계로 잡았다.

#### ✅ 지배 논증 완성 — 08-12보다 나아짐

08-12에는 *"해가 하나뿐이라서"*, *"결과 배열 length가 2라서"* 로 틀렸는데, 이번엔 **정렬을 근거로** 양방향을 다 설명했다. 빈칸 보강으로 완성:

```
numbers[i] 와 짝지을 수 있는 남은 수 중 가장 큰 것이 numbers[k] 다.
그 조합조차 target에 도달하지 못했다.
→ numbers[i] 는 남은 어떤 수와 짝지어도 항상 작다.
→ 버려도 안전
```

#### ⚠️ TypeScript — `return` 누락

```
error TS2366: Function lacks ending return statement
              and return type does not include 'undefined'.
```

| 환경 | 결과 |
|---|---|
| `strictNullChecks` off (LeetCode) | ✅ 통과 |
| **TS7 기본 (strict)** | ❌ 에러 |

**루프가 끝까지 돌면 반환값이 없다.** 문제가 *"정답은 정확히 하나"* 를 보장하므로 실제로 도달하지 않지만 **TS는 그 보장을 모른다.**
08-12 코드에는 `return []` 이 있었는데 이번에 빠졌다. → [0013. Roman to Integer](../../01-Array-String/0013-roman-to-integer/README.md) 의 TS 함정과 같은 성격

#### 남은 개선 — `sum` 을 변수로

```ts
while (i < k) {
    const sum = numbers[i] + numbers[k]      // 한 번만
    if (sum === target) return [i + 1, k + 1]
    if (sum > target) k--
    else i++
}
return []
```

**판정**: `return` 누락 → `1일` 단계 유지 (다음 복습 08-21)

### 2026-09-08 (2회차) — 통과, 지적 1건 · `1일` → `3일` 단계

```
고정 12/12  (음수 · 중복값 · 경계 ±1000 포함)
랜덤 (정답 유일 19,894건) 완전탐색과 불일치 0건
최대 입력 3만 × 2만회: 0ms
```

```ts
function twoSum(numbers: number[], target: number): number[] {
    let i = 0
    let k = numbers.length - 1

    while (numbers[i] + numbers[k] !== target) {
        if (numbers[i] + numbers[k] > target) k--
        else i++
    }

    return [i + 1, k + 1]
}
```

- **08-20의 `return` 누락 미재발** ✅
- **1-indexed 정확히 처리** (`[i+1, k+1]`) ✅

---

#### ⭐ `#패턴오적용` 을 같은 날 두 번째로 끊었다

같은 세션에서 방금 푼 [0001. Two Sum](../../02-Hashmap/0001-two-sum/README.md) 의 해시맵을 **가져오지 않았다.**

| | [0001. Two Sum](../../02-Hashmap/0001-two-sum/README.md) | **167** |
|---|---|---|
| 정렬 | ❌ 없음 | ✅ **정렬됨** |
| 공간 제약 | 없음 | **`only constant extra space`** |
| 접근 | 해시맵 `O(n)` 공간 | **투 포인터 `O(1)` 공간** |

1번의 맵 방식을 그대로 쓰면 **정답은 맞지만 `O(n)` 공간이라 문제 조건 위반**이다.
**정렬 조건이 투 포인터를 열어주고, 공간 제약이 그걸 강제한다.**

> 같은 날 [0242. Valid Anagram](../../02-Hashmap/0242-valid-anagram/README.md) 에서 `#패턴오적용` 이 4회로 올라갔는데, [0383. Ransom Note](../../02-Hashmap/0383-ransom-note/README.md) · 167 **두 번 연속 끊었다.**

---

#### ⚠️ 종료 조건이 **값**에 걸려 있다

```ts
while (numbers[i] + numbers[k] !== target)
```

이 루프는 *"답을 찾으면 멈춘다"* 다. **답이 없으면 멈출 방법이 없다.**

실측 — `numbers = [1,2,3]`, `target = 100`:

```
while(i < k) 가드 있음 : []                                    ✅ 정상 종료
가드 없음 (제출본 구조): 1000스텝 초과 → i=1001, k=2
                         numbers[i] = undefined
```

`i` 가 배열 끝을 넘어 `undefined + 3 = NaN` 이 되고, **`NaN !== target` 은 영원히 참**이라 무한 루프.

```ts
while (i < k) {                              // ← 포인터 관계로 종료
    const sum = numbers[i] + numbers[k]
    if (sum === target) return [i + 1, k + 1]
    if (sum > target) k--
    else i++
}
return []
```

> ### 🔑 **투 포인터의 종료 조건은 포인터 관계로 쓴다**
> [투 포인터](../../concepts/two-pointers.md) 개념노트에 이미 적어둔 항목이다 — *"종료 조건은 포인터 관계로"*.
> `i < k` 는 **입력이 무엇이든 최대 `n`번 만에 반드시 끝난다.** 값에 거는 조건은 *"답이 존재한다"* 는 Constraints에 의존한다.

LeetCode는 통과한다(정답이 보장되므로). 하지만 이건 오늘 계속 나온 그 패턴이다 — **Constraints가 대신 해주던 것에 기대는 코드.**

*(정답 코드이고 문제 조건상 도달 불가능한 경로라 **카운트 미포함.** 다만 `#우연히맞는코드` 계열)*

---

#### 지배 논증 — 왜 그 방향으로 옮기나

[0011. Container With Most Water](../0011-container-with-most-water/README.md) (08-28)에서 힌트 2회 만에 완성했던 논증이 여기도 필요하다.

```
합이 target 보다 크다  →  k--
```

**왜 `i++` 가 아니라 `k--` 인가?** 정렬돼 있으므로 `numbers[k]` 가 현재 범위의 **최댓값**이다. 합을 줄이려면:

- `i++` → `numbers[i]` 가 **커짐** → 합이 더 커짐 → 반대 방향
- `k--` → `numbers[k]` 가 **작아짐** → 합이 줄어듦 ✅

그리고 이 순간 **`k` 를 낀 조합이 전부 버려진다** — `(i,k), (i+1,k), … (k-1,k)`. 버려도 되는 이유:

> `numbers[i]` 가 남은 것 중 **최솟값**인데도 합이 `target` 을 넘었다.
> `i` 를 키우면 더 커지기만 하므로 **`k` 와 짝지어 `target` 이 되는 건 없다.**

**한 번의 이동이 `O(n)` 개의 후보를 지운다.** 그래서 `O(n²)` 이 `O(n)` 이 된다.

**판정**: 정답 · 복잡도 정확 · `return` 누락 미재발 · `#패턴오적용` 회피 / 종료 조건 지적 → `1일` → **`3일` 단계** (다음 09-11)

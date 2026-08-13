# 투 포인터 (Two Pointers)

> 인덱스 두 개(이상)를 움직여서 **되돌아가지 않고** 한 번의 순회로 문제를 푸는 패턴.
> 대부분 `O(n²)` 브루트포스를 `O(n)`으로, `O(n)` 공간을 `O(1)`로 만든다.

---

## 세 가지 유형

### ① 읽기-쓰기 포인터 (같은 방향, 속도 다름)

배열을 in-place로 걸러낼 때. **`k ≤ i` 불변식**이 핵심.

```js
let k = 0;                                 // 쓰기 = 살아남은 개수
for (let i = 0; i < nums.length; i++) {    // 읽기
  if (살릴_조건) nums[k++] = nums[i];
}
return k;
```

| 문제 | 조건 |
|---|---|
| [0027. Remove Element](../01-Array-String/0027-remove-element/README.md) | `nums[i] !== val` |
| [0026. Remove Duplicates from Sorted Array](../01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) | `nums[i] !== nums[k-1]` |
| 80. Remove Duplicates II | `k < 2 \|\| nums[i] !== nums[k-2]` |
| 283. Move Zeroes | `nums[i] !== 0` |

**왜 안전한가**: 쓰기 포인터가 읽기 포인터를 절대 추월하지 못하므로, 덮어쓰는 자리는 항상 **이미 읽고 지나온 곳**이다.

---

### ② 양끝 포인터 (반대 방향, 안쪽으로 수렴)

양쪽 끝에서 시작해 가운데로 좁힌다.

```js
let left = 0, right = n - 1;
while (left < right) {
  // 조건에 따라 left++ 또는 right-- 또는 둘 다
}
```

| 문제 | 움직이는 규칙 | 버려도 되는 근거 |
|---|---|---|
| [0125. Valid Palindrome](../03-Two-Pointers/0125-valid-palindrome/README.md) | 무시할 문자는 건너뛰고, 일치하면 둘 다 좁힘 | 대칭 구조 |
| [0167. Two Sum II - Input Array Is Sorted](../03-Two-Pointers/0167-two-sum-ii-input-array-is-sorted/README.md) | 합이 크면 `right--`, 작으면 `left++` | **정렬** → 지배 논증 (아래) |
| 11. Container With Most Water | 높이가 **낮은 쪽**을 안으로 | 낮은 쪽을 두면 폭만 줄어 넓이가 절대 안 커짐 |
| 15. 3Sum | 하나 고정 + 나머지 양끝 | 167을 `n`번 반복 → `O(n²)` |

**전제**: 대부분 **정렬되어 있거나 대칭 구조**여야 한다. 그래야 "어느 쪽을 움직일지" 판단할 수 있다.

### 🔑 지배 논증 — 양끝 포인터가 "버려도 되는" 이유

`left`/`right` 중 하나를 움직인다는 건 **그 원소를 영원히 버린다**는 뜻이다. 왜 안전한가?

[0167. Two Sum II - Input Array Is Sorted](../03-Two-Pointers/0167-two-sum-ii-input-array-is-sorted/README.md) 기준:

```
numbers[right] 와 짝지을 수 있는 남은 수 중 가장 작은 것이 numbers[left]   ← ① 정렬 덕분
그 조합조차 target을 초과했다                                             ← ②
→ numbers[right] 는 남은 어떤 수와 짝지어도 target을 넘는다                ← ①+②
→ numbers[right] 는 답에 포함될 수 없다  →  버려도 안전
```

> ### **"지금 최선의 조합조차 안 되면, 나머지는 볼 필요도 없다."**
> [0121. Best Time to Buy and Sell Stock](../01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) 의 *"새 최저가가 나오면 예전 최저가는 어떤 시나리오에서도 다시 쓸 일이 없다"* 와 **완전히 같은 구조.** → [그리디 알고리즘](greedy.md)

⚠️ **성립하는 유일한 이유는 "정렬"** 이다. 정렬이 없으면 `numbers[left]` 가 남은 것 중 가장 작다는 보장이 사라지고 **논증 전체가 무너진다.**

**매 반복 최소 하나의 후보를 확정 제거**하므로 최대 `n`번 → `O(n)`.

> 🔑 **양끝 포인터 문제를 풀 때 항상 물어라 — "이걸 버려도 되는 근거가 뭐지?"**
> 답하지 못하면 감으로 푼 것이고, 조건이 살짝 바뀌면 바로 틀린다.

---

### ③ 역방향 채우기 (뒤에서부터)

빈 공간이 뒤에 있을 때.

| 문제 | |
|---|---|
| [0088. Merge Sorted Array](../01-Array-String/0088-merge-sorted-array/README.md) | 쓰기가 읽기를 추월할 수 있어 앞에서 가면 데이터 손실 |

> ### 🔑 방향 결정 규칙
> **데이터가 줄어들면 앞에서부터, 늘어나면 뒤에서부터.**
> 판단 기준: **"쓰기 포인터가 아직 안 읽은 데이터를 밟을 수 있는가?"**

---

### ④ 매칭 포인터 (두 시퀀스, 속도 다름)

**서로 다른 두 시퀀스**를 각각 가리키며, 한쪽은 무조건 전진 / 다른 쪽은 매칭될 때만 전진.
①과 달리 **쓰기가 없다.** 두 배열을 대조·병합할 때 쓴다.

```js
let k = 0;                              // 느린 쪽 (조건부 전진)
while (k < s.length) {
  if (i === t.length) return false;     // 빠른 쪽 소진 → 실패
  if (s[k] === t[i]) k++;               // 일치할 때만
  i++;                                  // 항상
}
return true;                            // 느린 쪽 소진 → 성공
```

| 문제 | 규칙 |
|---|---|
| [0392. Is Subsequence](../03-Two-Pointers/0392-is-subsequence/README.md) | `s[k] === t[i]` 일 때만 `k++`, `i`는 항상 `++` |
| 350. Intersection of Two Arrays II | 작은 쪽 포인터를 전진 (정렬 전제) |
| 88. Merge (앞에서 갈 때) | 작은 쪽을 꺼내며 전진 |

> ### 🔑 루프 조건 = 성공 조건으로 잡는다
> [0392. Is Subsequence](../03-Two-Pointers/0392-is-subsequence/README.md) 에서 `while (i < t.length)` (= "t를 다 훑는다")로 잡으면
> `t = ""` 일 때 루프가 **0번** 돌아 성공 판정 기회조차 없다.
> `while (k < s.length)` (= "s를 다 소진한다")로 바꾸면 **탈출 = 성공**이 되어 엣지케이스가 저절로 풀린다.
>
> **성공 조건을 루프 조건에 놓으면 가드가 필요 없어진다.**

> ⚠️ **가드는 루프 밖에.** 루프 조건이 거짓이면 몸통은 한 번도 실행되지 않으므로,
> 몸통 안에 넣은 `if (t.length === 0)` 같은 가드는 **도달 불가능 코드**다.

---

## 복잡도 — 조건에 쓰인 변수를 세지 마라

```js
while (k < s.length) { ... i++ ... }    // 조건은 k, 하지만 매번 전진하는 건 i
```

> ### 🔑 **"매 반복마다 반드시 증가하는 변수"가 반복 횟수의 상한이다.**
> `while` 조건에 쓰인 변수가 아니다. [0392. Is Subsequence](../03-Two-Pointers/0392-is-subsequence/README.md) 는 조건이 `k < s.length` 인데도
> 시간복잡도는 `O(n)`, `n = t.length` 다. `k`는 매칭될 때만 올라가 상한을 못 정한다.

축이 둘이면 반드시 기호부터 정의한다 → [시간·공간 복잡도](complexity.md)

---

## 건너뛰기 — `continue` vs 중첩 `while`

무시할 원소를 건너뛸 때 두 가지 스타일. **둘 다 정답.**

```js
// ① continue 방식 — 루프 맨 위로 돌아가 다시 검사
while (left < right) {
  if (!isAlnum(s[left]))  { left++;  continue; }
  if (!isAlnum(s[right])) { right--; continue; }
  // 여기 오면 둘 다 유효
  ...
}

// ② 중첩 while 방식 — 유효한 걸 만날 때까지 밀어붙임
while (left < right) {
  while (left < right && !isAlnum(s[left]))  left++;
  while (left < right && !isAlnum(s[right])) right--;
  ...
}
```

⚠️ **두 방식 모두 `left < right` 가드가 필요하다.** 영숫자가 아예 없는 입력(`",,,,"`)에서 포인터가 서로를 넘어갈 수 있다.

### 🔑 종료 조건은 "포인터 관계"로만 쓴다 — 위치로 쓰면 틀린다

건너뛰기가 있는 투 포인터는 **대칭으로 움직이지 않는다.** `left`만 여러 번 갈 수도, `right`만 여러 번 갈 수도 있다.

```js
while (left < right)             // ✅ 만나는 경우(===)와 지나친 경우(>)가 둘 다 처리됨
while (left !== right)           // ❌ 지나쳐버리면 무한루프
while (left <= s.length / 2)     // ❌ 대칭 이동이 아니므로 의미 없음
```

**반례** ([0125. Valid Palindrome](../03-Two-Pointers/0125-valid-palindrome/README.md) 복습 08-12):
```
s = ",,,,,,ab"          길이 8, 절반 = 4    정답 false ("ab"는 회문 아님)

left=0~4 전부 ',' 건너뜀 → left=5 → 조건 5 <= 4 거짓 → 종료 → true ❌
'a'와 'b'를 비교해보지도 못한다
```

> **"언제 멈추나" 대신 "언제 계속 도나"로 뒤집으면** 답이 `left < right` 하나로 나온다.

⚠️ **`if` 가 아니라 `while`/`continue` 여야 한다.** 무시할 문자가 연속으로 나올 수 있으므로(`"a,,,b"`) 한 번만 건너뛰면 부족하다.

---

## 핵심 아이디어 — 전처리를 없앤다

> **"전처리해서 깨끗한 데이터를 만든 뒤 처리한다"**
> → **"처리하면서 더러운 데이터를 무시한다"**

이 전환으로 공간이 `O(n) → O(1)` 이 된다.

| | 전처리 방식 | 투 포인터 |
|---|---|---|
| 공간 | `O(n)` (새 문자열·배열) | **`O(1)`** |
| 조기 종료 | 전처리는 무조건 전체 순회 | **불일치 즉시 중단** |

`"ab..............ba"` — 전처리는 전체를 훑고 나서야 비교를 시작하지만, 투 포인터는 두 번 비교하고 끝난다.

---

## 관련 노트

- [시간·공간 복잡도](complexity.md)
- [0088. Merge Sorted Array](../01-Array-String/0088-merge-sorted-array/README.md) · [0027. Remove Element](../01-Array-String/0027-remove-element/README.md) · [0026. Remove Duplicates from Sorted Array](../01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) · [0125. Valid Palindrome](../03-Two-Pointers/0125-valid-palindrome/README.md) · [0392. Is Subsequence](../03-Two-Pointers/0392-is-subsequence/README.md) · [0167. Two Sum II - Input Array Is Sorted](../03-Two-Pointers/0167-two-sum-ii-input-array-is-sorted/README.md)

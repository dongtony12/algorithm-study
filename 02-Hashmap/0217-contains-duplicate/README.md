# 217. Contains Duplicate

- **난이도**: Easy
- **유형**: 배열, **Set 중복 판정**
- **링크**: https://leetcode.com/problems/contains-duplicate/
- **최초 풀이**: 2026-08-26 / **결과**: **통과 (피드백 0회, 구현 1발)**

---

## 문제 요약

어떤 값이든 **두 번 이상** 나타나면 `true`, 모두 서로 다르면 `false`.

```
[1,2,3,1]              →  true
[1,2,3,4]              →  false
[1,1,1,3,3,4,3,2,4,2]  →  true
```

- **Constraints**: `1 <= nums.length <= 10^5`, `-10^9 <= nums[i] <= 10^9`

---

## [0219. Contains Duplicate II](../0219-contains-duplicate-ii/README.md) 에서 조건 하나가 빠진 문제

| | 조건 | 필요한 것 |
|---|---|---|
| [0219. Contains Duplicate II](../0219-contains-duplicate-ii/README.md) | 중복 + **거리 `k` 이내** | Set + **윈도우 관리(`delete`)** |
| **217 (이 문제)** | 중복만 | **Set 하나** |

**거리 조건이 사라지니 "오래된 것 버리기"가 통째로 없어진다.** 그래서 `new Set(nums)` 한 줄로 끝난다.

> 🔑 **기억할 범위가 무한하면 버리는 동작이 없다.** 반대로 범위가 유한하면 윈도우가 된다.

---

## 최종 정답

```ts
function containsDuplicate(nums: number[]): boolean {
    const numSet = new Set(nums)

    if (nums.length === numSet.size) {
        return false
    } else {
        return true
    }
}
```

- **시간 `O(n)` / 공간 `O(n)`**
- 검증: 고정 9건 + 랜덤 30만건 불일치 0

**왜 되는가**: `Set` 은 중복을 자동으로 합치므로, **`size` 가 원본 길이보다 작다 = 중복이 있었다**.

---

## ⚠️ 실측 — 조기 종료와의 트레이드오프

```ts
// 조기 종료 버전
function containsDuplicate(nums: number[]): boolean {
    const seen = new Set()
    for (const x of nums) {
        if (seen.has(x)) return true      // 발견 즉시 종료
        seen.add(x)
    }
    return false
}
```

`n = 10⁵`, 200회:

| 입력 | `new Set(nums)` | 조기 종료 |
|---|---|---|
| **맨 앞에서 중복** | 599ms | **0ms** |
| **중복 없음** | **584ms** | 723ms |

**입력에 따라 승자가 뒤집힌다.**

| | `new Set(nums)` | 조기 종료 |
|---|---|---|
| 중복이 일찍 나올 때 | 전부 넣고 나서야 판단 | **즉시 반환** |
| 중복이 없을 때 | **네이티브 일괄 생성이라 빠름** | `has`/`add` 를 JS 루프로 반복 |

복잡도는 **둘 다 `O(n)` / `O(n)`**. 차이는 **상수와 조기 종료 여부**다.

> ### 🔑 `new Set(arr)` 은 "전부 넣고 나서 판단"이라 **조기 종료가 불가능**하다
> [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](../2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md)(n=50에서 Set이 7배 느림) · [0242. Valid Anagram](../0242-valid-anagram/README.md)(배열 26칸이 12배 빠름)에서 본 것과 같은 얘기 —
> **Big-O가 같을 때는 상수와 조기 종료가 실제 성능을 가른다.**

**면접 답변**: *"`new Set(nums).size !== nums.length` 한 줄로 됩니다. 다만 중복이 앞쪽에 있으면 조기 종료 버전이 훨씬 빠르고, 중복이 없으면 반대입니다."*

---

## 스타일 — `if (조건) return false; else return true`

```ts
if (nums.length === numSet.size) return false
else return true

return nums.length !== numSet.size        // ✅ 같은 뜻
```

**조건식 자체가 이미 boolean** 이다. `if (조건) return false; else return true` 는 **`return !조건`** 과 같다.
실무 코드리뷰에서 자주 지적되는 패턴.

---

## 실수 노트

- **`if/else` 로 boolean을 반환** → `return nums.length !== numSet.size` 한 줄이면 된다 (스타일, 카운트 미포함)
- ✅ **피드백 0회, 구현 1발** — [0219. Contains Duplicate II](../0219-contains-duplicate-ii/README.md) 와의 관계(거리 조건이 빠지면 윈도우 관리도 사라진다)를 정확히 파악
- ✅ 복잡도 `O(n)` / `O(n)` 정확

---

## 복습 기록

**다음 복습**: 2026-08-27 (`1일` 단계) — **`new Set(nums)` 과 조기 종료 중 어느 쪽이 언제 유리한지**도 함께 말할 것

### 2026-09-10 (1회차) — 통과, **피드백 0회** · `1일` → `3일` 단계

```
고정 10/10  (길이 1 · 음수 · ±10^9 경계 포함)
랜덤 40만건 불일치 0건
```

```ts
function containsDuplicate(nums: number[]): boolean {
    const numSet = new Set()

    for (let i = 0; i < nums.length; i++) {
        if (numSet.has(nums[i])) { return true }
        else { numSet.add(nums[i]) }
    }
    return false
}
```

#### ⭐ 공간 `O(n)` — 전날 [0202. Happy Number](../0202-happy-number/README.md) 에서 틀렸던 판단을 이번엔 맞힘

```
-10^9 <= nums[i] <= 10^9   →  |Σ| ≈ 20억
n ≤ 10^5

min(n, |Σ|) = min(100000, 20억) = n     →  O(n)  ✅
```

| | `\|Σ\|` | `n` 최대 | 승자 | 공간 |
|---|---|---|---|---|
| [0202. Happy Number](../0202-happy-number/README.md) (09-09) | **810** | 21억 | 알파벳 | `O(1)` — `O(n)` 이라 답함 ❌ |
| **0217 (09-10)** | **20억** | **10만** | **`n`** | **`O(n)`** ✅ |

**정확히 반대 상황인데 구분해냈다.** → [시간·공간 복잡도](../../concepts/complexity.md) 「`O(min(n, |Σ|))`」

---

#### ⭐ 조기 종료가 살아 있다 — 이 코드의 값어치

`new Set(nums).size !== nums.length` 한 줄로도 풀리지만 **루프 버전이 훨씬 나은 경우가 있다.**

```
[측정] Set 최대 크기 (n = 100,000)
  앞쪽에 중복 :      1개
  끝에 중복   : 99,999개
  중복 없음   : 100,000개
```

```
앞쪽에 중복 × 2000회
  루프 + 조기종료:    0ms      ← 두 번째 원소에서 끝남
  new Set 한 줄  : 4770ms      ← 10만 개를 전부 넣고 나서 비교

중복 없음 × 2000회
  루프 + 조기종료: 4944ms
  new Set 한 줄  : 4684ms      ← 최악에서는 비슷
```

**최악은 같지만 평균이 완전히 다르다.** 한 줄 버전은 *"답이 이미 정해졌는데도"* 끝까지 넣는다.

> ### 🔑 `new Set(arr).size` 는 "전부 넣은 뒤"에만 답을 준다
> 조기 종료가 의미 있는 문제에서는 직접 루프를 도는 게 맞다.
> [0383. Ransom Note](../0383-ransom-note/README.md) · [0242. Valid Anagram](../0242-valid-anagram/README.md) 의 **가드 절 / 조기 종료**와 같은 계열.

---

#### 사소한 것 — `else` 가 필요 없다

```ts
if (numSet.has(nums[i])) { return true }
else { numSet.add(nums[i]) }
```

`if` 안에서 **`return` 으로 함수를 나가므로** `else` 뒤 코드는 어차피 *"중복이 아닐 때만"* 실행된다.

```ts
for (const x of nums) {
    if (seen.has(x)) return true
    seen.add(x)
}
```

> `return` / `break` / `continue` 뒤의 `else` 는 **들여쓰기만 늘리고 정보를 안 더한다.**
> [0058. Length of Last Word](../../01-Array-String/0058-length-of-last-word/README.md) 의 *"상호배타적 조건은 `else` 로 묶는다"* 의 짝 — 이번엔 반대로 **`else` 를 빼는** 쪽.

**판정**: 정답 · 복잡도 정확(`|Σ|` vs `n` 구분 성공) · 조기 종료 유지 · 피드백 0회 → `1일` → **`3일` 단계** (다음 09-15)

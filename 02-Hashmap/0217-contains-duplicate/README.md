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

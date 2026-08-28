# 349. Intersection of Two Arrays

- **난이도**: Easy
- **유형**: 해시맵 (Set)
- **링크**: https://leetcode.com/problems/intersection-of-two-arrays/
- **최초 풀이**: 2026-08-28 / **결과**: 통과 (**피드백 0회**)

---

## 문제 요약

두 정수 배열의 **교집합**을 반환. 결과의 각 원소는 **유일**해야 하고 **순서는 무관**.

```
[1,2,2,1] ∩ [2,2]        →  [2]
[4,9,5]   ∩ [9,4,9,8,4]  →  [9,4]   (또는 [4,9])
```

```
1 <= nums1.length, nums2.length <= 1000
0 <= nums1[i], nums2[i] <= 1000
```

---

## 내 풀이 (통과)

```ts
function intersection(nums1: number[], nums2: number[]): number[] {
    const nums1Set = new Set(nums1)
    const nums2Set = new Set(nums2)

    const intersection = new Set([...nums1Set].filter((x) => nums2Set.has(x)))

    return Array.from(intersection)
}
```

- **시간 `O(n + m)` / 공간 `O(n + m)`** — 스스로 정확히 제시
- 검증: 고정 9건 · 랜덤 20만건 불일치 0건 · 결과 중복 0건

---

## ⭐ 핵심 — 왜 여기선 `O(1)` 이 아닌가

어제 [0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) 에서 배운 규칙은 *"유한 알파벳 위의 자료구조는 `O(1)`"* 이었다. 여기도 값 범위가 유한하다:

```
0 <= nums1[i], nums2[i] <= 1000     →  값의 종류 1001가지
```

**그럼 `O(1)` 인가? 아니다.** 규칙을 반쪽만 적용하면 이렇게 틀린다.

| | 알파벳 크기 `\|Σ\|` | 입력 크기 `n` | 실제 상한 | 공간 |
|---|---|---|---|---|
| [0205. Isomorphic Strings](../0205-isomorphic-strings/README.md) | **128** | 최대 **50,000** | `min(50000, 128)` = **128** | **`O(1)`** |
| **349** | **1001** | 최대 **1,000** | `min(1000, 1001)` = **1000** | **`O(n)`** ✅ |

> ### 🔑 정확한 형태는 **`O(min(n, |Σ|))`**
> 알파벳이 유한하다고 **자동으로** `O(1)` 이 아니다. **`|Σ|` 가 `n` 보다 훨씬 작을 때만** 상수로 접힌다.
> 349는 `|Σ| = 1001` 이 `n = 1000` 보다 **크므로** 상한 역할을 전혀 못 한다. 병목이 여전히 `n`.

**205는 `128 ≪ 50000` 이라 알파벳이 이겼고, 349는 `1001 > 1000` 이라 `n` 이 이겼다. 같은 규칙, 다른 승자.**

→ [시간·공간 복잡도](../../concepts/complexity.md) 「유한 알파벳 위의 자료구조는 `O(1)` 이다」

---

## ⚠️ 지적 1 — 바깥 `new Set(...)` 이 불필요

```ts
const intersection = new Set([...nums1Set].filter((x) => nums2Set.has(x)))
                     ^^^^^^^
```

`nums1Set` 은 **이미 중복이 없다.** 거기서 걸러낸 결과도 당연히 중복이 없다.
**없는 중복을 제거하려고 Set을 하나 더 만들고 있다.**

```
바깥 Set 제거해도 결과 동일: 20만건 불일치 0건

제출본 (Set 3개)       : 449ms
바깥 Set 제거 (Set 2개) : 379ms      ← 16% 빠름
```

```ts
return [...nums1Set].filter(x => nums2Set.has(x))     // Array.from() 도 같이 사라짐
```

> 💡 **`Set` 을 쓸 때는 "여기에 중복이 들어올 수 있나?"를 묻는다.** 안 들어오면 그 `Set` 은 비용만 내는 장식이다.

## ⚠️ 지적 2 — 변수명이 함수명과 같다 (shadowing)

```ts
function intersection(nums1, nums2) {
    const intersection = new Set(...)      // ← 함수 이름을 가려버림
```

재귀를 안 쓰니 동작 문제는 없지만 **함수 안에서 자기 이름을 부를 수 없게 된다.** 읽는 사람도 멈칫한다.

```ts
const common = [...nums1Set].filter(x => nums2Set.has(x))
```

---

## 최적화 — 작은 쪽을 순회

```
제출본 (Set 3개)      : 449ms
바깥 Set 제거 (Set 2개): 379ms
for 루프 (spread 없음) : 288ms      ← 1.6배
```

```ts
function intersection(nums1: number[], nums2: number[]): number[] {
    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1]

    const seen = new Set(nums2)
    const result = new Set<number>()
    for (const x of nums1) {
        if (seen.has(x)) result.add(x)
    }
    return [...result]
}
```

두 가지가 개선된다:

1. **`[...nums1Set]` 스프레드가 사라진다** — 중간 배열을 하나 덜 만든다
2. **짧은 배열을 순회한다** — `nums1` 이 1개, `nums2` 가 1000개면 1번만 돌면 된다

> 복잡도는 여전히 `O(n + m)` 으로 **같다. 상수 배수 개선**이지 차수 개선이 아니다 — 면접에서도 그렇게 말해야 정확하다.

---

## 알아야 할 상식

### `Set` 의 교집합은 언어 차원에 없다 (아직)

파이썬은 `set1 & set2` 로 끝나지만 JS `Set` 에는 집합 연산이 없다. 그래서 `filter + has` 로 직접 만든다.

```ts
const inter = [...a].filter(x => b.has(x))     // 교집합
const union = new Set([...a, ...b])            // 합집합
const diff  = [...a].filter(x => !b.has(x))    // 차집합
```

> ES2025에 `Set.prototype.intersection()` 등이 표준화됐지만 **LeetCode 런타임에는 없다고 보는 게 안전**하다.

### 배열 `includes` 를 쓰면 `O(n·m)` 이 된다

```ts
[...new Set(nums1)].filter(x => nums2.includes(x))     // ❌ includes 가 매번 O(m)
```

`Set.has` 는 `O(1)`, `Array.includes` 는 `O(m)`. **`Set` 으로 바꾸는 이유가 정확히 이것**이다.
→ [해시맵](../../concepts/hashmap.md) 「공간을 내주고 시간을 산다」

---

## 실수 노트

- 없는 중복을 제거하려고 `Set` 을 한 겹 더 감쌈 → **"여기에 중복이 들어올 수 있나?"** 를 먼저 묻기
- 변수명이 함수명을 가림(shadowing) → 결과를 담는 변수는 `result`, `common` 등으로
- ✅ **복잡도 시간·공간 둘 다 정확** · 접근 피드백 0회

---

## 복습 기록

**다음 복습**: 2026-08-31 (`1일` 단계 · 평일 기준)

# 242. Valid Anagram

- **난이도**: Easy
- **유형**: 문자열, **해시맵 카운팅**
- **링크**: https://leetcode.com/problems/valid-anagram/
- **최초 풀이**: 2026-08-17 / **결과**: 통과 (접근 피드백 2회 → 구현 1발)

---

## 문제 요약

`t`가 `s`의 **애너그램**(모든 글자를 정확히 한 번씩 재배열한 것)인지 판정.

```
"anagram" / "nagaram"  →  true
"rat"     / "car"      →  false
```

- **Constraints**: `1 <= s.length, t.length <= 5*10^4`, **소문자 영문자로만 구성**
  ← **"소문자만"이 공간을 `O(1)`로 만든다.** 키가 최대 26개
- **Follow-up**: 유니코드 문자가 들어온다면?

---

## 접근 설계 (구현 전에 확정한 것)

| 기준 | 내용 |
|---|---|
| ① 자료구조 | `Map` 카운팅 (글자 → 개수) |
| ② 단계 | s의 개수를 세고 → t의 개수를 세고 → **size가 같고 + 모든 키의 개수가 같으면** true |
| ③ 왜 되는가 | **애너그램 = 같은 글자를 재배열한 것 → 글자별 개수가 같으면 동일** |
| ④ 복잡도 | 시간 `O(m + n)` / 공간 `O(1)` (`m` = s.length, `n` = t.length) |

### ⚠️ `383` 과 요구가 다르다

| | 요구 | 비교 |
|---|---|---|
| [0383. Ransom Note](../0383-ransom-note/README.md) | *"만들 수 있나"* — magazine이 더 많아도 OK | `노트개수 <= 잡지개수` |
| **242** | *"정확히 같은 구성인가"* | **개수가 정확히 일치 + 키 집합도 일치** |

---

## ⚠️ 한쪽 맵의 키만 도는 건 부족하다

접근 1차에서 *"s와 t의 key value값이 같으면 true"* 라고만 했는데, 확인할 게 **두 가지**다.

```
s = "a",   t = "ab"

mapS = { a: 1 }
mapT = { a: 1, b: 1 }

mapS의 키를 전부 돌면 → a 하나뿐, 1 === 1 → true 반환  ❌   정답은 false
```

> **한쪽 맵의 키만 도는 건, 반대쪽에만 있는 키를 못 본다.**
> → **`size` 비교 + 키별 값 비교**, 둘 다 필요.

`Map` 비교에 깊은 비교가 없다는 것도 함께 기억할 것:
```js
mapA === mapB    // 항상 false (참조 비교)
map.size         // 키 개수 O(1)
for (const [k, v] of map)   // 키+값 순회 — 별도 Set 불필요
```

---

## 최종 정답 (제출본)

```ts
function isAnagram(s: string, t: string): boolean {
    const mapS = new Map()
    const mapT = new Map()

    for (const char of s) {
        let num = 0
        if (mapS.has(char)) {
            num = mapS.get(char)
        }
        mapS.set(char, num + 1)
    }

    for (const char of t) {
        let num = 0
        if (mapT.has(char)) {
            num = mapT.get(char)
        }
        mapT.set(char, num + 1)
    }

    if (mapS.size !== mapT.size) return false

    for (const [sk, sv] of mapS) {
        if (!mapT.has(sk) || sv !== mapT.get(sk)) {
            return false
        }
    }

    return true
}
```

- **시간 `O(m + n)` / 공간 `O(1)`**
- 검증: 고정 13건 + 랜덤 30만건 불일치 0

**`s.length !== t.length` 조기 종료를 안 넣었지만 정답에 지장 없다** — `size` 비교가 그 역할을 대신한다(`"a"` vs `"ab"` → size 1 vs 2). 논리적으로도 안전: 모든 키의 개수가 같으면 총 길이도 같다.

---

## 개선 ① 카운팅 관용구 — 4줄 → 1줄

```ts
// 지금
let num = 0
if (mapS.has(char)) { num = mapS.get(char) }
mapS.set(char, num + 1)

// 관용구
mapS.set(char, (mapS.get(char) ?? 0) + 1)
```

`get` 이 없는 키에 `undefined` 를 주니 `?? 0` 으로 기본값을 씌우면 **`has` 검사가 통째로 사라진다.** → [해시맵](../../concepts/hashmap.md)

⚠️ **`|| 0` 이 아니라 `?? 0`** — 개수가 `0`인 키가 있으면 `||` 는 그걸 "없음"으로 오판한다 (`#센티널값` 과 같은 뿌리)

비교 루프의 `!mapT.has(sk) ||` 도 없어도 된다 — 키가 없으면 `get` 이 `undefined` 라 `sv !== undefined` 로 걸린다. 다만 **명시적이라 남겨두는 것도 나쁘지 않다**(조회 한 번 더 하는 비용만 감수하면).

---

## 개선 ② 배열 26칸 — 실측 12배

```ts
function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false        // 길이 다르면 볼 것도 없음

    const count = new Array(26).fill(0)

    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 97]++              // s는 +1
        count[t.charCodeAt(i) - 97]--              // t는 -1
    }

    return count.every(c => c === 0)               // 전부 0이면 애너그램
}
```

**길이가 같음을 먼저 확인했으므로 루프 하나로 둘 다 처리**할 수 있다.
그리고 배열이 "비는" 게 아니라 **26칸이 그대로 있고 값이 전부 `0`** 이 되는 것.

### 실측 (`n = 5×10⁴`, 500회 · 4개 버전 교차검증 20만건 불일치 0)

| 방식 | 시간 | 복잡도 | 공간 |
|---|---|---|---|
| Map 2개 (제출본) | 507ms | `O(m+n)` | `O(1)` |
| Map 1개 + 차감 | 511ms | `O(m+n)` | `O(1)` |
| **배열 26칸 +/-** | **40ms** | `O(m+n)` | `O(1)` |
| 정렬 비교 | 1658ms | **`O(n log n)`** | `O(n)` |

> 🔑 **Map 1개로 줄여도 속도는 그대로다.** 병목이 "맵 개수"가 아니라 **문자열 해싱** 자체이기 때문.
> 배열로 바꿔야 12배가 나온다. [0383. Ransom Note](../0383-ransom-note/README.md) 의 10배와 같은 결론.

**정렬 비교**는 코드가 제일 짧지만 유일하게 `O(n log n)` 이고 배열까지 만든다.
면접 카드로: *"정렬로도 되지만 `O(n log n)` 이라 카운팅이 낫습니다."*

---

## Follow-up — 유니코드가 들어온다면

**26칸 배열이 즉시 무너진다.** `'가'.charCodeAt(0) - 97` 은 26을 훌쩍 넘는다.

→ **`Map` 으로 돌아간다.** 키가 뭐가 올지 모를 때 쓰는 게 `Map` 이다. **제출한 Map 버전이 Follow-up을 그대로 커버한다.**

> 🔑 **배열 26칸은 "키 종류가 적고 정수로 매핑 가능"할 때만 쓰는 최적화.** 전제가 깨지면 `Map`.

추가로 이모지·결합문자까지 정확히 세려면 `Intl.Segmenter` 가 필요하다:
```js
[...new Intl.Segmenter().segment("👨‍👩‍👧")].length   // 1  (그냥 .length 는 8)
```
→ [0058. Length of Last Word](../../01-Array-String/0058-length-of-last-word/README.md) 에 정리해둔 함정

---

## 실수 노트

- **복잡도를 `O(n)` 하나로 뭉갰다** → 입력이 두 개(`s`, `t`)이므로 `O(m + n)`. 문제를 내면서 *"입력이 두 개니 기호부터 정의하라"* 고 명시했는데도 나옴 `#복잡도차원뭉개기`
- **공간을 `O(n)` 으로 판단** → **소문자 26개 고정이라 `O(1)`.** 전날 [0383. Ransom Note](../0383-ransom-note/README.md) 에서 *"소문자 영문자의 개수만 강제되니 `O(1)`"* 이라고 스스로 답했던 내용 `#공간복잡도오판`
- **한쪽 맵의 키만 비교하려 했다** → `"a"` vs `"ab"` 오답. `size` 비교가 함께 필요
- **카운팅에 `has` + 임시변수 4줄** → `(map.get(k) ?? 0) + 1` 관용구가 [해시맵](../../concepts/hashmap.md) 노트에 이미 있다
- `new Set` 이 필요할 것 같다고 함 → `Map` 이 `size` / `keys()` / `entries()` 를 이미 제공 `#자료구조과다생성` (미발생, 접근 단계에서 정정)
- ✅ 지적 후 `O(m+n)` / `O(1)` 로 **스스로 정정**
- ✅ **"왜 되는가"를 한 번에 답함** — 애너그램 = 재배열이므로 글자별 개수만 같으면 동일
- ✅ 배열 26칸 최적화를 **힌트 한 번에** 도출 ([0383. Ransom Note](../0383-ransom-note/README.md) 학습 전이 성공)
- ✅ 구현 1발 통과 (수정 0회)

---

## 복습 기록

**다음 복습**: 2026-08-22 (마지막 풀이일 + 5일) — **배열 26칸 `+/-` 버전으로** 작성해볼 것

# 반복 실수 패턴

> 문제별 노트에 흩어진 실수 노트를 태그로 묶어 **약점을 가시화**한다.
> 3회 이상 쌓인 태그는 세션 시작 시 경고로 띄운다.
> 최초 집계: 2026-08-10 (문제 11개 기준)

---

## 집계

| 태그 | 횟수 | 마지막 | 문제 |
|---|---|---|---|
| 🔴 **#죽은코드방치** | 4 | 08-03 | [0027. Remove Element](01-Array-String/0027-remove-element/README.md) · [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) · [0058. Length of Last Word](01-Array-String/0058-length-of-last-word/README.md) · [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) |
| 🔴 **#복잡도차원뭉개기** | **4** | 08-12 | [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) ×2 · [0028. Find the Index of the First Occurrence in a String](01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) · [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) |
| ⚪ **#루프상한혼동** | 1 | 08-12 | [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) |
| 🔴 **#변수명불명확** | **4** | 08-12 | [0169. Majority Element](01-Array-String/0169-majority-element/README.md) · [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) · [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) · [0383. Ransom Note](02-Hashmap/0383-ransom-note/README.md) |
| 🟡 **#Constraints미확인** | 2 | 08-10 | [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) · [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) |
| 🟡 **#엣지케이스누락** | 2 | 08-10 | [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) · [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) |
| 🟡 **#공간복잡도오판** | 2 | 08-03 | [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) · [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) |
| 🟡 **#우연히맞는코드** | 2 | 08-03 | [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) · [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) |
| 🔴 **#쓰기포인터오해** | **3** | 08-12 | [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) ×2 · [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) |
| 🔴 **#인덱스오프바이원** | 3 | 08-11 | [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) · [0028. Find the Index of the First Occurrence in a String](01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) · [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) |
| ⚪ **#센티널값** | 1 | 08-03 | [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) |
| ⚪ **#함수참조vs호출** | 1 | 08-03 | [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) |
| ⚪ **#숨은반복문** | 1 | 08-03 | [0169. Majority Element](01-Array-String/0169-majority-element/README.md) |
| ⚪ **#루프0회케이스** | 1 | 08-10 | [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) |
| ⚪ **#입력훼손** | 1 | 08-02 | [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) |
| ⚪ **#정렬조건미활용** | 1 | 08-02 | [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) |
| ✅ **#복잡도명시누락** | 3 (해결) | 08-03 | 0026부터 습관화, 0058 이후 안 나옴 |

---

## #죽은코드방치

> 제출 전에 코드를 한 번 훑지 않아 미사용 변수·중복 조건·디버깅 잔재가 남는다.
> **동작에는 영향이 없어 스스로는 절대 못 잡는다.** 면접·코드리뷰에서만 지적당하는 종류.

- 2026-08-02 [0027. Remove Element](01-Array-String/0027-remove-element/README.md) — `let i = 0` 미사용 변수, `continue` + `else` 중복
- 2026-08-03 [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) — `prices[i]-low > 0 &&` 불필요한 앞 조건
- 2026-08-03 [0058. Length of Last Word](01-Array-String/0058-length-of-last-word/README.md) — `.split('').length` (문자열은 이미 `.length`를 안다) → 불필요한 `O(n)` 할당
- 2026-08-03 [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) — `console.log` 방치, 이미 보장된 조건 재검사

**대책**: 통과한 직후 **"이 줄 지워도 되나?"** 를 한 줄씩 물으며 한 번 훑는다.

---

## #복잡도차원뭉개기

> 입력이 둘인데 `n` 하나로 뭉쳐서 답한다. **가장 자주 반복되는 실수.**

- 2026-08-03 [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) — `O(m × k)` 를 `O(n²)` 로
- 2026-08-03 [0028. Find the Index of the First Occurrence in a String](01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) — `O(n × m)` 을 `O(n²)` 로 (2회 연속)
- 2026-08-10 [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) — `O(n)` 이라 답했으나 **`n`이 `s`인지 `t`인지 정의 없음**
- 2026-08-12 [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) — **재발.** 복습에서 또 `O(n²)`. *"크기를 결정하는 값이 두 개다, 기호를 정의하라"* 고 **명시적으로 요청한 뒤에도** 뭉갬

> ⚠️ **4회 누적. 그중 2회가 같은 문제([0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md)).**
> **코드를 보기 전에, 문제를 읽자마자 먼저 적을 것:**
> ```
> 크기를 결정하는 입력이 몇 개인가?  →  m = ___,  k = ___
> ```
> 이걸 안 적고 복잡도를 말하기 시작하면 반드시 뭉개게 된다.

**대책 — 복잡도를 쓰기 전 3단계**
1. **입력이 몇 개인가?** 둘이면 기호를 둘 정의한다 (`m` = 개수, `n` = 길이 …)
2. **매 반복 반드시 증가하는 변수는?** 그게 반복 횟수의 상한이다 (`while` 조건에 쓰인 변수가 아니다)
3. **축이 하나만 남으면 어느 쪽인지 명시**한다 — `O(n)` (X) → `O(n), n = t.length` (O)

```
28번:  O(n×m) = 10,000 × 3 = 30,000
       O(n²)  = 10,000 × 10,000 = 100,000,000   ← 3000배 과대평가
```

---

## #변수명불명확

- 2026-08-03 [0169. Majority Element](01-Array-String/0169-majority-element/README.md) — `newArr`, `arr1`, `temp`
- 2026-08-03 [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) — `index` 인데 실제로는 **키 문자열** (`pair`가 맞음)
- 2026-08-03 [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) — 한글 변수명 `기준` (관례는 영어 — `base`, `ref`)
- 2026-08-11 [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) — `const test = new Set(nums)` (카운트 미포함 판단)
- 2026-08-12 [0383. Ransom Note](02-Hashmap/0383-ransom-note/README.md) — **`const arr1 = new Map()`, `arr2`**. `arr`인데 실제로는 `Map`이라 **타입까지 오인**하게 만든다. 게다가 `arr1`은 0169 실수 노트에 **이미 적혀 있던 그 이름**

**대책**: `temp`, `arr1`, `arr2`, `test`, `newX` 금지. **역할을 이름에 넣는다** (`uniqueValues`, `frequency`, `noteCount`, `magazineCount`, `seen`).

> ⚠️ **4회 누적 — 가장 많이 반복되는 실수.** 특히 **`arr`로 시작하는 이름이 Map/Set인 경우**는 읽는 사람이 `.length`, `[0]` 을 기대하게 만들어 실무에서 실제 버그로 이어진다.
> 제출 직전 체크: **"이 이름만 보고 타입과 역할이 보이나?"**

---

## #Constraints미확인

> 코드를 짜기 전에 제약을 안 읽어서, 후보에서 제외됐어야 할 접근을 시도하거나 엣지케이스를 놓친다.

- 2026-08-03 [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) — `n = 10⁵` 을 안 보고 브루트포스 → TLE. 봤다면 `O(n²)` 는 즉시 탈락
- 2026-08-10 [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) — `0 <= s.length`, `0 <= t.length` 의 **`0`** 을 안 봄 → 빈 문자열로 3번 연속 오답

**대책 — 문제 읽는 순서**: **제목 → Constraints → 본문**
Constraints에서 반드시 볼 두 가지:
- **상한** → 목표 복잡도 역산 (`10⁵` 이면 `O(n log n)` 이하)
- **하한** → `0`이 허용되는가? 빈 입력·값 `0`이 실제 데이터인가?

---

## #엣지케이스누락

- 2026-08-03 [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) — "alphanumeric"에서 **숫자(48~57) 범위 누락**
- 2026-08-10 [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) — `("", "")` 를 3번 연속 놓침. 가드를 넣을 때 **반환값까지 틀림** (`t.length===0 → false`, 정답은 `true`)

**대책 — 제출 전 체크리스트**
```
□ 빈 입력 ("" / [])        □ 길이 1
□ 전부 동일한 값            □ 값이 최솟값/최댓값(0, 상한)
□ 정답이 "없음"인 경우      □ 두 입력 길이가 역전된 경우
```
> ⚠️ **가드를 넣기 전에 "이 조건일 때 정답이 뭐지"를 먼저 확정할 것.** 조건만 맞고 반환값이 틀리면 의미 없다.

---

## #공간복잡도오판

> "자료구조가 있으니 `O(n)`" 또는 "변수만 썼으니 `O(1)`" 처럼 겉모습으로 판단.

- 2026-08-03 [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) — **고정 크기** 룩업 테이블(항상 13개)을 `O(n)` 으로 오판
- 2026-08-03 [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) — 자료구조를 안 만들었는데 `O(n)` 으로 판단

**대책 — 두 가지만 묻는다**
1. **"배열/Map을 만들었나?"** 안 만들었으면 `O(1)`
2. 만들었다면 **"입력이 커지면 이것도 같이 커지나?"** — 안 커지면(알파벳 26칸, 룩업 13개) `O(1)`

*(반환값은 공간복잡도에서 제외하는 게 관례)*

---

## #우연히맞는코드

> 통과했지만 **왜 되는지 모른다.** 논리적으로 동등한 코드로 바꾸면 깨진다.

- 2026-08-02 [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) — `i >= 0` 가드 없이 통과. `nums1[-1]` → `undefined`, `undefined > 3` → `false` 라서 우연히 맞음. **비교 방향만 뒤집으면 폭발**
- 2026-08-03 [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) — `s[i] + s[i+1]` 이 `"Iundefined"` 가 되는 데 의존. `map[x] ? :` truthy 체크(값이 `0`이면 깨짐)

**대책**: `"통과했다"` ≠ `"왜 되는지 안다"`. 통과 후 **"이 줄이 왜 안전한지"** 를 한 문장으로 말할 수 있어야 한다. 못 하면 그 줄이 위험한 줄이다.

---

## #쓰기포인터오해

- 2026-08-02 [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) — `nums[k]`(아직 안 쓴 빈칸)와 비교. 의미 있는 값은 `nums[k-1]`
- 2026-08-02 [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) — `else`에서 `i--` (값은 `nums2`에서 가져왔는데 `nums1` 포인터를 움직임)
- 2026-08-12 [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) — **재발.** +7일 복습 접근 단계에서 `nums[k-1] !== nums[k] && nums[k] !== nums[i]` 로 또 `nums[k]` 를 비교에 넣음. 10일 전 같은 문제에서 적어둔 실수를 그대로 반복

**대책 두 가지**
1. **값을 가져온 쪽의 포인터만 움직인다.** 쓰기 포인터는 한 칸 채웠으니 항상 움직인다.
2. **비교하기 전에 물어라 — "이 칸은 이미 확정된 값인가, 아직 안 쓴 자리인가?"**
   `nums[k]` = 다음에 쓸 **빈칸** (원본 쓰레기값). 의미 있는 값은 **`nums[k-1]`**

> ⚠️ **3회 누적. 그중 2회가 같은 문제([0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md))** — 노트에 적어두는 것만으로는 안 잡혔다.
> 다음 복습에서는 **코드를 쓰기 전에 `k`와 `k-1`이 각각 무엇인지 말로 먼저 정의**하고 시작할 것.

→ [투 포인터](concepts/two-pointers.md)

---

## #인덱스오프바이원

- 2026-08-02 [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) — `k = 1` 로 시작해놓고 `i = 0` 부터 읽음
- 2026-08-03 [0028. Find the Index of the First Occurrence in a String](01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) — 시작 위치 개수 `n - m + 1` 의 `+1`
- 2026-08-11 [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) — 두 번째 루프를 `j = i` 부터 시작해 sequential prefix 구간(`nums[0..i-1]`)을 검사에서 누락. `[5]` → `5` 반환(정답 `6`). `j = i - 1` 로 한 칸을 살려야 했다

**대책**: **시작점을 바꿨으면 짝이 되는 쪽도 같이 확인.** 경계는 작은 예시(길이 1~3)로 손으로 세본다.

> ⚠️ **3회 누적.** 공통 원인은 **"이 루프가 커버해야 하는 범위가 정확히 어디까지인가"를 정하지 않고 시작하는 것.**
> 코딩 전에 한 줄로 적을 것 → `이 루프는 인덱스 __ 부터 __ 까지, 총 __ 번 돈다.`

---

## #루프상한혼동

> 이중 루프에서 **각 변수의 역할은 알고 있는데 상한만 서로 뒤바뀐** 경우. `#인덱스오프바이원`(±1 경계)과는 다르다.

- 2026-08-12 [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) — 접근 단계에서 *"바깥=열(글자 위치), 안쪽=행(문자열들)"* 을 정확히 써놓고, 구현에서 `i < strs.length` / `j < minLength` 로 뒤집음 → `strs[3]` → `undefined` → 💥 TypeError

**대책**: **이중 루프는 각 변수 옆에 한 단어로 역할을 적는다.**
```ts
for (let i = 0; i < minLength; i++) {        // i = 글자 위치 (열)
    for (let j = 0; j < strs.length; j++) {  // j = 문자열 번호 (행)
```
접근 단계에서 쓴 단어("열/행", "바깥/안쪽")를 **코드에 그대로 옮겨 적으면** 안 헷갈린다.

---

## #센티널값

- 2026-08-03 [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) — `0` 을 "아직 설정 안 됨" 표식으로 사용. 그런데 Constraints상 `0`은 **유효한 실제 가격** → `[0, 5]` 에서 오답

**대책**: 센티널은 **실제 데이터에 절대 나올 수 없는 값**이어야 한다.
```ts
let min = Infinity      // 최솟값 찾기
let max = -Infinity     // 최댓값 찾기
```
실무에서도 자주 터진다 (`id = 0`, `count = -1`).

---

## #함수참조vs호출

- 2026-08-03 [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) — `if (isAlnum && ...)` — 함수 객체는 **항상 truthy** 라 조건이 무의미

**실무 연결**: React에서 `{checkLoading && <Spinner/>}` — 함수 참조라 항상 렌더된다. `()` 확인.

---

## #숨은반복문

- 2026-08-03 [0169. Majority Element](01-Array-String/0169-majority-element/README.md) — `for` 안에서 `filter` 호출 → `O(n²)`. `for`문이 하나뿐이라 `O(n)`처럼 보였다

**대책**: 복잡도는 `for`문 개수가 아니라 **총 원소 방문 횟수**로 센다.

| 반복문 안에서 부르면 중첩 | `O(n)` |
|---|---|
| `filter` `map` `forEach` `reduce` | ✅ |
| `includes` `indexOf` `find` `some` `every` | ✅ |
| `Set.has` `Map.get` `Map.set` | ❌ `O(1)` — 안전 |

---

## #루프0회케이스

- 2026-08-10 [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) — 가드를 `while` 몸통 안에 넣음. `t = ""` 이면 루프가 **0번** 돌아 도달조차 못 하는 **죽은 코드**

**대책**: 루프가 0번 도는 입력을 처리하려면 가드는 **루프 진입 전**에.
더 좋은 건 **루프 조건 자체를 성공 조건으로 잡아** 가드가 필요 없게 만드는 것.

**실무 연결**: `items.forEach(...)` 안에 "빈 배열 처리"를 넣는 실수와 같은 구조.

---

## #입력훼손

- 2026-08-02 [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) — 요구되지 않은 `nums2` 를 `splice` 로 건드림

**대책**: 수정하라고 명시된 인자 외에는 **읽기 전용**으로 취급.

---

## #정렬조건미활용

- 2026-08-02 [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) — 두 배열이 이미 정렬돼 있는데 다시 `sort` → `O(n log n)` (최적은 `O(m+n)`)

**대책**: 문제에서 **"sorted"** 를 보면 반드시 멈춰서 이득을 챙길 수 있는지 확인.
정렬은 (a) 이진 탐색 `O(log n)`, (b) 투 포인터 양끝 수렴, (c) 같은 값이 붙어 있음 → 공간 `O(n)→O(1)` 을 가능하게 한다.

---

## ✅ #복잡도명시누락 — 해결됨

- 2026-08-02 [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) / [0027. Remove Element](01-Array-String/0027-remove-element/README.md) — 2회 연속 누락
- 2026-08-03 [0169. Majority Element](01-Array-String/0169-majority-element/README.md) — Boyer-Moore 제출 시 누락

[0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) 부터 습관화, [0058. Length of Last Word](01-Array-String/0058-length-of-last-word/README.md) 이후로는 매번 명시하고 있다. **이제는 정확도(어느 축인지)가 과제** → **#복잡도차원뭉개기**

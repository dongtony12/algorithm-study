# 14. Longest Common Prefix

- **난이도**: Easy
- **유형**: 문자열, 세로 스캔(vertical scanning)
- **링크**: https://leetcode.com/problems/longest-common-prefix/
- **최초 풀이**: 2026-08-03 / **결과**: 통과 (힌트 3단계까지 받음)

---

## 문제 요약

문자열 배열에서 **모든 문자열이 공통으로 가지는 가장 긴 접두사** 반환. 없으면 `""`.

- **Constraints**: `1 <= strs.length <= 200`, **`0 <= strs[i].length <= 200`** ← 빈 문자열 가능

---

## 접근 — 격자로 보기

```
strs = ["flower", "flow", "flight"]

                     인덱스 i →
              0     1     2     3     4     5
           ┌─────┬─────┬─────┬─────┬─────┬─────┐
  strs[0]  │  f  │  l  │  o  │  w  │  e  │  r  │   "flower"
           ├─────┼─────┼─────┼─────┼─────┼─────┤
  strs[1]  │  f  │  l  │  o  │  w  │  ×  │  ×  │   "flow"   ← 길이 4
           ├─────┼─────┼─────┼─────┼─────┼─────┤
  strs[2]  │  f  │  l  │  i  │  g  │  h  │  t  │   "flight"
           └─────┴─────┴─────┴─────┴─────┴─────┘
              ✅    ✅    ❌
                        ↑ i=2에서 어긋남 → 답 "fl"
```

**세로 스캔** = 열을 왼쪽→오른쪽으로 이동하며, 각 열 안에서 위→아래로 확인

```
바깥 for (i)  →  열 이동 (글자 위치)
  안쪽 for (j) →  행 이동 (문자열들)
```

### 두 가지 핵심

**① 상한은 `minLen`**
공통 접두사는 모든 문자열에 다 들어있어야 하므로 **가장 짧은 문자열 길이**를 넘을 수 없다.

**② `slice(0, i)` — 왜 `i-1`이 아닌가**
```js
"flower".slice(0, 2)   // "fl"  ← 인덱스 0, 1만. 2는 미포함
```
`slice`의 두 번째 인자는 **"여기 직전까지"**. `i`에서 어긋났으니 `slice(0, i)`가 정확히 그 앞까지다.

---

## 최종 정답

```ts
function longestCommonPrefix(strs: string[]): string {
    let minLen = Infinity;
    for (const s of strs) {
        minLen = Math.min(minLen, s.length)
    }

    for (let i = 0; i < minLen; i++) {
        const base = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (strs[j][i] !== base) {
                return strs[0].slice(0, i);      // 어긋난 지점 직전까지
            }
        }
    }
    return strs[0].slice(0, minLen);             // 끝까지 다 같았음
}
```

---

## ⚠️ 복잡도 — 변수가 두 개인 문제

**틀리게 답한 부분**: 시간 `O(n²)`, 공간 `O(n)` → 둘 다 아니다.

### 변수를 먼저 정의해야 한다

| 기호 | 뜻 |
|---|---|
| `m` | 문자열 **개수** (`strs.length`) |
| `k` | 가장 짧은 문자열 **길이** (`minLen`) |

> **차원이 둘인데 `n` 하나로 뭉치면 안 된다.**
> [0088. Merge Sorted Array](../0088-merge-sorted-array/README.md) 에서 `O(m+n)`이라 쓴 것과 같은 이유.
> 문자열 배열 문제는 거의 항상 **개수 × 길이** 두 축이 있다.

### 시간복잡도 `O(m × k)`

```
① minLen 구하기        →  O(m)
② 바깥 루프            →  최대 k번
③   안쪽 루프          →  각 (m-1)번
                       →  O(m × k)

총합 = O(m) + O(m × k) = O(m × k)
```

`O(n²)`이 되려면 `m ≈ k` 여야 한다. 일반적으로는 **별개의 값**이므로 분리해서 써야 정확하다.

- **최악**: 모든 문자열이 동일 → 끝까지 스캔 → `O(m × k)`
- **최선**: 0번 열에서 바로 어긋남 → `O(m)`

### 공간복잡도 `O(1)`

새로 만든 것:

| | 크기 |
|---|---|
| `minLen`, `base`, `i`, `j` | `O(1)` |
| 배열/Map 생성 | **없음** |

**반환값 `slice(0, i)`가 새 문자열을 만들지만, 출력은 공간복잡도에서 제외하는 게 관례다.**
(입력을 제외하는 것과 같은 이유 — 어떤 알고리즘을 써도 답은 만들어야 하므로 비교에 무의미)

→ **`O(1)`**. 출력까지 세면 `O(k)`.

### [0058. Length of Last Word](../0058-length-of-last-word/README.md) 와 비교

```js
// 58번 — split이 입력 크기만큼 배열 생성 → O(n)
const arr = s.split(' ')

// 14번 — 자료구조를 아예 안 만듦 → O(1)
let minLen = Infinity;
```

> **"자료구조를 만들었나?"** 가 기준이다. 변수 몇 개만 쓰면 `O(1)`.

---

## 알아야 할 상식

### 1. 대안 해법 — 정렬 트릭

```ts
function longestCommonPrefix(strs: string[]): string {
  strs.sort();                                  // 사전순 정렬
  const first = strs[0];
  const last = strs[strs.length - 1];

  let i = 0;
  while (i < first.length && first[i] === last[i]) i++;
  return first.slice(0, i);
}
```

**왜 되나**: 사전순 정렬하면 **첫 번째와 마지막이 가장 많이 다른 두 문자열**이 된다.
그 둘의 공통 접두사 = 전체의 공통 접두사. 중간 것들은 볼 필요가 없다.

- 시간 `O(m·k·log m)` (정렬 비용) — **세로 스캔보다 느리다**
- 하지만 **코드가 짧고 아이디어가 예쁘다.** 면접에서 언급하면 좋은 카드

### 2. 가로 스캔 (horizontal)

```ts
let prefix = strs[0];
for (let i = 1; i < strs.length; i++) {
  while (!strs[i].startsWith(prefix)) {
    prefix = prefix.slice(0, -1);      // 한 글자씩 줄임
    if (prefix === '') return '';
  }
}
return prefix;
```
누적 방식. `startsWith`가 내부적으로 `O(k)`라 **역시 `O(m × k)`**.
단 `prefix.slice(0, -1)` 이 매번 새 문자열을 만들어 할당이 잦다.

### 3. `slice`의 음수 인자

```js
"flower".slice(0, -1)   // "flowe"  ← 뒤에서 1개 제외
"flower".slice(-2)      // "er"     ← 뒤에서 2개
```

### 4. 변수명은 영어로

템플릿에서 `기준` 이라고 썼지만, JS는 유니코드 식별자를 허용할 뿐 **관례는 영어**다.
면접·실무 코드에서는 `base`, `target`, `ref` 등으로.

---

## 실수 노트

- **차원이 둘인데 `n` 하나로 뭉쳤다** → 문자열 배열 문제는 **개수(`m`) × 길이(`k`)** 를 분리할 것
- **자료구조를 안 만들었는데 공간을 `O(n)`으로 판단** → "배열/Map을 만들었나?"를 기준으로
- 반환값(출력)은 공간복잡도에서 제외하는 관례

---

## 복습 기록

**다음 복습**: 2026-08-17 (마지막 풀이일 + 5일)

### 2026-08-12 (1회차) — 통과, 접근 피드백 2회 + 구현 수정 1회

최종 통과. 고정 13건 + 랜덤 20만건(빈 문자열 포함) 불일치 0. 최대 입력(200×200) 2000회 98ms.

```ts
function longestCommonPrefix(strs: string[]): string {
    let minLength = Infinity
    let result = ''

    for (const str of strs) {
        if (str.length < minLength) {
            minLength = str.length
        }
    }

    for (let i = 0; i < minLength; i++) {          // i = 글자 위치 (열)
        let targetChar = strs[0][i]

        for (let j = 0; j < strs.length; j++) {    // j = 문자열 번호 (행)
            if (strs[j][i] !== targetChar) {
                return result
            }
        }

        result += targetChar
    }

    return result
}
```

**최초 풀이(08-03)와 달리 `slice` 없이 `result` 에 글자를 누적하는 변형.** 둘 다 `O(m × k)` / `O(1)`.

---

#### ⚠️ `#복잡도차원뭉개기` 재발 — 4회

이 문제가 그 태그의 **1회차**였는데, 복습에서 **또 `O(n²)`** 로 답했다.
게다가 *"이 문제에 크기를 결정하는 값이 두 개 있다. 기호 두 개를 정의하라"* 고 **명시적으로 요청한 뒤에도** 그랬다.

**왜 `n²`이 틀린가 — 숫자로**

| 입력 | 실제 작업량 | `O(n²)` 이 말하는 것 |
|---|---|---|
| 길이 1짜리 문자열 200개 | `200 × 1 = 200` | `40,000` (200배 과대) |
| 길이 200짜리 문자열 2개 | `2 × 200 = 400` | `40,000` (100배 과대) |
| 길이 200짜리 문자열 200개 | `200 × 200 = 40,000` | `40,000` ✅ |

**`m ≈ k` 일 때만 `n²`이 맞다.** 둘은 독립 변수다.

> 🔑 **복잡도를 쓰기 전에 항상: "크기를 결정하는 입력이 몇 개인가?"**
> 둘이면 기호를 둘 정의하고 시작한다. → [시간·공간 복잡도](../../concepts/complexity.md)

#### 🆕 새 실수 — 루프 상한 뒤바꿈 `#루프상한혼동`

접근 단계에서 구조를 정확히 써놓고도 구현에서 상한이 서로 뒤집혔다.

| 접근 단계에 직접 쓴 것 | 구현한 것 |
|---|---|
| 바깥 `i` → 열(글자 위치) → 최대 `k`번 | `i < strs.length` ❌ |
| 안쪽 `j` → 행(문자열들) → 각 `m`번 | `j < minLength` ❌ |

**증상**: `strs = ["flower","flow","flight"]` 에서 `minLength=4`, `strs.length=3` 이라 `j=3` 에서
```
strs[3] → undefined → undefined[i] → 💥 TypeError
```

> 🔑 **이중 루프는 각 변수 옆에 한 단어로 역할을 적는다.**
> ```ts
> for (let i = 0; i < minLength; i++) {        // i = 글자 위치 (열)
>     for (let j = 0; j < strs.length; j++) {  // j = 문자열 번호 (행)
> ```
> 접근 단계에서 "열/행"을 정확히 구분했으니, **그 단어를 코드에 그대로 옮겨 적으면** 안 헷갈린다.

#### 📌 `noUncheckedIndexedAccess` 가 이 버그를 잡아줬다

LeetCode에서 `if(strs[j][i] !== targetChar)` 줄에 컴파일 에러가 났다.

| 설정 | 결과 |
|---|---|
| TS7 기본 (`strict`) | ✅ 에러 없음 |
| `strictNullChecks` off | ✅ 에러 없음 |
| **`noUncheckedIndexedAccess`** | ❌ `TS2532: Object is possibly 'undefined'` (2곳) |

이 옵션은 **배열 인덱스 접근이 범위를 벗어날 수 있다**고 보고 `T | undefined` 를 붙인다.

> **타입 에러가 "귀찮은 소리"가 아니라 실제 버그를 잡아준 경우.**
> [0088. Merge Sorted Array](../0088-merge-sorted-array/README.md) 노트에 *"TS가 거짓말한다 — `noUncheckedIndexedAccess` 켜면 `number | undefined` 로 잡힌다"* 고 적어뒀는데, 이번엔 켜져 있어서 실제로 잡혔다.

#### 이전 실수 노트와 대조

| 08-03 실수 | 08-12 |
|---|---|
| 차원이 둘인데 `n` 하나로 뭉갬 `#복잡도차원뭉개기` | **재발 ❌** (지적 후 수정) |
| 자료구조를 안 만들었는데 공간을 `O(n)`으로 판단 `#공간복잡도오판` | **`O(1)` 정확** ✅ |
| 한글 변수명 `기준` `#변수명불명확` | `minLength`, `targetChar`, `result` ✅ |

#### ✅ 잘한 것

- **세로 스캔 상한이 "가장 짧은 문자열 길이"** 임을 스스로 도출
- **`["", "abc"]` 가 자동 처리되는 이유**까지 확인 (minLength=0 → 루프 미실행 → `""`)
- 2차원 배열 변환이 불필요하다는 지적을 받아들여 `strs[j][i]` 로 직접 접근 (공간 `O(1)` 유지)

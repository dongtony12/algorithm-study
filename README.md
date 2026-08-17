# 알고리즘 학습 기록

LeetCode 문제를 풀며 남긴 학습 기록입니다. **정답 코드만이 아니라 "어떻게 접근했고, 어디서 틀렸고, 힌트를 받았다면 그걸 어떻게 적용했는지"** 를 함께 남깁니다.

## 이 레포를 읽는 법

문제 폴더마다 `README.md` 와 `solution.ts` 가 있습니다.

| 섹션 | 내용 |
|---|---|
| **문제 요약** | 문제와 Constraints. 함정이 되는 조건은 굵게 |
| **접근** | 어떻게 생각해서 그 풀이에 도달했는지. ASCII 그림 또는 단계별 트레이스 |
| **최종 정답** | 실제로 통과시킨 코드 (`solution.ts` 와 동일) |
| **⚠️ 복잡도** | 변수를 먼저 정의하고 라인별로 셈. **틀리게 답했다면 그것도 남김** |
| **알아야 할 상식** | 대안 해법, 언어 함정, 실무 연결 |
| **실수 노트** | 무엇을 왜 틀렸는지 + 태그 |
| **복습 기록** | 백지 재작성 결과, 이전 실수의 재발 여부 대조 |

풀이 과정에서 **막혔던 지점과 힌트를 어떻게 적용했는지**는 각 노트의 「접근」과 「복습 기록」에 그대로 남아 있습니다.
반복해서 틀리는 패턴은 태그로 묶어 [mistakes.md](mistakes.md) 에 누적합니다.

## 폴더

- [배열 · 문자열](01-Array-String/README.md) — 9문제
- [해시맵](02-Hashmap/README.md) — 4문제
- [투 포인터](03-Two-Pointers/README.md) — 4문제

**개념 노트**

- [그리디 알고리즘](concepts/greedy.md)
- [시간·공간 복잡도](concepts/complexity.md)
- [투 포인터](concepts/two-pointers.md)
- [해시맵](concepts/hashmap.md)

- [반복 실수 패턴](mistakes.md)

---


- **전략**: **주제별 완주** — 한 주제를 Easy로 끝까지 판 뒤 다음 주제로 (2026-08-11 전환)
- **주 커리큘럼**: [LeetCode Top Interview 150](https://leetcode.com/studyplan/top-interview-150/) — 각 주제의 Easy를 우선 소화 (★ 표시)
- **보충**: Top150만으론 주제당 1~2문제뿐이라, LeetCode 태그별 Easy로 4~6문제 보충
- **주제 순서**: 챕터 순서가 아닌 **의존성 순서** (재귀 → 트리 → 그래프 → 백트래킹)
- **언어**: TypeScript (LeetCode 제출) / JavaScript
- **시작일**: 2026-08-02 · **전략 전환**: 2026-08-11


---

## 규칙

### 주제 졸업 기준
> **그 주제 대표 문제 2개를 연속으로 백지에서 — 힌트 없이 + 복잡도까지 정확히 — 통과하면 졸업.**

문제 수가 아니라 **재현 능력**이 기준. 목록을 다 안 풀었어도 2연속 통과하면 졸업, 다 풀었어도 못 하면 보충.

### 문제 선택
목록 순서대로. 단 **매 문제가 끝나면 "따로 풀고 싶은 문제 있는지" 먼저 묻는다.** 목록 밖 문제(데일리 등)는 해당 주제에 **보충으로 추가**한다.

### Medium 투입
**전체 주제 Easy를 끝낸 뒤** Medium 라운드.
⚠️ **예외 — 그래프 · 백트래킹 · 힙**: Easy가 거의 없어(백트래킹은 사실상 전무) 입문 Medium 2~3개를 Easy 라운드에 포함.

### 복습 — **마지막 풀이일 + 5일** (2026-08-12 변경)
- **가장 최근에 푼 날(최초 풀이든 복습이든) 기준 5일 뒤**에 다시 푼다. 복습할 때마다 다음 날짜가 5일 뒤로 밀리는 **롤링 방식**
- 재풀이 시 **이전 코드를 보지 않고** 백지에서 다시 작성
- 복습에서도 **접근을 한 줄 먼저** 말한 뒤 코드로 간다 (손이 기억하는 건지 개념을 기억하는 건지 구분됨)
- 30분 넘게 막히면 답을 보되, 본 다음 반드시 **닫고 백지에서 재작성**
- 막히면 그날 기준으로 다시 +5일

> 이전 방식(+1일 / +7일 / +30일 3단계)은 폐기. 단계가 많아 연체가 쌓이고 어느 단계인지 관리가 번거로웠다.

---

## 개념 노트

- [시간·공간 복잡도](concepts/complexity.md) — Big-O, auxiliary space, 입력 크기별 목표 복잡도 역산
- [그리디 알고리즘](concepts/greedy.md) — 성립 조건, 지배/교환 논증, 동전 반례, 실전 판별법
- [투 포인터](concepts/two-pointers.md) — 4가지 유형(읽기-쓰기/양끝/역방향/매칭), 건너뛰기, 전처리 제거
- [해시맵](concepts/hashmap.md) — 공간↔시간 거래, Set/Map/객체 선택 기준, 조회 비용표

**반복 실수**: [00-실수패턴](mistakes.md) — 태그별 누적. 3회 이상이면 세션 시작 시 경고

---

## 진행 현황

| # | 주제 | 폴더 | 진행 | 상태 |
|---|---|---|---|---|
| 1 | 배열 · 문자열 | `01-Array-String` | 9 / 9 | ✅ **졸업** |
| 2 | **해시맵** | `02-Hashmap` | **4 / 11** | 🔵 **진행 중** |
| 3 | 투 포인터 | `03-Two-Pointers` | 4 / 7 | 🟡 보충 필요 |
| 4 | 슬라이딩 윈도우 | `04-Sliding-Window` | 0 / 4 | |
| 5 | 스택 · 큐 | `05-Stack-Queue` | 0 / 6 | |
| 6 | 이진 탐색 | `06-Binary-Search` | 0 / 6 | |
| 7 | 정렬 · 인터벌 | `07-Sorting-Intervals` | 0 / 4 | |
| 8 | 링크드 리스트 | `08-Linked-List` | 0 / 8 | |
| 9 | 재귀 기초 | `09-Recursion` | 0 / 5 | |
| 10 | 트리 (DFS·BFS·BST) | `10-Tree` | 0 / 15 | |
| 11 | 그래프 | `11-Graph` | 0 / 5 | ⚠️ Medium 포함 |
| 12 | 백트래킹 | `12-Backtracking` | 0 / 4 | ⚠️ Medium 포함 |
| 13 | 힙 · 우선순위 큐 | `13-Heap` | 0 / 3 | ⚠️ Medium 포함 |
| 14 | DP (1D) | `14-DP` | 0 / 5 | |
| 부록 | 비트 · 수학 | `15-Bit-Math` | 0 / 6 | 짬짬이 |

**총 17 / 96**

---

## 1. 배열 · 문자열 — ✅ 졸업

- [x] ★ [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) — 08-02 통과
- [x] ★ [0027. Remove Element](01-Array-String/0027-remove-element/README.md) — 08-02 통과
- [x] ★ [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) — 08-02 통과 (1차 오답 후 수정)
- [x] ★ [0169. Majority Element](01-Array-String/0169-majority-element/README.md) — 08-03 통과 (Boyer-Moore까지)
- [x] ★ [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) — 08-03 통과 (브루트포스 TLE → 그리디)
- [x] ★ [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) — 08-03 통과
- [x] ★ [0058. Length of Last Word](01-Array-String/0058-length-of-last-word/README.md) — 08-03 통과
- [x] ★ [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) — 08-03 통과 (힌트 3단계)
- [x] ★ [0028. Find the Index of the First Occurrence in a String](01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) — 08-03 통과

> **졸업 판정**: 08-10 복습에서 [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) · [0027. Remove Element](01-Array-String/0027-remove-element/README.md) 를 백지 재작성 **2연속 통과** (힌트 0, 복잡도 정확, 과거 실수 6개 전부 미재발)

---

## 2. 해시맵 — 🔵 진행 중

> **코테 최다 빈출.** "값 → 개수 / 위치 / 짝" 매핑을 `O(1)`로 하는 게 전부다. → [해시맵](concepts/hashmap.md)

- [x] [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) — 08-11 통과 (Daily·보충, 1차 검사범위 오답 → 수정)
- [x] ★ [0383. Ransom Note](02-Hashmap/0383-ransom-note/README.md) — 08-12 통과 (**접근 설계 3회 피드백 → 구현 1발**, 배열 26칸 최적화까지)
- [x] ★ [0242. Valid Anagram](02-Hashmap/0242-valid-anagram/README.md) — 08-17 통과 (접근 피드백 2회 → 구현 1발, 배열 26칸 최적화까지)
- [x] ★ [0001. Two Sum](02-Hashmap/0001-two-sum/README.md) — 08-18 통과 (접근 피드백 3회 — 필터 오류·복잡도·맵 방향/시점)
- [ ] ★ 205. Isomorphic Strings
- [ ] ★ 290. Word Pattern
- [ ] ★ 202. Happy Number
- [ ] ★ 219. Contains Duplicate II
- [ ] 217. Contains Duplicate — 보충
- [ ] 349. Intersection of Two Arrays — 보충
- [ ] 387. First Unique Character in a String — 보충

---

## 3. 투 포인터 — 🟡 보충 필요

- [x] ★ [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) — 08-03 통과
- [x] ★ [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) — 08-10 통과 (빈 문자열 3차 수정)
- [x] **[0167. Two Sum II - Input Array Is Sorted](03-Two-Pointers/0167-two-sum-ii-input-array-is-sorted/README.md)** — 08-12 통과 (**Medium**, 사용자 지정 조기 투입. 지배 논증 피드백 2회)
- [x] **[0011. Container With Most Water](03-Two-Pointers/0011-container-with-most-water/README.md)** — 08-16 통과 (**Medium**, 사용자 지정. 구현 1발이나 접근 단계 생략 → 논증 사후 보강)
- [ ] 344. Reverse String — 보충
- [ ] 283. Move Zeroes — 보충
- [ ] 977. Squares of a Sorted Array — 보충

---

## 4. 슬라이딩 윈도우

> Top150에 Easy가 **0개**. 전부 보충.

- [ ] 643. Maximum Average Subarray I
- [ ] 1984. Minimum Difference Between Highest and Lowest of K Scores
- [ ] 2379. Minimum Recolors to Get K Consecutive Black Blocks
- [ ] 1876. Substrings of Size Three with Distinct Characters

---

## 5. 스택 · 큐

- [ ] ★ 20. Valid Parentheses
- [ ] 232. Implement Queue using Stacks
- [ ] 225. Implement Stack using Queues
- [ ] 1047. Remove All Adjacent Duplicates In String
- [ ] 844. Backspace String Compare
- [ ] 682. Baseball Game

---

## 6. 이진 탐색

> "정렬되어 있다"는 정보로 절반을 버리는 법. [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) Follow-up에서 맛봄

- [ ] 704. Binary Search
- [ ] ★ 35. Search Insert Position
- [ ] 278. First Bad Version
- [ ] ★ 69. Sqrt(x)
- [ ] 367. Valid Perfect Square
- [ ] 744. Find Smallest Letter Greater Than Target

---

## 7. 정렬 · 인터벌

- [ ] ★ 228. Summary Ranges
- [ ] 905. Sort Array By Parity
- [ ] 561. Array Partition
- [ ] 1051. Height Checker

---

## 8. 링크드 리스트

> 포인터 조작. **dummy head** 관용구를 여기서 확실히 익힌다.

- [ ] 206. Reverse Linked List
- [ ] ★ 21. Merge Two Sorted Lists
- [ ] ★ 141. Linked List Cycle
- [ ] 203. Remove Linked List Elements
- [ ] 83. Remove Duplicates from Sorted List
- [ ] 876. Middle of the Linked List
- [ ] 160. Intersection of Two Linked Lists
- [ ] 234. Palindrome Linked List

---

## 9. 재귀 기초

> **트리 전에 반드시 거친다.** 재귀가 안 잡힌 상태로 트리를 만나면 무조건 막힌다.

- [ ] 509. Fibonacci Number
- [ ] 231. Power of Two
- [ ] 326. Power of Three
- [ ] 342. Power of Four
- [ ] 206. Reverse Linked List — **재귀 버전으로 다시** (8번에서 반복문으로 푼 뒤)

---

## 10. 트리 (DFS · BFS · BST)

> 가장 큰 주제. DFS 재귀 → 순회 → BFS 레벨 → BST 성질 순서

**DFS 기초**
- [ ] ★ 104. Maximum Depth of Binary Tree
- [ ] ★ 100. Same Tree
- [ ] ★ 226. Invert Binary Tree
- [ ] ★ 101. Symmetric Tree
- [ ] ★ 112. Path Sum
- [ ] 111. Minimum Depth of Binary Tree
- [ ] 543. Diameter of Binary Tree
- [ ] 110. Balanced Binary Tree

**순회**
- [ ] 94. Binary Tree Inorder Traversal
- [ ] 144. Preorder Traversal
- [ ] 145. Postorder Traversal

**BFS**
- [ ] ★ 637. Average of Levels in Binary Tree

**BST**
- [ ] ★ 530. Minimum Absolute Difference in BST
- [ ] 700. Search in a Binary Search Tree
- [ ] 235. Lowest Common Ancestor of a BST
- [ ] ★ 108. Convert Sorted Array to Binary Search Tree

---

## 11. 그래프 — ⚠️ Medium 포함

> Top150 Easy **0개**. 인접행렬/인접리스트 · BFS · DFS를 여기서 처음 익힌다.

- [ ] 733. Flood Fill
- [ ] 463. Island Perimeter
- [ ] 997. Find the Town Judge
- [ ] 1971. Find if Path Exists in Graph
- [ ] **200. Number of Islands** — *Medium, 그래프 입문 필수*

---

## 12. 백트래킹 — ⚠️ Medium 포함

> Easy가 **사실상 없다.** 재귀 + 선택/취소 구조를 Medium으로 배운다.

- [ ] 784. Letter Case Permutation
- [ ] **78. Subsets** — *Medium, 백트래킹 기본형*
- [ ] **46. Permutations** — *Medium*
- [ ] **77. Combinations** — *Medium*

---

## 13. 힙 · 우선순위 큐 — ⚠️ Medium 포함

- [ ] 1046. Last Stone Weight
- [ ] 703. Kth Largest Element in a Stream
- [ ] **215. Kth Largest Element in an Array** — *Medium*

---

## 14. DP (1D)

> Top150 Easy **1개**뿐. "이전 상태 재사용" 감각을 여기서 만든다.

- [ ] ★ 70. Climbing Stairs
- [ ] 746. Min Cost Climbing Stairs
- [ ] 118. Pascal's Triangle
- [ ] 119. Pascal's Triangle II
- [ ] [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) 재해석 — 이미 푼 문제를 DP 관점으로 다시 보기

---

## 부록. 비트 · 수학

> 독립 주제. 다른 주제 사이사이 짬짬이

- [ ] ★ 136. Single Number
- [ ] ★ 191. Number of 1 Bits
- [ ] ★ 190. Reverse Bits
- [ ] ★ 67. Add Binary
- [ ] ★ 9. Palindrome Number
- [ ] ★ 66. Plus One

---

## 복습 대기열

**마지막 풀이일 + 5일.** 복습하면 그 날짜 기준으로 다시 5일 뒤로 갱신한다.

| 문제 | 마지막 풀이일 | 다음 복습일 | 복습 횟수 |
|---|---|---|---|
| [0169. Majority Element](01-Array-String/0169-majority-element/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0121. Best Time to Buy and Sell Stock](01-Array-String/0121-best-time-to-buy-and-sell-stock/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0013. Roman to Integer](01-Array-String/0013-roman-to-integer/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0058. Length of Last Word](01-Array-String/0058-length-of-last-word/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0014. Longest Common Prefix](01-Array-String/0014-longest-common-prefix/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0028. Find the Index of the First Occurrence in a String](01-Array-String/0028-find-the-index-of-the-first-occurrence-in-a-string/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0125. Valid Palindrome](03-Two-Pointers/0125-valid-palindrome/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0167. Two Sum II - Input Array Is Sorted](03-Two-Pointers/0167-two-sum-ii-input-array-is-sorted/README.md) | 08-12 | 08-17 | 0 |
| [0088. Merge Sorted Array](01-Array-String/0088-merge-sorted-array/README.md) | 08-10 (복습) | 08-15 | 1 |
| [0027. Remove Element](01-Array-String/0027-remove-element/README.md) | 08-10 (복습) | 08-15 | 1 |
| [0392. Is Subsequence](03-Two-Pointers/0392-is-subsequence/README.md) | 08-10 | 08-15 | 0 |
| [2996. Smallest Missing Integer Greater Than Sequential Prefix Sum](02-Hashmap/2996-smallest-missing-integer-greater-than-sequential-prefix-sum/README.md) | 08-11 | 08-16 | 0 |
| [0026. Remove Duplicates from Sorted Array](01-Array-String/0026-remove-duplicates-from-sorted-array/README.md) | 08-12 (복습) | 08-17 | 1 |
| [0383. Ransom Note](02-Hashmap/0383-ransom-note/README.md) | 08-12 | 08-17 | 0 |
| [0011. Container With Most Water](03-Two-Pointers/0011-container-with-most-water/README.md) | 08-16 | 08-21 | 0 |
| [0242. Valid Anagram](02-Hashmap/0242-valid-anagram/README.md) | 08-17 | 08-22 | 0 |
| [0001. Two Sum](02-Hashmap/0001-two-sum/README.md) | 08-18 | 08-23 | 0 |

---

## 이전 계획 (2026-08-11 폐기)

Round 1 = Top150 Easy 39 전체 → Round 2 Medium → Round 3 Hard.
**폐기 이유**: 주제당 Easy가 1~2개뿐이라 주제를 스쳐 지나갈 뿐 익히지 못함. Array/String + Hashmap이 39문제 중 16개(41%)인 반면 **DP 1문제, 그래프·백트래킹·힙 0문제.**
Top150 문제는 위 주제별 목록에 ★로 전부 흡수되어 있으므로 **한 문제도 버리지 않는다.**


---

> 이 레포는 옵시디언 노트에서 `scripts/sync-from-obsidian.mjs` 로 생성됩니다.
> 원본은 옵시디언이므로 여기서 직접 편집하면 다음 동기화 때 덮어써집니다.

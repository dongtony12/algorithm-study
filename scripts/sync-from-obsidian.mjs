#!/usr/bin/env node
/**
 * 옵시디언 알고리즘 노트 → GitHub 레포 변환
 *
 * 옵시디언이 원본(single source of truth)이고, 이 스크립트가 공개용으로 정리해 옮긴다.
 *   - 문제 노트  → <주제>/<NNNN-slug>/README.md + solution.ts
 *   - 개념 노트  → concepts/<slug>.md
 *   - 실수 패턴  → mistakes.md
 *   - 학습로그   → README.md (진도표 + 목차)
 *   - [[위키링크]] → 상대경로 마크다운 링크
 *
 * 사용: node scripts/sync-from-obsidian.mjs [--dry]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs'
import { join, basename } from 'node:path'
import { homedir } from 'node:os'

const VAULT = join(
  homedir(),
  'Library/CloudStorage/GoogleDrive-dongtony1@gmail.com/내 드라이브/Obsidian/Kim Dong Hyeun/알고리즘'
)
const REPO = join(homedir(), 'private/algorithm-study')
const DRY = process.argv.includes('--dry')

// 개념 노트 파일명 → 영문 slug (한글 파일명은 URL 인코딩되어 지저분해지므로)
const CONCEPT_SLUG = new Map(
  Object.entries({
    '시간·공간 복잡도': 'complexity',
    '그리디 알고리즘': 'greedy',
    '투 포인터': 'two-pointers',
    '해시맵': 'hashmap',
  }).map(([k, v]) => [k.normalize('NFC'), v])
)

const log = (...a) => console.log(...a)

// ─────────────────────────────────────────────────────────── 유틸

/** "0088. Merge Sorted Array" → "0088-merge-sorted-array" */
function problemSlug(title) {
  const m = title.match(/^(\d+)\.\s*(.+)$/)
  if (!m) return slugify(title)
  const [, num, name] = m
  return `${num.padStart(4, '0')}-${slugify(name)}`
}

function slugify(s) {
  return nfc(s)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/**
 * macOS 파일시스템은 한글을 NFD(자모 분리)로 저장한다.
 * 노트 본문의 [[위키링크]]는 NFC(조합형)이므로 양쪽을 NFC로 통일해야 매칭된다.
 */
const nfc = (s) => s.normalize('NFC')

/** 주제 폴더인가 (01-Array-String 형태). 00- 접두사는 메타(00-개념 등)라 제외 */
const isTopicDir = (d) => /^\d{2}-/.test(d) && !d.startsWith('00-')

// ─────────────────────────────────────────────────────────── 수집

/** 위키링크 대상 이름 → 레포 내 경로 */
const linkMap = new Map()

const topics = readdirSync(VAULT, { withFileTypes: true })
  .filter((e) => e.isDirectory() && isTopicDir(e.name))
  .map((e) => e.name)
  .sort()

const problems = [] // { topic, title, slug, srcPath }

for (const topic of topics) {
  const files = readdirSync(join(VAULT, topic)).filter((f) => f.endsWith('.md'))
  for (const f of files) {
    const title = basename(f, '.md')
    const slug = problemSlug(title)
    problems.push({ topic, title, slug, srcPath: join(VAULT, topic, f) })
    linkMap.set(title, `${topic}/${slug}/README.md`)
  }
}

const concepts = [] // { title, slug, srcPath }
const conceptDir = join(VAULT, '00-개념')
if (existsSync(conceptDir)) {
  for (const f of readdirSync(conceptDir).filter((x) => x.endsWith('.md'))) {
    const title = nfc(basename(f, '.md'))
    const slug = CONCEPT_SLUG.get(title) ?? slugify(title)
    concepts.push({ title, slug, srcPath: join(conceptDir, f) })
    linkMap.set(title, `concepts/${slug}.md`)
  }
}

linkMap.set('00-실수패턴', 'mistakes.md')
linkMap.set('00-학습로그', 'README.md')

// ─────────────────────────────────────────────────────────── 변환

/** 레포 내 fromPath 기준으로 toPath 를 가리키는 상대경로 */
function relative(fromPath, toPath) {
  const from = fromPath.split('/').slice(0, -1)
  const to = toPath.split('/')
  let i = 0
  while (i < from.length && i < to.length - 1 && from[i] === to[i]) i++
  const up = Array(from.length - i).fill('..')
  return [...up, ...to.slice(i)].join('/') || '.'
}

/** [[제목]] → [제목](상대경로) · 대상이 없으면 굵은 글씨로 */
function convertWikilinks(md, selfPath) {
  return md.replace(/\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
    const label = alias ?? target
    const dest = linkMap.get(nfc(target.trim()))
    if (!dest) return `**${label}**`
    if (dest === selfPath) return `**${label}**`
    return `[${label}](${relative(selfPath, dest)})`
  })
}

/**
 * 최종 제출 코드 추출 — **가장 최근에 통과시킨 코드**를 고른다.
 * 우선순위: 복습 기록(`### YYYY-MM-DD (N회차)`) > "최종 정답" > "정답" > "풀이" > 그 외
 * 복습에서 더 나은 풀이로 바꾼 경우(예: 0058은 O(n)→O(1))가 있으므로 복습본이 최우선.
 * 같은 우선순위면 마지막 것.
 */
function extractSolution(md) {
  const lines = md.split('\n')
  const blocks = [] // { priority, order, code }
  let heading = ''
  let inFence = false
  let fenceLang = ''
  let buf = []
  let order = 0

  const priorityOf = (h) => {
    if (/\d{4}-\d{2}-\d{2}.*회차/.test(h)) return 4 // 복습 기록 = 가장 최근 코드
    if (/최종\s*정답/.test(h)) return 3
    if (/정답/.test(h)) return 2
    if (/풀이/.test(h)) return 1
    return 0
  }

  for (const line of lines) {
    const fence = line.match(/^```(\w*)/)
    if (fence) {
      if (!inFence) {
        inFence = true
        fenceLang = fence[1]
        buf = []
      } else {
        if (fenceLang === 'ts' || fenceLang === 'typescript' || fenceLang === 'js') {
          blocks.push({ priority: priorityOf(heading), order: order++, code: buf.join('\n') })
        }
        inFence = false
      }
      continue
    }
    if (inFence) { buf.push(line); continue }
    if (/^#{1,4}\s/.test(line)) heading = line
  }

  if (!blocks.length) return null
  // 함수 선언이 있는 블록만 (설명용 조각 제외)
  const real = blocks.filter((b) => /function\s+\w+|class\s+\w+/.test(b.code))
  const pool = real.length ? real : blocks
  const maxP = Math.max(...pool.map((b) => b.priority))
  const best = pool.filter((b) => b.priority === maxP).pop()
  return best.code.trim()
}

/** 노트 앞머리에서 링크/난이도 뽑기 */
function meta(md) {
  const link = md.match(/\*\*링크\*\*:\s*(\S+)/)?.[1] ?? ''
  const level = md.match(/\*\*난이도\*\*:\s*(\w+)/)?.[1] ?? ''
  const first = md.match(/\*\*최초 풀이\*\*:\s*([\d-]+)/)?.[1] ?? ''
  const result = md.match(/\*\*결과\*\*:\s*(.+)/)?.[1]?.trim() ?? ''
  return { link, level, first, result }
}

// ─────────────────────────────────────────────────────────── 쓰기

const written = []
function put(relPath, content) {
  written.push(relPath)
  if (DRY) return
  const full = join(REPO, relPath)
  mkdirSync(join(full, '..'), { recursive: true })
  writeFileSync(full, content.endsWith('\n') ? content : content + '\n')
}

// 기존 생성물 정리 (스크립트가 만든 것만)
if (!DRY) {
  for (const t of topics) rmSync(join(REPO, t), { recursive: true, force: true })
  rmSync(join(REPO, 'concepts'), { recursive: true, force: true })
}

// ── 문제 노트
const byTopic = new Map()
for (const p of problems) {
  const md = readFileSync(p.srcPath, 'utf8')
  const selfPath = `${p.topic}/${p.slug}/README.md`
  const m = meta(md)

  put(selfPath, convertWikilinks(md, selfPath))

  const code = extractSolution(md)
  if (code) put(`${p.topic}/${p.slug}/solution.ts`, code)

  if (!byTopic.has(p.topic)) byTopic.set(p.topic, [])
  byTopic.get(p.topic).push({ ...p, ...m, hasCode: !!code })
}

// ── 주제별 목차
const TOPIC_KO = {
  '01-Array-String': '배열 · 문자열',
  '02-Hashmap': '해시맵',
  '03-Two-Pointers': '투 포인터',
  '04-Sliding-Window': '슬라이딩 윈도우',
  '05-Stack-Queue': '스택 · 큐',
  '06-Binary-Search': '이진 탐색',
  '07-Sorting-Intervals': '정렬 · 인터벌',
  '08-Linked-List': '링크드 리스트',
  '09-Recursion': '재귀 기초',
  '10-Tree': '트리 (DFS · BFS · BST)',
  '11-Graph': '그래프',
  '12-Backtracking': '백트래킹',
  '13-Heap': '힙 · 우선순위 큐',
  '14-DP': 'DP (1D)',
  '15-Bit-Math': '비트 · 수학',
}

for (const [topic, list] of byTopic) {
  list.sort((a, b) => a.slug.localeCompare(b.slug))
  const rows = list
    .map((p) => `| [${p.title}](${p.slug}/README.md) | ${p.level || '-'} | ${p.first || '-'} | ${p.result || '-'} |`)
    .join('\n')
  put(
    `${topic}/README.md`,
    `# ${topic.replace(/^\d+-/, '')} — ${TOPIC_KO[topic] ?? ''}\n\n` +
      `[← 전체 목차](../README.md)\n\n` +
      `| 문제 | 난이도 | 최초 풀이 | 결과 |\n|---|---|---|---|\n${rows}\n`
  )
}

// ── 개념 노트
for (const c of concepts) {
  const selfPath = `concepts/${c.slug}.md`
  put(selfPath, convertWikilinks(readFileSync(c.srcPath, 'utf8'), selfPath))
}

// ── 실수 패턴
const mistakesSrc = join(VAULT, '00-실수패턴.md')
if (existsSync(mistakesSrc)) {
  put('mistakes.md', convertWikilinks(readFileSync(mistakesSrc, 'utf8'), 'mistakes.md'))
}

// ── 루트 README (학습로그 기반)
const logSrc = join(VAULT, '00-학습로그.md')
let rootBody = ''
if (existsSync(logSrc)) {
  rootBody = convertWikilinks(readFileSync(logSrc, 'utf8'), 'README.md')
    // 제목 교체 + 노트 관리용 내부 메모 제거
    .replace(/^# 알고리즘 학습로그[^\n]*\n/, '')
    .replace(/^> ⚠️ \*\*카운트는[^\n]*\n/m, '')
}

const INTRO = `# 알고리즘 학습 기록

LeetCode 문제를 풀며 남긴 학습 기록입니다. **정답 코드만이 아니라 "어떻게 접근했고, 어디서 틀렸고, 힌트를 받았다면 그걸 어떻게 적용했는지"** 를 함께 남깁니다.

## 이 레포를 읽는 법

문제 폴더마다 \`README.md\` 와 \`solution.ts\` 가 있습니다.

| 섹션 | 내용 |
|---|---|
| **문제 요약** | 문제와 Constraints. 함정이 되는 조건은 굵게 |
| **접근** | 어떻게 생각해서 그 풀이에 도달했는지. ASCII 그림 또는 단계별 트레이스 |
| **최종 정답** | 실제로 통과시킨 코드 (\`solution.ts\` 와 동일) |
| **⚠️ 복잡도** | 변수를 먼저 정의하고 라인별로 셈. **틀리게 답했다면 그것도 남김** |
| **알아야 할 상식** | 대안 해법, 언어 함정, 실무 연결 |
| **실수 노트** | 무엇을 왜 틀렸는지 + 태그 |
| **복습 기록** | 백지 재작성 결과, 이전 실수의 재발 여부 대조 |

풀이 과정에서 **막혔던 지점과 힌트를 어떻게 적용했는지**는 각 노트의 「접근」과 「복습 기록」에 그대로 남아 있습니다.
반복해서 틀리는 패턴은 태그로 묶어 [mistakes.md](mistakes.md) 에 누적합니다.

`

const conceptList = concepts.map((c) => `- [${c.title}](concepts/${c.slug}.md)`).join('\n')
const topicList = [...byTopic.keys()]
  .sort()
  .map((t) => `- [${TOPIC_KO[t] ?? t}](${t}/README.md) — ${byTopic.get(t).length}문제`)
  .join('\n')

put(
  'README.md',
  `${INTRO}## 폴더\n\n${topicList}\n\n**개념 노트**\n\n${conceptList}\n\n- [반복 실수 패턴](mistakes.md)\n\n---\n\n` +
    `${rootBody}\n\n---\n\n` +
    `> 이 레포는 옵시디언 노트에서 \`scripts/sync-from-obsidian.mjs\` 로 생성됩니다.\n` +
    `> 원본은 옵시디언이므로 여기서 직접 편집하면 다음 동기화 때 덮어써집니다.\n`
)

// ─────────────────────────────────────────────────────────── 보고
log(`${DRY ? '[dry-run] ' : ''}파일 ${written.length}개`)
log(`  문제 ${problems.length}개 · 개념 ${concepts.length}개 · 주제 ${byTopic.size}개`)
const noCode = problems.filter((p) => !written.includes(`${p.topic}/${p.slug}/solution.ts`))
if (noCode.length) log(`  ⚠️ 코드 추출 실패: ${noCode.map((p) => p.title).join(', ')}`)

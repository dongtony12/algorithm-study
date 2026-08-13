#!/usr/bin/env node
/**
 * 생성물 검증 — 동기화 후 항상 돌린다.
 *   1. [[위키링크]] 잔존 여부
 *   2. 상대경로 링크가 실제 파일을 가리키는지
 *   3. solution.ts 에 함수 선언이 있는지
 *
 * 사용: node scripts/check.mjs
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue
    const p = join(dir, e.name)
    e.isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}

const files = walk(ROOT)
const mds = files.filter((f) => f.endsWith('.md'))
const rel = (f) => f.replace(ROOT + '/', '')

let leftover = 0
let broken = 0

for (const f of mds) {
  const md = readFileSync(f, 'utf8')

  const wikilinks = md.match(/\[\[[^\]]+\]\]/g)
  if (wikilinks) {
    leftover += wikilinks.length
    console.log(`❌ 위키링크 잔존  ${rel(f)}: ${wikilinks.slice(0, 3).join(', ')}`)
  }

  for (const m of md.matchAll(/\]\((\.[^)]+\.(?:md|ts))\)/g)) {
    const target = resolve(dirname(f), m[1])
    if (!existsSync(target)) {
      broken++
      console.log(`❌ 깨진 링크    ${rel(f)} → ${m[1]}`)
    }
  }
}

const solutions = files.filter((f) => f.endsWith('solution.ts'))
let noFn = 0
for (const f of solutions) {
  if (!/function\s+\w+|class\s+\w+/.test(readFileSync(f, 'utf8'))) {
    noFn++
    console.log(`❌ 함수 선언 없음 ${rel(f)}`)
  }
}

const ok = leftover === 0 && broken === 0 && noFn === 0
console.log(
  `\n마크다운 ${mds.length}개 · solution.ts ${solutions.length}개\n` +
    `위키링크 잔존 ${leftover} · 깨진 링크 ${broken} · 함수 없는 solution ${noFn}\n` +
    (ok ? '✅ 통과' : '⚠️ 위 항목 확인 필요')
)
process.exit(ok ? 0 : 1)

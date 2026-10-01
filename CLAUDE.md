# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**소문 항구 탐정단 (Rumor Harbor Detectives)** — a Korean-language educational game for elementary students (grades 1–6). Each of 10 harbor "zones" covers one 범교과 (cross-curricular) theme from the 2022 revised national curriculum and presents a rumor; kids play mini-games and answer quizzes to collect clues and judge whether the rumor is true, partly true, or false. All UI text and content is Korean; keep new content in Korean and age-appropriate.

## Running / building

There is no build system, package manager, linter, or test suite. The app is `index.html` (inline CSS + one inline `<script>`) plus `dungeon.html` (the picture-based 소문 던전, ~1.4MB with embedded webp/jpeg art), which `index.html` loads in a full-screen iframe. Serve the folder (e.g. `python -m http.server`) and open `index.html`. The only external resource is the Google Fonts "Jua" stylesheet.

`index.backup-*.html` files are manual snapshots taken before large changes — do not edit them; the live file is `index.html`. `preview/` holds byte-for-byte copies of two claude.ai artifacts from 2026-09-30 (the original dungeon preview, and a parallel whole-game version with an image-based match-3) — keep them as untouched originals; `dungeon.html` was generated from `preview/dungeon-preview-20260930.html`. Commit messages are written in Korean.

## Painted art assets (Canva → asset inbox)

The final art direction is hand-painted art matching the dungeon (rules, prompts, Canva media ids in `assets/ART_STYLE.md`). Images are generated with the Canva connector; the user only downloads them (original names, default Downloads folder) and says "다운로드했어" — never ask them to rename or move files.

1. When generating a batch, call `get-assets` for each media id and write `assets/inbox/manifest.json` (`target`, `kind`: isle/isle_home/bg/item-sheet/npc, `index`/`out`/`zone`, `canvaMedia`, `canvaName`). Give the user only the Canva links.
2. On "다운로드했어": run `powershell -ExecutionPolicy Bypass -File scripts/import-assets.ps1` (preview), then with `-Apply` — it copies by Canva name (or exact-count time order), runs `scripts/process-assets.js` (cutout/webp/sheet split → regenerates `assets/art-manifest.js`), then `scripts/test-assets.js`. Exit code 2 = ambiguous (show candidates, don't guess), 3 = would overwrite.
3. `index.html` loads `assets/art-manifest.js` (`window.ART_FILES`) into `ART`; registering art never needs hand edits. Hub hotspot positions on the painted background are manual (`HOT.hubPainted`).

Tools need `npm install` (playwright-core, uses system Chrome). `npm run assets:test` re-checks all registered art.

## Redesign progress (`game-redesign` branch, as of 2026-10-01)

Done (painted art):
- 지도 · 항구 허브 painted art
- 10개 구역 지도 섬
- 머지게임 10개 구역 painted 아이템 (120개)
- 대표 주민 초상화 3명 (npc_safety · npc_career · npc_unify)

Next, in order:
1. 나머지 주민 초상화 (대표 7명 → 이웃 주민 `npc_<zone>_1/_2`)
2. 블록 퍼즐 리디자인
3. 3매치 비주얼 리디자인
4. 소문 퐁당 리디자인
5. 던전 마무리
6. 전체 통합 및 모바일 테스트
7. 최종 GitHub push/배포 — push only when the user explicitly asks

## Architecture (all inside `index.html`)

The script is ordered as: content data → shared engine → per-game engines → event wiring/boot (bottom of file). Search by the section comments (`/* ===== ... ===== */`, `/* ---------- ... ---------- */`).

### Content data
- `CH` — array of 10 chapters (`id`: safety, character, career, democracy, rights, multi, unify, dokdo, money, eco). Each has `theme`, `place`, `tint/tintL/tintD` colors, `grades`, `rumor`, `verdict` (`'true' | 'part' | 'false'`) + `verdictWhy`, `npc`/`villagers`, two merge `chains` (generator + 5 item levels), four `steps` (story lines + quiz), `truth` points, `extra` quizzes, and `tips`.
- `GAMES[chId]` — two mini-games per chapter (types: `order`, `sort`, `match`, `ox`, `shop`). A post-processing loop right after `GAMES` **replaces steps 2 and 4 (indices 1, 3) with these mini-games** and moves those steps' original quizzes into `ch.extra`.
- `QBANK[chId]` — extra quiz tuples `[question, options, explanation]`; **the correct answer is always the first option** (options are shuffled at display time).
- Adding a chapter means adding matching entries in `CH`, `GAMES`, and `QBANK` with the same `id`.

### Quiz pool
`poolOf(ci)` builds a deduplicated question pool from step quizzes, `extra`, `QBANK`, and questions auto-derived from the chapter's `GAMES` cards. `drawQ(ci)` deals from a persisted shuffled deck (`c.deck`, `c.recent`) so questions don't repeat until the deck is exhausted — every mode (merge quiz-charge, match bonus, block rescue, dungeon fights, review) draws through this. Wrong answers are tracked by a hash of the question text (`qid`) in `c.wrong` for the "다시 풀기" review.

### State & persistence
- Global `S` is saved to `localStorage` under `soomun-harbor-v2` (with migration from `v1`) via a debounced `save()`. Always call `save()` after mutating `S`.
- Per-chapter state via `chState(ci)` (lazily initializes `step`, `stars`, `done`, merge `board`/`orders`, `best`, `dBest`, `dWins`, plus `guess`, `final`, `deck`/`deckK`, `wrong`, `mBest` (match), `pBest` (drop), `caveBest`/`caveWins` (dungeon), etc.). `S.grade` (1–6, 0 = not chosen) drives the first-run grade picker, map recommendations, and `poolOf` filtering of questions tagged `g:[min,max]`; `poolAll` is the unfiltered pool used by the wrong-answer review. If you add fields, give them defaults there or guard for `undefined` — old saves won't have them.
- `S.lesson` holds an active teacher lesson (chapter, grade, duration, start time); on boot the app jumps straight into that chapter's hub.

### Screens & flow
`<section class="screen">` elements are switched by `show(id)`; `CI` is the current chapter index and `SCREEN` the current screen. `refresh()` re-renders whichever screen is active.
- `map` (SVG harbor map `renderHarborMap` + zone list + truth-card collection) → `hub` (chapter home) → play modes: `merge` (merge-2 board with orders and energy), `match` (8×8 SVG-art match-3 with line / whirlpool / pearl specials), `drop` (소문 퐁당: canvas drop-and-merge physics, 10 creature levels, cached sprites), `block` (8×8 block puzzle), and the dungeon. A new screen must be added to the id list in `show()` and to `refresh()`.
- Dungeon: the hub card calls `openCave()`, which loads `dungeon.html?ch=&g=` into `#caveFrame`. The two talk via `postMessage` (`dq:need` → `dq:q` question from `drawQ`, `dq:ans` → `wrongAdd`, `dq:stars`, `dq:floor`, `dq:clear`, `dq:exit`); always check `e.source`. `dungeon.html` is a separate global scope that reuses names like `G`, `$`, `say`, `.plank`, so never paste its code into `index.html`. The older card dungeon (`openDungeon`, 7-floor quiz roguelite) is still reachable from the hub's 빠른 카드 던전 button.
- Play modes earn ⭐ stars for the current chapter; spending `STEP_COST[step]` stars in the hub unlocks the next story step (`startStory` → `completeStep`). After 4 steps the chapter is `done` and `showTruth` shows the final detective report (student's first guess via `guessModal` vs. final verdict).
- Teacher lesson mode: `teacherModal` (grade-based recommendations, timer via `lessonLeft`/`timeUpModal`) and `openRecap` (whole-class wrap-up screen).

### Shared UI helpers
`openModal(html, {onClose, closable})`/`closeModal` (single `#modal` element, all dialogs go through it), `runQuiz`, `runGame`, `toast`, `confetti`, `coachStart(steps)` for step-by-step tutorials (tracked in `S.tut`), `ttsBtn(text)` for Korean speech-synthesis read-aloud buttons, `sfx` (WebAudio beeps). Use `esc()` when interpolating content into HTML strings. Per-chapter colors are applied via CSS variables `--tint/--tintL/--tintD` (`tintVars`).

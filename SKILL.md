---
name: recook
description: Builds and tests a new agent skill, with limits set first (cost tier, time, rounds, permissions). Use when the user types /recook or asks to create, build or improve a skill, or turn a workflow into one. Not for running existing skills or one-off tasks.
---

# ReCook

Build a new agent skill inside limits the user sets first, then test it with a fresh subagent before calling it done.

Cost and time figures in this skill are rough estimates. Actual use varies by model, plan and task. Always say so when you show one.

## State files

Run state lives in `recook-run/` at the project root, unless the user picks another place at intake. These files are your memory across context resets.

| Path | Holds |
|---|---|
| `recook-run/BRIEF.md` | Limits, permissions, purpose, done criteria. Written once after intake. |
| `recook-run/ROUNDS.md` | The ledger. One entry per round. |
| `recook-run/draft/<skill-name>/` | The skill being built. |

## Start or resume

- `recook-run/BRIEF.md` exists and the run is not finished: read BRIEF and the last two ROUNDS entries, then continue. Do not re-ask intake questions.
- After a context compaction, do the same before your next action.
- No `recook-run/`: start at step 0.

## Steps

### 0. Fit check
Before spending anything, ask whether a skill is needed. A single prompt, a line in the project's instruction file, or an existing skill may do the job. If so, say it and stop. Details in `references/design-coach.md`.

### 1. Limits intake (once, before any building)
Ask every open question in one message, each with a default. The user can answer by number or reply "defaults". Skip what they already answered. Questions: `references/limits-intake.md`.

Cover, in this order: cost tier, time cap, round cap, what done looks like, what to do if the user is away, permissions, how reference material arrives, where notes are saved.

Show the estimate for the chosen tier with the warning that it is an estimate. Write `recook-run/BRIEF.md` from `templates/SKILL-BRIEF.md`.

### 2. Design
Walk the user through the design questions in `references/design-coach.md`, a few at a time. Offer a default and an example for each. Write the draft skill from `templates/skill-skeleton/`.

### 3. Test loop
Each round, in order:
1. Run the lint script: `node <skill>/scripts/check-skill.mjs recook-run/draft/<name>`.
2. Run the tests in `references/testing.md`, using fresh-context subagents.
3. Fix the weakest failure. Change one thing at a time.
4. Log the round in `recook-run/ROUNDS.md`: what changed, what was measured, what was only judged, what was not checked.
5. Run the stop check.

### 4. Hand over
Show the user the finished skill, the test results and the ledger. Install or publish only if the permissions in BRIEF.md allow it and the user confirms.

## Stop check

Stop at the first of these, and say which one it was:
- Done criteria in BRIEF.md are met and the tests pass.
- The round cap is reached.
- The time cap is reached.
- The estimated cost cap is reached.
- A permission is needed that BRIEF.md does not grant.

If the user is away at a gate, stop and report. Never keep spending to wait for an answer. When a limit stops the run before the criteria are met, finish the current round, log it and report plainly what still fails.

## Never

- Build before the limits intake is answered, unless the user says "defaults".
- Ask new questions after intake, except to request a permission BRIEF.md does not grant.
- Exceed a cap the user set, or raise one without asking.
- Present an estimate as a price or a promise.
- Report a test as passed when it was not run. Write "not run".
- Run sample tasks against real data, real accounts or the network unless BRIEF.md allows it.
- Put keys, tokens or private details in the ledger, notes or the skill.
- Publish, push or install anything without permission.

## Files in this skill

| File | Read when |
|---|---|
| `references/limits-intake.md` | Step 1: questions, defaults, tiers, estimates. |
| `references/design-coach.md` | Steps 0 and 2: fit check and design questions. |
| `references/testing.md` | Step 3: the tests, subagent prompts, pass rules. |
| `templates/SKILL-BRIEF.md` | Step 1: the brief format. |
| `templates/ROUNDS.md` | Start of the run: copy to `recook-run/ROUNDS.md`. |
| `templates/skill-skeleton/` | Step 2: the starting layout for the new skill. |
| `scripts/check-skill.mjs` | Every round: structural checks on the draft. |

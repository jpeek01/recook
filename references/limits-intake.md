# Limits intake

This file is the source of truth for the intake. The intake is one sitting, in this order:
1. The limits questions below, in one message, each with its default.
2. The design questions from `design-coach.md`. Use its short path when it applies.
3. The estimate for the chosen tier, with the warning below.
4. The closing line: "Anything else, tell me now. After this I work within these limits without asking."

After the closing line you ask nothing, except at a gate (see SKILL.md, Gates).

Before you ask: read what the user already gave you (the prompt, files, a filled brief). Do not ask what is answered. The user can answer by number or reply "defaults".

If the user is away or tells you to decide: use the defaults below and decide the design questions yourself. Log each guess in the ledger's Decisions list, marked "unconfirmed". The run stops before hand-over and reports what is unconfirmed.

## Limits questions and defaults

| # | Question | Default |
|---|---|---|
| 1 | Cost tier: light, standard or deep? | Standard |
| 2 | Time cap? | The tier's time cap |
| 3 | Round cap? | The tier's round cap |
| 4 | What must be true when the new skill has done its job? 3 to 5 rules, checked by a command or test where possible. | I draft 3 to 5 from your answers (see design-coach.md). If you are away, they are marked "agent-written, unconfirmed". |
| 5 | One example of the output you want: a finished sample, or "none yet"? | None yet. BRIEF.md records that the output format is a guess. |
| 6 | If you are away when I need a decision? | Stop and report. Do not keep spending. |
| 7 | What may I do while building? | The default permissions below. |
| 8 | May I add `recook-run/` and `recook-archive/` to your .gitignore? | No. Please add them yourself, or keep them out of commits. |
| 9 | How will you provide reference material? | Paste it or point to local files. |
| 10 | Where should I save design notes? | Local files in `recook-run/`. |
| 11 | Which model and plan do you run on? | Not known |
| 12 | May I install or publish the finished skill? | No. Prepare it locally and say it is ready. |

For any answer to 9 or 10 other than the default, read `sources-and-notes.md`.

ReCook's own rule for when the run is done is fixed (SKILL.md, Run done). Question 4 is about the new skill, not the run.

## Tiers

Rounds, subagent runs and time are the real caps. Cost is derived from them. A round is defined in SKILL.md (Test loop).

| Tier | Round cap | Subagent runs per round | Subagent runs, at most | Time cap | Cost estimate |
|---|---|---|---|---|---|
| Light | 2 | 3 | 6 | 45 min | about $1 to $10 |
| Standard | 4 | 4 | 16 | 90 min | about $2 to $20 |
| Deep | 8 | 5 | 40 | 3 h | about $4 to $40 |

How the cost figure is made: rounds x a guessed $0.50 to $5 per round, covering the building work and the test subagents around it. The per-round guess is **uncalibrated**. It will be too high for small skills on a small model and too low for large skills on a large model. It is not measured from the user's account.

Always show this warning with the figures:

> These are rough estimates, not prices. Mileage may vary with your model, plan and the size of the skill. Subscription plans may show use as a share of a usage window instead of dollars. I count rounds and subagent runs, and stop at the cap you set.

If the user gives a per-round cost from their own experience, use it instead and note it in BRIEF.md.

The agent usually cannot read real spend. So the cost cap is enforced by counting rounds and subagent runs, not by reading a bill. If the harness offers a usage readout, check it at each round boundary and stop early if it disagrees badly with the estimate.

## Time cap

- Start time goes in BRIEF.md and the ledger header. Read the clock at each round boundary.
- Plan rounds to finish before the cap with time left for the final log and report.
- There is no minimum time. Finishing early when run done is met is correct.
- Warn: "Time is an estimate. Test runs can be slower than expected."

## Permissions

Default permissions (the "defaults" answer to question 7):
- Read project files.
- Write inside `recook-run/`, including `recook-run/scratch/`.
- Before a new run, move a stopped or finished run to `recook-archive/<date>/`.
- Run the bundled lint script: `node scripts/check-skill.mjs`, from this skill's folder.
- Start fresh test subagents that write only in `recook-run/scratch/`, are read-only on real data, and use no network.
- Let those test subagents run `node` on the draft skill's own scripts, with output only in `recook-run/scratch/`. Nothing else may be run as a shell command.

Not allowed unless the user grants it: install, publish, push, network, connectors, editing .gitignore (question 8), writing anywhere else, and any other shell command.

List what the user allows, one line each, in BRIEF.md. Anything not listed is not allowed. When a step needs something unlisted, that is a gate: ask once, or stop and report if the user is away.

## Adapting

- Light: use the short design path in design-coach.md.
- Standard and Deep: ask the full design questions, unless the short path applies.
- Which tests each tier runs is in testing.md.

A tier change mid-run is a gate. If the user approves it, log it in the ledger's Decisions list and update the ledger header. The ledger header then overrides the limits in BRIEF.md.

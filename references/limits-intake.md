# Limits intake

This file is the source of truth for the intake. The intake is one message from you and one reply from the user. The message holds, in this order:
1. The limits questions below, each with its default.
2. The design questions from `design-coach.md`, each with a default. Use its short path when it applies.
3. The estimate table for all three tiers, with the warning below. For a skill that sends, posts, deploys or deletes, include the side-effect warning (Permissions).
4. The closing line: "Reply with your answers, or 'defaults'. After your reply I work within these limits without asking."

One reply ends the intake. After it you ask nothing, except at a gate (SKILL.md, Gates).

Before you ask: read what the user already gave you (the prompt, files, a filled brief). Do not ask what is answered. The user can answer by number or reply "defaults". "defaults" accepts every default, including the design defaults you proposed. Log those in the ledger's Decisions list as "agent-proposed, accepted by default". Done criteria written this way have Source "agent-written, accepted by default".

Fixed rule: at a gate with no answer, stop and report. Never keep spending to wait.

## Limits questions and defaults

| # | Question | Default |
|---|---|---|
| 1 | Cost tier: light, standard or deep? | Standard |
| 2 | Subagent models: cheap, moderate or heavy? (see Subagent models) | Moderate |
| 3 | Time cap? | The tier's time cap |
| 4 | Round cap? | The tier's round cap |
| 5 | What must be true when the new skill has done its job? 3 to 5 rules, checked by a command or test where possible. | I draft 3 to 5 from your answers (see design-coach.md). |
| 6 | One example of the output you want: a finished sample, or "none yet"? | None yet. BRIEF.md records that the output format is a guess. |
| 7 | What may I do while building? | The default permissions below. |
| 8 | How will you provide reference material? | Paste it or point to local files. |
| 9 | May I install or publish the finished skill? | No. Prepare it locally and say it is ready. |

For a non-default answer to question 8, read `sources.md`.

ReCook's own rule for when the run is done is fixed (SKILL.md, Run done). Question 5 is about the new skill, not the run.

## Tiers

Rounds, subagent runs and time are the real caps. Cost is derived from them.

| Tier | Round cap | Subagent runs per round | Subagent runs, at most | Time cap | Cost estimate |
|---|---|---|---|---|---|
| Light | 2 | 3 | 6 | 45 min | about $1 to $10 |
| Standard | 4 | 4 | 16 | 90 min | about $2 to $20 |
| Deep | 8 | 5 | 40 | 3 h | about $4 to $40 |

"Subagent runs, at most" = round cap x runs per round. If the user sets their own round cap, recompute it and record it in BRIEF.md and the ledger header.

How the cost figure is made: rounds x a guessed $0.50 to $5 per round, covering the building work and the test subagents around it. The per-round guess is **uncalibrated**. It will be too high for small skills on a small model and too low for large skills on a large model. It is not measured from the user's account.

Always show this warning with the figures:

> These are rough estimates, not prices. Mileage may vary with your model, plan and the size of the skill. Subscription plans may show use as a share of a usage window instead of dollars. I count rounds and subagent runs, and stop at the cap you set.

A change of cost tier or subagent models mid-run is a gate. If the user approves it, log it in the ledger's Decisions list and update the ledger header. The ledger header then overrides the limits in BRIEF.md.

Under the table always show: "These figures assume Moderate subagent models. Heavy is likely several times higher." If the user picks Heavy, note that in BRIEF.md next to the estimated cost range. If the user gives a per-round cost from their own experience, use it instead and note it in BRIEF.md.

The agent usually cannot read real spend. So the cost cap is enforced by counting rounds and subagent runs, not by reading a bill. If the harness offers a usage readout, check it at each round boundary and stop early if it disagrees badly with the estimate.

## Subagent models

A second dial, independent of the tier. The tier sets how many subagent runs; this sets which model each test subagent runs on. The user can also say it in the request, for example "/recook heavy ...".

| Level | Model for test subagents (Claude Code) |
|---|---|
| Cheap | Haiku 5.5 |
| Moderate (default) | Sonnet 5.5 |
| Heavy | Opus 5.5 |

- On another harness use the nearest equivalent. If the harness cannot set a subagent's model, say so and record "subagent models: harness default".
- It changes the cost of each run, not the number of runs. The cost table assumes Moderate (see the note under it). Cheap is likely lower. This is uncalibrated, like the rest.
- Test on the level the skill will be used with. A pass on Heavy does not show the skill works on a smaller model.
- All test subagents in a run use the same level. Record it in BRIEF.md Limits and in the ledger header.

## Time cap

- Start time goes in BRIEF.md and the ledger header. Read the clock with `date` at each round boundary.
- Plan rounds to finish before the cap with time left for the final log and report.
- There is no minimum time. Finishing early when run done is met is correct.
- Warn: "Time is an estimate. Test runs can be slower than expected."

## Permissions

Default permissions (the "defaults" answer to question 7):
- Read project files.
- Write inside `recook-run/`, including `recook-run/scratch/`.
- Before a new run, move a stopped or finished run to `recook-archive/<date>/`.
- Run the lint script, from the project root: `node <this skill's folder>/scripts/check-skill.mjs recook-run/draft/<skill-name>`.
- Read the clock with `date`, and check for stray writes with `git status --short`. No other shell command.
- Start fresh test subagents that write only in `recook-run/scratch/`, are read-only on real data and use no network.
- Those subagents may run `node` on the draft skill's own scripts and the plain read-only commands the draft's steps name (such as `wc` or `grep`).
- Those subagents are told to send no messages and start no sessions or agents.

Not allowed unless the user grants it: install, publish, push, network, connectors, writing anywhere else, and any other shell command. ReCook never edits .gitignore; the user adds `recook-run/` and `recook-archive/` themselves. Also not allowed: using a cloud or remote session tool, or any tool that acts outside the project, as a stand-in for test subagents (testing.md).

Warning for a skill with side effects (it sends, posts, deploys or deletes): test subagents inherit the parent's tools, and the sandbox is only an instruction. Before the run, the user should disable the sending tool or set it to ask for approval.

List what the user allows, one line each, in BRIEF.md. Anything not listed is not allowed. When a step needs something unlisted, that is a gate: ask once.

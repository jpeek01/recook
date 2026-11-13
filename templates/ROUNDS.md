# ReCook ledger: [skill name]

Status: [running | stopped | finished]
Stop reason: [none yet / which stop check line]

Started: [timestamp]
Tier: [tier] | Round cap: [N] | Subagent runs per round: [N] | Subagent run cap: [N] | Time cap: [duration]
Used: rounds [0] | subagent runs [0] | elapsed [0]

One entry per round, newest at the bottom. Label every result measured or judged.

## Decisions
Made without asking, one line each. Mark guesses made while the user was away "unconfirmed".
- [time] [decision], because [reason] [unconfirmed]

---

## Round [N]

Time: [start] to [end] | total elapsed [h]
Used after this round: rounds [n] | subagent runs [n] (this round: [n] of [per-round limit])

Changed:
- [what, where]

Results:

| Test | Result | Measured or judged |
|---|---|---|
| Lint | [pass / n errors] | measured |
| Trigger test | [x of 6 should, y of 6 should-not correct] | judged (proxy) |
| Dry run | [new skill's done criteria met: list] | [measured / judged] |
| Baseline | [better / same / worse, per criterion / not run (tier)] | judged |
| Critic | [fails and top problems] | judged |

Retest: [test, result / none]
Not run this round: [what, and why]
Self-tested (never counts as passed): [what / none]

Top problems:
1. [ ]
2. [ ]

Stop check: run done [met / not] | rounds [n of N] | time [elapsed of cap] | runs [n of N] -> [next round / stop: reason]
Next focus: [ ]

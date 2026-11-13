# ReCook ledger: [skill name]

Copy to `recook-run/ROUNDS.md`. One entry per round, newest at the bottom. Label every result measured or judged.

Started: [timestamp]
Tier: [tier] | Round cap: [N] | Subagent run cap: [N] | Time cap: [duration]
Used: rounds [0] | subagent runs [0] | elapsed [0]

## Decisions
Made without asking, one line each.
- [time] [decision], because [reason]

---

## Round [N]

Time: [start] to [end] | total elapsed [h]
Used after this round: rounds [n] | subagent runs [n]

Changed:
- [what, where]

Results:

| Test | Result | Measured or judged |
|---|---|---|
| Lint | [pass / n errors] | measured |
| Trigger test | [x of 6 should, y of 6 should-not correct] | judged (proxy) |
| Dry run | [done criteria met: list] | [measured / judged] |
| Baseline | [better / same / worse, per criterion] | judged |
| Critic | [fails and top problems] | judged |

Not run this round: [what, and why]

Top problems:
1. [ ]
2. [ ]

Stop check: criteria [met / not] | rounds [n of N] | time [elapsed of cap] | runs [n of N] -> [next round / stop: reason]
Next focus: [ ]

# ReCook ledger: [fill in: skill name]

Status: [fill in: running | stopped | finished]
Stop reason: [fill in: none yet / which stop check line]

Started: [fill in: timestamp]
Tier: [fill in: tier] | Round cap: [fill in: N] | Subagent runs per round: [fill in: N] | Subagent run cap: [fill in: N] | Time cap: [fill in: duration]
Used: rounds [fill in: 0] | subagent runs [fill in: 0] | elapsed [fill in: 0]

One entry per round, newest at the bottom. Label every result measured or judged.

## Decisions
Made without asking, one line each. Mark guesses made while the user was away "unconfirmed".
- [fill in: time] [fill in: decision], because [fill in: reason] [fill in: "unconfirmed" if a guess, else delete]

---

Round entry template. Copy this block once per round, and delete this line and the block when you copy the ledger if you have no round yet.

<!-- ROUND ENTRY TEMPLATE: START -->

## Round [N]

Time: [start] to [end] | total elapsed [h]
Used after this round: rounds [n] | subagent runs [n] (this round: [n] of [per-round limit])

Changed:
- [what, where]

Results:

| Test | Result | Measured or judged |
|---|---|---|
| Lint | [pass / n errors] | measured |
| Trigger test | [x of 6 should, y of 6 should-not correct; prompts from user / agent-written, unconfirmed] | judged (proxy) |
| Dry run | [new skill's done criteria met: list] | [measured / judged] |
| Baseline | [better / same / worse, per criterion / not run (tier)] | judged |
| Critic | [fails and top problems] | judged |

Retest: [test, result / none]
Not run this round: [what, and why]
Self-tested (never counts as passed): [what / none]
Off-task tool calls: [test, tool, what was done about it / none]

Top problems:
1. [ ]
2. [ ]

Stop check: run done [met / not] | rounds [n of N] | time [elapsed of cap] | runs [n of N] -> [next round / stop: reason]
Next focus: [ ]

<!-- ROUND ENTRY TEMPLATE: END -->

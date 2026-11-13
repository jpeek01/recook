# ReCook ledger: [fill in: skill name]

Status: [fill in: running | stopped | finished]
Stop reason: [fill in: none yet / which stop check line]

Started: [fill in: timestamp]
Tier: [fill in: tier] | Round cap: [fill in: N] | Subagent runs per round: [fill in: N] | Subagent run cap: [fill in: N] | Time cap: [fill in: duration]
Subagent models: [fill in: cheap / moderate / heavy / harness default]
Used: rounds [fill in: 0] | subagent runs [fill in: 0] | elapsed [fill in: 0]

One entry per round, newest at the bottom. Label every result measured or judged.

## Decisions
Made without asking, one line each. Mark guesses made while the user was away "unconfirmed".
- [fill in: time] [fill in: decision], because [fill in: reason] [fill in: "unconfirmed" if a guess, else delete]

---

Round entry template. When you copy this ledger, delete this line and the block below, then paste a copy of the block for each round.

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
| Trigger test | [x of 6 should, y of 6 should-not correct; prompts from user / agent-written, accepted by default / agent-written, unconfirmed] | judged (proxy) |
| Dry run | [done criteria met / not met, or "not run (side effect)"] | measured by command, judged by the critic |
| Baseline | [better / same / worse, per criterion / not run (tier)] | judged |
| Critic | [fails and top problems; second critic: ran / not run (tier or round 1)] | judged |

Critic, confirmed fails: [item: first critic's evidence line / second critic's evidence line; fixed / open / accepted by the user: reason / none]
Critic, pending fails (round 1 of Standard or Deep; run done not met): [item: pending / pending, not re-raised / none]
Critic, unconfirmed fails: [item: fixed / unconfirmed fail, left: reason / none]
Not run this round: [what, and why]
Self-tested (never counts as passed): [what / none]
Off-task tool calls: [test, tool, what was done about it / none]

Top problems:
1. [ ]
2. [ ]

Stop check: run done [met / not] | rounds [n of N] | time [elapsed of cap] | runs [n of N] -> [next round / stop: reason]
Next focus: [ ]

<!-- ROUND ENTRY TEMPLATE: END -->

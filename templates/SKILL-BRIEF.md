# Brief: [skill name]

Written once after the intake. Keep it short. Every line steers the run, so leave out what does not apply. Counts of rounds and subagent runs used live in the ledger header (`recook-run/ROUNDS.md`), not here.

## Limits
Tier: [light / standard / deep]. Estimates are rough, not prices.
Rounds: at most [N]. Subagent runs: at most [N] per round, [N] in total.
Time cap: [duration]. Started: [timestamp].
Estimated cost range: [$x to $y] (uncalibrated; model and plan: [answer / not known]).
If the user is away: [stop and report].

## Permissions
Allowed: [defaults: read project files; write inside recook-run/ and recook-run/scratch/; archive an old run to recook-archive/; run node scripts/check-skill.mjs; fresh test subagents that write only in recook-run/scratch/, read-only on real data, no network] [plus any grant: shell / network / connectors: names / .gitignore edit / install / publish].
Not allowed: everything not listed.

## Run done (ReCook default)
Lint 0 errors. Trigger test at least 5 of 6 correct on each side. Dry run meets the new skill's done criteria below. Critic review has no fail. Baseline is reported, not gating. Self-tested results never count.
Stricter rule from the user: [none / rule].

## The new skill's done criteria
Source: [user / agent-written, unconfirmed].
1. [criterion] (measured / judged)
2. [criterion] (measured / judged)
3. [criterion] (measured / judged)

## Sample output
[path or pasted sample] or "none yet: the output format is a guess".

## The skill
Problem and user: [one or two sentences].
Triggers: [3 examples]. Non-triggers: [3 examples].
Steps: [3 to 7].
Gates: [what needs the human].
Never: [short list].
Unconfirmed design answers: [none / see ledger Decisions].

## References
[source: where it came from, read-only, what to use] or "no references".

## Notes
Design notes also saved to: [local recook-run/ only / Obsidian vault path / Notion page / nowhere].

## The user's words
"[key lines of the request, verbatim]"

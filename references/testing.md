# Testing the new skill

Test with fresh-context subagents. A fresh subagent has no history, no brief and does not know who wrote the skill or what you expect. It gets only what the test names. Subagent runs count against the tier's cap.

Label every result "measured" (a command or a countable check produced it) or "judged" (a model or person decided).

If you cannot start subagents, use a fresh session with only the listed inputs. If neither is possible, run the test yourself and mark it "self-tested". Never report a test that was not run.

## Order

1. Lint (measured)
2. Trigger test
3. Dry run
4. Baseline comparison
5. Critic review

Run 1 every round. Run 2 to 5 as the tier allows: Light runs 1, 2 and 3 once. Standard runs all five. Deep adds a second sample task and a second critic.

## 1. Lint

`node <skill>/scripts/check-skill.mjs recook-run/draft/<name>`

It checks: frontmatter has `name` and `description`, name matches the folder, description length, `SKILL.md` line count, every file the skill mentions in its file table exists, and a stop or done section is present. Pass means no errors. Warnings are listed in the ledger.

## 2. Trigger test

Purpose: would the agent pick this skill for the right prompts and ignore the wrong ones?

1. Write 6 prompts that should trigger it and 6 that should not. Include a few near-misses. Use the user's trigger and non-trigger examples from design.
2. Give a fresh subagent only the skill's `name` and `description` and the list of prompts, one at a time or in one batch.
3. Ask for each prompt: would you use this skill? Answer yes or no with one line why.
4. Count hits and false fires.

This is a proxy. Real skill selection depends on the harness and on the other skills installed. Say so in the ledger.

Prompt:
```text
Here is the name and description of one skill. For each user message below, say whether you would invoke this skill, yes or no, and give one short reason. Use only the description.
```

Pass rule (default): at least 5 of 6 correct on each side. The user may set a stricter rule.

## 3. Dry run

Purpose: can an agent follow the skill and reach the done criteria?

1. Write 1 sample task (2 in Deep). Make it realistic and small.
2. Give a fresh subagent the skill folder and the task. Nothing else.
3. Default sandbox: read-only on real data, writes only to a scratch folder, no network, no real accounts. The skill is untrusted until tested. Relax this only if BRIEF.md says so.
4. Record: did it follow the steps, where did it hesitate, what did it skip, did it hit the stop condition correctly.
5. Check the result against the done criteria. Measured ones by command. Judged ones by the critic.

Prompt:
```text
You have one skill in the folder [path]. Follow it for this task: [task]. Work only in [scratch folder]. Do not use the network. At the end, list each step you took, anything that was unclear, and anything you had to guess.
```

## 4. Baseline comparison

Purpose: does the skill help, or would the model do as well without it?

1. Give a second fresh subagent the same task with no skill.
2. Compare both results against the done criteria.
3. Report plainly: skill better, same, or worse, per criterion. If the baseline matches the skill, say the skill adds little and suggest the simpler option from the fit check.

One baseline run is weak evidence. Say so. Deep tier uses two tasks.

## 5. Critic review

A separate fresh subagent gets only the skill folder and this checklist. Do not say who built it.

```text
Review this skill against the checklist. For each item answer pass, fail or unclear with one line of evidence. Then list the 3 biggest problems and what to change.

1. The description says when to use it and when not to.
2. The main file is short and points to detail files.
3. Every step is concrete enough to follow without guessing.
4. There is a clear stop or done condition.
5. Permissions and things it must never do are stated.
6. It says what happens if the user is absent.
7. Nothing in it contradicts something else in it.
8. Nothing asks for secrets or hides actions.
```

Judged results only. If two critics differ, trust neither alone and look at the evidence they cite.

## Fixing

- Fix the weakest result first. Change one thing, then retest that one test.
- If a change makes a result worse, undo it and log why.
- Do not edit a test to make it pass. Change the skill.

## Ledger entry for each round

Record: what changed, each test and its result with measured or judged, the sample tasks used, subagent runs used so far against the cap, elapsed time, what was not checked, and the next focus.

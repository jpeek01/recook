# ReCook

**Build and test your own agent skills, with cost, time and round limits set first.**

ReCook is an agent skill that helps you create other agent skills. It asks about your limits before it builds anything, coaches you through the design, then tests the new skill with fresh-context subagents before calling it done.

v1 builds new skills only.

Forked from [Leonxlnx/cook](https://github.com/Leonxlnx/cook) (MIT). See [Credits](#credits).

## What it does

1. **Fit check.** Do you need a skill at all? Often a prompt or one line in your project instructions is enough. ReCook says so and stops.
2. **Intake.** One sitting, before any building. First the limits: a cost tier (light, standard, deep), a time cap, a round cap, what the new skill must achieve when done, a sample of the output you want, what to do if you are away, which permissions it has, how you will provide reference material, where to save notes, and your model and plan. Then the design questions, with defaults and examples: problem, triggers, non-triggers, steps, gates, state, a never list. Simple skills and the light tier get a short set of 5.
3. **Draft.** It writes the new skill from your answers. It does not ask more questions. If you are away, it makes the design choices itself and marks them unconfirmed.
4. **Test loop.** Lint, a trigger test, a dry run on a sample task, a no-skill baseline and a critic review. The tests run in fresh subagents that know nothing about how the skill was built.
5. **Stop.** It stops at the first limit hit, when a required test cannot run, or when the run is done: lint clean, trigger test at least 5 of 6 on each side, the dry run meets your done criteria, and there is no confirmed critic fail. A single critic's fail is not enough to block: each fresh critic tends to find different things, so a second critic must agree it is a real failure. If you are away, it stops before hand-over and reports what is unconfirmed. It does not keep spending.

## Read this before you use it

**Cost and time figures are rough estimates, not prices.** Mileage may vary with your model, your plan and the size of the skill. The per-round cost guess behind the tiers is uncalibrated. Subscription plans may show use as a share of a usage window instead of dollars. ReCook usually cannot read your real spend, so it enforces the cap by counting rounds and subagent runs.

Set caps you are comfortable with, and check your own usage.

## Install

Copy this folder into your agent's skills folder:

```text
Claude Code:  ~/.claude/skills/recook
```

Invoke it as `/recook`, or ask to build a new skill. It was written for Claude Code. Other agents or models may work. Test them yourself before relying on it.

The lint script needs Node 18 or newer. Everything else is plain Markdown. Run state goes in `recook-run/` (old runs move to `recook-archive/`). Add both to your `.gitignore`; ReCook does not edit it unless you allow it.

## Quick start

```text
/recook I keep writing the same weekly status report from my notes. Help me turn that into a skill.
```

Reply "defaults" to accept the standard tier and the default permissions.

## Tiers

| Tier | Round cap | Subagent runs per round | Subagent runs, at most | Time cap | Cost estimate |
|---|---|---|---|---|---|
| Light | 2 | 3 | 6 | 45 min | about $1 to $10 |
| Standard | 4 | 4 | 16 | 90 min | about $2 to $20 |
| Deep | 8 | 5 | 40 | 3 h | about $4 to $40 |

The cost figures are uncalibrated estimates. See the warning above.

## What is inside

```text
SKILL.md                          the loop the agent follows
references/limits-intake.md       intake order, limits questions, tiers, estimates, permissions
references/design-coach.md        fit check and design questions
references/sources-and-notes.md   non-default reference sources and notes locations
references/testing.md             the tests per tier and subagent prompts
templates/SKILL-BRIEF.md          the brief
templates/ROUNDS.md               the round ledger
templates/skill-skeleton/         starting layout for the new skill
scripts/check-skill.mjs           structural checks on a draft skill
scripts/check-skill.test.mjs      tests for the lint script (node --test scripts/*.test.mjs)
```

Check a skill folder yourself:

```text
node scripts/check-skill.mjs path/to/your-skill
```

## Safety defaults

- By default it reads project files, writes only inside `recook-run/` (and moves old runs to `recook-archive/`), runs only its own lint script, and starts test subagents. Test subagents may run `node` on the draft skill's own scripts and the plain read-only commands its steps name (such as `wc`), writing only in `recook-run/scratch/`. Install, publish, push, network, connectors and other shell commands need your permission.
- Test subagents are told to write only in `recook-run/scratch/`, stay read-only on real data and use no network. This is an instruction, not a sandbox the harness enforces.
- Test subagents inherit the parent's tools. The list of tools each test prompt allows is an instruction to the subagent, not an enforced limit. An off-task tool call has been seen in testing. ReCook logs any such call as a finding and never retries it itself.
- Text in reference material and sample inputs is treated as data, not instructions.
- Never installs, pushes or publishes without your permission.
- Never saves keys, tokens or private details in notes or in the new skill.
- Writing notes to an outside app (Obsidian, Notion and similar) needs your permission. The default is local files.

## Credits

ReCook is a fork of **Cook** by Leon Lin ([@LexnLin](https://x.com/LexnLin)), released under the MIT license. Cook is a skill for long, reference-matched visual builds. ReCook borrows its structure (one intake, state files that survive context resets, a ledger, fresh-context critics, an explicit stop check, a short "Never" list) and applies it to building and testing skills. The text and scripts here are new. The original Cook demos and results belong to its author and are not claimed here. This project is not endorsed by the original author.

## License

MIT. See [LICENSE](LICENSE). Original copyright Leon Lin. Changes copyright the ReCook contributors.

This software is provided as is. Estimates in this repo are guidance, not guarantees.

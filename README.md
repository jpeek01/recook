# ReCook

**Build and test your own agent skills, with cost, time and round limits set first.**

ReCook is an agent skill that helps you create other agent skills. It asks about your limits before it builds anything, coaches you through the design, then tests the new skill with fresh-context subagents before calling it done.

Forked from [Leonxlnx/cook](https://github.com/Leonxlnx/cook) (MIT). See [Credits](#credits).

## What it does

1. **Fit check.** Do you need a skill at all? Often a prompt or one line in your project instructions is enough. ReCook says so and stops.
2. **Limits first.** One message asks for: a cost tier (light, standard, deep), a time cap, a round cap, what "done" looks like, what to do if you are away, which permissions it has, how you will provide reference material, and where to save notes.
3. **Design coaching.** Questions with defaults and examples: problem, triggers, non-triggers, steps, gates, state, a never list.
4. **Test loop.** Lint, a trigger test, a dry run on a sample task, a no-skill baseline and a critic review. The tests run in fresh subagents that know nothing about how the skill was built.
5. **Stop.** It stops at the first limit hit or when your done criteria pass. If you are away, it stops and reports. It does not keep spending.

## Read this before you use it

**Cost and time figures are rough estimates, not prices.** Mileage may vary with your model, your plan and the size of the skill. The per-round cost guess behind the tiers is uncalibrated. Subscription plans may show use as a share of a usage window instead of dollars. ReCook usually cannot read your real spend, so it enforces the cap by counting rounds and subagent runs.

Set caps you are comfortable with, and check your own usage.

## Install

Copy this folder into your agent's skills folder:

```text
Claude Code:  ~/.claude/skills/recook
Codex CLI:    ~/.codex/skills/recook
```

Invoke it as `/recook` in Claude Code or `$recook` in Codex, or ask to create or improve a skill.

The lint script needs Node 18 or newer. Everything else is plain Markdown.

## Quick start

```text
/recook I keep writing the same weekly status report from my notes. Help me turn that into a skill.
```

Reply "defaults" to the limits questions to accept the standard tier.

## Tiers

| Tier | Round cap | Subagent runs | Time estimate | Cost estimate |
|---|---|---|---|---|
| Light | 2 | 6 | 30 to 60 min | about $1 to $10 |
| Standard | 4 | 16 | 1 to 2 h | about $2 to $20 |
| Deep | 8 | 40 | 2 to 4 h | about $4 to $40 |

These are uncalibrated estimates. See the warning above.

## What is inside

```text
SKILL.md                     the loop the agent follows
references/limits-intake.md  limits questions, tiers, estimates, permissions
references/design-coach.md   fit check and design questions
references/testing.md        the tests and subagent prompts
templates/SKILL-BRIEF.md     the brief
templates/ROUNDS.md          the round ledger
templates/skill-skeleton/    starting layout for the new skill
scripts/check-skill.mjs      structural checks on a draft skill
```

Check a skill folder yourself:

```text
node scripts/check-skill.mjs path/to/your-skill
```

## Safety defaults

- Reads files and writes only inside `recook-run/` unless you grant more.
- Sample tasks run read-only, in a scratch folder, with no network, by default.
- Never installs, pushes or publishes without your permission.
- Never saves keys, tokens or private details in notes or in the new skill.
- Writing notes to an outside app (Obsidian, Notion and similar) needs your permission. The default is local files.

## Credits

ReCook is a fork of **Cook** by Leon Lin ([@LexnLin](https://x.com/LexnLin)), released under the MIT license. Cook is a skill for long, reference-matched visual builds. ReCook borrows its structure (one intake, state files that survive context resets, a ledger, fresh-context critics, an explicit stop check, a short "Never" list) and applies it to building and testing skills. The text and scripts here are new. The original Cook demos and results belong to its author and are not claimed here. This project is not endorsed by the original author.

## License

MIT. See [LICENSE](LICENSE). Original copyright Leon Lin. Changes copyright the ReCook contributors.

This software is provided as is. Estimates in this repo are guidance, not guarantees.

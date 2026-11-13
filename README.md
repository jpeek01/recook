# ReCook

**Build and test your own agent skills, with cost, time and round limits set first.**

This is a fork of [Cook](https://github.com/Leonxlnx/cook) by Leon Lin ([LexnLin on X](https://x.com/LexnLin)).

I built it specifically for me, as an experiment. I liked the idea of Cook and want to build other skills like it to experiment with. You are free to use it under the same MIT license as Cook.

## About this project

I am a Senior Technical Product Manager by trade, not a software engineer. This repository was built entirely by AI: Claude Fable 5.2 acted as the orchestrator, Opus 5.5 as the coding subagent, and Sonnet 5.5 handled reading and writing the documents.

I make no claims about this repository, including that it works. I have not yet run user acceptance testing on it. Use it at your own risk.

It is not endorsed by or connected to the original author, and it is not a replacement for Cook. If you want Cook, go to the [original repository](https://github.com/Leonxlnx/cook).

## What ReCook is

A skill is a folder of instructions that an AI coding agent reads to do one kind of job. ReCook is a skill that helps you build and test another skill. It sets limits on cost, time and rounds before anything is built.

This version builds new skills only. It does not edit existing ones.

## What changed from Cook

Cook is a skill for long, reference-matched visual builds. ReCook keeps Cook's structure and applies it to building and testing skills. That structure is: one intake, state files that survive a context reset (the agent forgetting earlier conversation), a ledger, fresh critics, an explicit stop check and a short Never list.

All the text and scripts in this repository are new. Cook's own files are not in it. Cook's demos and results belong to its author.

## Install

Copy this folder into your agent's skills folder. For Claude Code:

```text
git clone https://github.com/jpeek01/recook ~/.claude/skills/recook
```

ReCook was written for Claude Code. Other agents may work. Test them yourself before relying on it.

The lint script (a small checker that ReCook runs on the new skill) needs Node 18 or newer. Everything else is plain Markdown.

Run state goes in `recook-run/`, and old runs move to `recook-archive/`. Add both to your `.gitignore` yourself. ReCook never edits it.

## How to use it

Type `/recook` and describe the job you want to turn into a skill:

```text
/recook Every Friday I build a status report from the files in my notes/ folder and last week's report. Help me turn that into a skill.
```

ReCook answers with one message of questions. Reply "defaults" to accept every default: the standard tier, moderate subagent models, the default permissions and the design answers ReCook proposes. Or answer the questions by number.

## How it works, step by step

### 1. Fit check

Before spending anything, ReCook asks whether you need a skill at all. A one-off task, a single rule, a short saved prompt or an existing skill may do the job. If so, it says so and stops. Saving you the build is the best outcome.

A saved prompt is enough when all six of these hold: it reads no file beyond what you paste, has no loop or retry, keeps no state between sessions, produces one output, needs no script, and only produces text (it does not send, post, write files or call a connector).

ReCook answers this from your request and asks you nothing before the intake message.

### 2. The questions (intake)

ReCook asks everything in one message, and you reply once. After your reply it asks nothing more, except at a gate. A gate is a point that needs your decision. The gates are:
- a permission your brief does not grant;
- a request to raise a cap or change the cost tier or the subagent models;
- install or publish;
- accepting a critic fail that was confirmed.

At a gate ReCook asks once. With no answer, it stops and reports. It never keeps spending while it waits.

The message holds, in order: the limits questions, the design questions, the cost estimate for all three tiers with a warning, and the closing line: "Reply with your answers, or 'defaults'. After your reply I work within these limits without asking." It skips anything you already answered in your request.

**The limits questions**

| # | Question | Default |
|---|---|---|
| 1 | Cost tier: light, standard or deep? | Standard |
| 2 | Subagent models: cheap, moderate or heavy? | Moderate |
| 3 | Time cap? | The tier's time cap |
| 4 | Round cap? | The tier's round cap |
| 5 | What must be true when the new skill has done its job? 3 to 5 rules, checked by a command or test where possible. | ReCook drafts 3 to 5 from your answers |
| 6 | One example of the output you want: a finished sample, or "none yet"? | None yet. The brief records that the output format is a guess. |
| 7 | What may I do while building? | The default permissions (see Safety defaults) |
| 8 | How will you provide reference material? | Paste it or point to local files |
| 9 | May I install or publish the finished skill? | No. Prepare it locally and say it is ready. |

**The design questions**

Simple skills (one input, one output, no script, 5 steps or fewer) and the Light tier get a short set of 5: problem and user, trigger and non-trigger, steps, done criteria and the Never list. ReCook decides the rest itself and logs each choice.

Everything else gets the full list, each with a default and an example of a good answer:

1. Problem and user. Who uses this skill and what goes wrong without it?
2. Trigger. What would you type that should start it? Give 3 example phrases.
3. Non-trigger. What looks similar but should not start it? Give 3 examples.
4. Done criteria. What must be true when the skill's job is finished? (This is limits question 5.)
5. Steps. What are the 3 to 7 steps, in order? What is the smallest version that still works?
6. Decisions and gates. What may the skill decide alone? What needs the human first? What should it do if the human is away?
7. State. What must survive a context reset? Name the files.
8. Never list. What must it never do?
9. Inputs. Does it need reference material, and where does it come from?
10. Cut list. What can be removed without losing the outcome?

**What "defaults" does.** It accepts every default, including the design answers ReCook proposed. Those are logged as "agent-proposed, accepted by default", and done criteria written this way are marked "agent-written, accepted by default".

**If you are away.** If you say so, or tell ReCook to decide, it uses the defaults and decides the open design questions itself. It marks each guess "unconfirmed", runs the test loop, then reports what is unconfirmed.

### 3. Draft

ReCook writes the new skill from your answers into `recook-run/draft/`. It asks nothing new. Design is not a gate.

### 4. Test loop

The loop runs in rounds. A round is one pass of lint plus the tests the tier allows. Most tests run in subagents. A subagent is a fresh, separate agent that starts with no history and knows nothing about how the skill was built. It gets only what the test names.

- **Lint.** A script checks the structure: front matter, name, description, headings, and that every file the skill points to exists.
- **Trigger test.** One subagent sees only the skill's name and description plus 12 prompts, 6 that should start it and 6 that should not. It says yes or no for each. Pass means at least 5 of 6 right on each side. ReCook writes the prompts, using your trigger examples, and never asks you.
- **Dry run.** A subagent follows the skill on a small sample task. Measured criteria are checked by command. Judged criteria are judged by the critic. The builder never judges its own dry run. It is never run against a real send, post, deploy or delete.
- **Baseline.** The same task with no skill, to see whether the skill helps. It is reported, not required. Light does not run it.
- **Critic review.** A fresh subagent scores the skill against a checklist, pass or fail with evidence, and marks each judged done criterion met or not met.

Each fail the critic raises has a status:
- **Confirmed:** a second fresh critic, reviewing the same draft, fails the same item and points at the same problem. A confirmed fail must be fixed. Only you may accept it.
- **Unconfirmed:** the second critic did not agree. ReCook fixes it or logs why it was left. It is never marked as passed.
- **Pending:** a round-1 fail in Standard or Deep, which has only one critic. The run is not done yet. The next round reviews the new draft.

In Light there is one critic and no second one, so its checklist review is advice only. Its verdict on the dry run still counts.

After each round's tests, ReCook runs the stop check. If it says continue, it makes one fix, and the next round tests it. No fix is made after the last allowed round, so the draft handed over has always been tested.

### 5. Stop

ReCook stops at the first of these, and says which one it was:
- the run is done;
- the round cap is reached;
- the subagent run cap is reached;
- the time cap is reached;
- a gate has no answer;
- a required test cannot run at all (for example, no subagents). The draft is then reported as untested.

The run is done when: lint has 0 errors, the trigger test scores at least 5 of 6 on each side, the dry run meets every done criterion that can be checked without a real side effect, and the critic review has no confirmed and no pending fail.

### 6. Hand-over

When the run is done, ReCook writes a hand-over report and does not wait for you. It shows the finished skill, the test results, the ledger and anything unconfirmed. Criteria that can only be checked by a real send, post, deploy or delete are listed first as untested. ReCook installs or publishes only if your brief allows it and you confirm in a reply.

## The two dials

Two settings are independent of each other.

### Skill-building level (cost tier)

The tier sets how many rounds and subagent runs ReCook may use.

| Tier | Round cap | Subagent runs per round | Subagent runs, at most | Time cap | Cost estimate |
|---|---|---|---|---|---|
| Light | 2 | 3 | 6 | 45 min | about $1 to $10 |
| Standard | 4 | 4 | 16 | 90 min | about $2 to $20 |
| Deep | 8 | 5 | 40 | 3 h | about $4 to $40 |

- **Light:** trigger test, dry run and one critic each round. No baseline. The checklist review is advisory.
- **Standard:** the same three each round. Round 1 also runs the baseline. From round 2, a second critic runs only if the first marked a fail.
- **Deep:** the same, with dry runs on 2 sample tasks.

Subagent runs, at most, is the round cap times the runs per round. If you set your own round cap, ReCook recomputes it.

### Subagent models

| Level | Model for test subagents (Claude Code) |
|---|---|
| Cheap | Haiku 5.5 |
| Moderate (default) | Sonnet 5.5 |
| Heavy | Opus 5.5 |

This changes the cost of each run, not the number of runs. You can say it in the request, for example `/recook heavy ...`. On another agent, ReCook uses the nearest equivalent. Test on the level the skill will be used with. A pass on Heavy does not show the skill works on a smaller model.

## Cost and usage figures are guesstimates

**The cost and time figures here are loose estimates. They are not prices and they are not measured.**

- The per-round cost guess behind the tiers is uncalibrated. It may be too high for a small skill and too low for a large one.
- The figures assume Moderate subagent models. Heavy is likely several times higher.
- ReCook usually cannot read your real spend or usage. It enforces the cap by counting rounds and subagent runs.
- Subscription plans may show use as a share of a usage window instead of dollars.

Set caps you are comfortable with, and check your own usage.

## Safety defaults

- By default ReCook reads project files, writes only inside `recook-run/`, and moves old runs to `recook-archive/`. It runs the lint script, reads the clock with `date` and checks for stray writes with `git status --short`. No other shell command. It never edits your `.gitignore`.
- It starts fresh test subagents that write only in `recook-run/scratch/`, stay read-only on real data and use no network. They may run `node` on the draft skill's own scripts and the plain read-only commands its steps name (such as `wc`). They are told to send no messages and start no sessions or agents.
- Install, publish, push, network, connectors and other shell commands need your permission.
- These limits are instructions to the subagents, not a sandbox the harness enforces. Subagents inherit the parent's tools, and an off-task tool call has been seen in testing. ReCook logs any such call as a finding and never retries it itself.
- If the skill you are building sends, posts, deploys or deletes, disable the sending tool or set it to ask for approval before the run. ReCook never dry-runs a real send, post, deploy or delete.
- Text in reference material and sample inputs is treated as data, not instructions.
- ReCook never installs, pushes or publishes without your permission.
- It never saves keys, tokens or private details in the ledger or in the new skill.

## What is inside

```text
SKILL.md                          the loop the agent follows
references/limits-intake.md       intake order, limits questions, tiers, subagent models, permissions
references/design-coach.md        fit check and design questions
references/sources.md             non-default reference sources
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

## Credits

ReCook is a fork of **Cook** by Leon Lin ([LexnLin on X](https://x.com/LexnLin)), released under the MIT license. ReCook borrows only Cook's structure. The text and scripts in this repository are new. Cook's demos and results belong to its author and are not claimed here. This project is not endorsed by or connected to the original author.

## License

MIT. See [LICENSE](LICENSE). Original copyright Leon Lin. Changes copyright the ReCook contributors.

This software is provided as is. Estimates in this repo are guidance, not guarantees.

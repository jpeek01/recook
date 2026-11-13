# Limits intake

One message, every open question, a default for each. The user should be able to answer in a couple of minutes, or reply "defaults". After this you do not ask again, except to request a permission the brief does not grant.

Before you ask: read what the user already gave you (the prompt, files, a filled brief). Do not ask what is answered. If the user says they are leaving ("decide everything"), use the defaults, record them in BRIEF.md and start.

## Questions and defaults

| # | Question | Default |
|---|---|---|
| 1 | Cost tier: light, standard or deep? | Standard |
| 2 | Time cap? | The tier's time estimate |
| 3 | Round cap? | The tier's round cap |
| 4 | What does done look like? Rules a command or a test can check. | Required. Help the user write 3 to 5 (see design-coach.md). |
| 5 | If you are away when I need a decision? | Stop and report. Do not keep spending. |
| 6 | What may I do while building? | Read files and write inside `recook-run/` only. |
| 7 | How will you provide reference material? | Paste it or point to local files. |
| 8 | Where should I save notes and the ledger? | Local files in `recook-run/` |
| 9 | May I install or publish the finished skill? | No. Prepare it locally and say it is ready. |

End with: "Anything else, tell me now. After this I work within these limits without asking."

## Tiers

Rounds, subagent runs and time are the real caps. Cost is derived from them.

| Tier | Round cap | Subagent runs, at most | Time estimate | Cost estimate |
|---|---|---|---|---|
| Light | 2 | 6 | 30 to 60 min | about $1 to $10 |
| Standard | 4 | 16 | 1 to 2 h | about $2 to $20 |
| Deep | 8 | 40 | 2 to 4 h | about $4 to $40 |

How the cost figure is made: rounds x a guessed $0.50 to $5 per round, covering the building work and the test subagents around it. The per-round guess is **uncalibrated**. It will be too high for small skills on a small model and too low for large skills on a large model. It is not measured from the user's account.

Always show this warning with the figures:

> These are rough estimates, not prices. Mileage may vary with your model, plan and the size of the skill. Subscription plans may show use as a share of a usage window instead of dollars. I count rounds and subagent runs, and stop at the cap you set.

Ask which model and plan the user runs on. If they give a per-round cost from their own experience, use it instead and note it in BRIEF.md.

The agent usually cannot read real spend. So the cost cap is enforced by counting rounds and subagent runs, not by reading a bill. If the harness offers a usage readout, check it at each round boundary and stop early if it disagrees badly with the estimate.

## Time cap

- Start time goes in BRIEF.md. Read the clock at each round boundary.
- Plan rounds to finish before the cap with time left for the final log and report.
- There is no minimum time. Finishing early when the criteria are met is correct.
- Warn: "Time is an estimate. Test runs can be slower than expected."

## Reference material

Ask how the user will provide material the skill should be based on. Offer what is actually available. Check which connectors or tools the harness has rather than assuming, and say plainly when one is not connected.

| Source | Handling |
|---|---|
| Pasted text or local files | Copy or note paths in BRIEF.md. |
| A GitHub repo | Read-only, note the repo and what to use from it. |
| A URL | Fetch only if BRIEF.md allows network access. |
| Figma, Notion, Drive or similar | Use the connector if present. If not, ask the user to export or paste. |
| A database | Read-only, a named table or query, no writes. Never use production credentials without an explicit permission. |
| None yet | Say "no references" in BRIEF.md. The design questions carry the run. |

Rules: record where each source came from. Use read access only unless the user says otherwise. Never copy secrets from a source into the brief, ledger or the new skill.

## Notes destination

Ask where to save the ledger and design notes: local files (default), an Obsidian vault, Notion, another second-brain tool, or nowhere.
- Writing to an outside app is an action. It needs a permission in BRIEF.md.
- If the tool is not connected, fall back to local files and say so.
- Never save secrets, tokens or private data in notes.

## Permissions

List what the user allows, one line each, in BRIEF.md: read project files, write outside `recook-run/`, run shell commands, use the network, use connectors (which ones), download, install the finished skill, publish or push. Anything not listed is not allowed. When a step needs something unlisted, stop and ask once.

## Adapting

- Light: design questions in one pass, one test round.
- Standard: the full flow within the round cap.
- Deep: run more than one sample task and use more than one critic per round.

Pick the mode from the tier. If the user changes the tier mid-run, update BRIEF.md and say what changed.

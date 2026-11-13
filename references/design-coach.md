# Design coach

The goal is a small skill that does one job well. Ask a few questions at a time. For each, give a default and an example of a good answer. Keep the user's words.

## Fit check (step 0)

Ask: what problem keeps repeating, and what do you do about it today?

A skill is worth building when the same multi-step job comes back and the agent needs durable instructions, files or a loop. Otherwise suggest the simpler option and stop:
- One-off task: just do it.
- A preference or rule: one line in the project's instruction file.
- A short reusable prompt: save the prompt.
- An existing skill already covers it: use or extend that one.

Say plainly when a skill is not needed. Saving the user the build is the best outcome.

## Design questions

Ask in this order. Skip what is already answered.

1. **Problem and user.** Who uses this skill and what goes wrong without it?
2. **Trigger.** What would the user type that should start it? Give 3 example phrases.
3. **Non-trigger.** What looks similar but should not start it? Give 3 examples.
4. **Done criteria.** What must be true when the skill's job is finished? Prefer rules a command or test can check ("the file exists and passes the linter"). Judged criteria are allowed but must be labelled as judged.
5. **Steps.** What are the 3 to 7 steps, in order? What is the smallest version that still works?
6. **Decisions and gates.** What may the skill decide alone? What needs the human before it continues? What should it do if the human is away?
7. **State.** What must survive a context reset? Name the files.
8. **Never list.** What must it never do? Keep it to the real dangers.
9. **Inputs.** Does it need reference material, and where does it come from?
10. **Cut list.** What can be removed without losing the outcome?

## Writing good done criteria

Convert vague goals into observable ones.

| Vague | Observable |
|---|---|
| Works well | Passes all 6 should-trigger prompts and none of the 6 should-not-trigger prompts |
| Is clear | The main file is under 120 lines and every referenced file exists |
| Is useful | On the sample task it beats the no-skill baseline on criterion 2 |

Aim for 3 to 5 criteria. Label each "measured" (a command checks it) or "judged" (a person or model decides).

## Simplicity rules

- The main `SKILL.md` stays short. Put detail in `references/` and say when to read each file.
- The description is the trigger. Make it specific, short and say when not to use it.
- Prefer a script for anything that can be computed. Prefer a sentence for everything else.
- Do not add a loop, ledger or critic unless the task needs repeated judgment. Many skills are just a good prompt plus a checklist.
- Skills the user will share need a plain README and a license.

## Safety defaults for the new skill

Every generated skill should state:
- what permissions it needs
- what it must not do without asking
- where it writes
- what happens when the user is absent

If the skill will run unattended, require a time, round or cost cap in its own brief.

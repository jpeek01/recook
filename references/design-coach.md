# Design coach

The goal is a small skill that does one job well. The design questions are part of the intake: ask them in the same sitting, right after the limits questions and before the closing line (see `limits-intake.md`). Ask a few at a time. For each, give a default and an example of a good answer. Keep the user's words.

## Fit check (step 0)

Ask: what problem keeps repeating, and what do you do about it today?

A skill is worth building when the same multi-step job comes back and the agent needs durable instructions, files or a loop. Otherwise suggest the simpler option and stop:
- One-off task: just do it.
- A preference or rule: one line in the project's instruction file.
- A short reusable prompt: save the prompt.
- An existing skill already covers it: use that one. ReCook does not edit existing skills.

Test for a saved prompt. A saved prompt is enough when all five hold:
1. It reads no file from disk beyond what the user pastes.
2. It has no loop or retry.
3. It keeps no state between sessions.
4. It produces one output.
5. It needs no script.

If all five hold, say so, stop, and offer the prompt. If the user is away, stop and report "a saved prompt is enough". Do not build. If any one fails, a skill is justified.

Say plainly when a skill is not needed. Saving the user the build is the best outcome.

## Short path

A skill is simple when it has one input, one output, no script, and 5 steps or fewer. The Light tier always uses the short path.

If the fit check passes and the skill is simple, or the tier is Light, ask only these 5:
1. Problem and user (question 1 below).
2. Trigger and non-trigger (questions 2 and 3).
3. Steps (question 5).
4. Done criteria (question 4).
5. Never list (question 8).

Decide the rest yourself and log each choice in the ledger's Decisions list.

## Design questions

Ask in this order. Skip what is already answered.

1. **Problem and user.** Who uses this skill and what goes wrong without it?
2. **Trigger.** What would the user type that should start it? Give 3 example phrases.
3. **Non-trigger.** What looks similar but should not start it? Give 3 examples.
4. **Done criteria.** What must be true when the skill's job is finished? This is limits question 4. If the answer there is vague, turn it into observable rules here with the guide below. Default: you draft 3 to 5.
5. **Steps.** What are the 3 to 7 steps, in order? What is the smallest version that still works?
6. **Decisions and gates.** What may the skill decide alone? What needs the human before it continues? What should it do if the human is away?
7. **State.** What must survive a context reset? Name the files.
8. **Never list.** What must it never do? Keep it to the real dangers.
9. **Inputs.** Does it need reference material, and where does it come from?
10. **Cut list.** What can be removed without losing the outcome?

If the user is away, follow SKILL.md step 1.

## Writing good done criteria

Convert vague goals into observable ones.

| Vague | Observable |
|---|---|
| Works well | Passes all 6 should-trigger prompts and none of the 6 should-not-trigger prompts |
| Is clear | The main file is under 120 lines and every referenced file exists |
| Is useful | On the sample task it beats the no-skill baseline on criterion 2 |

Aim for 3 to 5 criteria. Label each "measured" (a command checks it) or "judged" (a person or model decides).

Then read the criteria together. Check that no two can conflict with each other or with the steps. Example of a conflict: one criterion says "exactly these sections" and another says "plus an Unclear section". Fix any conflict before you write BRIEF.md.

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

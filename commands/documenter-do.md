---
description: Route a freeform documentation request to the right sub-workflow. Use when the user asks something like "add a chapter for the login screen", "re-capture screenshots", "regenerate diagrams", "update the PDF", or any other partial-pipeline request. Never does the work itself — always delegates.
argument-hint: "<freeform request>"
allowed-tools: Read, Grep, Glob, Bash, Write, Task, AskUserQuestion
model: sonnet
---

@${CLAUDE_PLUGIN_ROOT}/workflows/do.md

---
description: Generate an end-user manual for the current project (web or Flutter). Use this command when the user says "generate docs", "create a manual", "document this project", "write a user guide", or "make a PDF manual". Runs the full pipeline: code analysis → screenshots → diagrams → prose drafting → multi-format rendering.
argument-hint: "[end-user|admin|power-user] [--format md|pdf|latex|html|all] [--style typst|eisvogel] [--src <relative-path>]"
allowed-tools: Read, Grep, Glob, Bash, Write, Task, AskUserQuestion
model: sonnet
---

@${CLAUDE_PLUGIN_ROOT}/workflows/document.md

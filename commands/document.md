---
description: Generate an end-user manual for the current Flutter project. Use this command when the user says "generate docs", "create a manual", "document this project", or "write a user guide". Runs the full pipeline: code analysis → screenshots → diagrams → prose drafting. Output is a folder of cross-linked Markdown files.
argument-hint: "[end-user|admin|power-user] [--src <relative-path>]"
allowed-tools: Read, Grep, Glob, Bash, Write, Task, AskUserQuestion
model: sonnet
---

@${CLAUDE_PLUGIN_ROOT}/workflows/document.md

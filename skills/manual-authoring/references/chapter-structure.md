# Chapter Structure

## Top-level manual structure

```
# <Project Name> — User Manual

> Brief one-line description of the product.

## Table of Contents
- [Getting Started](#getting-started)
- [<Chapter 1>](#chapter-1)
- …
- [How to: <Journey 1>](#how-to-journey-1)
- …
- [Troubleshooting](#troubleshooting)
- [Getting Help](#getting-help)

## Getting Started
…

## <Chapter Group 1>
…

## How to: <Journey Name>
…

## Troubleshooting
…

## Getting Help
…
```

## Per-chapter structure (one chapter = one logical feature group)

```
## <Chapter Title>

One sentence: what this section covers.

### <Screen/Route Title>

One sentence: what this screen is for.

![<Screen Title>](screenshots/web/<id>.png)

**To <primary action>:**

1. Go to **<screen name>**.
2. Click **<element>**.
3. …

> **Tip:** <non-obvious note>

**Fields on this screen:**

| Field | What to enter |
|-------|---------------|
| Email | Your account email address |
| Password | Your password (at least 8 characters) |
```

## Journey section structure

```
## How to: <Journey Name>

<One sentence describing the goal>

![<Journey Name> flow](diagrams/<journey-id>.svg)

1. **<Step name>** — <what the user does>
2. …

After completing this, you will see <expected outcome>.
```

## Heading hierarchy rules

- H1 (`#`) — document title only, once
- H2 (`##`) — chapter or major section
- H3 (`###`) — individual screen or sub-feature within a chapter
- H4 (`####`) — rare, only for deeply nested content; prefer restructuring instead

Never skip levels (e.g. H2 → H4).

## Screenshot rules

- Every screen that has a form or primary action should have a screenshot.
- Image immediately after the H3 heading, before any prose.
- Alt text = screen title (exact match to H3 heading).
- Caption (italic line below) = one sentence describing what the user is looking at.

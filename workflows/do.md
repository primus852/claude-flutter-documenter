# /documenter-do — Router Workflow

This workflow routes a freeform user request to the right sub-workflow.
Never do the work itself. Always delegate.

---

## Routing table

Parse the user's freeform text (`$ARGUMENTS`) and route to the best-matching sub-workflow:

| If the request mentions... | Route to |
|---------------------------|----------|
| "screenshot", "capture", "photo", "re-take" | Run `screenshot-orchestrator` agent only |
| "diagram", "flowchart", "chart", "redraw" | Run `diagram-designer` agent only |
| "chapter", "section", "update", "rewrite", "add", "fix prose" | Run `manual-drafter` agent with targeted chapter |
| "render", "PDF", "LaTeX", "export", "generate PDF" | Run Step 7 of `document.md` (render only) |
| "analyze", "re-analyze", "routes", "re-scan" | Run Step 3 of `document.md` (code-cartographer only) |
| "full run", "redo everything", "start over" | Run all 7 steps of `document.md` |
| unclear | Ask: "What would you like to update? (screenshots / diagrams / a chapter / re-render / full run)" |

---

## Executing the routed action

After routing:
1. Confirm what you're about to do in one sentence.
2. Execute the relevant agent or workflow step.
3. Report result.

Example:
> User: "re-capture screenshots for the dashboard"
> Response: "Re-running screenshot capture for the dashboard route."
> → spawn `screenshot-orchestrator` with `ROUTES_FILTER=["dashboard"]`

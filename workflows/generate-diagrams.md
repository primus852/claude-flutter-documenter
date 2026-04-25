# generate-diagrams — Sub-workflow

Used by `diagram-designer` agent.

## Process

1. Read `DOCS_DIR/analysis/journeys.json` and `routes.json`.
2. For each journey, choose diagram type (flowchart LR or TD; sequenceDiagram for request flows).
3. Write `.mmd` source files.
4. Run `mmdc` batch rendering to SVG.
5. Write `overview.mmd` + `overview.svg` (full app navigation map).
6. If `mmdc` is not found: print install instructions and leave `.mmd` files in place — Mermaid blocks can still be rendered in the Markdown output.

# /documenter-help — Reference

Print this reference verbatim.

---

## flutter-doc — Command Reference

### Commands

| Command | Description |
|---------|-------------|
| `/flutter-doc:document` | Full pipeline: analyze → screenshots → diagrams → draft |
| `/flutter-doc:document end-user` | Full pipeline, audience = end-user (default) |
| `/flutter-doc:document admin` | Full pipeline, audience = admin |
| `/flutter-doc:document power-user` | Full pipeline, audience = power-user |
| `/flutter-doc:document --src lib` | Scope analysis to a specific subfolder |
| `/flutter-doc:do "<text>"` | Route a freeform request to the right sub-workflow |
| `/flutter-doc:help` | Show this reference |

### Audience options

| Audience | Reading level |
|----------|--------------|
| `end-user` | Plain language, step-by-step, screenshot every screen |
| `admin` | Technical, includes config and permissions |
| `power-user` | Expert, leads with shortcuts and advanced features |

### Output location

All artifacts land in `<your-project>/.documenter/`:
```
.documenter/
├── analysis/routes.json
├── analysis/journeys.json
├── analysis/manifest.yaml
├── screenshots/<route-id>.png
├── diagrams/<journey-id>.mmd
├── diagrams/<journey-id>.svg      (if mmdc is installed)
└── manual/
    ├── index.md                   ← start here
    ├── chapters/<chapter-id>.md
    ├── journeys/<journey-id>.md
    ├── troubleshooting.md
    └── getting-help.md
```

### Config file

`.documenter/config.json` is created on first run and can be edited:
```json
{
  "projectName": "My App",
  "audience": "end-user",
  "version": "1.0",
  "contactEmail": "support@example.com",
  "contactUrl": "https://help.example.com"
}
```

### System dependencies

```bash
brew install mermaid-cli   # optional — enables SVG diagram rendering
npm install                # in claude-flutter-documenter repo
```

Run `${CLAUDE_PLUGIN_ROOT}/scripts/install-deps.sh` to install automatically.

Flutter itself must be installed separately: https://docs.flutter.dev/get-started/install

### Support

File issues: https://github.com/primus852/claude-flutter-documenter/issues

#!/usr/bin/env node
'use strict';

const path = require('path');
const args = process.argv.slice(2);
const subcommand = args[0];

const PLUGIN_ROOT = path.resolve(__dirname, '..');

const commands = {
  'analyze-web': () => require('./lib/routes-web.cjs').run(args.slice(1)),
  'analyze-flutter': () => require('./lib/routes-flutter.cjs').run(args.slice(1)),
  'screenshot-web': () => require('./lib/playwright-runner.cjs').run(args.slice(1)),
  'screenshot-flutter': () => require('./lib/flutter-screenshot.cjs').run(args.slice(1)),
  'diagrams': () => require('./lib/mermaid-render.cjs').run(args.slice(1)),
  'render': () => require('./lib/pandoc-render.cjs').run(args.slice(1)),
  'manifest': () => require('./lib/manifest.cjs').run(args.slice(1)),
  'help': () => printHelp(),
};

if (!subcommand || !commands[subcommand]) {
  printHelp();
  process.exit(subcommand ? 1 : 0);
}

commands[subcommand]();

function printHelp() {
  console.log(`
documenter — claude-documenter CLI

Usage: documenter <command> [args]

Commands:
  analyze-web <root>              Extract routes/forms/buttons from a web project
  analyze-flutter <root>          Extract routes/screens from a Flutter project
  screenshot-web <spec>           Run a Playwright spec to capture web screenshots
  screenshot-flutter <route>      Capture a Flutter screenshot via flutter screenshot
  diagrams <journeys.json>        Render Mermaid diagrams from journeys.json
  render <manual.md> <fmt> [style]  Render manual to PDF/LaTeX/HTML via Pandoc
  manifest <docs-dir>             Read/write the screenshot manifest YAML
  help                            Show this help

Formats: md | pdf | latex | html | all
Styles:  typst (default) | eisvogel
  `);
}

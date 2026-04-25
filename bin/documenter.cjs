#!/usr/bin/env node
'use strict';

const path = require('path');
const args = process.argv.slice(2);
const subcommand = args[0];

const PLUGIN_ROOT = path.resolve(__dirname, '..');

const commands = {
  'analyze-flutter':    () => require('./lib/routes-flutter.cjs').run(args.slice(1)),
  'screenshot-flutter': () => require('./lib/flutter-screenshot.cjs').run(args.slice(1)),
  'diagrams':           () => require('./lib/mermaid-render.cjs').run(args.slice(1)),
  'manifest':           () => require('./lib/manifest.cjs').run(args.slice(1)),
  'help':               () => printHelp(),
};

if (!subcommand || !commands[subcommand]) {
  printHelp();
  process.exit(subcommand ? 1 : 0);
}

commands[subcommand]();

function printHelp() {
  console.log(`
documenter — claude-flutter-documenter CLI

Usage: documenter <command> [args]

Commands:
  analyze-flutter <root>          Extract routes/screens from a Flutter project
  screenshot-flutter <route>      Capture a Flutter screenshot via flutter screenshot
  diagrams <journeys.json>        Render Mermaid diagrams to SVG from journeys.json
  manifest <docs-dir>             Read/write the screenshot manifest YAML
  help                            Show this help
  `);
}

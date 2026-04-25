'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run([specFile]) {
  if (!specFile) {
    console.error('Usage: documenter screenshot-web <playwright.spec.ts>');
    process.exit(1);
  }

  const spec = path.resolve(specFile);
  if (!fs.existsSync(spec)) {
    console.error(`ERROR: Spec file not found: ${spec}`);
    process.exit(1);
  }

  const cwd = path.dirname(spec);

  // Check for Playwright installation
  try {
    execSync('npx playwright --version', { stdio: 'ignore', cwd });
  } catch {
    console.error('ERROR: Playwright not found. Run: npm install in the claude-documenter directory.');
    process.exit(1);
  }

  console.log(`Running Playwright spec: ${spec}`);
  const res = spawnSync('npx', ['playwright', 'test', spec, '--reporter=list'], {
    cwd,
    stdio: 'inherit',
    encoding: 'utf8',
  });

  if (res.status !== 0) {
    console.warn('⚠ Playwright run completed with errors. Some screenshots may be missing.');
  } else {
    console.log('✓ Playwright screenshots captured.');
  }
}

module.exports = { run };

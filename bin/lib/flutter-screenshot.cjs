'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run([targetRoot, routeId, routePath, outDir]) {
  if (!targetRoot) {
    console.error('Usage: documenter screenshot-flutter <project-root> <route-id> <route-path> <output-dir>');
    process.exit(1);
  }

  const root = path.resolve(targetRoot);
  const outputDir = path.resolve(outDir || path.join(root, '.documenter', 'screenshots', 'flutter'));
  fs.mkdirSync(outputDir, { recursive: true });

  // Check flutter is available
  try {
    execSync('flutter --version', { stdio: 'ignore', cwd: root });
  } catch {
    console.error('ERROR: flutter not found on PATH.');
    process.exit(1);
  }

  // Check for connected device
  const devicesResult = spawnSync('flutter', ['devices', '--machine'], {
    cwd: root, encoding: 'utf8', stdio: 'pipe',
  });

  let devices = [];
  try { devices = JSON.parse(devicesResult.stdout || '[]'); } catch {}

  if (devices.length === 0) {
    console.warn('⚠ No Flutter devices connected.');
    console.warn('  Start an emulator: flutter emulators --launch <emulator-id>');
    console.warn('  Or place screenshots manually in:', outputDir);
    process.exit(0);
  }

  const device = devices[0];
  console.log(`Using device: ${device.name} (${device.id})`);

  const outFile = path.join(outputDir, `${routeId || 'screen'}.png`);

  // Navigate via deep link if route provided
  if (routePath) {
    console.log(`Navigating to route: ${routePath}`);
    // Try ADB deep link (Android)
    if (device.targetPlatform && device.targetPlatform.includes('android')) {
      const deepLinkResult = spawnSync('adb', [
        '-s', device.id, 'shell', 'am', 'start',
        '-W', '-a', 'android.intent.action.VIEW',
        '-d', `app:/${routePath}`,
      ], { stdio: 'pipe', encoding: 'utf8' });
      if (deepLinkResult.status !== 0) {
        console.warn('  ⚠ ADB deep link failed — navigate manually and retry');
      }
    }
    // Wait for navigation
    execSync('sleep 2');
  }

  // Capture screenshot
  const res = spawnSync('flutter', ['screenshot', '--out', outFile], {
    cwd: root, stdio: 'pipe', encoding: 'utf8',
  });

  if (res.status === 0) {
    console.log(`✓ Screenshot saved: ${outFile}`);
  } else {
    console.warn(`⚠ flutter screenshot failed: ${res.stderr}`);
    process.exit(1);
  }
}

module.exports = { run };

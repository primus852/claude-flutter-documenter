'use strict';

const fs = require('fs');
const path = require('path');
let yaml;

function loadYaml() {
  if (!yaml) yaml = require('js-yaml');
}

async function run([docsDir, ...args]) {
  loadYaml();
  if (!docsDir) {
    console.error('Usage: documenter manifest <docs-dir>');
    process.exit(1);
  }

  const dir = path.resolve(docsDir);
  const manifestPath = path.join(dir, 'analysis', 'manifest.yaml');
  const routesPath = path.join(dir, 'analysis', 'routes.json');

  if (!fs.existsSync(routesPath)) {
    console.error('ERROR: routes.json not found. Run analyze-web or analyze-flutter first.');
    process.exit(1);
  }

  const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

  // Build manifest from discovered screenshots
  const existing = loadExisting(manifestPath);
  const updated = buildManifest(routes, dir, existing);

  fs.writeFileSync(manifestPath, yaml.dump({ screenshots: updated }, { lineWidth: 120 }));
  console.log(`✓ manifest.yaml: ${updated.length} entries`);
}

function loadExisting(manifestPath) {
  loadYaml();
  if (!fs.existsSync(manifestPath)) return [];
  try {
    const parsed = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
    return (parsed && parsed.screenshots) ? parsed.screenshots : [];
  } catch { return []; }
}

function buildManifest(routes, docsDir, existing) {
  const existingMap = Object.fromEntries(existing.map(e => [e.id, e]));
  const result = [];

  for (const route of routes) {
    const webFile = path.join('screenshots', 'web', `${route.id}.png`);
    const flutterFile = path.join('screenshots', 'flutter', `${route.id}.png`);

    const webExists = fs.existsSync(path.join(docsDir, webFile));
    const flutterExists = fs.existsSync(path.join(docsDir, flutterFile));

    if (webExists) {
      result.push({
        ...existingMap[route.id] || {},
        id: route.id,
        type: 'web',
        file: webFile,
        caption: existingMap[route.id]?.caption || `The ${route.title} screen.`,
        route: route.path,
      });
    }
    if (flutterExists) {
      result.push({
        ...existingMap[`${route.id}-flutter`] || {},
        id: `${route.id}-flutter`,
        type: 'flutter',
        file: flutterFile,
        caption: existingMap[`${route.id}-flutter`]?.caption || `The ${route.title} screen (Flutter).`,
        route: route.path,
      });
    }
  }

  // Preserve manually added entries that don't match any route
  for (const entry of existing) {
    if (!result.find(r => r.id === entry.id)) {
      result.push(entry);
    }
  }

  return result;
}

module.exports = { run };

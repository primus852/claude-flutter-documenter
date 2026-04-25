'use strict';

const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run([journeysFile]) {
  if (!journeysFile) {
    console.error('Usage: documenter diagrams <docs-dir/analysis/journeys.json>');
    process.exit(1);
  }

  const journeysPath = path.resolve(journeysFile);
  if (!fs.existsSync(journeysPath)) {
    console.error(`ERROR: Not found: ${journeysPath}`);
    process.exit(1);
  }

  const docsDir = path.resolve(path.dirname(journeysPath), '..');
  const diagramsDir = path.join(docsDir, 'diagrams');
  fs.mkdirSync(diagramsDir, { recursive: true });

  const routesPath = path.join(path.dirname(journeysPath), 'routes.json');
  const journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
  const routes = fs.existsSync(routesPath) ? JSON.parse(fs.readFileSync(routesPath, 'utf8')) : [];
  const routeMap = Object.fromEntries(routes.map(r => [r.id, r]));

  const hasMmdc = hasCommand('mmdc');
  if (!hasMmdc) {
    console.warn('⚠ mmdc not found. Mermaid .mmd files will be written but not rendered to SVG.');
    console.warn('  Install: brew install mermaid-cli');
  }

  let rendered = 0;
  let skipped = 0;

  // Per-journey diagrams
  for (const journey of journeys) {
    const mmd = buildFlowchart(journey, routeMap);
    const mmdPath = path.join(diagramsDir, `${journey.id}.mmd`);
    const svgPath = path.join(diagramsDir, `${journey.id}.svg`);
    fs.writeFileSync(mmdPath, mmd);

    if (hasMmdc) {
      const res = spawnSync('mmdc', ['-i', mmdPath, '-o', svgPath, '-b', 'transparent'], {
        stdio: 'pipe', encoding: 'utf8',
      });
      if (res.status === 0) rendered++;
      else { skipped++; console.warn(`  ⚠ mmdc failed for ${journey.id}: ${res.stderr}`); }
    } else {
      skipped++;
    }
  }

  // Overview diagram — all routes and their nav links
  if (routes.length > 0) {
    const overviewMmd = buildOverview(routes);
    const mmdPath = path.join(diagramsDir, 'overview.mmd');
    const svgPath = path.join(diagramsDir, 'overview.svg');
    fs.writeFileSync(mmdPath, overviewMmd);

    if (hasMmdc) {
      const res = spawnSync('mmdc', ['-i', mmdPath, '-o', svgPath, '-b', 'transparent'], {
        stdio: 'pipe', encoding: 'utf8',
      });
      if (res.status === 0) rendered++;
      else skipped++;
    } else {
      skipped++;
    }
  }

  console.log(`✓ Diagrams: ${rendered} rendered to SVG, ${skipped} .mmd only`);
}

function buildFlowchart(journey, routeMap) {
  const lines = ['flowchart LR'];
  journey.steps.forEach((step, i) => {
    const route = routeMap[step.route_id] || { title: step.route_id, path: '' };
    const label = `${route.title}\\n${route.path || ''}`.replace(/"/g, "'");
    const nodeId = `N${i}`;
    const isLast = i === journey.steps.length - 1;
    const color = i === 0 ? 'fill:#4f86f7,color:#fff,stroke:none'
                : isLast ? 'fill:#22c55e,color:#fff,stroke:none'
                : 'fill:#94a3b8,color:#fff,stroke:none';
    lines.push(`  ${nodeId}["${label}"]`);
    lines.push(`  style ${nodeId} ${color}`);
    if (i > 0) lines.push(`  N${i - 1} --> ${nodeId}`);
  });
  return lines.join('\n');
}

function buildOverview(routes) {
  const lines = ['flowchart LR'];
  const nodeIds = {};
  routes.slice(0, 20).forEach((r, i) => { // cap at 20 nodes for readability
    const nodeId = `R${i}`;
    nodeIds[r.path] = nodeId;
    const label = r.title.replace(/"/g, "'");
    lines.push(`  ${nodeId}["${label}"]`);
    lines.push(`  style ${nodeId} fill:#4f86f7,color:#fff,stroke:none`);
  });
  for (const r of routes.slice(0, 20)) {
    const fromId = nodeIds[r.path];
    if (!fromId) continue;
    for (const link of (r.nav_links || []).slice(0, 3)) {
      const toId = nodeIds[link];
      if (toId && toId !== fromId) lines.push(`  ${fromId} --> ${toId}`);
    }
  }
  return lines.join('\n');
}

function hasCommand(cmd) {
  try { execSync(`which ${cmd}`, { stdio: 'ignore' }); return true; }
  catch { return false; }
}

module.exports = { run };

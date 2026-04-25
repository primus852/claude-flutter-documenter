'use strict';

const fs = require('fs');
const path = require('path');

async function run(args) {
  // Parse: analyze-flutter <root> [--src <subdir>]
  const srcFlagIdx = args.indexOf('--src');
  const srcFlag = srcFlagIdx !== -1 ? args[srcFlagIdx + 1] : null;
  const targetRoot = args.find((a, i) => !a.startsWith('--') && i !== srcFlagIdx + 1);

  if (!targetRoot) {
    console.error('Usage: documenter analyze-flutter <project-root> [--src <subdir>]');
    process.exit(1);
  }

  const root = path.resolve(targetRoot);
  const docsDir = path.join(root, '.documenter', 'analysis');
  fs.mkdirSync(docsDir, { recursive: true });

  // --src pins the source subfolder; default is lib/
  const srcDir = srcFlag ? path.resolve(root, srcFlag) : path.join(root, 'lib');
  if (!fs.existsSync(srcDir)) {
    console.error(`ERROR: source directory not found: ${srcDir}`);
    console.error(`  Pass the correct subfolder with --src, e.g.: --src lib`);
    process.exit(1);
  }
  console.log(`Source dir: ${path.relative(root, srcDir)}`);

  const dartFiles = findDartFiles(srcDir);
  console.log(`Found ${dartFiles.length} Dart files`);

  // Try each router type in priority order
  let routes = [];

  routes = extractGoRouterRoutes(dartFiles, root);
  if (routes.length === 0) routes = extractMaterialAppRoutes(dartFiles, root);
  if (routes.length === 0) routes = extractOnGenerateRoute(dartFiles, root);

  // Enrich routes with widget info
  for (const route of routes) {
    enrichFromWidget(route, dartFiles, root);
  }

  const journeys = inferJourneys(routes, dartFiles);

  const routesOut = path.join(docsDir, 'routes.json');
  const journeysOut = path.join(docsDir, 'journeys.json');
  fs.writeFileSync(routesOut, JSON.stringify(routes, null, 2));
  fs.writeFileSync(journeysOut, JSON.stringify(journeys, null, 2));

  console.log(`✓ routes.json: ${routes.length} routes`);
  console.log(`✓ journeys.json: ${journeys.length} journeys`);
}

function findDartFiles(dir) {
  const results = [];
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory() && entry.name !== 'generated' && entry.name !== '.dart_tool') {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.dart')) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

function extractGoRouterRoutes(dartFiles, root) {
  const routes = [];
  for (const file of dartFiles) {
    const src = safeRead(file) || '';
    if (!src.includes('GoRouter') && !src.includes('GoRoute')) continue;

    const matches = src.matchAll(/GoRoute\(\s*(?:name:\s*'[^']*',\s*)?path:\s*'([^']+)',\s*(?:name:[^,]+,\s*)?(?:builder|pageBuilder):[^=>]+?=>\s*(?:const\s+)?(\w+)\(/g);
    for (const m of matches) {
      const routePath = m[1];
      const widget = m[2];
      if (routePath.includes(':') || routePath.includes('*')) continue; // skip dynamic
      routes.push({
        id: routeToId(routePath),
        path: routePath,
        title: widgetToTitle(widget),
        file: path.relative(root, file),
        type: 'flutter',
        widget,
        forms: [],
        buttons: [],
        nav_links: [],
        requiresAuth: src.includes(`case '${routePath}'`) && src.toLowerCase().includes('redirect'),
      });
    }
    if (routes.length > 0) break;
  }
  return routes;
}

function extractMaterialAppRoutes(dartFiles, root) {
  const routes = [];
  for (const file of dartFiles) {
    const src = safeRead(file) || '';
    if (!src.includes('MaterialApp') || !src.includes('routes:')) continue;

    const matches = src.matchAll(/'(\/[^']*)':\s*\(context\)\s*=>\s*(?:const\s+)?(\w+)\(/g);
    for (const m of matches) {
      routes.push({
        id: routeToId(m[1]),
        path: m[1],
        title: widgetToTitle(m[2]),
        file: path.relative(root, file),
        type: 'flutter',
        widget: m[2],
        forms: [],
        buttons: [],
        nav_links: [],
      });
    }
    if (routes.length > 0) break;
  }
  return routes;
}

function extractOnGenerateRoute(dartFiles, root) {
  const routes = [];
  for (const file of dartFiles) {
    const src = safeRead(file) || '';
    if (!src.includes('onGenerateRoute')) continue;

    const matches = src.matchAll(/case\s+'(\/[^']+)':\s*return\s+MaterialPageRoute\(\s*builder:\s*[^)]+?=>\s*(?:const\s+)?(\w+)\(/g);
    for (const m of matches) {
      routes.push({
        id: routeToId(m[1]),
        path: m[1],
        title: widgetToTitle(m[2]),
        file: path.relative(root, file),
        type: 'flutter',
        widget: m[2],
        forms: [],
        buttons: [],
        nav_links: [],
      });
    }
    if (routes.length > 0) break;
  }
  return routes;
}

function enrichFromWidget(route, dartFiles, root) {
  const widgetFile = dartFiles.find(f => {
    const src = safeRead(f) || '';
    return src.includes(`class ${route.widget}`);
  });
  if (!widgetFile) return;

  const src = safeRead(widgetFile) || '';

  // AppBar title
  const appBarTitle = src.match(/AppBar\([^)]*?title:\s*(?:const\s+)?Text\('([^']+)'\)/s);
  if (appBarTitle) route.title = appBarTitle[1];

  // TextField labels
  const fieldMatches = src.matchAll(/labelText:\s*'([^']+)'/g);
  const fields = [];
  for (const m of fieldMatches) {
    fields.push({ name: m[1].toLowerCase().replace(/\s+/g, '_'), label: m[1], type: 'text' });
  }
  if (fields.length) route.forms = [{ id: 'form', fields }];

  // Buttons
  const btnMatches = src.matchAll(/(?:ElevatedButton|TextButton|OutlinedButton)\([^)]*?child:\s*(?:const\s+)?Text\('([^']+)'\)/g);
  for (const m of btnMatches) {
    if (route.buttons.length < 8) route.buttons.push(m[1]);
  }
  // FAB tooltips
  const fabMatch = src.match(/FloatingActionButton\([^)]*?tooltip:\s*'([^']+)'/s);
  if (fabMatch && route.buttons.length < 8) route.buttons.push(fabMatch[1]);

  // Nav links
  const navMatches = src.matchAll(/(?:pushNamed|context\.push|context\.go)\(context,?\s*'(\/[^']+)'/g);
  for (const m of navMatches) {
    if (!route.nav_links.includes(m[1]) && route.nav_links.length < 10) {
      route.nav_links.push(m[1]);
    }
  }
}

function inferJourneys(routes, dartFiles) {
  const journeys = [];
  const routeMap = Object.fromEntries(routes.map(r => [r.path, r]));

  for (const start of routes) {
    if (!start.forms.length) continue;
    const chain = [start];
    let current = start;
    const visited = new Set([start.path]);
    for (let i = 0; i < 4; i++) {
      const nextPath = current.nav_links.find(l => routeMap[l] && !visited.has(l));
      if (!nextPath) break;
      chain.push(routeMap[nextPath]);
      visited.add(nextPath);
      current = routeMap[nextPath];
    }
    if (chain.length >= 2) {
      journeys.push({
        id: start.id + '-flow',
        name: guessJourneyName(start),
        description: `Flow starting at ${start.title}`,
        steps: chain.map((r, i) => ({
          route_id: r.id,
          action: i === 0 ? `Complete the ${r.title} screen` : `Proceed through ${r.title}`,
        })),
      });
    }
  }
  return journeys;
}

function guessJourneyName(route) {
  const p = route.path.toLowerCase();
  if (p.includes('login') || p.includes('signin')) return 'Sign In';
  if (p.includes('register') || p.includes('signup')) return 'Registration';
  if (p.includes('onboard')) return 'Onboarding';
  if (p.includes('forgot') || p.includes('reset')) return 'Password Reset';
  return `${route.title} Flow`;
}

function routeToId(route) {
  return route.replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '') || 'home';
}

function widgetToTitle(widget) {
  return widget
    .replace(/Screen$|Page$|View$|Widget$/, '')
    .replace(/([A-Z])/g, ' $1').trim();
}

function safeRead(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}

module.exports = { run };

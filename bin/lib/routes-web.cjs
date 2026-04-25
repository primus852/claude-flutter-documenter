'use strict';

const fs = require('fs');
const path = require('path');

// Lazy-load heavy dependencies so the CLI starts fast
let parser, traverse, glob;

async function loadDeps() {
  if (!parser) {
    parser = require('@babel/parser');
    traverse = require('@babel/traverse').default;
    glob = require('glob');
  }
}

async function run([targetRoot, ...opts]) {
  if (!targetRoot) {
    console.error('Usage: documenter analyze-web <project-root>');
    process.exit(1);
  }

  await loadDeps();
  const root = path.resolve(targetRoot);
  const docsDir = path.join(root, '.documenter', 'analysis');
  fs.mkdirSync(docsDir, { recursive: true });

  const framework = detectFramework(root);
  console.log(`Detected framework: ${framework}`);

  let routes = [];
  if (framework === 'nextjs-app') routes = await extractNextjsApp(root);
  else if (framework === 'nextjs-pages') routes = await extractNextjsPages(root);
  else if (framework === 'react-router') routes = await extractReactRouter(root);
  else routes = await extractHtml(root);

  const journeys = inferJourneys(routes);

  const routesOut = path.join(docsDir, 'routes.json');
  const journeysOut = path.join(docsDir, 'journeys.json');
  fs.writeFileSync(routesOut, JSON.stringify(routes, null, 2));
  fs.writeFileSync(journeysOut, JSON.stringify(journeys, null, 2));

  console.log(`✓ routes.json: ${routes.length} routes`);
  console.log(`✓ journeys.json: ${journeys.length} journeys`);
  console.log(`  Output: ${docsDir}`);
}

function detectFramework(root) {
  if (fs.existsSync(path.join(root, 'next.config.js')) ||
      fs.existsSync(path.join(root, 'next.config.ts')) ||
      fs.existsSync(path.join(root, 'next.config.mjs'))) {
    const hasApp = fs.existsSync(path.join(root, 'app')) ||
                   fs.existsSync(path.join(root, 'src', 'app'));
    return hasApp ? 'nextjs-app' : 'nextjs-pages';
  }
  // Search for React Router
  const srcDirs = ['src', 'app', '.'].map(d => path.join(root, d));
  for (const dir of srcDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = glob.sync('**/*.{tsx,jsx,ts,js}', { cwd: dir, absolute: true, ignore: ['**/node_modules/**'] });
    for (const f of files.slice(0, 50)) {
      const src = safeRead(f);
      if (src && (src.includes('createBrowserRouter') || src.includes('<Routes') || src.includes('<Switch'))) {
        return 'react-router';
      }
    }
  }
  return 'html';
}

async function extractNextjsApp(root) {
  const appDirs = ['app', 'src/app'].map(d => path.join(root, d)).filter(fs.existsSync);
  if (!appDirs.length) return [];

  const routes = [];
  for (const appDir of appDirs) {
    const pageFiles = glob.sync('**/page.{tsx,jsx,ts,js}', { cwd: appDir, absolute: true });
    for (const file of pageFiles) {
      const rel = path.relative(appDir, file);
      const route = filePathToRoute(rel);
      const src = safeRead(file) || '';
      const info = extractPageInfo(src, file);
      routes.push({
        id: routeToId(route),
        path: route,
        title: info.title || pathToTitle(route),
        file: path.relative(root, file),
        type: 'web',
        forms: info.forms,
        buttons: info.buttons,
        nav_links: info.navLinks,
      });
    }
  }
  return routes;
}

async function extractNextjsPages(root) {
  const pagesDirs = ['pages', 'src/pages'].map(d => path.join(root, d)).filter(fs.existsSync);
  if (!pagesDirs.length) return [];

  const routes = [];
  for (const pagesDir of pagesDirs) {
    const pageFiles = glob.sync('**/*.{tsx,jsx,ts,js}', {
      cwd: pagesDir,
      absolute: true,
      ignore: ['**/api/**', '**/_*'],
    });
    for (const file of pageFiles) {
      const rel = path.relative(pagesDir, file);
      const route = filePathToRoute(rel);
      const src = safeRead(file) || '';
      const info = extractPageInfo(src, file);
      routes.push({
        id: routeToId(route),
        path: route,
        title: info.title || pathToTitle(route),
        file: path.relative(root, file),
        type: 'web',
        forms: info.forms,
        buttons: info.buttons,
        nav_links: info.navLinks,
      });
    }
  }
  return routes;
}

async function extractReactRouter(root) {
  // Find router config files
  const srcDir = fs.existsSync(path.join(root, 'src')) ? path.join(root, 'src') : root;
  const allFiles = glob.sync('**/*.{tsx,jsx,ts,js}', {
    cwd: srcDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*'],
  });

  let routerFile = null;
  let routerSrc = '';
  for (const f of allFiles) {
    const src = safeRead(f) || '';
    if (src.includes('createBrowserRouter') || src.includes('createHashRouter') ||
        src.includes('<Routes') || src.includes('<Switch')) {
      routerFile = f;
      routerSrc = src;
      break;
    }
  }

  if (!routerFile) return [];

  // Extract route paths from JSX <Route path="..."> or config objects
  const routes = [];
  const pathMatches = routerSrc.matchAll(/path:\s*["']([^"']+)["']/g);
  for (const m of pathMatches) {
    const p = m[1];
    if (p.includes('*') || p.startsWith('http')) continue;
    const normPath = p.startsWith('/') ? p : '/' + p;
    if (normPath.includes(':') || normPath.includes('[')) continue; // skip dynamic
    routes.push({
      id: routeToId(normPath),
      path: normPath,
      title: pathToTitle(normPath),
      file: path.relative(root, routerFile),
      type: 'web',
      forms: [],
      buttons: [],
      nav_links: [],
    });
  }
  return routes;
}

async function extractHtml(root) {
  const htmlFiles = glob.sync('**/*.html', {
    cwd: root,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });
  return htmlFiles.slice(0, 20).map(f => {
    const rel = '/' + path.relative(root, f).replace(/\\/g, '/');
    return {
      id: routeToId(rel),
      path: rel,
      title: pathToTitle(rel),
      file: path.relative(root, f),
      type: 'web',
      forms: [],
      buttons: [],
      nav_links: [],
    };
  });
}

function extractPageInfo(src, file) {
  const result = { title: '', forms: [], buttons: [], navLinks: [] };

  // Title from export const metadata
  const metaMatch = src.match(/metadata\s*=\s*\{[^}]*title:\s*["']([^"']+)["']/);
  if (metaMatch) result.title = metaMatch[1];

  // Title from <h1> or <h2>
  if (!result.title) {
    const h1 = src.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (h1) result.title = h1[1].trim();
  }

  // Buttons — simple text extraction
  const btnMatches = src.matchAll(/<[Bb]utton[^>]*>\s*([A-Za-z][^<]{1,40}?)\s*<\/[Bb]utton>/g);
  for (const m of btnMatches) {
    const label = m[1].trim().replace(/\s+/g, ' ');
    if (label && !label.startsWith('{') && result.buttons.length < 10) {
      result.buttons.push(label);
    }
  }

  // Form fields — input names/labels
  const inputMatches = src.matchAll(/<input[^>]+(?:name|aria-label|placeholder)=["']([^"']+)["'][^>]*>/g);
  for (const m of inputMatches) {
    if (result.forms.length === 0) result.forms.push({ id: 'form-1', fields: [] });
    result.forms[0].fields.push({ name: m[1], label: m[1], type: 'text' });
    if (result.forms[0].fields.length >= 10) break;
  }

  // Nav links — <Link href> or <a href>
  const linkMatches = src.matchAll(/(?:href|to)=["'](\/[^"'?#]+)["']/g);
  for (const m of linkMatches) {
    if (!result.navLinks.includes(m[1]) && result.navLinks.length < 15) {
      result.navLinks.push(m[1]);
    }
  }

  return result;
}

function inferJourneys(routes) {
  const journeys = [];
  // Simple heuristic: find chains of 3+ routes connected by nav_links
  const routeMap = Object.fromEntries(routes.map(r => [r.path, r]));

  for (const start of routes) {
    if (!start.forms.length) continue; // start journeys at form pages
    const chain = [start];
    let current = start;
    const visited = new Set([start.path]);
    for (let i = 0; i < 4; i++) {
      const nextPath = current.nav_links.find(l => routeMap[l] && !visited.has(l));
      if (!nextPath) break;
      const next = routeMap[nextPath];
      chain.push(next);
      visited.add(nextPath);
      current = next;
    }
    if (chain.length >= 2) {
      journeys.push({
        id: start.id + '-flow',
        name: guessJourneyName(start),
        description: `User flow starting at ${start.title}`,
        steps: chain.map((r, i) => ({
          route_id: r.id,
          action: i === 0 ? `Fill in the ${r.title} form and submit` : `Complete ${r.title}`,
        })),
      });
    }
  }
  return journeys;
}

function guessJourneyName(route) {
  const path = route.path.toLowerCase();
  if (path.includes('login') || path.includes('signin')) return 'Sign In';
  if (path.includes('register') || path.includes('signup')) return 'User Registration';
  if (path.includes('checkout')) return 'Checkout';
  if (path.includes('onboard')) return 'Onboarding';
  if (path.includes('forgot') || path.includes('reset')) return 'Password Reset';
  return `${route.title} Flow`;
}

function filePathToRoute(relPath) {
  let route = relPath.replace(/\\/g, '/');
  // Remove page.tsx etc
  route = route.replace(/\/page\.(tsx|jsx|ts|js)$/, '');
  route = route.replace(/\.(tsx|jsx|ts|js)$/, '');
  // Remove index
  route = route.replace(/\/index$/, '');
  // Remove route groups (parenthesized segments)
  route = route.replace(/\/\([^)]+\)/g, '');
  // Remove dynamic segments
  route = route.replace(/\/\[[^\]]+\]/g, '');
  if (!route.startsWith('/')) route = '/' + route;
  return route || '/';
}

function routeToId(route) {
  return route.replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '') || 'home';
}

function pathToTitle(route) {
  const segment = route.split('/').filter(Boolean).pop() || 'Home';
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

module.exports = { run };

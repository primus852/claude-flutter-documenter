'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run([inputFile, format = 'all', style = 'typst']) {
  if (!inputFile) {
    console.error('Usage: documenter render <manual.md> [format] [style]');
    process.exit(1);
  }

  const input = path.resolve(inputFile);
  if (!fs.existsSync(input)) {
    console.error(`ERROR: Input file not found: ${input}`);
    process.exit(1);
  }

  const docsDir = path.dirname(input);
  const distDir = path.join(docsDir, 'dist');
  fs.mkdirSync(distDir, { recursive: true });

  const formats = format === 'all' ? ['md', 'pdf', 'latex', 'html'] : [format];
  const pluginRoot = path.resolve(__dirname, '..', '..');

  for (const fmt of formats) {
    console.log(`Rendering → ${fmt} (style: ${style})`);
    try {
      renderFormat(input, fmt, style, distDir, docsDir, pluginRoot);
    } catch (err) {
      console.warn(`  ⚠ Failed to render ${fmt}: ${err.message}`);
    }
  }

  console.log('\n✓ Render complete. Files in:', distDir);
  fs.readdirSync(distDir).forEach(f => {
    const size = fs.statSync(path.join(distDir, f)).size;
    console.log(`  ${f} (${Math.round(size / 1024)} KB)`);
  });
}

function renderFormat(input, format, style, distDir, docsDir, pluginRoot) {
  if (!hasPandoc()) throw new Error('pandoc not found — run: brew install pandoc');

  const base = ['pandoc', path.relative(docsDir, input)];
  const common = ['--standalone', '--toc', '--toc-depth=2', '--resource-path=.'];

  if (format === 'md') {
    // Already have manual.md — just copy to dist
    fs.copyFileSync(input, path.join(distDir, 'manual.md'));
    console.log('  ✓ manual.md');
    return;
  }

  if (format === 'html') {
    const cmd = [...base, ...common, '--self-contained', '-o', path.relative(docsDir, path.join(distDir, 'manual.html'))];
    run_pandoc(cmd, docsDir);
    console.log('  ✓ manual.html');
    return;
  }

  if (format === 'latex') {
    const metaFile = path.join(pluginRoot, 'templates', 'eisvogel-meta.yaml');
    const cmd = [
      ...base, ...common,
      '--to=latex',
      '--pdf-engine=xelatex',
      '--listings',
      '--number-sections',
      ...(fs.existsSync(metaFile) ? [`--metadata-file=${path.relative(docsDir, metaFile)}`] : []),
      '-o', path.relative(docsDir, path.join(distDir, 'manual.tex')),
    ];
    run_pandoc(cmd, docsDir);
    console.log('  ✓ manual.tex');

    // Also render eisvogel PDF if xelatex available and template present
    const eisvogelTemplate = path.join(process.env.HOME, '.local', 'share', 'pandoc', 'templates', 'eisvogel.latex');
    if (hasCommand('xelatex') && fs.existsSync(eisvogelTemplate)) {
      const pdfCmd = [
        ...base, ...common,
        '--pdf-engine=xelatex',
        '--template=eisvogel',
        '--listings',
        '--number-sections',
        '-V', 'colorlinks=true',
        '-V', 'linkcolor=blue',
        ...(fs.existsSync(metaFile) ? [`--metadata-file=${path.relative(docsDir, metaFile)}`] : []),
        '-o', path.relative(docsDir, path.join(distDir, 'manual-eisvogel.pdf')),
      ];
      run_pandoc(pdfCmd, docsDir);
      console.log('  ✓ manual-eisvogel.pdf');
    } else {
      console.warn('  ⚠ Skipping eisvogel PDF: xelatex or eisvogel.latex template not found.');
      console.warn('    Run: brew install --cask basictex && scripts/postinstall-eisvogel.sh');
    }
    return;
  }

  if (format === 'pdf') {
    if (style === 'eisvogel') {
      const metaFile = path.join(pluginRoot, 'templates', 'eisvogel-meta.yaml');
      const eisvogelTemplate = path.join(process.env.HOME, '.local', 'share', 'pandoc', 'templates', 'eisvogel.latex');
      if (!hasCommand('xelatex')) {
        console.warn('  ⚠ xelatex not found. Falling back to Typst for PDF.');
        renderTypstPdf(base, common, distDir, docsDir, pluginRoot);
        return;
      }
      if (!fs.existsSync(eisvogelTemplate)) {
        console.warn('  ⚠ eisvogel.latex not found. Run: scripts/postinstall-eisvogel.sh');
        console.warn('    Falling back to Typst.');
        renderTypstPdf(base, common, distDir, docsDir, pluginRoot);
        return;
      }
      const cmd = [
        ...base, ...common,
        '--pdf-engine=xelatex',
        '--template=eisvogel',
        '--listings',
        '--number-sections',
        '-V', 'colorlinks=true',
        '-V', 'linkcolor=blue',
        ...(fs.existsSync(metaFile) ? [`--metadata-file=${path.relative(docsDir, metaFile)}`] : []),
        '-o', path.relative(docsDir, path.join(distDir, 'manual.pdf')),
      ];
      run_pandoc(cmd, docsDir);
    } else {
      renderTypstPdf(base, common, distDir, docsDir, pluginRoot);
    }
    console.log('  ✓ manual.pdf');
  }
}

function renderTypstPdf(base, common, distDir, docsDir, pluginRoot) {
  if (!hasCommand('typst')) {
    throw new Error('typst not found — run: brew install typst');
  }
  const typTemplate = path.join(pluginRoot, 'templates', 'manual.typ');
  const cmd = [
    ...base, ...common,
    '--pdf-engine=typst',
    ...(fs.existsSync(typTemplate) ? [`--template=${path.relative(docsDir, typTemplate)}`] : []),
    '-o', path.relative(docsDir, path.join(distDir, 'manual.pdf')),
  ];
  run_pandoc(cmd, docsDir);
}

function run_pandoc(args, cwd) {
  const result = spawnSync('pandoc', args, { cwd, stdio: 'pipe', encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'pandoc failed');
  }
}

function hasPandoc() { return hasCommand('pandoc'); }

function hasCommand(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

module.exports = { run };

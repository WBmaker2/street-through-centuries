import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(decodeURIComponent(new URL('..', import.meta.url).pathname));
const files = ['index.html', 'src/app.js', 'src/content.js', 'src/engine.js', 'src/state.js', 'src/styles.css', 'HISTORICAL-EVIDENCE-MATRIX.md', 'EXPERT-REVIEW-PACKET.md', 'TEACHER-CLASSROOM-GUIDE.md', 'STUDENT-WORKSHEET.md', 'FORMATIVE-ASSESSMENT.md', 'CLASSROOM-PILOT-PROTOCOL.md'];
for (const relative of files) {
  const file = path.join(root, relative);
  assert.ok(fs.existsSync(file), `${relative} exists`);
  const lineCount = fs.readFileSync(file, 'utf8').split('\n').length;
  assert.ok(lineCount <= 500, `${relative} stays under 500 lines (${lineCount})`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(html, /type="module"/);
assert.match(fs.readFileSync(path.join(root, 'src/app.js'), 'utf8'), /data-od-id="hero"/);
assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/app.js'), 'utf8'), /scrollIntoView/);
assert.match(fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8'), /prefers-reduced-motion/);
assert.match(fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8'), /gi-pulse/);
assert.match(fs.readFileSync(path.join(root, 'src/content.js'), 'utf8'), /P06/);
assert.match(fs.readFileSync(path.join(root, 'src/content.js'), 'utf8'), /TEACHER_RESOURCES/);
assert.match(fs.readFileSync(path.join(root, 'src/content.js'), 'utf8'), /전문 감수 대기/);
assert.match(fs.readFileSync(path.join(root, 'src/app.js'), 'utf8'), /교실 파일럿 대기/);

const css = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
const tokenEnd = css.indexOf('}\n\n*, *::before');
const outsideTokens = css.slice(tokenEnd + 2);
assert.doesNotMatch(outsideTokens, /#[0-9a-fA-F]{3,8}\b/, 'raw hex only appears in token block');

const topSections = [...fs.readFileSync(path.join(root, 'src/app.js'), 'utf8').matchAll(/<section\b/g)].length;
const odSections = [...fs.readFileSync(path.join(root, 'src/app.js'), 'utf8').matchAll(/<section[^>]+data-od-id=/g)].length;
assert.equal(topSections, odSections, 'every rendered top-level section has data-od-id');
assert.match(fs.readFileSync(path.join(root, 'src/app.js'), 'utf8'), /data-od-id="resources"/);
assert.match(fs.readFileSync(path.join(root, 'src/app.js'), 'utf8'), /target="_blank" rel="noopener noreferrer"/);
assert.match(fs.readFileSync(path.join(root, 'HISTORICAL-EVIDENCE-MATRIX.md'), 'utf8'), /S01~S12.*목업.*검토 대기/s);
assert.match(fs.readFileSync(path.join(root, 'EXPERT-REVIEW-PACKET.md'), 'utf8'), /전문 감수 대기/);
assert.match(fs.readFileSync(path.join(root, 'CLASSROOM-PILOT-PROTOCOL.md'), 'utf8'), /실행 대기/);
console.log(`static-check passed: ${files.length} files, ${topSections} sections, token-only hex colors`);

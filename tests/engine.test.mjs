import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ASSETS, ERAS, POINTS, SOURCES, getPointEraContent } from '../src/content.js';
import { canPromoteObservationToFact, getProgress, imageFallbackModel, validateEvidence } from '../src/engine.js';
import { createSession, observePoint } from '../src/state.js';

const source = (id) => SOURCES.find((item) => item.id === id);

test('generated scene claims stay observation, never automatic historical fact', () => {
  const result = canPromoteObservationToFact({ claim: { type: 'observation' }, source: source('S01'), relation: 'direct' });
  assert.equal(result.valid, false);
  assert.match(result.reason, /자동 승격/);
});

test('S07 and S08 cannot auto-confirm as direct evidence for 1875', () => {
  for (const id of ['S07', 'S08']) {
    const result = validateEvidence({ era: 1875, source: source(id), relation: 'direct' });
    assert.equal(result.valid, false);
    assert.equal(result.status, 'time-warning');
    assert.match(result.message, /자동 확정하지 않습니다/);
  }
});

test('mock source can be recorded but remains review-pending, not a confirmed fact', () => {
  const result = validateEvidence({ era: 1725, source: source('S02'), relation: 'direct' });
  assert.equal(result.valid, true);
  assert.equal(result.status, 'review-pending');
  assert.match(result.message, /확정 사실로 승격하지 않습니다/);
});

test('historical fact requires direct reviewed source', () => {
  const result = canPromoteObservationToFact({ claim: { type: 'historicalFact' }, source: { id: 'S01', status: '검수 완료' }, relation: 'direct' });
  assert.equal(result.valid, true);
  const pending = canPromoteObservationToFact({ claim: { type: 'historicalFact' }, source: source('S01'), relation: 'direct' });
  assert.equal(pending.valid, false);
});

test('progress counts unique observed points, recordable evidence, and revisions', () => {
  const session = { claims: [{ type: 'observation', pointId: 'P01' }, { type: 'observation', pointId: 'P01' }, { type: 'observation', pointId: 'P02' }], evidenceLinks: [{ valid: true }, { valid: false }, { valid: true }], revisionCount: 1 };
  assert.deepEqual(getProgress(session), { observationCount: 2, evidenceCount: 2, revisionCount: 1 });
});

test('image fallback keeps caption and sourceIds', () => {
  const fallback = imageFallbackModel(ASSETS[1725], SOURCES);
  assert.equal(fallback.assetId, 'A1725-STREET');
  assert.match(fallback.caption, /합성 연습용 · 실제 사료 사진 아님 · 검수 전 · 특정 실제 거리 아님/);
  assert.deepEqual(fallback.sourceIds, ['S01', 'S02']);
});

test('era observations stay tied to what each generated image shows', () => {
  const p03 = POINTS.find((point) => point.id === 'P03');
  const p04 = POINTS.find((point) => point.id === 'P04');
  const p06 = POINTS.find((point) => point.id === 'P06');
  assert.match(getPointEraContent(p03, 1725).observation, /수레/);
  assert.match(getPointEraContent(p03, 1875).observation, /전차나 선로는 보이지 않습니다/);
  assert.match(getPointEraContent(p03, 2025).observation, /신호등과 횡단보도/);
  assert.doesNotMatch(getPointEraContent(p03, 2025).observation, /수레 형태/);
  assert.equal(p04.label, '공공 공간·거리 시설');
  assert.match(getPointEraContent(p04, 1725).observation, /십자형 목재 구조물/);
  assert.match(getPointEraContent(p04, 2025).observation, /신호등과 가로등/);
  assert.doesNotMatch(getPointEraContent(p06, 1725).observation, /물길과 낮은 다리처럼/);
  assert.match(getPointEraContent(p06, 2025).observation, /직사각형 시설/);
});

test('1875 remains an opening-before hypothesis and later changes stay comparative', () => {
  const era = ERAS.find((item) => item.id === 1875);
  assert.equal(era.title, '개항 직전의 가설 시점');
  assert.match(era.note, /1876년 이후 변화는 참고 비교로만/);
  for (const id of ['S07', 'S08']) {
    const reference = validateEvidence({ era: 1875, source: source(id), relation: 'reference' });
    assert.equal(reference.valid, true);
    assert.equal(reference.status, 'review-pending');
  }
});

test('each era has a distinct existing local scene asset', () => {
  const assetPaths = Object.values(ASSETS).map((asset) => asset.path);
  assert.equal(new Set(assetPaths).size, 3);
  for (const assetPath of assetPaths) assert.equal(fs.existsSync(path.resolve(decodeURIComponent(new URL(`../${assetPath.replace('./', '')}`, import.meta.url).pathname))), true);
});

test('reclassifying a claim does not overwrite the observation record', () => {
  const session = createSession();
  observePoint(session, 'P01', '길 가장자리가 보인다.');
  session.claims.push({ id: 'claim-P01', pointId: 'P01', text: '길 가장자리가 보인다.', type: 'inference' });
  session.claims[0].type = 'unknown';
  assert.equal(session.observations[0].text, '길 가장자리가 보인다.');
  assert.equal(session.observations[0].pointId, 'P01');
  assert.equal(session.claims[0].type, 'unknown');
});

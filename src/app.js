import { ASSETS, CLAIM_TYPES, ERAS, POINTS, REVIEW_LINKS, SOURCES, TEACHER_RESOURCES, UPDATE_HISTORY, getPointEraContent } from './content.js';
import { getProgress, imageFallbackModel, validateEvidence } from './engine.js';
import { createSession, markTask, observePoint, recordDraft, revealClue, setEra, setPoint } from './state.js';

const state = createSession();
const root = document.querySelector('#app');

function selectedEra() { return ERAS.find((era) => era.id === state.selectedEra); }
function selectedPoint() { return POINTS.find((point) => point.id === state.selectedPoint); }
function sourceById(id) { return SOURCES.find((source) => source.id === id); }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]); }

function requiredAction() {
  const progress = getProgress(state);
  if (progress.observationCount < 4) return 'observe';
  if (progress.evidenceCount < 3) return 'evidence';
  if (!state.draftBefore) return 'draft';
  if (!state.clueRevealed) return 'clue';
  if (!state.draftAfter) return 'draft';
  return '';
}

function pulse(action) { return requiredAction() === action ? ' gi-pulse' : ''; }

function render() {
  const era = selectedEra();
  const point = selectedPoint();
  const progress = getProgress(state);
  const asset = ASSETS[state.selectedEra];
  const selectedSources = era.sources.map(sourceById);
  const pointContent = getPointEraContent(point, state.selectedEra);
  const selectedObservation = state.observations.find((observation) => observation.pointId === point.id && observation.era === state.selectedEra);
  const selectedClassification = state.claims.find((claim) => claim.pointId === point.id && claim.era === state.selectedEra);
  root.innerHTML = `
    <header class="topnav" data-od-id="topnav">
      <div class="container topnav-inner">
        <a class="logo" href="#top">한 거리의 300년</a>
        <nav aria-label="주요 메뉴">
          <a href="#timeline">시점 비교</a><a href="#workbench">탐구 작업대</a><a href="#records">과정 기록</a>
        </nav>
        <button class="btn btn-secondary update-trigger" data-action="updates">업데이트 내역</button>
      </div>
    </header>

    <main id="content">
      <section class="section hero hero-section" data-od-id="hero" id="top">
        <div class="container hero-split">
          <div class="hero-copy">
            <p class="eyebrow">WARM EDITORIAL · 역사 탐구 연습</p>
            <h1>한 장소를 오래 바라보며, 자료가 말하는 만큼만 그려 봅니다.</h1>
            <p class="lead">세 시점을 같은 기준점에서 비교하고, 보이는 것·사료가 말하는 것·아직 모르는 것을 나누어 기록하는 합성 연습입니다.</p>
            <div class="hero-cta"><a class="btn btn-primary" href="#workbench">탐구 작업대 열기 <span aria-hidden="true">→</span></a><a class="btn btn-ghost btn-arrow" href="#guide">사용 안내</a></div>
            <div class="notice-pills"><span class="pill">합성 연습 거리</span><span class="tag">목업 사료 · 확정 역사 아님</span></div>
            <aside class="review-info" aria-label="역사 검수 정보"><div class="review-status"><span class="review-dot" aria-hidden="true"></span><b>문헌 기반 1차 검수 완료 · 전문 감수 대기</b></div><p>공식 기관 공개 자료를 대조한 상태이며, 생성 이미지는 관찰 연습용입니다.</p><div class="review-links">${REVIEW_LINKS.map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} ↗</a>`).join('')}</div><a class="review-report" href="./HISTORY-CURRICULUM-REVIEW.md" target="_blank" rel="noopener noreferrer">HISTORY-CURRICULUM-REVIEW.md 전체 검수 범위 보기 ↗</a></aside>
          </div>
          <div class="hero-visual">
            <div class="image-frame" data-image-frame>
              <img src="${asset.path}" alt="${escapeHTML(asset.alt)}" data-street-image />
              <div class="image-fallback" data-image-fallback hidden>
                <div class="fallback-plan" aria-hidden="true"><i></i><i></i><i></i><i></i><b>연습 거리 평면도</b></div>
                <p>이미지를 불러오지 못해 평면도로 대체했습니다.</p>
              </div>
              <div class="image-label">${era.code} · ${era.label} / ${escapeHTML(asset.id)}</div>
            </div>
            <p class="image-caption">${escapeHTML(asset.caption)} · sourceIds: ${asset.sourceIds.join(', ')}</p>
          </div>
        </div>
      </section>

      <section class="section timeline-section" data-od-id="timeline" id="timeline">
        <div class="container">
          <div class="section-heading row-between"><div><p class="eyebrow">세 시점 비교</p><h2>같은 길, 다른 단서</h2></div><span class="meta">자동 재생 없음 · 직접 선택</span></div>
          <div class="era-tabs" role="tablist" aria-label="거리 시점 선택">${ERAS.map((item) => `<button class="era-tab ${item.id === state.selectedEra ? 'is-selected' : ''}" role="tab" aria-selected="${item.id === state.selectedEra}" data-era="${item.id}"><span class="era-code">${item.code}</span><span><b>${item.label}</b><small>${item.title}</small></span></button>`).join('')}</div>
          <div class="era-summary"><span class="pill">현재 시점 ${era.code} · ${era.label}</span><span>${era.note}</span><span class="meta">장소: 특정 실제 거리로 확정하지 않음</span></div>
        </div>
      </section>

      <section class="section workbench-section" data-od-id="workbench" id="workbench">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">현재 과제 · 먼저 보이는 것만 말하기</p><h2>거리의 한 지점을 확대해 보세요.</h2><p class="lead">${point.id} ${point.label} — ${pointContent.prompt}</p></div>
          <div class="workbench-grid">
            <div class="scene-column">
              <div class="scene-card card">
                <div class="scene-toolbar row-between"><span class="meta">${era.code} · ${era.label} / 기준점 보기</span><div class="preset-group"><button class="btn btn-ghost" data-preset="north">북쪽 보기</button><button class="btn btn-ghost" data-preset="road">큰길 보기</button><button class="btn btn-ghost" data-preset="point">관찰 지점 보기</button></div></div>
                <div class="scene-image"><img src="${asset.path}" alt="${escapeHTML(asset.alt)}" data-street-image /><div class="image-fallback" data-image-fallback hidden><div class="fallback-plan" aria-hidden="true"><i></i><i></i><i></i><i></i><b>연습 거리 평면도</b></div><p>대체 평면도 · caption/sourceIds 유지: ${asset.sourceIds.join(', ')}</p></div>${POINTS.map((item) => `<button class="point-marker ${item.id === point.id ? 'is-active' : ''}" style="left:${item.anchor[0]}%;top:${item.anchor[1]}%" data-point="${item.id}" aria-label="${item.id} ${item.label}">${item.id}</button>`).join('')}<span class="north-arrow" aria-label="북쪽 방향">N ↑</span></div>
                <p class="image-caption">${escapeHTML(asset.caption)} · sourceIds: ${asset.sourceIds.join(', ')}</p>
              </div>
                <div class="point-list card-flat"><div class="point-list-head row-between"><h3>관찰 지점 P01–P06</h3><span class="meta">선택 ${point.id}</span></div>${POINTS.map((item) => `<button class="point-row ${item.id === point.id ? 'is-selected' : ''}" data-point="${item.id}"><span class="point-index">${item.id}</span><span><b>${item.label}</b><small>${getPointEraContent(item, state.selectedEra).prompt}</small></span><span aria-hidden="true">→</span></button>`).join('')}</div>
            </div>

            <div class="answer-column">
              <div class="card observation-card" data-panel="observation"><div class="card-kicker"><span class="pill">관찰</span><span class="meta">${selectedObservation ? '기록됨' : '아직 기록하지 않음'}</span></div><h3>${point.id} · ${point.label}</h3><p>${pointContent.observation}</p><button class="btn btn-primary action-button${pulse('observe')}" data-action="observe">${selectedObservation ? '관찰 기록 다시 확인' : '이 지점을 관찰로 기록'} <span aria-hidden="true">→</span></button><div class="claim-types"><span class="meta">별도 주장 분류</span>${CLAIM_TYPES.map((type) => `<button class="type-button ${selectedClassification?.type === type.id ? 'is-selected' : ''}" data-claim-type="${type.id}" title="${type.hint}">${type.label}</button>`).join('')}</div></div>
              <div class="card source-card" data-panel="sources"><div class="card-kicker"><span class="pill">사료 연결</span><span class="meta">현재 시점의 목업 사료 ${selectedSources.length}개</span></div><h3>이 장면의 근거를 분류해 보세요.</h3><p class="helper">자료를 선택하고 직접·간접·참고 중 하나로 기록하세요. 확정 역사 판정은 하지 않습니다.</p><div class="source-list">${selectedSources.map((source) => renderSource(source)).join('')}</div><div class="warning-box" data-warning ${state.lastNotice ? '' : 'hidden'}>${escapeHTML(state.lastNotice)}</div></div>
              <div class="card explanation-card" data-panel="explanation"><div class="card-kicker"><span class="pill">설명 수정</span><span class="meta">자유 서술은 자동 진실성 판정 없음</span></div><h3>변화를 한 문장으로 설명해 보세요.</h3><p class="helper">원인 2개, 결과 1개, 불확실성 1개를 떠올리되, 이 입력은 세션 비교용으로만 남습니다.</p><textarea class="textarea" data-explanation placeholder="예: 길 가장자리의 공간은 이동과 장사를 함께 고려한 것으로 보인다. 다만 실제 상점의 이름과 사람들의 신분은 모른다.">${escapeHTML(state.draftAfter || state.draftBefore)}</textarea><div class="explanation-actions"><button class="btn btn-primary action-button${pulse('draft')}" data-action="draft">${state.draftBefore ? '수정 설명 기록' : '초안 설명 기록'} <span aria-hidden="true">→</span></button><button class="btn btn-secondary action-button${pulse('clue')}" data-action="clue" ${state.draftBefore && !state.clueRevealed ? '' : 'disabled'}>새 단서 열기</button></div>${renderRevision()}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section records-section" data-od-id="records" id="records">
        <div class="container record-grid"><div><p class="eyebrow">성취 증거 · 점수가 아닌 과정 기록</p><h2>무엇을 확인했는지 남습니다.</h2><p class="lead">관찰·근거·수정은 현재 브라우저 세션에만 기록됩니다. 계정, 영구 저장, AI 채점은 없습니다.</p></div><div class="progress-card card"><div class="progress-row ${progress.observationCount >= 4 ? 'is-complete' : ''}"><span class="progress-num">${progress.observationCount}</span><div><b>관찰 지점</b><small>목표 4개 이상</small></div><span class="progress-mark">${progress.observationCount >= 4 ? '✓' : '기록 중'}</span></div><div class="progress-row ${progress.evidenceCount >= 3 ? 'is-complete' : ''}"><span class="progress-num">${progress.evidenceCount}</span><div><b>유효 근거 연결</b><small>목표 3개 이상</small></div><span class="progress-mark">${progress.evidenceCount >= 3 ? '✓' : '기록 중'}</span></div><div class="progress-row ${progress.revisionCount >= 1 ? 'is-complete' : ''}"><span class="progress-num">${progress.revisionCount}</span><div><b>설명 수정</b><small>목표 1회</small></div><span class="progress-mark">${progress.revisionCount >= 1 ? '✓' : '기록 중'}</span></div></div></div>
      </section>

      <section class="section resources-section" data-od-id="resources" id="resources"><div class="container"><div class="section-heading row-between"><div><p class="eyebrow">교사용 자료 · 공개 검토 패키지</p><h2>수업 전에 범위를 확인하세요.</h2><p class="lead">문헌·전문 감수·교실 파일럿의 상태를 따로 표시합니다. 아래 문서는 모두 새 탭에서 열립니다.</p></div><div class="status-stack"><span class="status-item is-done">문헌 기반 1차 검수 완료</span><span class="status-item">전문 감수 대기</span><span class="status-item">교실 파일럿 대기</span></div></div><div class="resource-grid">${TEACHER_RESOURCES.map((resource) => `<a class="resource-card" href="${resource.path}" target="_blank" rel="noopener noreferrer"><b>${escapeHTML(resource.label)}</b><span>${escapeHTML(resource.meta)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="matrix-summary"><b>근거 매트릭스 요약</b><p>공식 서울역사박물관 자료 O01~O04는 문헌 기반 1차 검수 범위입니다. S01~S12는 직접·참고 연결을 연습하는 목업 사료로 모두 검토 대기 상태입니다. 생성 이미지 요소는 <i>synthetic</i>, 자료가 부족한 주장은 <i>unknown</i>으로 남깁니다.</p><a href="./HISTORICAL-EVIDENCE-MATRIX.md" target="_blank" rel="noopener noreferrer">HISTORICAL-EVIDENCE-MATRIX.md에서 전체 표 보기 ↗</a></div></div></section>

      <section class="section guide-section" data-od-id="guide" id="guide"><div class="container guide-grid"><div><p class="eyebrow">사용 안내</p><h2>보이는 만큼, 근거가 있는 만큼.</h2></div><div class="guide-steps"><p><span>01</span><b>관찰</b> P01–P06 중 지점을 골라 장면에서 보이는 문장만 기록합니다.</p><p><span>02</span><b>연결</b> 사료의 날짜·범위를 확인하고 직접·간접·참고 근거로 분류합니다.</p><p><span>03</span><b>수정</b> 새 단서를 연 뒤 설명을 고쳐 씁니다. 모르는 것을 남겨도 괜찮습니다.</p></div></div></section>
    </main>
    <footer class="pagefoot" data-od-id="footer"><div class="container row-between"><span>한 거리의 300년 · 합성 연습 프로토타입</span><span class="meta">실제 거리·사료 검수 전 단계 · 2026</span></div></footer>
    <dialog class="update-dialog" data-update-dialog><div class="dialog-head row-between"><div><p class="eyebrow">CHANGELOG</p><h2>업데이트 내역</h2></div><button class="btn btn-ghost" data-action="close-updates" aria-label="업데이트 내역 닫기">닫기 ×</button></div><div class="update-list">${UPDATE_HISTORY.map((item) => `<div class="log-row"><span class="meta">${item.date}</span><p>${item.text}</p></div>`).join('')}</div><p class="meta">개발·개선 내역은 이 합성 연습용 화면의 변경 기록입니다.</p></dialog>`;
  bindEvents();
  installImageFallbacks();
}

function renderSource(source) {
  const link = state.evidenceLinks.find((item) => item.sourceId === source.id && item.pointId === state.selectedPoint);
  const relations = [['direct', '직접'], ['indirect', '간접'], ['reference', '참고']];
  return `<article class="source-item ${link?.valid ? 'is-linked' : ''}"><div class="source-meta"><span class="source-id">${source.id}</span><span>${source.date} · ${source.kind}</span><span class="tag">${source.status}</span></div><b>${source.scope}</b><p>${source.note}</p><div class="relation-row"><span class="meta">근거 분류</span>${relations.map(([id, label]) => `<button class="relation-button ${link?.relation === id ? 'is-selected' : ''}${pulse('evidence') && source.id === 'S02' && id === 'direct' ? ' gi-pulse' : ''}" data-source="${source.id}" data-relation="${id}">${label}</button>`).join('')}</div>${link?.message ? `<small class="link-message">${escapeHTML(link.message)}</small>` : ''}</article>`;
}

function renderRevision() {
  if (!state.draftBefore) return '<p class="helper revision-placeholder">초안을 기록하면 새 단서를 열고 전후 설명을 비교할 수 있습니다.</p>';
  if (!state.draftAfter) return `<div class="clue-note"><b>초안 기록됨</b><span>${state.clueRevealed ? '새 단서: 후대 자료는 당시 장면의 직접 근거가 될 수 없습니다.' : '새 단서를 열어 설명을 수정해 보세요.'}</span></div><div class="revision-preview"><span>수정 전</span><p>${escapeHTML(state.draftBefore)}</p></div>`;
  return `<div class="revision-preview"><span>수정 전</span><p>${escapeHTML(state.draftBefore)}</p><span>수정 후</span><p>${escapeHTML(state.draftAfter)}</p></div>`;
}

function bindEvents() {
  root.querySelectorAll('[data-era]').forEach((button) => button.addEventListener('click', () => { setEra(state, Number(button.dataset.era)); render(); const target = document.querySelector('#workbench'); if (target) window.scrollTo({ top: Math.max(0, target.offsetTop - 72), behavior: 'smooth' }); }));
  root.querySelectorAll('[data-point]').forEach((button) => button.addEventListener('click', () => { setPoint(state, button.dataset.point); render(); }));
  root.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action)));
  root.querySelectorAll('[data-claim-type]').forEach((button) => button.addEventListener('click', () => handleClaimType(button.dataset.claimType)));
  root.querySelectorAll('[data-source][data-relation]').forEach((button) => button.addEventListener('click', () => handleEvidence(button.dataset.source, button.dataset.relation)));
  root.querySelectorAll('[data-preset]').forEach((button) => button.addEventListener('click', () => { state.lastNotice = `${button.textContent} 프리셋을 선택했습니다. 자동 회전은 없습니다.`; render(); }));
}

function handleAction(action) {
  if (action === 'observe') { const point = selectedPoint(); observePoint(state, state.selectedPoint, getPointEraContent(point, state.selectedEra).observation); markTask(state, 'observation'); state.lastNotice = `${state.selectedPoint} · ${state.selectedEra} 관찰을 세션에 기록했습니다.`; }
  if (action === 'draft') { const field = root.querySelector('[data-explanation]'); recordDraft(state, field?.value || ''); markTask(state, state.draftAfter ? 'revision' : 'draft'); state.lastNotice = state.draftAfter ? '수정 전·후 설명을 기록했습니다.' : '초안 설명을 기록했습니다.'; }
  if (action === 'clue') { revealClue(state); markTask(state, 'clue'); }
  if (action === 'updates') { root.querySelector('[data-update-dialog]')?.showModal(); return; }
  if (action === 'close-updates') { root.querySelector('[data-update-dialog]')?.close(); return; }
  render();
}

function handleClaimType(type) {
  const point = selectedPoint();
  if (type === 'historicalFact') { state.lastNotice = '생성 장면에서 보인 문장은 역사 사실로 자동 승격하지 않습니다. 검수 완료된 직접 사료가 필요합니다.'; render(); return; }
  const existing = state.claims.find((claim) => claim.pointId === point.id && claim.era === state.selectedEra);
  if (existing) existing.type = type;
  else state.claims.push({ id: `claim-${state.selectedEra}-${point.id}`, text: getPointEraContent(point, state.selectedEra).observation, type, era: state.selectedEra, pointId: point.id, sourceIds: [] });
  state.lastNotice = `${CLAIM_TYPES.find((item) => item.id === type).label} 경계를 선택했습니다.`;
  render();
}

function handleEvidence(sourceId, relation) {
  const source = sourceById(sourceId);
  const result = validateEvidence({ era: state.selectedEra, source, relation });
  const existingIndex = state.evidenceLinks.findIndex((item) => item.sourceId === sourceId && item.pointId === state.selectedPoint);
  const link = { sourceId, pointId: state.selectedPoint, era: state.selectedEra, relation, valid: result.valid, status: result.status, message: result.message };
  if (existingIndex >= 0) state.evidenceLinks[existingIndex] = link; else state.evidenceLinks.push(link);
  state.lastNotice = result.message;
  render();
}

function installImageFallbacks() {
  root.querySelectorAll('[data-street-image]').forEach((image) => image.addEventListener('error', () => { image.hidden = true; const fallback = image.parentElement.querySelector('[data-image-fallback]'); if (fallback) fallback.hidden = false; }));
}

render();

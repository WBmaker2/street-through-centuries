export function createSession() {
  return {
    selectedEra: 1725,
    selectedPoint: 'P01',
    evidenceLinks: [],
    observations: [],
    claims: [],
    completedTasks: [],
    revisionCount: 0,
    draftBefore: '',
    draftAfter: '',
    clueRevealed: false,
    lastNotice: '',
  };
}

export function observePoint(session, pointId, text) {
  const hasPoint = session.observations.some((observation) => observation.pointId === pointId && observation.era === session.selectedEra);
  if (!hasPoint) session.observations.push({ id: `observation-${session.selectedEra}-${pointId}`, text, era: session.selectedEra, pointId });
  return session;
}

export function setEra(session, eraId) {
  session.selectedEra = eraId;
  session.lastNotice = '';
  return session;
}

export function setPoint(session, pointId) {
  session.selectedPoint = pointId;
  session.lastNotice = '';
  return session;
}

export function recordDraft(session, text) {
  if (!text.trim()) return session;
  if (!session.draftBefore) session.draftBefore = text.trim();
  else {
    session.draftAfter = text.trim();
    session.revisionCount += 1;
  }
  return session;
}

export function revealClue(session) {
  session.clueRevealed = true;
  session.lastNotice = '새 단서가 열렸습니다. 설명을 다시 읽고 수정해 보세요.';
  return session;
}

export function markTask(session, taskId) {
  if (!session.completedTasks.includes(taskId)) session.completedTasks.push(taskId);
  return session;
}

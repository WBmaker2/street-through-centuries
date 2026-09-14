const ERA_YEARS = [1725, 1875, 2025];

export function validateEvidence({ era, source, relation, claimType = 'inference' }) {
  if (!ERA_YEARS.includes(era)) return { valid: false, status: 'invalid-era', message: '알 수 없는 시점입니다.' };
  if (!source || !source.id) return { valid: false, status: 'missing-source', message: '사료를 먼저 선택해 주세요.' };

  if (era === 1875 && ['S07', 'S08'].includes(source.id) && relation === 'direct') {
    return {
      valid: false,
      status: 'time-warning',
      message: `${source.id}(${source.date})은 1875년보다 후대 자료입니다. 직접 근거로 자동 확정하지 않습니다. 참고 근거로 남겨 보세요.`,
    };
  }
  if (claimType === 'historicalFact' && relation !== 'direct') {
    return { valid: false, status: 'relation-mismatch', message: '역사 사실은 직접 근거로만 연결할 수 있습니다.' };
  }
  if (source.status !== '검수 완료') {
    return { valid: true, status: 'review-pending', message: `${source.id}는 ${source.status} 상태입니다. 연결은 기록하지만 확정 사실로 승격하지 않습니다.` };
  }
  const isReference = relation === 'reference' || !sameEra(source.date, era);
  return {
    valid: true,
    status: isReference ? 'reference' : 'accepted',
    message: isReference ? '관련 사례로 기록했습니다. 동일 장소·시점의 직접 증거는 아닙니다.' : '근거 연결을 기록했습니다.',
  };
}

function sameEra(date, era) {
  const value = String(date);
  if (era === 1725) return value.includes('18세기');
  if (era === 1875) return value.includes('19세기') || value.includes('1870');
  return value.includes('2025');
}

export function canPromoteObservationToFact({ claim, source, relation }) {
  if (!claim || claim.type !== 'historicalFact') return { valid: false, reason: '관찰 카드는 역사 사실로 자동 승격하지 않습니다.' };
  if (!source || source.status !== '검수 완료' || relation !== 'direct') return { valid: false, reason: '검수 완료된 직접 사료가 필요합니다.' };
  return { valid: true, reason: '구조화된 사료 범위가 일치합니다.' };
}

export function getProgress(session) {
  const observationRecords = session.observations || session.claims.filter((claim) => claim.type === 'observation');
  const observationCount = new Set(observationRecords.map((record) => record.pointId)).size;
  const evidenceCount = session.evidenceLinks.filter((link) => link.valid).length;
  return { observationCount, evidenceCount, revisionCount: session.revisionCount };
}

export function imageFallbackModel(asset, sources) {
  return { assetId: asset.id, caption: asset.caption, sourceIds: [...asset.sourceIds], sourceLabels: asset.sourceIds.map((id) => sources.find((source) => source.id === id)?.id || id) };
}

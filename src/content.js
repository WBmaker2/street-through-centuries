export const ERAS = [
  { id: 1725, code: 'A', label: '1725', title: '후기 조선의 연습 시점', note: '거리의 폭과 행랑을 자료의 범위 안에서 살펴봅니다.', sources: ['S01', 'S02', 'S03', 'S04'] },
  { id: 1875, code: 'B', label: '1875', title: '개항 직전의 가설 시점', note: '1875년 장면을 살피고, 1876년 이후 변화는 참고 비교로만 다룹니다.', sources: ['S05', 'S06', 'S07', 'S08'] },
  { id: 2025, code: 'C', label: '2025', title: '현재 기준점', note: '오늘의 거리에서 공통 기준점을 다시 찾습니다.', sources: ['S09', 'S10', 'S11', 'S12'] },
];

export const POINTS = [
  {
    id: 'P01', label: '큰길의 폭과 가장자리', anchor: [24, 62], byEra: {
      1725: { prompt: '흙길과 건물 가장자리에서 직접 보이는 공간의 경계는 무엇인가요?', observation: '넓은 흙길이 화면 중앙을 차지하고, 양쪽 건물 앞에 낮은 단차와 진열 공간이 보입니다.' },
      1875: { prompt: '흙길과 가장자리의 형태를 보고 이동 공간을 어떻게 설명할 수 있나요?', observation: '넓고 울퉁불퉁한 흙길과 양쪽 건물 앞의 낮은 돌 단차가 보입니다.' },
      2025: { prompt: '차도와 보도의 경계에서 지금의 이동 공간은 어떻게 나뉘나요?', observation: '포장된 차도 양옆으로 연속된 보도와 낮은 턱이 분명하게 보입니다.' },
    } },
  {
    id: 'P02', label: '가게 앞 진열·행랑', anchor: [39, 48], byEra: {
      1725: { prompt: '처마 아래에서 눈으로 확인되는 진열 요소는 무엇인가요?', observation: '양쪽 처마 아래에 천으로 된 덮개, 바구니, 항아리와 낮은 목재 선반이 보입니다.' },
      1875: { prompt: '가게 앞의 덮개와 물건을 어디까지 직접 말할 수 있나요?', observation: '처마와 천막 아래에 바구니·포대처럼 보이는 물건과 낮은 진열대가 보입니다.' },
      2025: { prompt: '현대 상점의 앞 공간에서 보이는 요소와 추론을 어떻게 나눌까요?', observation: '유리 상점면과 차양, 화분·간판처럼 보이는 상점 앞 요소가 보이지만 상호나 용도는 확인할 수 없습니다.' },
    } },
  {
    id: 'P03', label: '교통 표지와 이동 수단', anchor: [69, 59], byEra: {
      1725: { prompt: '그림에서 확인되는 이동 수단의 형태만 말해 볼까요?', observation: '길 양쪽에 나무 바퀴가 달린 손수레처럼 보이는 물체가 놓여 있습니다.' },
      1875: { prompt: '사람과 수레가 함께 보이는 장면에서 직접 관찰할 수 있는 것은 무엇인가요?', observation: '흙길에 바퀴 달린 수레와 걷는 사람들이 보이며, 전차나 선로는 보이지 않습니다.' },
      2025: { prompt: '현재 장면의 교통 시설과 이동 수단을 보이는 만큼 기록해 보세요.', observation: '교차로의 신호등과 횡단보도, 보도 가장자리의 자전거가 보이며 수레나 선로는 보이지 않습니다.' },
    } },
  {
    id: 'P04', label: '공공 공간·거리 시설', anchor: [53, 31], byEra: {
      1725: { prompt: '먼 곳의 구조물을 보이는 모양만 기록하고 공공 용도는 보류해 보세요.', observation: '길 먼 곳 중앙에 십자형 목재 구조물이 보이지만, 용도나 공공성은 이미지로 확인할 수 없습니다.' },
      1875: { prompt: '거리 가운데의 구조물과 주변 시설 중 실제로 보이는 것만 말해 볼까요?', observation: '길 먼 곳 중앙에 십자형 목재 구조물이 보이며, 전신 시설·전차 시설이라고 판단할 근거는 없습니다.' },
      2025: { prompt: '현재 거리 시설의 형태를 확인하고 이름이나 역할은 자료와 구분해 보세요.', observation: '교차로 위 신호등과 가로등, 보도 가장자리의 화분과 벤치처럼 보이는 시설이 보입니다.' },
    } },
  {
    id: 'P05', label: '사람들의 복장·행동', anchor: [78, 48], byEra: {
      1725: { prompt: '인물이 선명하지 않을 때 말할 수 있는 범위는 어디까지인가요?', observation: '거리의 인물은 뚜렷하게 식별되지 않아 복장이나 행동을 확인할 수 없습니다.' },
      1875: { prompt: '한 장면의 인물에게서 확인할 수 있는 것과 모르는 것을 나눠 보세요.', observation: '여러 사람이 걷거나 서 있고 모자와 긴 옷처럼 보이는 형태가 있으나, 신분이나 사회 전체의 모습은 알 수 없습니다.' },
      2025: { prompt: '현재 보이는 보행자의 모습만 기록하고 전체 사회로 확대하지 않아 보세요.', observation: '보도에 여러 보행자가 보이고 자전거를 든 사람도 있지만, 이 장면만으로 사람들의 전체 생활을 말할 수 없습니다.' },
    } },
  {
    id: 'P06', label: '땅·배수·골목 연결', anchor: [86, 72], byEra: {
      1725: { prompt: '길 표면과 가장자리에서 배수 시설을 어디까지 확인할 수 있나요?', observation: '흙길 표면과 돌이 흩어진 가장자리는 보이지만, 열린 물길이나 다리는 확인되지 않습니다.' },
      1875: { prompt: '길의 단차와 표면을 관찰하고 보이지 않는 시설은 모름으로 남겨 보세요.', observation: '울퉁불퉁한 흙길과 가장자리의 돌·단차가 보이지만, 물길이나 골목의 연결은 이미지에서 확인하기 어렵습니다.' },
      2025: { prompt: '포장면·턱·배수 덮개처럼 실제로 보이는 연결 요소를 찾아보세요.', observation: '포장 차도와 보도가 낮은 턱으로 이어지고, 보도에 덮개처럼 보이는 직사각형 시설이 보입니다.' },
    } },
];

export function getPointEraContent(point, eraId) {
  return point.byEra?.[eraId] || { prompt: '이 시점에서 직접 보이는 요소만 기록해 보세요.', observation: '이 시점의 관찰 문장이 아직 준비되지 않았습니다.' };
}

export const CLAIM_TYPES = [
  { id: 'observation', label: '관찰', hint: '장면에서 직접 보이는 내용' },
  { id: 'historicalFact', label: '역사 사실', hint: '검수된 사료가 직접 확인하는 범위' },
  { id: 'inference', label: '추론', hint: '관찰과 사료를 이어 만든 해석' },
  { id: 'unknown', label: '모름', hint: '자료가 부족해 결론을 보류함' },
];

export const SOURCES = [
  { id: 'S01', date: '18세기', kind: '지도', scope: '한성 도성·도로 발췌', note: '도로 축과 성문 위치를 연습하는 목업 지도입니다.', status: '목업·검토 대기', defaultRelation: 'direct' },
  { id: 'S02', date: '18세기', kind: '기록', scope: '시전·행랑 관련 발췌', note: '행랑과 장사 공간을 연결해 보는 목업 기록입니다.', status: '목업·검토 대기', defaultRelation: 'direct' },
  { id: 'S03', date: '18세기', kind: '기록', scope: '상업·가격·상품 메모', note: '상품 기록과 실제 장소의 연결 범위는 아직 모릅니다.', status: '목업·검토 대기', defaultRelation: 'indirect' },
  { id: 'S04', date: '발굴 기록', kind: '도면', scope: '종로 시전행랑 유구 사례', note: '관련 사례이지만 동일 구간의 확정 증거는 아닙니다.', status: '목업·검토 대기', defaultRelation: 'reference' },
  { id: 'S05', date: '19세기', kind: '지도', scope: '서울 도로·성문 지도', note: '도로 연결을 비교하는 목업 지도입니다.', status: '목업·검토 대기', defaultRelation: 'direct' },
  { id: 'S06', date: '1870년대', kind: '기록', scope: '개항·도시 행정 기록', note: '변화가 겹치는 시점의 행정 언어를 살펴봅니다.', status: '목업·검토 대기', defaultRelation: 'direct' },
  { id: 'S07', date: '1896', kind: '기록', scope: '종로 가로 정비 기록', note: '1875 화면에 직접 붙일 수 없는 후대 자료입니다.', status: '목업·검토 대기', defaultRelation: 'reference' },
  { id: 'S08', date: '1898', kind: '기록', scope: '종로 전차 선로 기록', note: '1875 화면에 직접 붙일 수 없는 후대 자료입니다.', status: '목업·검토 대기', defaultRelation: 'reference' },
  { id: 'S09', date: '20세기 초', kind: '사진', scope: '종로 사진·엽서 사례', note: '촬영 위치와 방향을 확인해야 하는 목업 이미지입니다.', status: '목업·검토 대기', defaultRelation: 'reference' },
  { id: 'S10', date: '20세기', kind: '생활 자료', scope: '상점·시장 생활 자료', note: '개별 상호를 특정하지 않는 목업 생활 자료입니다.', status: '목업·검토 대기', defaultRelation: 'indirect' },
  { id: 'S11', date: '2025', kind: '지도', scope: '현재 도로 지도·공공 거리뷰', note: '현재의 기준점을 확인하는 목업 지도입니다.', status: '목업·검토 대기', defaultRelation: 'direct' },
  { id: 'S12', date: '근현대', kind: '유물', scope: '공평동 골목길·생활유물 사례', note: '다른 구간의 사례이므로 참고 근거로만 둡니다.', status: '목업·검토 대기', defaultRelation: 'reference' },
];

export const ASSETS = {
  1725: { id: 'A1725-STREET', path: './assets/practice-street-1725.png', sourceIds: ['S01', 'S02'], caption: '합성 연습용 · 실제 사료 사진 아님 · 검수 전 · 특정 실제 거리 아님', alt: '1725년을 가정한 합성 연습 거리 장면' },
  1875: { id: 'A1875-STREET', path: './assets/practice-street-1875.png', sourceIds: ['S05', 'S06'], caption: '합성 연습용 · 실제 사료 사진 아님 · 검수 전 · 특정 실제 거리 아님', alt: '1875년을 가정한 합성 연습 거리 장면' },
  2025: { id: 'A2025-STREET', path: './assets/practice-street-2025.png', sourceIds: ['S11'], caption: '합성 연습용 · 실제 사료 사진 아님 · 검수 전 · 특정 실제 거리 아님', alt: '2025년을 가정한 합성 연습 거리 장면' },
};

export const REVIEW_LINKS = [
  { label: '서울역사박물관 조선시대의 서울', url: 'https://museum.seoul.go.kr/www/exh/per/exhPer1th.jsp' },
  { label: '서울역사박물관 도시유적보존', url: 'https://museum.seoul.go.kr/www/relic/cons/dataConssumculture/dataConssumcity.jsp?sso=ok' },
  { label: '서울역사박물관 개항·대한제국기의 서울', url: 'https://museum.seoul.go.kr/www/exh/per/exhPer2th.jsp?sso=ok' },
  { label: '서울역사박물관 공평동 현장박물관 보도자료', url: 'https://museum.seoul.go.kr/www/board/NR_boardView.do?bbsCd=1015&seq=20180912165823934&sso=ok' },
];

export const UPDATE_HISTORY = [
  { date: '2026-09-14', text: '역사 검수 P0 교정: 시대별 관찰·질문 분리, 1875 연대 경계, 합성 이미지 캡션과 검수 정보 영역을 보강했습니다.' },
  { date: '2026-09-14', text: '합성 연습 거리, 목업 사료, 시점 경고와 설명 수정 흐름을 추가했습니다.' },
  { date: '2026-09-14', text: '320px·키보드 경로와 이미지 실패 시 평면도 대체를 준비했습니다.' },
];

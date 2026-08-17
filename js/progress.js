/**
 * Yeongseo Middle School Class Progress Tracker & Grade-Specific Syllabus Manager
 * Grades: 1 ~ 3, Classes: 1 ~ 8 (22 Classes Total)
 * Teacher: Jongyoon Lim (임종윤 교사 - 수학과)
 */

const ProgressModule = {
  activeGrade: 2, // 기본값: 2학년
  hasUnsavedChanges: false, // 저장 버튼 누르기 전 수정 여부 플래그

  // 1학년 기본 진도표 (예시 25차시 -> 추가/업로드 가능)
  defaultSyllabus1: [
    { period: 1, mainUnit: 'Ⅰ. 수와 연산', subUnit: '1. 소인수분해', topic: '소수와 합성수의 개념 탐구' },
    { period: 2, mainUnit: 'Ⅰ. 수와 연산', subUnit: '1. 소인수분해', topic: '소인수분해의 뜻과 인수분해 방법' },
    { period: 3, mainUnit: 'Ⅰ. 수와 연산', subUnit: '1. 소인수분해', topic: '소인수분해를 이용한 최대공약수 구하기' },
    { period: 4, mainUnit: 'Ⅰ. 수와 연산', subUnit: '1. 소인수분해', topic: '소인수분해를 이용한 최소공배수 구하기' },
    { period: 5, mainUnit: 'Ⅰ. 수와 연산', subUnit: '2. 정수와 유리수', topic: '정수와 유리수의 개념 및 수직선 표현' },
    { period: 6, mainUnit: 'Ⅰ. 수와 연산', subUnit: '2. 정수와 유리수', topic: '절댓값의 뜻과 수의 대소 관계' },
    { period: 7, mainUnit: 'Ⅰ. 수와 연산', subUnit: '2. 정수와 유리수', topic: '정수와 유리수의 덧셈과 뺄셈' },
    { period: 8, mainUnit: 'Ⅰ. 수와 연산', subUnit: '2. 정수와 유리수', topic: '정수와 유리수의 곱셈과 나눗셈' },
    { period: 9, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '1. 문자와 식', topic: '문자의 사용과 기호의 생략 규칙' },
    { period: 10, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '1. 문자와 식', topic: '식의 값 구하기 및 일차식의 계산' },
    { period: 11, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '2. 일차방정식', topic: '방정식과 등식의 성질 탐구' },
    { period: 12, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '2. 일차방정식', topic: '일차방정식의 풀이 기법' },
    { period: 13, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '2. 일차방정식', topic: '일차방정식의 활용 (수와 나이 문제)' },
    { period: 14, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '2. 일차방정식', topic: '일차방정식의 활용 (거리·속력·시간)' },
    { period: 15, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '3. 좌표평면과 그래프', topic: '순서쌍과 좌표평면 및 사분면' },
    { period: 16, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '3. 좌표평면과 그래프', topic: '그래프의 해석 및 정비례 관계' },
    { period: 17, mainUnit: 'Ⅱ. 변화와 관계', subUnit: '3. 좌표평면과 그래프', topic: '반비례 관계와 그 그래프의 성질' },
    { period: 18, mainUnit: 'Ⅲ. 도형과 측정', subUnit: '1. 기본 도형', topic: '점·선·면·각 및 위치 관계' },
    { period: 19, mainUnit: 'Ⅲ. 도형과 측정', subUnit: '1. 기본 도형', topic: '평행선의 성질 (동의각과 엇각)' },
    { period: 20, mainUnit: 'Ⅲ. 도형과 측정', subUnit: '2. 평면도형의 성질', topic: '다각형의 내각과 외각의 크기의 합' },
    { period: 21, mainUnit: 'Ⅲ. 도형과 측정', subUnit: '2. 평면도형의 성질', topic: '원과 부채꼴의 호의 길이와 넓이' },
    { period: 22, mainUnit: 'Ⅲ. 도형과 측정', subUnit: '3. 입체도형의 성질', topic: '다면체와 회전체의 성질' },
    { period: 23, mainUnit: 'Ⅲ. 도형과 측정', subUnit: '3. 입체도형의 성질', topic: '입체도형의 겉넓이와 부피 구하기' },
    { period: 24, mainUnit: 'Ⅳ. 통계', subUnit: '1. 자료의 정리', topic: '줄기와 잎 그림, 도수분포표' },
    { period: 25, mainUnit: 'Ⅳ. 통계', subUnit: '1. 자료의 정리', topic: '히스토그램, 도수분포다각형, 상대도수' }
  ],

  // 2학년 2학기 마스터 50차시 진도표 (5단원 ~ 8단원)
  defaultSyllabus2: [
    { period: 1, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '단원 도입', topic: '단원 열기 및 준비 학습 (초/중1 도형 진단)' },
    { period: 2, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '1. 삼각형의 성질', topic: '이등변삼각형의 뜻과 두 밑각의 크기가 같음의 증명' },
    { period: 3, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '1. 삼각형의 성질', topic: '이등변삼각형의 꼭지각의 이등분선과 밑변 수직이등분 성질' },
    { period: 4, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '1. 삼각형의 성질', topic: '두 각의 크기가 같은 삼각형은 이등변삼각형임을 증명' },
    { period: 5, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '1. 삼각형의 성질', topic: '직각삼각형의 RHA 합동 조건 탐구 및 증명' },
    { period: 6, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '1. 삼각형의 성질', topic: '직각삼각형의 RHS 합동 조건 및 각의 이등분선의 성질' },
    { period: 7, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '2. 외심과 내심', topic: '삼각형의 외심의 뜻과 세 변의 수직이등분선 교점 성질' },
    { period: 8, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '2. 외심과 내심', topic: '삼각형의 외심의 위치(직각삼각형 빗변 중점) 및 각도 응용' },
    { period: 9, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '2. 외심과 내심', topic: '삼각형의 내심의 뜻과 세 내각의 이등분선 교점 성질' },
    { period: 10, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '2. 외심과 내심', topic: '삼각형의 내심의 각도 응용 및 내접원과 삼각형 넓이 공식' },
    { period: 11, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '2. 외심과 내심', topic: '삼각형의 외심과 내심의 성질 종합 비교 및 심화' },
    { period: 12, mainUnit: 'Ⅴ. 삼각형의 성질', subUnit: '단원 마무리', topic: 'Ⅴ. 삼각형의 성질 대단원 총괄 평가 및 피드백' },
    { period: 13, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '단원 도입', topic: '단원 열기 및 여러 가지 사각형 모양 관찰' },
    { period: 14, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '1. 평행사변형', topic: '평행사변형의 정의와 두 대변/대각의 성질 증명' },
    { period: 15, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '1. 평행사변형', topic: '평행사변형의 두 대각선의 이등분 성질 증명' },
    { period: 16, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '1. 평행사변형', topic: '평행사변형이 되는 5가지 조건 탐구 및 증명' },
    { period: 17, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '1. 평행사변형', topic: '평행사변형과 넓이의 이등분 및 내부의 한 점과 넓이' },
    { period: 18, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '2. 여러 가지 사각형', topic: '직사각형의 뜻과 대각선의 길이 성질 및 조건' },
    { period: 19, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '2. 여러 가지 사각형', topic: '마름모의 뜻과 두 대각선의 수직이등분 성질 및 조건' },
    { period: 20, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '2. 여러 가지 사각형', topic: '정사각형과 등변사다리꼴의 뜻과 성질' },
    { period: 21, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '2. 여러 가지 사각형', topic: '여러 가지 사각형 사이의 포함 관계 및 중점 연결 사각형' },
    { period: 22, mainUnit: 'Ⅵ. 사각형의 성질', subUnit: '2. 여러 가지 사각형', topic: '평행선과 삼각형의 넓이 및 사각형 변형' },
    { period: 23, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '단원 도입', topic: '합동과 닮음의 비교 및 닮음 직관 형성' },
    { period: 24, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '1. 도형의 닮음', topic: '닮은 평면도형의 성질 (닮음비, 대응변, 대응각)' },
    { period: 25, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '1. 도형의 닮음', topic: '닮은 입체도형의 성질 (대응 모서리 비, 대응 면)' },
    { period: 26, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '1. 도형의 닮음', topic: '삼각형의 3가지 닮음 조건 (SSS, SAS, AA 닮음)' },
    { period: 27, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '1. 도형의 닮음', topic: '삼각형의 닮음 조건의 응용 및 건물 높이 측정' },
    { period: 28, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '1. 도형의 닮음', topic: '직각삼각형의 닮음 공식 3가지 및 소 공식' },
    { period: 29, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '삼각형에서 평행선과 선분의 길이의 비 성질' },
    { period: 30, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '평행선 사이에 있는 선분의 비 및 사다리꼴 응용' },
    { period: 31, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '삼각형의 내각의 이등분선 및 외각의 이등분선 정리' },
    { period: 32, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '삼각형의 중점연결정리 및 사각형 적용' },
    { period: 33, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '사다리꼴의 중점연결선분의 길이 및 대각선 교점' },
    { period: 34, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '삼각형의 중선과 무게중심(G) 및 2:1 나누는 성질' },
    { period: 35, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '무게중심과 6개 소삼각형 넓이의 성질' },
    { period: 36, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '2. 닮음의 응용', topic: '닮은 도형의 넓이의 비(m²:n²)와 부피의 비(m³:n³)' },
    { period: 37, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '3. 피타고라스 정리', topic: '피타고라스 정리(a²+b²=c²) 뜻과 증명 탐구' },
    { period: 38, mainUnit: 'Ⅶ. 도형의 닮음과 피타고라스', subUnit: '3. 피타고라스 정리', topic: '직각삼각형이 되기 위한 조건 및 히포크라테스 초승달 넓이' },
    { period: 39, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '단원 도입', topic: '단원 열기 및 생활 속 경우의 수와 확률 탐구' },
    { period: 40, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '1. 경우의 수', topic: '사건과 경우의 수 (순서쌍과 수형도로 세기)' },
    { period: 41, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '1. 경우의 수', topic: '사건 A 또는 사건 B가 일어나는 경우 (합의 법칙)' },
    { period: 42, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '1. 경우의 수', topic: '사건 A와 사건 B가 동시에 일어나는 경우 (곱의 법칙)' },
    { period: 43, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '1. 경우의 수', topic: '한 줄로 세우는 경우의 수 및 이웃하는 경우' },
    { period: 44, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '1. 경우의 수', topic: '숫자 카드로 정수 만드는 경우의 수 (0 포함)' },
    { period: 45, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '1. 경우의 수', topic: '대표를 뽑는 경우의 수 (자격이 다른 vs 같은 대표)' },
    { period: 46, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '2. 확률과 그 계산', topic: '확률의 뜻과 기본 개념 (사건 경우의 수 / 전체)' },
    { period: 47, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '2. 확률과 그 계산', topic: '확률의 기본 성질 (0 <= p <= 1, 1과 0의 의미)' },
    { period: 48, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '2. 확률과 그 계산', topic: '여사건의 확률 (1 - p, 적어도 하나는 ~일 확률)' },
    { period: 49, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '2. 확률과 그 계산', topic: '확률의 계산 (확률의 합의 법칙과 곱의 법칙)' },
    { period: 50, mainUnit: 'Ⅷ. 경우의 수와 확률', subUnit: '2. 확률과 그 계산', topic: '연속하여 뽑는 확률 (복원 vs 비복원) 및 2학기 총괄 평가' }
  ],

  // 3학년 기본 진도표 (예시 25차시 -> 추가/업로드 가능)
  defaultSyllabus3: [
    { period: 1, mainUnit: 'Ⅰ. 실수와 그 계산', subUnit: '1. 제곱근과 실수', topic: '제곱근의 뜻과 성질' },
    { period: 2, mainUnit: 'Ⅰ. 실수와 그 계산', subUnit: '1. 제곱근과 실수', topic: '무리수와 실수의 이해 및 수직선 표현' },
    { period: 3, mainUnit: 'Ⅰ. 실수와 그 계산', subUnit: '2. 근호를 포함한 식의 계산', topic: '제곱근의 곱셈과 나눗셈 및 분모의 유리아' },
    { period: 4, mainUnit: 'Ⅰ. 실수와 그 계산', subUnit: '2. 근호를 포함한 식의 계산', topic: '제곱근의 덧셈과 뺄셈 및 혼합 계산' },
    { period: 5, mainUnit: 'Ⅱ. 다항식의 곱셈과 인수분해', subUnit: '1. 다항식의 곱셈', topic: '다항식의 곱셈 공식 (1) (a+b)² 및 (a-b)²' },
    { period: 6, mainUnit: 'Ⅱ. 다항식의 곱셈과 인수분해', subUnit: '1. 다항식의 곱셈', topic: '합차 공식 (a+b)(a-b) 및 곱셈 공식의 활용' },
    { period: 7, mainUnit: 'Ⅱ. 다항식의 곱셈과 인수분해', subUnit: '2. 인수분해', topic: '인수분해의 뜻과 공통인수로 묶기' },
    { period: 8, mainUnit: 'Ⅱ. 다항식의 곱셈과 인수분해', subUnit: '2. 인수분해', topic: '인수분해 공식 4가지 적용' },
    { period: 9, mainUnit: 'Ⅱ. 다항식의 곱셈과 인수분해', subUnit: '2. 인수분해', topic: '복잡한 식의 인수분해 및 식의 값 구하기' },
    { period: 10, mainUnit: 'Ⅲ. 이차방정식', subUnit: '1. 이차방정식의 풀이', topic: '이차방정식의 뜻과 해의 개념' },
    { period: 11, mainUnit: 'Ⅲ. 이차방정식', subUnit: '1. 이차방정식의 풀이', topic: '인수분해를 이용한 이차방정식의 풀이' },
    { period: 12, mainUnit: 'Ⅲ. 이차방정식', subUnit: '1. 이차방정식의 풀이', topic: '제곱근과 완전제곱식을 이용한 풀이' },
    { period: 13, mainUnit: 'Ⅲ. 이차방정식', subUnit: '1. 이차방정식의 풀이', topic: '근의 공식 유도 및 적용' },
    { period: 14, mainUnit: 'Ⅲ. 이차방정식', subUnit: '2. 이차방정식의 활용', topic: '이차방정식의 활용 (수, 도형, 동역학 문제)' },
    { period: 15, mainUnit: 'Ⅳ. 이차함수', subUnit: '1. 이차함수와 그래프', topic: '이차함수의 뜻과 y = ax² 그래프의 성질' },
    { period: 16, mainUnit: 'Ⅳ. 이차함수', subUnit: '1. 이차함수와 그래프', topic: 'y = a(x-p)² + q 꼴의 그래프와 평행이동' },
    { period: 17, mainUnit: 'Ⅳ. 이차함수', subUnit: '2. 이차함수 y = ax² + bx + c', topic: '일반형을 표준형으로 고쳐 그래프 그리기' },
    { period: 18, mainUnit: 'Ⅴ. 삼각비', subUnit: '1. 삼각비', topic: '삼각비의 뜻 (sin, cos, tan)' },
    { period: 19, mainUnit: 'Ⅴ. 삼각비', subUnit: '1. 삼각비', topic: '30°, 45°, 60° 특수각의 삼각비의 값' },
    { period: 20, mainUnit: 'Ⅴ. 삼각비', subUnit: '2. 삼각비의 활용', topic: '삼각비를 이용한 높이와 거리 구하기' },
    { period: 21, mainUnit: 'Ⅴ. 삼각비', subUnit: '2. 삼각비의 활용', topic: '삼각비를 이용한 삼각형 및 사각형 넓이 구하기' },
    { period: 22, mainUnit: 'Ⅵ. 원의 성질', subUnit: '1. 원과 직선', topic: '원의 현과 접선의 성질' },
    { period: 23, mainUnit: 'Ⅵ. 원의 성질', subUnit: '2. 원주각', topic: '원주각의 성질 및 중심각과의 관계' },
    { period: 24, mainUnit: 'Ⅵ. 원의 성질', subUnit: '2. 원주각', topic: '원주각의 활용 및 원에 내접하는 사각형' },
    { period: 25, mainUnit: 'Ⅶ. 통계', subUnit: '1. 대표값과 산포도', topic: '평균, 중앙값, 최빈값, 분산과 표준편차' }
  ],

  // 학년별 독립 진도표 컨테이너
  syllabusData: {},

  // 학년별 완료 체크리스트 컨테이너 ({ grade: { classNum: [periods] } })
  checklistData: {
    1: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] },
    2: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] },
    3: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }
  },

  initSyllabusData() {
    if (!this.syllabusData[1]) this.syllabusData[1] = JSON.parse(JSON.stringify(this.defaultSyllabus1));
    if (!this.syllabusData[2]) this.syllabusData[2] = JSON.parse(JSON.stringify(this.defaultSyllabus2));
    if (!this.syllabusData[3]) this.syllabusData[3] = JSON.parse(JSON.stringify(this.defaultSyllabus3));

    try {
      const cached = localStorage.getItem('mathlab_syllabus_checklist_cache');
      if (cached && !this._hasLoadedFromCache) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._hasLoadedFromCache = true;
          this.updateFromSheet(parsed);
        }
      }
    } catch (e) {}
  },

  getCurrentSyllabus() {
    this.initSyllabusData();
    return this.syllabusData[this.activeGrade] || [];
  },

  switchGrade(grade) {
    if (this.hasUnsavedChanges) {
      if (!confirm('⚠️ 저장되지 않은 수정사항이 있습니다. 학년을 변경하면 변경 내용이 사라질 수 있습니다. 이동하시겠습니까?')) {
        return;
      }
    }
    this.hasUnsavedChanges = false;
    this.activeGrade = grade;
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderView();
    }
  },

  updateFromSheet(checklistItems) {
    if (!Array.isArray(checklistItems) || checklistItems.length === 0) return;
    this.initSyllabusData();

    // Reset checklistData before populating synced DB items
    this.checklistData = {
      1: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] },
      2: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] },
      3: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }
    };

    checklistItems.forEach(item => {
      const g = Number(item.grade) || 2;
      const p = Number(item.period);
      if (p >= 1 && g >= 1 && g <= 3) {
        const checkedClassesStr = String(item.checkedClasses || '');
        const classNums = checkedClassesStr.split(',').map(n => Number(n.trim ? n.trim() : n)).filter(n => n > 0);
        
        if (!this.checklistData[g]) this.checklistData[g] = {};
        classNums.forEach(c => {
          if (!this.checklistData[g][c]) this.checklistData[g][c] = [];
          if (!this.checklistData[g][c].includes(p)) {
            this.checklistData[g][c].push(p);
          }
        });

        if (this.syllabusData[g]) {
          const target = this.syllabusData[g].find(s => s.period === p);
          if (target) {
            if (item.mainUnit) target.mainUnit = item.mainUnit;
            if (item.subUnit) target.subUnit = item.subUnit;
            if (item.topic) target.topic = item.topic;
          }
        }
      }
    });

    const mainView = document.getElementById('teacher-main-view');
    if (mainView && document.querySelector('.syllabus-table')) {
      mainView.innerHTML = this.renderView();
    }
  },

  toggleCheck(period, classNum) {
    if (!this.checklistData[this.activeGrade]) {
      this.checklistData[this.activeGrade] = {};
    }
    if (!this.checklistData[this.activeGrade][classNum]) {
      this.checklistData[this.activeGrade][classNum] = [];
    }

    const list = this.checklistData[this.activeGrade][classNum];
    const idx = list.indexOf(period);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(period);
    }

    this.markAsUnsaved();
    this.updateStatsUI();
  },

  toggleAllForPeriod(period) {
    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    if (!this.checklistData[this.activeGrade]) {
      this.checklistData[this.activeGrade] = {};
    }

    let allChecked = true;
    for (let c = 1; c <= totalClasses; c++) {
      const list = this.checklistData[this.activeGrade][c] || [];
      if (!list.includes(period)) {
        allChecked = false;
        break;
      }
    }

    for (let c = 1; c <= totalClasses; c++) {
      if (!this.checklistData[this.activeGrade][c]) {
        this.checklistData[this.activeGrade][c] = [];
      }
      const list = this.checklistData[this.activeGrade][c];
      const idx = list.indexOf(period);

      if (allChecked) {
        if (idx >= 0) list.splice(idx, 1);
      } else {
        if (idx < 0) list.push(period);
      }
    }

    this.markAsUnsaved();
    this.renderTableOnly();
    this.updateStatsUI();
  },

  handleTextEdit(period, field, value) {
    const syl = this.getCurrentSyllabus();
    const target = syl.find(s => s.period === period);
    if (target) {
      target[field] = value;
      this.markAsUnsaved();
    }
  },

  markAsUnsaved() {
    this.hasUnsavedChanges = true;
    const saveBtn = document.getElementById('save-syllabus-btn');
    if (saveBtn) {
      saveBtn.style.animation = 'pulseSave 1.5s infinite alternate';
      saveBtn.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.6)';
    }

    const syncStatusEl = document.getElementById('cloud-sync-status');
    if (syncStatusEl) {
      syncStatusEl.innerHTML = '⚠️ <span style="color: #d97706; font-weight: 800;">수정사항 있음 (저장 버튼을 누르세요)</span>';
      syncStatusEl.style.background = '#fef3c7';
      syncStatusEl.style.borderColor = '#fde68a';
    }
  },

  updateStatsUI() {
    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    const syl = this.getCurrentSyllabus();
    const totalPeriods = syl.length || 1;

    for (let c = 1; c <= totalClasses; c++) {
      const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
      const pct = Math.round((list.length / totalPeriods) * 100);
      
      const badgeEl = document.getElementById(`pct-badge-${c}`);
      if (badgeEl) badgeEl.textContent = `${pct}% (${list.length}/${totalPeriods}차시)`;

      const fillEl = document.getElementById(`bar-fill-${c}`);
      if (fillEl) fillEl.style.width = `${pct}%`;
    }

    syl.forEach(item => {
      let count = 0;
      for (let c = 1; c <= totalClasses; c++) {
        const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
        if (list.includes(item.period)) count++;
      }
      const countEl = document.getElementById(`completed-count-${item.period}`);
      if (countEl) {
        countEl.textContent = `${count}/${totalClasses}개반`;
        countEl.style.background = count === totalClasses ? '#d1fae5' : count > 0 ? '#e0e7ff' : '#f1f5f9';
        countEl.style.color = count === totalClasses ? '#047857' : count > 0 ? '#3730a3' : '#64748b';
      }
    });
  },

  async saveToCloudDB() {
    const syncStatusEl = document.getElementById('cloud-sync-status');
    const saveBtn = document.getElementById('save-syllabus-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '⏳ 클라우드 DB 저장 중...';
    }
    if (syncStatusEl) {
      syncStatusEl.innerHTML = '🔄 <span style="color: #4f46e5; font-weight: 800;">클라우드 DB 전송 중...</span>';
    }

    this.initSyllabusData();
    const payloadItems = [];
    [1, 2, 3].forEach(g => {
      const syl = this.syllabusData[g] || [];
      const totalClasses = (g === 3) ? 6 : 8;
      syl.forEach(item => {
        const checkedClasses = [];
        for (let c = 1; c <= totalClasses; c++) {
          const list = (this.checklistData[g] && this.checklistData[g][c]) || [];
          if (list.includes(item.period)) {
            checkedClasses.push(c);
          }
        }
        payloadItems.push({
          grade: g,
          period: item.period,
          mainUnit: item.mainUnit,
          subUnit: item.subUnit,
          topic: item.topic,
          checkedClasses: checkedClasses
        });
      });
    });

    try {
      if (window.CloudDB && CloudDB.saveSyllabusChecklist) {
        await CloudDB.saveSyllabusChecklist(payloadItems);
      }
      this.hasUnsavedChanges = false;
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.style.animation = 'none';
        saveBtn.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.25)';
        saveBtn.innerHTML = `💾 ${this.activeGrade}학년 진도 수정사항 저장하기`;
      }
      if (syncStatusEl) {
        syncStatusEl.innerHTML = '✅ <span style="color: #059669; font-weight: 800;">클라우드 DB 저장 완료!</span>';
        syncStatusEl.style.background = '#d1fae5';
        syncStatusEl.style.borderColor = '#6ee7b7';
      }
      alert(`✅ ${this.activeGrade}학년 진도표 및 체크리스트가 클라우드 DB에 성공적으로 저장되었습니다!`);
    } catch (err) {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `💾 ${this.activeGrade}학년 진도 수정사항 저장하기`;
      }
      alert('⚠️ 로컬에 임시 저장되었습니다.');
    }
  },

  // 5. 1학년/3학년 진도표 파일 업로드 / 텍스트 묶음 등록 팝업 모달
  openUploadModal() {
    const overlay = document.getElementById('syllabus-upload-modal');
    if (overlay) overlay.classList.add('active');
  },

  closeUploadModal() {
    const overlay = document.getElementById('syllabus-upload-modal');
    if (overlay) overlay.classList.remove('active');
  },

  // 텍스트/파일 업로드 처리
  handleSyllabusTextImport() {
    const textarea = document.getElementById('syllabus-raw-textarea');
    const targetGradeSelect = document.getElementById('upload-target-grade');
    if (!textarea || !textarea.value.trim()) {
      alert('⚠️ 진도표 텍스트나 CSV 내역을 입력해 주세요.');
      return;
    }

    const targetGrade = Number(targetGradeSelect ? targetGradeSelect.value : this.activeGrade);
    const rawLines = textarea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const parsedItems = [];
    rawLines.forEach((line, idx) => {
      // CSV or Tab or | 구분자 지원
      let parts = line.split('\t');
      if (parts.length < 3) parts = line.split(',');
      if (parts.length < 3) parts = line.split('|');

      if (parts.length >= 3) {
        parsedItems.push({
          period: idx + 1,
          mainUnit: parts[0].trim(),
          subUnit: parts[1].trim(),
          topic: parts.slice(2).join(' ').trim()
        });
      } else {
        // 단일 행 텍스트인 경우
        parsedItems.push({
          period: idx + 1,
          mainUnit: `${targetGrade}학년 수학`,
          subUnit: `단원 #${idx+1}`,
          topic: line
        });
      }
    });

    if (parsedItems.length > 0) {
      this.initSyllabusData();
      this.syllabusData[targetGrade] = parsedItems;
      this.activeGrade = targetGrade;
      this.hasUnsavedChanges = true;
      this.closeUploadModal();
      
      const mainView = document.getElementById('teacher-main-view');
      if (mainView) {
        mainView.innerHTML = this.renderView();
      }
      alert(`🎉 ${targetGrade}학년 진도표 ${parsedItems.length}개 차시가 성공적으로 교체 등록되었습니다!\n[💾 ${targetGrade}학년 진도 수정사항 저장하기] 버튼을 누르면 클라우드 DB에 반영됩니다.`);
    }
  },

  renderTableOnly() {
    const tableContainer = document.getElementById('syllabus-table-container');
    if (tableContainer) {
      tableContainer.innerHTML = this.renderTableRowsHtml();
    }
  },

  renderTableRowsHtml() {
    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    const classArray = Array.from({ length: totalClasses }, (_, i) => i + 1);
    const syl = this.getCurrentSyllabus();

    return `
      <table class="syllabus-table" style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
        <thead>
          <tr style="background: linear-gradient(135deg, #e0e7ff, #ede9fe); border-bottom: 2px solid #a5b4fc; color: #1e1b4b;">
            <th style="padding: 0.8rem 0.5rem; text-align: center; width: 65px; font-weight: 800; white-space: nowrap;">차시</th>
            <th style="padding: 0.8rem 0.6rem; width: 190px; font-weight: 800; white-space: nowrap;">대단원</th>
            <th style="padding: 0.8rem 0.6rem; width: 170px; font-weight: 800; white-space: nowrap;">중단원 / 소단원</th>
            <th style="padding: 0.8rem 0.6rem; min-width: 270px; font-weight: 800; white-space: nowrap;">학습 주제 및 핵심 개념</th>
            ${classArray.map(c => `
              <th style="padding: 0.8rem 0.3rem; text-align: center; width: 50px; font-weight: 800; color: #3730a3; white-space: nowrap;">${c}반</th>
            `).join('')}
            <th style="padding: 0.8rem 0.5rem; text-align: center; width: 75px; font-weight: 800; white-space: nowrap;">차시 전체</th>
            <th style="padding: 0.8rem 0.5rem; text-align: center; width: 85px; font-weight: 800; white-space: nowrap;">완료 학급</th>
          </tr>
        </thead>
        <tbody>
          ${syl.map(item => {
            let completedCount = 0;
            classArray.forEach(c => {
              const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
              if (list.includes(item.period)) completedCount++;
            });

            return `
              <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td style="padding: 0.7rem 0.5rem; text-align: center; font-weight: 800; color: #059669; font-family: var(--font-mono); font-size: 0.9rem; white-space: nowrap;">
                  ${String(item.period).padStart(2, '0')}차시
                </td>

                <!-- 대단원 (직접 수정 가능) -->
                <td style="padding: 0.45rem 0.5rem;">
                  <input type="text" class="input-inline" value="${item.mainUnit}" onchange="ProgressModule.handleTextEdit(${item.period}, 'mainUnit', this.value)" style="width: 100%; font-size: 0.85rem; font-weight: 800; color: #3730a3; background: transparent; border: 1px solid transparent; border-radius: 6px; padding: 4px 6px;" onfocus="this.style.borderColor='#6366f1'; this.style.background='#ffffff'" onblur="this.style.borderColor='transparent'; this.style.background='transparent'">
                </td>

                <!-- 소단원 (직접 수정 가능) -->
                <td style="padding: 0.45rem 0.5rem;">
                  <input type="text" class="input-inline" value="${item.subUnit}" onchange="ProgressModule.handleTextEdit(${item.period}, 'subUnit', this.value)" style="width: 100%; font-size: 0.85rem; font-weight: 600; color: #334155; background: transparent; border: 1px solid transparent; border-radius: 6px; padding: 4px 6px;" onfocus="this.style.borderColor='#6366f1'; this.style.background='#ffffff'" onblur="this.style.borderColor='transparent'; this.style.background='transparent'">
                </td>

                <!-- 학습 주제 및 핵심 개념 (직접 수정 가능) -->
                <td style="padding: 0.45rem 0.5rem;">
                  <input type="text" class="input-inline" value="${item.topic}" onchange="ProgressModule.handleTextEdit(${item.period}, 'topic', this.value)" style="width: 100%; font-size: 0.85rem; font-weight: 500; color: #1e293b; background: transparent; border: 1px solid transparent; border-radius: 6px; padding: 4px 6px;" onfocus="this.style.borderColor='#6366f1'; this.style.background='#ffffff'" onblur="this.style.borderColor='transparent'; this.style.background='transparent'">
                </td>

                <!-- 학반별 체크박스 -->
                ${classArray.map(c => {
                  const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
                  const isChecked = list.includes(item.period);
                  return `
                    <td style="padding: 0.7rem 0.3rem; text-align: center;">
                      <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="ProgressModule.toggleCheck(${item.period}, ${c})" style="width: 19px; height: 19px; cursor: pointer; accent-color: #4f46e5;">
                    </td>
                  `;
                }).join('')}

                <!-- 차시별 전체 학반 선택 고정 버튼 ('전체' 라벨 고정) -->
                <td style="padding: 0.7rem 0.4rem; text-align: center;">
                  <button type="button" onclick="ProgressModule.toggleAllForPeriod(${item.period})" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 800; border-radius: 8px; border: 1px solid #c7d2fe; background: #e0e7ff; color: #3730a3; cursor: pointer; white-space: nowrap; transition: all 0.15s ease;" title="해당 차시의 전체 학반 체크박스 선택/해제">
                    전체
                  </button>
                </td>

                <!-- 완료 학급 수 -->
                <td style="padding: 0.7rem; text-align: center; white-space: nowrap;">
                  <span id="completed-count-${item.period}" style="font-size: 0.8rem; font-weight: 800; padding: 3px 10px; border-radius: 12px; display: inline-block; white-space: nowrap; background: ${completedCount === totalClasses ? '#d1fae5' : completedCount > 0 ? '#e0e7ff' : '#f1f5f9'}; color: ${completedCount === totalClasses ? '#047857' : completedCount > 0 ? '#3730a3' : '#64748b'}; border: 1px solid ${completedCount === totalClasses ? '#a7f3d0' : completedCount > 0 ? '#c7d2fe' : '#e2e8f0'};">
                    ${completedCount}/${totalClasses}개반
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  renderView() {
    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    const classArray = Array.from({ length: totalClasses }, (_, i) => i + 1);
    const syl = this.getCurrentSyllabus();

    return `
      <div style="width: 100%;">
        <!-- Header Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.8rem; font-weight: 700; background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;">
                🏫 영서중학교 수학과
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #1e1b4b;">${this.activeGrade}학년 세부 진도표 & 반별 체크리스트</h2>
            </div>
            <p style="font-size: 0.85rem; color: #475569; margin-top: 0.3rem;">
              담당 교사: <strong style="color: #1e1b4b;">임종윤 교사</strong> | 각 학년 탭을 클릭하여 독립된 진도표를 관리하거나 신규 진도표를 업로드할 수 있습니다.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
            <div id="cloud-sync-status" style="font-size: 0.85rem; font-weight: 600; background: #ffffff; padding: 7px 14px; border-radius: 10px; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              ${this.hasUnsavedChanges ? '⚠️ <span style="color: #d97706; font-weight: 800;">수정사항 있음 (저장 버튼을 누르세요)</span>' : '✅ <span style="color: #059669; font-weight: 700;">클라우드 DB 동기화 완료</span>'}
            </div>

            <!-- 학년 진도표 업로드 버튼 -->
            <button class="btn btn-secondary" onclick="ProgressModule.openUploadModal()" style="background: #ffffff; color: #4338ca; border: 1px solid #a5b4fc; font-weight: 800;">
              📥 ${this.activeGrade}학년 진도표 업로드
            </button>

            <!-- 핵심 [저장] 버튼 -->
            <button id="save-syllabus-btn" class="btn btn-primary" onclick="ProgressModule.saveToCloudDB()" style="background: linear-gradient(135deg, #4f46e5, #6366f1); border: none; font-weight: 800; font-size: 0.95rem; padding: 0.65rem 1.4rem; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3); transition: all 0.2s ease;">
              💾 ${this.activeGrade}학년 진도 수정사항 저장하기
            </button>
            
            <button class="btn btn-outline-violet" onclick="window.print()" style="background: #ffffff; color: #4338ca; border: 1px solid #c7d2fe; font-weight: 700;">
              🖨️ 인쇄
            </button>
          </div>
        </div>

        <!-- Grade Selector Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
          <button class="grade-tab-btn ${this.activeGrade === 1 ? 'active' : ''}" onclick="ProgressModule.switchGrade(1)" style="font-weight: 800;">
            🌱 1학년 (${this.syllabusData[1] ? this.syllabusData[1].length : 25}차시 진도표)
          </button>
          <button class="grade-tab-btn ${this.activeGrade === 2 ? 'active' : ''}" onclick="ProgressModule.switchGrade(2)" style="font-weight: 800;">
            🌿 2학년 (${this.syllabusData[2] ? this.syllabusData[2].length : 50}차시 마스터 진도표)
          </button>
          <button class="grade-tab-btn ${this.activeGrade === 3 ? 'active' : ''}" onclick="ProgressModule.switchGrade(3)" style="font-weight: 800;">
            🌳 3학년 (${this.syllabusData[3] ? this.syllabusData[3].length : 25}차시 진도표)
          </button>
        </div>

        <!-- Class Progress Bright Cards Overview -->
        <div style="margin-bottom: 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 1rem;">
          ${classArray.map(c => {
            const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
            const pct = Math.round((list.length / (syl.length || 1)) * 100);
            return `
              <div class="glass-card hover-lift" style="padding: 1.05rem 1.2rem; border: 1px solid #c7d2fe; background: linear-gradient(135deg, #ffffff, #f8fafc); box-shadow: 0 4px 16px rgba(99, 102, 241, 0.08); border-radius: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; gap: 0.6rem; flex-wrap: nowrap;">
                  <strong style="font-size: 1rem; font-weight: 800; color: #3730a3; white-space: nowrap; flex-shrink: 0;">${this.activeGrade}학년 ${c}반</strong>
                  <span id="pct-badge-${c}" style="font-size: 0.78rem; font-weight: 800; color: #047857; background: #d1fae5; border: 1px solid #a7f3d0; padding: 3px 9px; border-radius: 10px; white-space: nowrap; flex-shrink: 0;">
                    ${pct}% (${list.length}/${syl.length}차시)
                  </span>
                </div>
                <div class="progress-bar-track" style="height: 8px; background: #e2e8f0; border-radius: 6px;">
                  <div id="bar-fill-${c}" class="progress-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 6px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 50-Period Syllabus Checkbox Matrix Table Container -->
        <div class="glass-card" style="overflow-x: auto; padding: 1.25rem; background: #ffffff; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04); border-radius: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #1e1b4b; display: flex; align-items: center; gap: 0.5rem;">
              <span>📋 ${this.activeGrade}학년 세부 진도표 및 반별 완료 체크리스트</span>
              <span style="font-size: 0.8rem; background: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 10px; font-weight: 700; border: 1px solid #c7d2fe;">
                총 ${syl.length}개 차시 독립 관리
              </span>
            </h3>
            <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">
              💡 각 차시별 <strong style="color: #4338ca;">[전체]</strong> 버튼을 누르면 전체 반 체크박스가 토글 선택/해제됩니다.
            </span>
          </div>

          <div id="syllabus-table-container">
            ${this.renderTableRowsHtml()}
          </div>
        </div>

        <!-- 학년 진도표 파일 / 텍스트 업로드 모달 -->
        <div id="syllabus-upload-modal" class="modal-overlay">
          <div class="glass-card modal-content" style="max-width: 620px; background: #ffffff; border-radius: 16px; padding: 1.5rem;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.8rem; margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #1e1b4b;">
                📥 학년별 세부 진도표 업로드 및 교체
              </h3>
              <button class="close-btn" onclick="ProgressModule.closeUploadModal()" style="font-size: 1.2rem; background: none; border: none; cursor: pointer;">×</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem; display: block;">
                  1. 적용 대상 학년 선택
                </label>
                <select id="upload-target-grade" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 0.9rem; color: #3730a3; background: #f8fafc;">
                  <option value="1" ${this.activeGrade === 1 ? 'selected' : ''}>🌱 1학년 진도표로 등록</option>
                  <option value="2" ${this.activeGrade === 2 ? 'selected' : ''}>🌿 2학년 진도표로 등록</option>
                  <option value="3" ${this.activeGrade === 3 ? 'selected' : ''}>🌳 3학년 진도표로 등록</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem; display: block;">
                  2. 진도표 내용 입력 (텍스트 붙여넣기 또는 CSV 형식)
                </label>
                <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">
                  형식 예시: <code>대단원명 | 중단원명 | 학습주제 및 핵심개념</code> (한 줄에 1차시씩 입력)
                </p>
                <textarea id="syllabus-raw-textarea" rows="8" placeholder="예시:
Ⅰ. 수와 연산 | 1. 소인수분해 | 소수와 합성수의 개념 탐구
Ⅰ. 수와 연산 | 1. 소인수분해 | 소인수분해의 뜻과 방법
Ⅰ. 수와 연산 | 2. 정수와 유리수 | 정수와 유리수의 사칙연산" style="width: 100%; font-size: 0.85rem; padding: 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1; font-family: monospace; line-height: 1.5; resize: vertical;"></textarea>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 0.5rem;">
                <button type="button" class="btn btn-secondary" onclick="ProgressModule.closeUploadModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">
                  취소
                </button>
                <button type="button" class="btn btn-primary" onclick="ProgressModule.handleSyllabusTextImport()" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff; font-weight: 800;">
                  📥 선택 학년 진도표 교체 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.ProgressModule = ProgressModule;

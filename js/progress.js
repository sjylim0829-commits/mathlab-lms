/**
 * Yeongseo Middle School Class Progress Tracker & 50-Period Syllabus Checkboard
 * Grades: 1 ~ 3, Classes: 1 ~ 8 (22 Classes Total for Yeongseo MS)
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교 수학과)
 */

const ProgressModule = {
  activeGrade: 2, // 기본값: 2학년

  // 중학교 2학년 수학 (2학기) 50차시 세부 진도표 마스터 데이터 (5단원 ~ 8단원)
  syllabus50: [
    // Ⅴ. 삼각형의 성질 (12차시: 01 ~ 12)
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

    // Ⅵ. 사각형의 성질 (10차시: 13 ~ 22)
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

    // Ⅶ. 도형의 닮음과 피타고라스 정리 (16차시: 23 ~ 38)
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

    // Ⅷ. 경우의 수와 확률 (12차시: 39 ~ 50)
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

  // 각 학학년/학반별 50차시 완료 체크리스트 상태 ({ period: [checked_classNums] })
  checklistData: {
    // 2학년 기본 더미 데이터
    2: {
      1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // 30차시 완료
      2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
      4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      6: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
    }
  },

  switchGrade(grade) {
    this.activeGrade = grade;
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderView();
    }
  },

  // 구글 시트 백엔드에서 50차시 체크리스트 데이터 수합 시 갱신
  updateFromSheet(checklistItems) {
    if (!Array.isArray(checklistItems) || checklistItems.length === 0) return;

    checklistItems.forEach(item => {
      const p = Number(item.period);
      if (p >= 1 && p <= 50) {
        const checkedClassesStr = String(item.checkedClasses || '');
        const classNums = checkedClassesStr.split(',').map(n => Number(n.strip ? n.strip() : n)).filter(n => n > 0);
        
        // 2학년 체크리스트 반영
        if (!this.checklistData[2]) this.checklistData[2] = {};
        classNums.forEach(c => {
          if (!this.checklistData[2][c]) this.checklistData[2][c] = [];
          if (!this.checklistData[2][c].includes(p)) {
            this.checklistData[2][c].push(p);
          }
        });

        // 50차시 제목 반영
        const target = this.syllabus50.find(s => s.period === p);
        if (target) {
          if (item.mainUnit) target.mainUnit = item.mainUnit;
          if (item.subUnit) target.subUnit = item.subUnit;
          if (item.topic) target.topic = item.topic;
        }
      }
    });

    const mainView = document.getElementById('teacher-main-view');
    if (mainView && document.querySelector('.syllabus-table')) {
      mainView.innerHTML = this.renderView();
    }
  },

  // 반별 체크박스 토글 핸들러
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
      list.splice(idx, 1); // 체크 해제
    } else {
      list.push(period); // 체크 등록
    }

    // 화면 진도율 및 카운트 실시간 재계산
    this.updateStatsUI();

    // 구글 드라이브 시트 DB 자동 동기화 (Background Sync)
    this.syncToCloudDB();
  },

  // 실시간 진도율 수치 재계산 UI
  updateStatsUI() {
    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    for (let c = 1; c <= totalClasses; c++) {
      const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
      const pct = Math.round((list.length / 50) * 100);
      
      const badgeEl = document.getElementById(`pct-badge-${c}`);
      if (badgeEl) badgeEl.textContent = `${pct}% (${list.length}/50차시)`;

      const fillEl = document.getElementById(`bar-fill-${c}`);
      if (fillEl) fillEl.style.width = `${pct}%`;
    }

    // 각 차시별 완료 학급 수 업데이트
    this.syllabus50.forEach(item => {
      let count = 0;
      for (let c = 1; c <= totalClasses; c++) {
        const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
        if (list.includes(item.period)) count++;
      }
      const countEl = document.getElementById(`completed-count-${item.period}`);
      if (countEl) {
        countEl.textContent = `${count}/${totalClasses}개반`;
        countEl.className = `badge ${count === totalClasses ? 'badge-success' : count > 0 ? 'badge-violet' : 'badge-secondary'}`;
      }
    });
  },

  // 50차시 텍스트 직접 수정 시 반영
  handleTextEdit(period, field, value) {
    const target = this.syllabus50.find(s => s.period === period);
    if (target) {
      target[field] = value;
    }
  },

  // 구글 드라이브 DB 연동 저장
  async syncToCloudDB() {
    const syncStatusEl = document.getElementById('cloud-sync-status');
    if (syncStatusEl) {
      syncStatusEl.innerHTML = '🔄 <span style="color: var(--accent-gold);">구글 드라이브 DB 저장 중...</span>';
    }

    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    const payloadItems = this.syllabus50.map(item => {
      const checkedClasses = [];
      for (let c = 1; c <= totalClasses; c++) {
        const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
        if (list.includes(item.period)) {
          checkedClasses.push(c);
        }
      }
      return {
        period: item.period,
        mainUnit: item.mainUnit,
        subUnit: item.subUnit,
        topic: item.topic,
        checkedClasses: checkedClasses
      };
    });

    try {
      if (window.CloudDB && CloudDB.saveSyllabusChecklist) {
        await CloudDB.saveSyllabusChecklist(payloadItems);
        if (syncStatusEl) {
          syncStatusEl.innerHTML = '✅ <span style="color: var(--accent-emerald);">구글 드라이브 DB 동기화 완료!</span>';
        }
      }
    } catch (err) {
      if (syncStatusEl) {
        syncStatusEl.innerHTML = '⚠️ <span style="color: #f87171;">로컬 동기화 완료 (DB 오프라인)</span>';
      }
    }
  },

  renderView() {
    const totalClasses = (this.activeGrade === 3) ? 6 : 8;
    const classArray = Array.from({ length: totalClasses }, (_, i) => i + 1);

    return `
      <div style="width: 100%;">
        <!-- Header Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem; background: rgba(139, 92, 246, 0.2); color: var(--primary-violet);">
                🏫 영서중학교 수학과
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 800;">50차시 세부 진도표 & 반별 체크리스트 (구글 드라이브 DB 연동)</h2>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              담당 교사: <strong style="color: var(--text-main);">임종윤 교사 (영서중학교)</strong> | 1차시부터 50차시까지 학반별 진도 완료 체크박스를 클릭하여 실시간 기록하세요.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <div id="cloud-sync-status" style="font-size: 0.85rem; font-weight: 600; background: rgba(15, 23, 42, 0.6); padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border-card);">
              ✅ <span style="color: var(--accent-emerald);">구글 드라이브 DB 연동 준비됨</span>
            </div>
            <button class="btn btn-primary" onclick="ProgressModule.syncToCloudDB()">
              💾 구글 드라이브 DB 수동 저장
            </button>
            <button class="btn btn-outline-violet" onclick="window.print()">
              🖨️ 50차시 진도표 인쇄
            </button>
          </div>
        </div>

        <!-- Grade Selector Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
          <button class="grade-tab-btn ${this.activeGrade === 1 ? 'active' : ''}" onclick="ProgressModule.switchGrade(1)">
            🌱 1학년 (1~8반)
          </button>
          <button class="grade-tab-btn ${this.activeGrade === 2 ? 'active' : ''}" onclick="ProgressModule.switchGrade(2)">
            🌿 2학년 2학기 (50차시 마스터 진도표)
          </button>
          <button class="grade-tab-btn ${this.activeGrade === 3 ? 'active' : ''}" onclick="ProgressModule.switchGrade(3)">
            🌳 3학년 (1~6반)
          </button>
        </div>

        <!-- Class Progress Metric Cards Overview -->
        <div style="margin-bottom: 1.8rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.75rem;">
          ${classArray.map(c => {
            const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
            const pct = Math.round((list.length / 50) * 100);
            return `
              <div class="glass-card" style="padding: 0.8rem; border-color: rgba(99, 102, 241, 0.2); background: rgba(15, 23, 42, 0.4);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                  <strong style="font-size: 0.95rem; color: var(--violet-bright);">${this.activeGrade}학년 ${c}반</strong>
                  <span id="pct-badge-${c}" style="font-size: 0.75rem; font-weight: 700; color: var(--accent-emerald);">
                    ${pct}% (${list.length}/50차시)
                  </span>
                </div>
                <div class="progress-bar-track" style="height: 6px;">
                  <div id="bar-fill-${c}" class="progress-bar-fill" style="width: ${pct}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 50-Period Syllabus Checkbox Matrix Table -->
        <div class="glass-card" style="overflow-x: auto; padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
              <span>📋 50차시 세부 진도표 및 반별 완료 체크리스트</span>
              <span style="font-size: 0.75rem; background: rgba(99, 102, 241, 0.15); color: var(--violet-bright); padding: 2px 8px; border-radius: 8px;">
                5단원 삼각형의 성질 ~ 8단원 경우의 수와 확률
              </span>
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              💡 각 반별 체크박스를 누르거나 텍스트를 직접 클릭하여 바로 수정할 수 있습니다.
            </span>
          </div>

          <table class="syllabus-table" style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="background: rgba(30, 41, 59, 0.8); border-bottom: 2px solid var(--border-card); color: var(--violet-bright);">
                <th style="padding: 0.65rem 0.5rem; text-align: center; width: 65px;">차시</th>
                <th style="padding: 0.65rem; width: 180px;">대단원</th>
                <th style="padding: 0.65rem; width: 160px;">중단원 / 소단원</th>
                <th style="padding: 0.65rem; min-width: 260px;">학습 주제 및 핵심 개념</th>
                ${classArray.map(c => `
                  <th style="padding: 0.65rem 0.3rem; text-align: center; width: 48px;">${c}반</th>
                `).join('')}
                <th style="padding: 0.65rem; text-align: center; width: 85px;">완료 학급</th>
              </tr>
            </thead>
            <tbody>
              ${this.syllabus50.map(item => {
                let completedCount = 0;
                classArray.forEach(c => {
                  const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
                  if (list.includes(item.period)) completedCount++;
                });

                return `
                  <tr style="border-bottom: 1px solid var(--border-card); transition: background 0.15s ease;" onmouseover="this.style.background='rgba(99,102,241,0.05)'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 0.65rem 0.5rem; text-align: center; font-weight: 700; color: var(--accent-emerald); font-family: var(--font-mono);">
                      ${String(item.period).padStart(2, '0')}차시
                    </td>

                    <!-- 대단원 (직접 수정 가능) -->
                    <td style="padding: 0.4rem 0.5rem;">
                      <input type="text" class="input-inline" value="${item.mainUnit}" onchange="ProgressModule.handleTextEdit(${item.period}, 'mainUnit', this.value)" style="width: 100%; font-size: 0.8rem; font-weight: 700; color: var(--violet-bright); background: transparent; border: 1px solid transparent; border-radius: 4px; padding: 2px 4px;" onfocus="this.style.borderColor='var(--violet-bright)'; this.style.background='rgba(15,23,42,0.8)'" onblur="this.style.borderColor='transparent'; this.style.background='transparent'">
                    </td>

                    <!-- 소단원 (직접 수정 가능) -->
                    <td style="padding: 0.4rem 0.5rem;">
                      <input type="text" class="input-inline" value="${item.subUnit}" onchange="ProgressModule.handleTextEdit(${item.period}, 'subUnit', this.value)" style="width: 100%; font-size: 0.8rem; color: var(--text-main); background: transparent; border: 1px solid transparent; border-radius: 4px; padding: 2px 4px;" onfocus="this.style.borderColor='var(--violet-bright)'; this.style.background='rgba(15,23,42,0.8)'" onblur="this.style.borderColor='transparent'; this.style.background='transparent'">
                    </td>

                    <!-- 학습 주제 및 핵심 개념 (직접 수정 가능) -->
                    <td style="padding: 0.4rem 0.5rem;">
                      <input type="text" class="input-inline" value="${item.topic}" onchange="ProgressModule.handleTextEdit(${item.period}, 'topic', this.value)" style="width: 100%; font-size: 0.85rem; color: var(--text-main); background: transparent; border: 1px solid transparent; border-radius: 4px; padding: 2px 4px;" onfocus="this.style.borderColor='var(--violet-bright)'; this.style.background='rgba(15,23,42,0.8)'" onblur="this.style.borderColor='transparent'; this.style.background='transparent'">
                    </td>

                    <!-- 학반별 체크박스 -->
                    ${classArray.map(c => {
                      const list = (this.checklistData[this.activeGrade] && this.checklistData[this.activeGrade][c]) || [];
                      const isChecked = list.includes(item.period);
                      return `
                        <td style="padding: 0.65rem 0.3rem; text-align: center;">
                          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="ProgressModule.toggleCheck(${item.period}, ${c})" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary-violet);">
                        </td>
                      `;
                    }).join('')}

                    <!-- 완료 학급 수 -->
                    <td style="padding: 0.65rem; text-align: center;">
                      <span id="completed-count-${item.period}" style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; background: ${completedCount === totalClasses ? 'rgba(16, 185, 129, 0.2)' : completedCount > 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(148, 163, 184, 0.1)'}; color: ${completedCount === totalClasses ? 'var(--accent-emerald)' : completedCount > 0 ? 'var(--violet-bright)' : 'var(--text-muted)'};">
                        ${completedCount}/${totalClasses}개반
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

window.ProgressModule = ProgressModule;

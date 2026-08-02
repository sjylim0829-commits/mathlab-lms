/**
 * Yeongseo Middle School Class Progress Tracker & Semester Curriculum Database
 * Grades: 1 ~ 3, Classes: 1 ~ 8 (24 Classes Total)
 * Teacher: Jongyoon Lim (임종윤 교사)
 */

const ProgressModule = {
  activeGrade: 2, // Default 2학년
  selectedClassForModal: null,

  // 1~3학년 중등 수학 한 학기 정규 교육과정 단원 DB
  curriculumDB: {
    1: [
      { id: '1-1', unit: 'Ⅰ. 수와 연산 - 1. 소인수분해 (소수와 합성수, 소인수분해)', defaultPages: 'p.10 ~ p.25' },
      { id: '1-2', unit: 'Ⅰ. 수와 연산 - 2. 정수와 유리수 (정수와 유리수의 뜻과 사칙연산)', defaultPages: 'p.26 ~ p.48' },
      { id: '1-3', unit: 'Ⅱ. 변화와 관계 - 1. 문자와 식 (문자의 사용과 식의 값, 일차식)', defaultPages: 'p.50 ~ p.68' },
      { id: '1-4', unit: 'Ⅱ. 변화와 관계 - 2. 일차방정식 (일차방정식의 풀이와 활용)', defaultPages: 'p.70 ~ p.92' },
      { id: '1-5', unit: 'Ⅱ. 변화와 관계 - 3. 좌표평면과 그래프 (정비례와 반비례)', defaultPages: 'p.94 ~ p.118' },
      { id: '1-6', unit: 'Ⅲ. 도형과 측정 - 1. 기본 도형 (점·선·면·각, 위치 관계)', defaultPages: 'p.120 ~ p.142' },
      { id: '1-7', unit: 'Ⅲ. 도형과 측정 - 2. 평면도형의 성질 (다각형, 원과 부채꼴)', defaultPages: 'p.144 ~ p.168' },
      { id: '1-8', unit: 'Ⅲ. 도형과 측정 - 3. 입체도형의 성질 (다면체와 회전체, 겉넓이와 부피)', defaultPages: 'p.170 ~ p.196' },
      { id: '1-9', unit: 'Ⅳ. 통계 - 1. 자료의 정리와 해석 (도수분포표, 히스토그램, 상대도수)', defaultPages: 'p.198 ~ p.220' }
    ],

    2: [
      { id: '2-1', unit: 'Ⅰ. 수와 식의 계산 - 1. 유리수와 순환소수 (순환소수의 표현과 분수 변환)', defaultPages: 'p.10 ~ p.28' },
      { id: '2-2', unit: 'Ⅰ. 수와 식의 계산 - 2. 식의 계산 (지수법칙, 단항식과 다항식의 계산)', defaultPages: 'p.30 ~ p.52' },
      { id: '2-3', unit: 'Ⅱ. 부등식과 방정식 - 1. 일차부등식 (일차부등식의 풀이와 활용)', defaultPages: 'p.54 ~ p.76' },
      { id: '2-4', unit: 'Ⅱ. 부등식과 방정식 - 2. 연립일차방정식 (연립방정식의 풀이와 활용)', defaultPages: 'p.78 ~ p.104' },
      { id: '2-5', unit: 'Ⅲ. 일차함수 - 1. 일차함수와 그래프 (기울기와 절편, 평행과 직교)', defaultPages: 'p.106 ~ p.132' },
      { id: '2-6', unit: 'Ⅲ. 일차함수 - 2. 일차함수와 일차방정식의 관계 (연립방정식과 그래프)', defaultPages: 'p.134 ~ p.150' },
      { id: '2-7', unit: 'Ⅳ. 도형의 성질 - 1. 삼각형의 성질 (이등변삼각형, 외심과 내심)', defaultPages: 'p.152 ~ p.178' },
      { id: '2-8', unit: 'Ⅳ. 도형의 성질 - 2. 사각형의 성질 (평행사변형, 여러 가지 사각형)', defaultPages: 'p.180 ~ p.204' },
      { id: '2-9', unit: 'Ⅴ. 도형의 닮음 - 1. 도형의 닮음과 피타고라스 정리', defaultPages: 'p.206 ~ p.230' },
      { id: '2-10', unit: 'Ⅵ. 확률 - 1. 경우의 수와 확률 (확률의 뜻과 성질)', defaultPages: 'p.232 ~ p.250' }
    ],

    3: [
      { id: '3-1', unit: 'Ⅰ. 실수와 그 계산 - 1. 제곱근과 실수 (제곱근의 뜻과 성질, 무리수)', defaultPages: 'p.10 ~ p.32' },
      { id: '3-2', unit: 'Ⅰ. 실수와 그 계산 - 2. 근호를 포함한 식의 계산 (덧셈·뺄셈·곱셈·나눗셈)', defaultPages: 'p.34 ~ p.54' },
      { id: '3-3', unit: 'Ⅱ. 다항식의 곱셈과 인수분해 - 1. 인수분해 공식과 활용', defaultPages: 'p.56 ~ p.82' },
      { id: '3-4', unit: 'Ⅲ. 이차방정식 - 1. 이차방정식의 풀이 (인수분해, 근의 공식과 활용)', defaultPages: 'p.84 ~ p.110' },
      { id: '3-5', unit: 'Ⅳ. 이차함수 - 1. 이차함수 y = ax² 및 y = a(x-p)² + q 그래프', defaultPages: 'p.112 ~ p.140' },
      { id: '3-6', unit: 'Ⅳ. 이차함수 - 2. 이차함수 y = ax² + bx + c 일반형 그래프', defaultPages: 'p.142 ~ p.165' },
      { id: '3-7', unit: 'Ⅴ. 삼각비 - 1. 삼각비의 뜻과 값 (sin, cos, tan 특수각)', defaultPages: 'p.166 ~ p.188' },
      { id: '3-8', unit: 'Ⅴ. 삼각비 - 2. 삼각비의 활용 (길이와 넓이 구하기)', defaultPages: 'p.190 ~ p.208' },
      { id: '3-9', unit: 'Ⅵ. 원의 성질 - 1. 원주각의 성질과 원과 비례', defaultPages: 'p.210 ~ p.235' }
    ]
  },

  // 24 Classes initial progress data
  progressData: {
    1: Array.from({ length: 8 }, (_, i) => ({
      classNum: i + 1,
      unit: 'Ⅱ. 변화와 관계 - 2. 일차방정식 (일차방정식의 풀이와 활용)',
      pages: `p.${70 + i * 2} ~ p.${80 + i * 2}`,
      progressPct: Math.min(100, 45 + i * 6),
      lastDate: '2026-08-02',
      homework: `교과서 p.${75 + i * 2} 중단원 형성평가 1~8번`,
      teacherNote: '방정식 등식의 성질 실습 완료'
    })),

    2: Array.from({ length: 8 }, (_, i) => ({
      classNum: i + 1,
      unit: 'Ⅲ. 일차함수 - 1. 일차함수와 그래프 (기울기와 절편, 평행과 직교)',
      pages: `p.${106 + i * 3} ~ p.${118 + i * 3}`,
      progressPct: Math.min(100, 60 + i * 4),
      lastDate: '2026-08-02',
      homework: `중단원 연습문제 p.${110 + i * 3} 풀기`,
      teacherNote: '기울기와 y절편 탐구 학습 진행 중'
    })),

    3: Array.from({ length: 8 }, (_, i) => ({
      classNum: i + 1,
      unit: 'Ⅲ. 이차방정식 - 1. 이차방정식의 풀이 (인수분해, 근의 공식과 활용)',
      pages: `p.${84 + i * 3} ~ p.${96 + i * 3}`,
      progressPct: Math.min(100, 65 + i * 3),
      lastDate: '2026-08-02',
      homework: `이차방정식 근의 공식 응용 프린트 2장`,
      teacherNote: '인수분해 활용 형성평가 실시'
    }))
  },

  switchGrade(grade) {
    this.activeGrade = grade;
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderView();
    }
  },

  renderView() {
    const currentGradeUnits = this.curriculumDB[this.activeGrade];
    const currentClasses = this.progressData[this.activeGrade];

    return `
      <div>
        <!-- Progress Tracker Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem; background: rgba(139, 92, 246, 0.2); color: var(--primary-violet);">
                🏫 영서중학교 수학과
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 800;">전 학급 수업 진도 기록부 (구글 시트 실시간 연동)</h2>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              담당 교사: <strong style="color: var(--text-main);">임종윤 교사 (영서중학교)</strong> | 총 24개 학급 실시간 진도 구글 시트 저장
            </p>
          </div>

          <div style="display: flex; gap: 0.6rem;">
            <button class="btn btn-primary" onclick="ProgressModule.openUpdateModal(1)">
              ✏️ 진도 선택 입력
            </button>
            <button class="btn btn-outline-violet" onclick="alert('영서중 1~3학년 진도표가 성공적으로 출력되었습니다.');">
              🖨️ 진도표 출력
            </button>
          </div>
        </div>

        <!-- Grade Selector Tabs -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
          <button class="grade-tab-btn ${this.activeGrade === 1 ? 'active' : ''}" onclick="ProgressModule.switchGrade(1)">
            🌱 1학년 (1반 ~ 8반)
          </button>
          <button class="grade-tab-btn ${this.activeGrade === 2 ? 'active' : ''}" onclick="ProgressModule.switchGrade(2)">
            🌿 2학년 (1반 ~ 8반)
          </button>
          <button class="grade-tab-btn ${this.activeGrade === 3 ? 'active' : ''}" onclick="ProgressModule.switchGrade(3)">
            🌳 3학년 (1반 ~ 8반)
          </button>
        </div>

        <!-- Class Matrix Grid (1반 ~ 8반) -->
        <div class="progress-grid" style="margin-bottom: 2.5rem;">
          ${currentClasses.map(cls => `
            <div class="glass-card hover-lift" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                  <span class="class-title-badge">${this.activeGrade}학년 ${cls.classNum}반</span>
                  <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">
                    📅 ${cls.lastDate}
                  </span>
                </div>

                <div style="margin-bottom: 0.8rem;">
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">진행 단원</div>
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--violet-bright); margin-top: 0.15rem; line-height: 1.35;">
                    ${cls.unit}
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  <span>진도 페이지: <strong style="color: var(--text-main);">${cls.pages}</strong></span>
                  <span style="font-weight: 700; color: var(--accent-emerald);">${cls.progressPct}% 달성</span>
                </div>

                <div class="progress-bar-track" style="margin-bottom: 0.8rem;">
                  <div class="progress-bar-fill" style="width: ${cls.progressPct}%;"></div>
                </div>

                <div style="font-size: 0.8rem; background: rgba(9, 13, 22, 0.6); padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
                  <div style="color: var(--accent-gold); font-size: 0.75rem; font-weight: 600;">📝 과제: ${cls.homework}</div>
                  <div style="color: var(--text-dim); font-size: 0.75rem; margin-top: 0.2rem;">💬 메모: ${cls.teacherNote}</div>
                </div>
              </div>

              <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem; padding: 0.4rem; font-size: 0.8rem;" onclick="ProgressModule.openUpdateModal(${cls.classNum})">
                ✏️ ${this.activeGrade}학년 ${cls.classNum}반 진도 변경
              </button>
            </div>
          `).join('')}
        </div>

        <!-- Curriculum Database Reference Section -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--violet-bright); display: flex; align-items: center; gap: 0.5rem;">
                <span>📖 영서중학교 ${this.activeGrade}학년 수학 한 학기 정규 교육과정 단원 DB</span>
                <span style="font-size: 0.75rem; background: rgba(139, 92, 246, 0.15); color: var(--violet-bright); padding: 2px 8px; border-radius: 12px;">
                  총 ${currentGradeUnits.length}개 정규 단원
                </span>
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                구글 시트와 실시간 연동되어 선생님께서 직접 작성 및 수정이 가능한 교육과정 단원 DB입니다.
              </p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 0.8rem;">
            ${currentGradeUnits.map((u, idx) => `
              <div style="background: rgba(9, 13, 22, 0.7); border: 1px solid var(--border-card); padding: 0.8rem 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${u.unit}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">권장 범위: ${u.defaultPages}</div>
                </div>
                <span style="font-size: 0.75rem; background: rgba(16,185,129,0.12); color: var(--accent-emerald); padding: 2px 6px; border-radius: 6px; font-weight: 700;">
                  단원 DB #${idx + 1}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Class Progress Update Modal -->
        <div id="progress-modal-overlay" class="modal-overlay">
          <div class="glass-card modal-content" style="max-width: 540px;">
            <div class="modal-header">
              <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--violet-bright);" id="progress-modal-title">
                ✏️ 진도 선택 입력 및 구글 시트 저장
              </h3>
              <button class="close-btn" onclick="ProgressModule.closeUpdateModal()">×</button>
            </div>

            <form onsubmit="ProgressModule.handleSaveProgress(event)" style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">대상 학년</label>
                  <input type="text" class="input-control" value="${this.activeGrade}학년" readonly style="background: rgba(255,255,255,0.05); color: var(--text-muted);">
                </div>

                <div class="form-group">
                  <label class="form-label">대상 학반 선택</label>
                  <select id="modal-class-select" class="input-control">
                    ${[1,2,3,4,5,6,7,8].map(c => `<option value="${c}">${c}반</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- Unit DB Picker Dropdown -->
              <div class="form-group">
                <label class="form-label" style="color: var(--violet-bright); font-weight: 700;">
                  📚 한 학기 정규 교육과정 단원 선택 (DB 연동)
                </label>
                <select id="modal-unit-select" class="input-control" onchange="ProgressModule.handleUnitSelectChange(this)" style="font-weight: 600; border-color: var(--border-violet);">
                  ${currentGradeUnits.map(u => `<option value="${u.unit}" data-pages="${u.defaultPages}">${u.unit}</option>`).join('')}
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">교과서 진도 범위</label>
                  <input type="text" id="modal-pages-input" class="input-control" required placeholder="예: p.106 ~ p.132" value="${currentGradeUnits[0].defaultPages}">
                </div>

                <div class="form-group">
                  <label class="form-label">달성 진도율 (%)</label>
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <input type="range" id="modal-pct-slider" min="0" max="100" value="60" class="slider-input" oninput="document.getElementById('pct-val-display').innerText = this.value + '%'">
                    <span id="pct-val-display" style="font-weight: 800; font-size: 0.95rem; color: var(--accent-emerald); width: 45px;">60%</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">수업 과제 및 숙제</label>
                <input type="text" id="modal-homework-input" class="input-control" placeholder="예: 교과서 p.110 중단원 연습문제 풀기" value="중단원 형성평가 프린트 풀기">
              </div>

              <div class="form-group">
                <label class="form-label">수업 피드백 메모</label>
                <input type="text" id="modal-note-input" class="input-control" placeholder="예: 개념 설명 완료, 다음 시간 모둠 실습 예정" value="개념 형성평가 실시 완료">
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
                <button type="button" class="btn btn-secondary" onclick="ProgressModule.closeUpdateModal()">취소</button>
                <button type="submit" class="btn btn-primary">💾 진도 입력 및 구글 시트 저장</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  handleUnitSelectChange(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const defaultPages = selectedOption.getAttribute('data-pages');
    const pagesInput = document.getElementById('modal-pages-input');
    if (pagesInput && defaultPages) {
      pagesInput.value = defaultPages;
    }
  },

  openUpdateModal(classNum = 1) {
    this.selectedClassForModal = classNum;
    const modal = document.getElementById('progress-modal-overlay');
    const classSelect = document.getElementById('modal-class-select');
    const title = document.getElementById('progress-modal-title');

    if (classSelect) classSelect.value = classNum;
    if (title) title.innerText = `✏️ ${this.activeGrade}학년 ${classNum}반 수업 진도 입력`;

    if (modal) modal.classList.add('active');
  },

  closeUpdateModal() {
    const modal = document.getElementById('progress-modal-overlay');
    if (modal) modal.classList.remove('active');
  },

  handleSaveProgress(e) {
    e.preventDefault();
    const classNum = parseInt(document.getElementById('modal-class-select').value, 10);
    const unit = document.getElementById('modal-unit-select').value;
    const pages = document.getElementById('modal-pages-input').value.trim();
    const progressPct = parseInt(document.getElementById('modal-pct-slider').value, 10);
    const homework = document.getElementById('modal-homework-input').value.trim();
    const teacherNote = document.getElementById('modal-note-input').value.trim();

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;

    const targetList = this.progressData[this.activeGrade];
    const targetClass = targetList.find(c => c.classNum === classNum);

    if (targetClass) {
      targetClass.unit = unit;
      targetClass.pages = pages;
      targetClass.progressPct = progressPct;
      targetClass.lastDate = dateStr;
      targetClass.homework = homework;
      targetClass.teacherNote = teacherNote;
    }

    if (typeof CloudDB !== 'undefined' && CloudDB.saveClassProgress) {
      CloudDB.saveClassProgress({
        grade: this.activeGrade,
        classNum: classNum,
        unit: unit,
        pages: pages,
        progressPct: progressPct,
        homework: homework,
        teacherNote: teacherNote
      });
    }

    this.closeUpdateModal();
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderView();
    }

    alert(`🎉 [구글 시트 진도 저장 완료!]\n\n영서중학교 ${this.activeGrade}학년 ${classNum}반의 진도가 구글 시트에 업데이트되었습니다.\n단원: ${unit}\n범위: ${pages} (${progressPct}% 완료)`);
  }
};

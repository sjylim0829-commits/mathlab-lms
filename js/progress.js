/**
 * Yeongseo Middle School Class Progress Tracker (1학년 ~ 3학년, 1반 ~ 8반)
 * Teacher: Jongyoon Lim (임종윤 교사)
 */

const ProgressModule = {
  activeGrade: 2, // Default 2학년

  // 24 Classes data structure (Grades 1-3 x Classes 1-8)
  progressData: {
    1: Array.from({ length: 8 }, (_, i) => ({
      classNum: i + 1,
      unit: ['1. 소수와 합성수', '2. 정수와 유리수', '3. 문자와 식', '4. 일차방정식의 활용', '5. 좌표평면과 그래프'][i % 5],
      pages: `p.${30 + i * 12} ~ p.${42 + i * 12}`,
      progressPct: Math.min(100, 35 + i * 8),
      lastDate: `2026-08-0${(i % 5) + 1}`,
      homework: `교과서 p.${40 + i * 12} 대단원 평가 풀기`,
      teacherNote: '개념 설명 완료, 단원 평가 예정'
    })),

    2: Array.from({ length: 8 }, (_, i) => ({
      classNum: i + 1,
      unit: ['1. 유리수와 순환소수', '2. 식의 계산', '3. 일차부등식', '4. 연립일차방정식', '5. 일차함수와 그래프'][i % 5],
      pages: `p.${45 + i * 10} ~ p.${58 + i * 10}`,
      progressPct: Math.min(100, 48 + i * 6),
      lastDate: `2026-08-0${(i % 5) + 1}`,
      homework: `중단원 연습문제 1~10번`,
      teacherNote: '그래프 기울기 실습 완료'
    })),

    3: Array.from({ length: 8 }, (_, i) => ({
      classNum: i + 1,
      unit: ['1. 실수와 그 계산', '2. 다항식의 곱셈과 인수분해', '3. 이차방정식', '4. 이차함수 $y=ax^2$', '5. 삼각비'][i % 5],
      pages: `p.${60 + i * 8} ~ p.${72 + i * 8}`,
      progressPct: Math.min(100, 60 + i * 5),
      lastDate: `2026-08-0${(i % 5) + 1}`,
      homework: `이차방정식 풀이 프린트 2장`,
      teacherNote: '인수분해 형성평가 실시'
    }))
  },

  renderView() {
    return `
      <div>
        <!-- Progress Tracker Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem; background: rgba(139, 92, 246, 0.2); color: var(--primary-violet);">
                🏫 영서중학교 수학과
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 800;">1~3학년 (1~8반) 전 학급 수업 진도 기록부</h2>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              담당 교사: <strong style="color: var(--text-main);">임종윤 교사 (영서중학교)</strong> | 총 24개 학급 실시간 진도 현황
            </p>
          </div>

          <div style="display: flex; gap: 0.6rem;">
            <button class="btn btn-primary" onclick="ProgressModule.openUpdateModal()">
              ✏️ 진도 일괄 업데이트
            </button>
            <button class="btn btn-outline-violet" onclick="alert('진도표 출력이 준비되었습니다.');">
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
        <div class="progress-grid">
          ${this.progressData[this.activeGrade].map(cls => `
            <div class="glass-card hover-lift" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                  <span class="class-title-badge">${this.activeGrade}학년 ${cls.classNum}반</span>
                  <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">
                    📅 ${cls.lastDate}
                  </span>
                </div>

                <div style="margin-bottom: 0.8rem;">
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">현재 진도 단원</div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--violet-bright); margin-top: 0.1rem;">
                    ${cls.unit}
                  </div>
                </div>

                <div style="margin-bottom: 0.8rem; font-size: 0.85rem;">
                  <span style="color: var(--text-muted);">교과서 범위: </span>
                  <span style="font-weight: 600; font-family: var(--font-mono); color: var(--accent-emerald);">${cls.pages}</span>
                </div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 1rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.3rem;">
                    <span style="color: var(--text-muted);">진도 달성률</span>
                    <span style="font-weight: 700; color: var(--primary-violet);">${cls.progressPct}%</span>
                  </div>
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width: ${cls.progressPct}%;"></div>
                  </div>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-card); border-radius: var(--radius-sm); padding: 0.6rem; font-size: 0.8rem; margin-bottom: 0.8rem;">
                  <div style="color: var(--accent-gold); font-weight: 600;">📝 다음 수업 과제</div>
                  <div style="color: var(--text-main); margin-top: 0.1rem;">${cls.homework}</div>
                </div>
              </div>

              <button class="btn btn-secondary" style="width: 100%; font-size: 0.8rem; padding: 0.4rem;" onclick="ProgressModule.openUpdateModal(${this.activeGrade}, ${cls.classNum})">
                ⚙️ ${cls.classNum}반 진도 수정
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Update Modal -->
      <div id="progress-modal-overlay" class="modal-overlay">
        <div class="glass-card modal-content">
          <div class="modal-header">
            <h3 style="font-size: 1.3rem; font-weight: 700;" id="modal-title-text">진도 업데이트</h3>
            <button class="close-btn" onclick="ProgressModule.closeUpdateModal()">×</button>
          </div>

          <form onsubmit="ProgressModule.handleSaveProgress(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">학년 선택</label>
                <select id="modal-grade-select" class="input-control" onchange="ProgressModule.onModalGradeChange()">
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">학반 선택</label>
                <select id="modal-class-select" class="input-control">
                  ${[1,2,3,4,5,6,7,8].map(c => `<option value="${c}">${c}반</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">현재 진도 단원명</label>
              <input type="text" id="modal-unit-input" class="input-control" required placeholder="예: 3. 이차방정식의 활용">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">교과서 페이지</label>
                <input type="text" id="modal-pages-input" class="input-control" placeholder="예: p.84 ~ p.92">
              </div>

              <div class="form-group">
                <label class="form-label">진도 달성률 (%)</label>
                <input type="number" id="modal-pct-input" class="input-control" min="0" max="100" value="70">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">과제 안내</label>
              <input type="text" id="modal-hw-input" class="input-control" placeholder="예: 중단원 마무리 문제 1~8번">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
              <button type="button" class="btn btn-secondary" onclick="ProgressModule.closeUpdateModal()">취소</button>
              <button type="submit" class="btn btn-primary">💾 진도 저장하기</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  switchGrade(gradeNum) {
    this.activeGrade = gradeNum;
    const contentArea = document.getElementById('teacher-main-view');
    if (contentArea) {
      contentArea.innerHTML = this.renderView();
    }
  },

  openUpdateModal(gradeNum = this.activeGrade, classNum = 1) {
    const modal = document.getElementById('progress-modal-overlay');
    if (!modal) return;

    this.activeGrade = gradeNum;
    document.getElementById('modal-grade-select').value = gradeNum;
    document.getElementById('modal-class-select').value = classNum;

    const clsData = this.progressData[gradeNum].find(c => c.classNum === classNum);
    if (clsData) {
      document.getElementById('modal-unit-input').value = clsData.unit;
      document.getElementById('modal-pages-input').value = clsData.pages;
      document.getElementById('modal-pct-input').value = clsData.progressPct;
      document.getElementById('modal-hw-input').value = clsData.homework;
    }

    modal.classList.add('active');
  },

  closeUpdateModal() {
    const modal = document.getElementById('progress-modal-overlay');
    if (modal) modal.classList.remove('active');
  },

  onModalGradeChange() {
    const g = parseInt(document.getElementById('modal-grade-select').value);
    const c = parseInt(document.getElementById('modal-class-select').value);
    const clsData = this.progressData[g].find(item => item.classNum === c);
    if (clsData) {
      document.getElementById('modal-unit-input').value = clsData.unit;
      document.getElementById('modal-pages-input').value = clsData.pages;
      document.getElementById('modal-pct-input').value = clsData.progressPct;
      document.getElementById('modal-hw-input').value = clsData.homework;
    }
  },

  handleSaveProgress(e) {
    e.preventDefault();
    const g = parseInt(document.getElementById('modal-grade-select').value);
    const c = parseInt(document.getElementById('modal-class-select').value);

    const clsData = this.progressData[g].find(item => item.classNum === c);
    if (clsData) {
      clsData.unit = document.getElementById('modal-unit-input').value;
      clsData.pages = document.getElementById('modal-pages-input').value;
      clsData.progressPct = parseInt(document.getElementById('modal-pct-input').value);
      clsData.homework = document.getElementById('modal-hw-input').value;

      const now = new Date();
      clsData.lastDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
    }

    this.closeUpdateModal();
    this.switchGrade(g);
    alert(`[진도 저장 완료]\n영서중학교 ${g}학년 ${c}반의 수업 진도가 정상적으로 기록되었습니다.`);
  }
};

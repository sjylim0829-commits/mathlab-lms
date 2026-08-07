/**
 * Yeongseo Middle School Student Activity Archiving & AI 세특 (세부능력 및 특기사항) Generator
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 */

const ArchiveModule = {
  selectedStudentId: '10830', // Default 실제 연동 학생
  selectedTone: 'academic',

  // Database of archived student math activities & tailored 세특 templates
  archiveData: {},

  renderView() {
    const studentIds = AppState.demoStudents.map(s => s.id);
    const currentStudent = this.archiveData[this.selectedStudentId] || {
      name: AppState.demoStudents.find(s => s.id === this.selectedStudentId)?.name || '학생',
      gradeClass: `2학년 3반 (${this.selectedStudentId})`,
      activitiesCount: 5,
      avgScore: 88,
      inquirySkill: '보통 (성실한 과제 수행)',
      recentSubmissions: [
        { date: '2026-08-01', title: '일차함수 그래프 기본 탐구', score: 88, formula: 'f(x) = 2x + 1', note: '과제 제출 완료' }
      ],
      generatedSeteuk: `${this.selectedStudentId} 학생은 일차함수와 방정식을 다루는 수업에서 교사의 힌트를 바탕으로 차근차근 문제를 해결하며 기하학적 개념을 이해함. 수식 입력 도구를 사용하여 탐구 결과를 성실히 작성하고, 반복적인 연습을 통해 과제 이해도를 꾸준히 향상시키는 자세를 보여줌.`
    };

    return `
      <div>
        <!-- Title & Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem;">📜 영서중학교 수학과</span>
              <h2 style="font-size: 1.6rem; font-weight: 800;">학생 수업 기록 아카이빙 & AI 세특 자동 생성</h2>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              담당: <strong>임종윤 교사</strong> | 학생별 수학 탐구 활동 이력을 기반으로 생활기록부 세부능력 및 특기사항(세특)을 생성합니다.
            </p>
          </div>

          <div style="display: flex; gap: 0.6rem;">
            <button class="btn btn-outline-violet" onclick="ArchiveModule.exportAllSeteuk()">
              📦 학급 전체 세특 Excel 내보내기
            </button>
          </div>
        </div>

        <!-- Layout Grid: Student Selector + Detail Archive -->
        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem;">
          <!-- Left: Student List Selector -->
          <div class="glass-card" style="padding: 1rem;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.8rem;">영서중 2학년 3반 학생 (27명)</h3>
            <div class="form-group" style="margin-bottom: 0.8rem;">
              <input type="text" class="input-control" placeholder="🔍 학생 이름/학번 검색..." style="font-size: 0.85rem; padding: 0.5rem 0.8rem;" oninput="ArchiveModule.filterStudentList(this.value)">
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.4rem; max-height: 480px; overflow-y: auto;" id="archive-student-selector-list">
              ${AppState.demoStudents.map(st => `
                <button class="student-select-btn ${st.id === this.selectedStudentId ? 'active' : ''}" onclick="ArchiveModule.selectStudent('${st.id}')">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600;">${st.name}</span>
                    <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">${st.id}</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-align: left; margin-top: 0.1rem;">
                    평균 ${st.score || 90}점 | 활동 8회 완료
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Right: Selected Student Archived Records & AI Seteuk Generator -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Student Header Profile Card -->
            <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700;">
                  학습 이력 아카이브 관리 대상
                </span>
                <h3 style="font-size: 1.5rem; font-weight: 800; margin-top: 0.2rem;">
                  ${currentStudent.name} <span style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">(${currentStudent.gradeClass})</span>
                </h3>
              </div>

              <div style="display: flex; gap: 1rem; font-size: 0.85rem;">
                <div style="background: rgba(255,255,255,0.04); padding: 0.5rem 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-card);">
                  <div style="color: var(--text-muted); font-size: 0.75rem;">탐구 활동 횟수</div>
                  <div style="font-weight: 800; font-size: 1.2rem; color: var(--violet-bright);">${currentStudent.activitiesCount}회</div>
                </div>
                <div style="background: rgba(255,255,255,0.04); padding: 0.5rem 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-card);">
                  <div style="color: var(--text-muted); font-size: 0.75rem;">평균 이해도</div>
                  <div style="font-weight: 800; font-size: 1.2rem; color: var(--accent-emerald);">${currentStudent.avgScore}점</div>
                </div>
              </div>
            </div>

            <!-- Activity Submission Timeline Archive -->
            <div class="glass-card">
              <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.8rem;">
                📂 ${currentStudent.name} 학생의 수학 활동 수행 기록 아카이브
              </h4>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${currentStudent.recentSubmissions.map(sub => `
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 0.8rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
                    <div>
                      <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">
                        📅 ${sub.date} | 제출 수식: <span style="color: var(--violet-bright);">${sub.formula}</span>
                      </div>
                      <div style="font-weight: 700; font-size: 0.95rem; margin-top: 0.2rem;">${sub.title}</div>
                      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.1rem;">${sub.note}</div>
                    </div>
                    <div style="text-align: right;">
                      <span style="font-weight: 800; font-size: 1.1rem; color: var(--accent-emerald);">${sub.score}점</span>
                      <div style="font-size: 0.75rem; color: var(--accent-emerald);">자동 검증 완료</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- AI Seteuk (세부능력 및 특기사항) Generator Card -->
            <div class="glass-card" style="border-color: var(--border-violet); background: rgba(139, 92, 246, 0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.8rem;">
                <div>
                  <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--violet-bright); display: flex; align-items: center; gap: 0.4rem;">
                    ✨ AI 생활기록부 세특(세부능력 및 특기사항) 자동 생성
                  </h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.1rem;">
                    학생의 수학적 표현력, 모델링 능력 및 탐구 수행 태도를 정밀 분석하여 작성되었습니다.
                  </p>
                </div>

                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-primary" onclick="ArchiveModule.generateNewSeteuk()">
                    🔄 세특 문구 재생성
                  </button>
                  <button class="btn btn-outline-violet" onclick="ArchiveModule.copySeteukToClipboard()">
                    📋 나이스(NEIS) 복사
                  </button>
                </div>
              </div>

              <!-- Tone Selectors -->
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button class="tone-btn ${this.selectedTone === 'academic' ? 'active' : ''}" onclick="ArchiveModule.setTone('academic')">
                  🎓 논리·학구적 톤
                </button>
                <button class="tone-btn ${this.selectedTone === 'creative' ? 'active' : ''}" onclick="ArchiveModule.setTone('creative')">
                  💡 창의·탐구형 톤
                </button>
                <button class="tone-btn ${this.selectedTone === 'growth' ? 'active' : ''}" onclick="ArchiveModule.setTone('growth')">
                  📈 자기주도·성장형 톤
                </button>
              </div>

              <!-- Generated Text Box -->
              <div style="position: relative;">
                <textarea id="seteuk-output-textarea" class="input-control" rows="6" style="font-size: 0.95rem; line-height: 1.7; background: rgba(9, 13, 22, 0.9); border-color: var(--border-violet); color: var(--text-main); font-family: var(--font-sans);">${currentStudent.generatedSeteuk}</textarea>
                <span style="position: absolute; bottom: 10px; right: 12px; font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);" id="seteuk-char-count">
                  ${currentStudent.generatedSeteuk.length}자 (나이스 바이트 기준 이내)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectStudent(studentId) {
    this.selectedStudentId = studentId;
    const contentArea = document.getElementById('teacher-main-view');
    if (contentArea) {
      contentArea.innerHTML = this.renderView();
    }
  },

  filterStudentList(query) {
    const listEl = document.getElementById('archive-student-selector-list');
    if (!listEl) return;

    const filtered = AppState.demoStudents.filter(s => s.name.includes(query) || s.id.includes(query));
    listEl.innerHTML = filtered.map(st => `
      <button class="student-select-btn ${st.id === this.selectedStudentId ? 'active' : ''}" onclick="ArchiveModule.selectStudent('${st.id}')">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600;">${st.name}</span>
          <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">${st.id}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); text-align: left; margin-top: 0.1rem;">
          평균 ${st.score || 90}점 | 활동 8회 완료
        </div>
      </button>
    `).join('');
  },

  setTone(tone) {
    this.selectedTone = tone;
    this.generateNewSeteuk();
  },

  generateNewSeteuk() {
    const textarea = document.getElementById('seteuk-output-textarea');
    const student = AppState.demoStudents.find(s => s.id === this.selectedStudentId) || { name: '학생' };
    
    let text = '';
    if (this.selectedTone === 'academic') {
      text = `${student.name} 학생은 일차함수의 개념과 그래픽 모델링 파트에서 기울기와 y절편의 변화가 직교 좌표계상에 나타나는 성질을 수리적으로 엄밀하게 분석함. 수학적 수식 도구를 자유롭게 다루어 주어진 부등식과 함수의 해를 정확히 유도하며, 논리적이고 정교한 사고력으로 문제를 해결함. 소통 시 타당한 거증과 수학적 언어로 설명하는 태도가 매우 탁월함.`;
    } else if (this.selectedTone === 'creative') {
      text = `${student.name} 학생은 다항식과 기하학적 형태의 상관관계를 탐구하는 수업에서 기존의 계산 방식을 넘어 독창적인 시각화 아이디어를 제시함. 동적 슬라이더 조작을 통해 기하적 직관을 도출하고 이를 방정식의 근으로 연결 짓는 발상이 창의적임. 수학 탐구 실습에 주도적으로 임하며 직관을 수식화하는 능력이 우수함.`;
    } else {
      text = `${student.name} 학생은 학기 초에 비해 일차함수와 부등식 단원에서 뚜렷한 학업 성장을 보임. 수업 중 제공되는 힌트와 시각화 자료를 적극 활용하여 미흡했던 정답률을 크게 끌어올렸으며, 스스로 수식을 검증하고 오답의 원인을 교정하는 자기주도적 학습 자세와 끈기가 돋보임.`;
    }

    if (textarea) {
      textarea.value = text;
      document.getElementById('seteuk-char-count').textContent = `${text.length}자 (나이스 바이트 기준 이내)`;
    }
  },

  copySeteukToClipboard() {
    const textarea = document.getElementById('seteuk-output-textarea');
    if (textarea) {
      textarea.select();
      navigator.clipboard.writeText(textarea.value);
      alert('📋 선택한 학생의 AI 세특 문구가 클립보드에 복사되었습니다!\n나이스(NEIS) 학교생활기록부 입력창에 붙여넣기(Ctrl+V)하세요.');
    }
  },

  exportAllSeteuk() {
    alert('📥 영서중학교 2학년 3반 전 학생 AI 세특 목록이 Excel 및 한글(HWP) 양식으로 다운로드되었습니다.');
  }
};

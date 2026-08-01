/**
 * Yeongseo Middle School Teacher Management Module
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 */

const TeacherModule = {
  activeTab: 'dashboard',
  liveSimulationInterval: null,

  init() {
    this.bindTabEvents();
  },

  bindTabEvents() {
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.teacher-tab-btn');
      if (tabBtn) {
        const targetTab = tabBtn.dataset.tab;
        this.switchTab(targetTab);
      }
    });
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.teacher-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    const contentArea = document.getElementById('teacher-main-view');
    if (!contentArea) return;

    if (tabName === 'dashboard') {
      contentArea.innerHTML = this.renderDashboard();
    } else if (tabName === 'progress-tracker') {
      contentArea.innerHTML = ProgressModule.renderView();
    } else if (tabName === 'archive-seteuk') {
      contentArea.innerHTML = ArchiveModule.renderView();
    } else if (tabName === 'live-monitor') {
      contentArea.innerHTML = this.renderLiveMonitor();
      this.initLiveMonitorCanvas();
    } else if (tabName === 'builder') {
      contentArea.innerHTML = this.renderActivityBuilder();
    } else if (tabName === 'analytics') {
      contentArea.innerHTML = this.renderAnalytics();
    }
  },

  // 1. Dashboard View HTML
  renderDashboard() {
    return `
      <div class="metrics-grid">
        <div class="glass-card metric-card hover-lift">
          <span class="metric-label">담당 수업 학급</span>
          <div class="metric-value-row">
            <span class="metric-value">24<span style="font-size: 1.2rem;">개 반</span></span>
            <span class="metric-badge violet">1~3학년 (1~8반 전체)</span>
          </div>
        </div>

        <div class="glass-card metric-card hover-lift">
          <span class="metric-label">전체 수업 진행률</span>
          <div class="metric-value-row">
            <span class="metric-value">62.8<span style="font-size: 1.2rem;">%</span></span>
            <span class="metric-badge positive">정상 진도 순항 중</span>
          </div>
        </div>

        <div class="glass-card metric-card hover-lift">
          <span class="metric-label">수강 학생 수</span>
          <div class="metric-value-row">
            <span class="metric-value">648<span style="font-size: 1.2rem;">명</span></span>
            <span class="metric-badge positive">영서중 전교생</span>
          </div>
        </div>

        <div class="glass-card metric-card hover-lift">
          <span class="metric-label">생성된 AI 세특 개수</span>
          <div class="metric-value-row">
            <span class="metric-value">142<span style="font-size: 1.2rem;">건</span></span>
            <span class="metric-badge violet">나이스 입력 완료</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 2rem;">
        <div class="glass-card hover-lift" style="background: rgba(139, 92, 246, 0.08); border-color: var(--border-violet);">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--violet-bright);">
            📚 수업 진도 기록부
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem; margin-bottom: 1rem;">
            영서중학교 수학 교과 24개 전 학급의 교과서 단원, 페이지 및 과제 현황을 일괄 기록합니다.
          </p>
          <button class="btn btn-primary teacher-tab-btn" data-tab="progress-tracker">
            🏫 수업 진도 기록부 바로가기 →
          </button>
        </div>

        <div class="glass-card hover-lift" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3);">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald);">
            📜 학생 기록 아카이브 & AI 세특 자동 생성기
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem; margin-bottom: 1rem;">
            학생들의 수학 탐구 실습 이력을 바탕으로 생활기록부 세부능력 및 특기사항을 맞춤 작성합니다.
          </p>
          <button class="btn btn-outline-violet teacher-tab-btn" data-tab="archive-seteuk">
            ✨ AI 세특 생성기 바로가기 →
          </button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h2 style="font-size: 1.4rem; font-weight: 700;">수업 탐구 활동 및 퀴즈</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">임종윤 교사가 생성한 중학교 대화형 수학 실습 카드입니다.</p>
        </div>
        <button class="btn btn-outline-violet teacher-tab-btn" data-tab="builder">
          ✨ 새 탐구 문제 제작
        </button>
      </div>

      <div class="activities-grid">
        <!-- Activity Card 1 -->
        <div class="glass-card hover-lift">
          <div class="activity-card-header">
            <div>
              <span class="status-indicator live">
                <span class="dot"></span> 실시간 수업 진행 중
              </span>
              <h3 class="activity-title" style="margin-top: 0.5rem;">[2학년] 일차함수 $y = ax + b$ 기울기와 절편 탐구</h3>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            기울기 $a$와 y절편 $b$를 변경하여 평행, 직교 및 직선의 방정식 관계 관찰
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-card); padding-top: 0.8rem;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-dim);">참여 코드</span>
              <div class="pin-code-badge">🔑 YS-2041</div>
            </div>
            <button class="btn btn-outline-violet teacher-tab-btn" data-tab="live-monitor">
              📊 실시간 대시보드
            </button>
          </div>
        </div>

        <!-- Activity Card 2 -->
        <div class="glass-card hover-lift">
          <div class="activity-card-header">
            <div>
              <span class="status-indicator" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">
                ⏳ 예약 대기중
              </span>
              <h3 class="activity-title" style="margin-top: 0.5rem;">[3학년] 이차함수 $y = a(x-p)^2 + q$ 꼭짓점 이동</h3>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            표준형 이차함수의 평행이동과 대칭축의 방정식 시각화 퀴즈
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-card); padding-top: 0.8rem;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-dim);">참여 코드</span>
              <div class="pin-code-badge">🔑 YS-3088</div>
            </div>
            <button class="btn btn-secondary" onclick="alert('수업 시작 시 코드 활성화됩니다.');">
              ▶️ 수업 시작하기
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 2. Live Session Monitor View HTML
  renderLiveMonitor() {
    const students = AppState.demoStudents;

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="status-indicator live"><span class="dot"></span> Live Session</span>
            <h2 style="font-size: 1.5rem; font-weight: 800;">[2학년 3반] 일차함수 그래프 실시간 모니터링</h2>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
            영서중학교 2학년 3반 | 담당: 임종윤 교사 | 수업 PIN: <span class="pin-code-badge" style="font-size: 0.8rem;">YS-2041</span>
          </p>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-outline-violet" id="toggle-sim-btn" onclick="TeacherModule.toggleLiveSimulation()">
            ⚡ 학생 응답 실시간 시뮬레이션
          </button>
          <button class="btn btn-secondary" onclick="alert('2학년 3반에 힌트 메시지를 전송했습니다.');">
            💡 전체 힌트 전송
          </button>
          <button class="btn btn-primary" onclick="alert('제출이 완료되었습니다.');">
            🔒 제출 마감
          </button>
        </div>
      </div>

      <div class="monitor-matrix-container">
        <!-- Main Board Left -->
        <div>
          <div class="glass-card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700;">실시간 공통 모델링 그래프</h3>
              <span style="font-size: 0.8rem; color: var(--violet-bright);" id="live-target-formula">
                기본 방정식: $y = 1.0x - 2.0$ (기울기 $a = 1.0$)
              </span>
            </div>
            <div class="grapher-canvas-card" style="height: 280px;">
              <canvas id="teacher-live-grapher" class="grapher-canvas"></canvas>
            </div>
          </div>

          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700;">영서중 2학년 3반 학생 응답 현황 (27명)</h3>
              <div style="display: flex; gap: 1rem; font-size: 0.8rem;">
                <span style="color: var(--accent-emerald);">● 제출 완료 (22)</span>
                <span style="color: var(--accent-gold);">● 작성 중 (4)</span>
                <span style="color: var(--text-dim);">● 미제출 (1)</span>
              </div>
            </div>

            <div class="students-matrix-grid" id="students-grid-matrix">
              ${students.map(st => `
                <div class="student-status-chip ${st.status}" onclick="TeacherModule.showStudentDetail('${st.id}')">
                  <div class="student-name">${st.name}</div>
                  <div class="student-progress-text">
                    ${st.status === 'submitted' ? '✅ 제출 완료 (' + st.score + '점)' : st.status === 'in-progress' ? '✏️ 작성 중...' : '⏳ 미작성'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Live Activity Log Sidebar Right -->
        <div class="glass-card" style="height: fit-content;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <span>🔥 탐구 참여 피드</span>
            <span style="font-size: 0.75rem; color: var(--accent-emerald);">● Live</span>
          </h3>

          <div class="live-feed-list" id="live-activity-feed">
            <div class="feed-item">
              <span class="feed-timestamp">18:30</span>
              <div><strong>김민준</strong> 학생이 기울기 $a = 1.0$ 제출</div>
            </div>
            <div class="feed-item">
              <span class="feed-timestamp">18:29</span>
              <div><strong>이서연</strong> 학생이 일차함수 $y = 2x - 3$ 완설!</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initLiveMonitorCanvas() {
    setTimeout(() => {
      const graphCanvas = document.getElementById('teacher-live-grapher');
      if (graphCanvas) {
        this.liveGrapher = new MathGrapher(graphCanvas, {
          funcType: 'quadratic',
          a: 1.0,
          b: 0,
          c: -2.0,
          x0: 1.0
        });
      }
    }, 50);
  },

  toggleLiveSimulation() {
    const btn = document.getElementById('toggle-sim-btn');
    if (this.liveSimulationInterval) {
      clearInterval(this.liveSimulationInterval);
      this.liveSimulationInterval = null;
      if (btn) {
        btn.innerHTML = '⚡ 학생 응답 실시간 시뮬레이션';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-violet');
      }
    } else {
      if (btn) {
        btn.innerHTML = '⏸️ 시뮬레이션 일시정지';
        btn.classList.remove('btn-outline-violet');
        btn.classList.add('btn-primary');
      }
      this.liveSimulationInterval = setInterval(() => {
        const inProgressList = AppState.demoStudents.filter(s => s.status !== 'submitted');
        if (inProgressList.length > 0) {
          const randomStudent = inProgressList[Math.floor(Math.random() * inProgressList.length)];
          randomStudent.status = 'submitted';
          randomStudent.score = Math.floor(Math.random() * 20) + 80;

          const feed = document.getElementById('live-activity-feed');
          if (feed) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const item = document.createElement('div');
            item.className = 'feed-item';
            item.innerHTML = `<span class="feed-timestamp">${timeStr}</span><div><strong>${randomStudent.name}</strong> 학생이 정답 제출 (${randomStudent.score}점)!</div>`;
            feed.prepend(item);
          }

          const grid = document.getElementById('students-grid-matrix');
          if (grid) {
            grid.innerHTML = AppState.demoStudents.map(st => `
              <div class="student-status-chip ${st.status}" onclick="TeacherModule.showStudentDetail('${st.id}')">
                <div class="student-name">${st.name}</div>
                <div class="student-progress-text">
                  ${st.status === 'submitted' ? '✅ 제출 완료 (' + st.score + '점)' : st.status === 'in-progress' ? '✏️ 작성 중...' : '⏳ 미작성'}
                </div>
              </div>
            `).join('');
          }
        }
      }, 2500);
    }
  },

  showStudentDetail(studentId) {
    const student = AppState.demoStudents.find(s => s.id === studentId);
    if (!student) return;

    alert(`[영서중 2학년 3반 학생 제출 답안]\n학생명: ${student.name}\n상태: ${student.status === 'submitted' ? '제출 완료' : '진행 중'}\n점수: ${student.score}점\n제출 수식: f(x) = x^2 - 2`);
  },

  renderActivityBuilder() {
    return `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800;">✨ 영서중 수학 탐구 활동 등록</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted);">임종윤 교사가 중학교 수학 교육과정에 맞춘 탐구 문제를 구성합니다.</p>
        </div>

        <form onsubmit="TeacherModule.handleSaveActivity(event)" class="glass-card" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="form-group">
            <label class="form-label">탐구 활동 제목</label>
            <input type="text" class="input-control" required placeholder="예: [2학년] 일차함수의 그래프와 기울기의 성질" value="[2학년] 일차부등식과 그 해를 수직선 위에 나타내기">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">학년 선택</label>
              <select class="input-control">
                <option>1학년</option>
                <option selected>2학년</option>
                <option>3학년</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">대상 학반</label>
              <select class="input-control">
                <option selected>2학년 3반</option>
                <option>2학년 1반 ~ 8반 전체</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">문제 설명 및 탐구 요령</label>
            <textarea class="input-control" rows="3">부등식 2x - 4 > 0 의 해를 구하고, 수직선 위에서 해의 범위를 동적으로 조작하여 시각화하세요.</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
            <button type="button" class="btn btn-secondary teacher-tab-btn" data-tab="dashboard">취소</button>
            <button type="submit" class="btn btn-primary">🚀 탐구 문제 등록 및 PIN 발급</button>
          </div>
        </form>
      </div>
    `;
  },

  handleSaveActivity(e) {
    e.preventDefault();
    alert('새 수업 활동이 성공적으로 등록되었습니다!\n영서중 수업 PIN: YS-8821');
    this.switchTab('dashboard');
  },

  renderAnalytics() {
    const students = AppState.demoStudents;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800;">영서중학교 2학년 3반 - 수학 학업 성취도</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">담당 교사: 임종윤 교사 | 2학년 3반 형성평가 결과 분석 리포트</p>
          </div>
          <button class="btn btn-outline-violet" onclick="alert('영서중 2학년 3반 Excel 성적표가 다운로드되었습니다.');">
            📥 Excel 리포트 내보내기
          </button>
        </div>

        <div class="glass-card">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-card); color: var(--text-muted);">
                <th style="padding: 0.8rem;">학번 / 이름</th>
                <th style="padding: 0.8rem;">수업 과제</th>
                <th style="padding: 0.8rem;">형성평가 점수</th>
                <th style="padding: 0.8rem;">이해도 판별</th>
                <th style="padding: 0.8rem; text-align: right;">상세 보기</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(st => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.8rem; font-weight: 600;">
                    ${st.name} <span style="font-size: 0.75rem; color: var(--text-muted);">(${st.id})</span>
                  </td>
                  <td style="padding: 0.8rem;">일차함수 그래프</td>
                  <td style="padding: 0.8rem;">
                    <span style="font-weight: 700; color: ${st.score >= 90 ? 'var(--accent-emerald)' : 'var(--violet-bright)'};">
                      ${st.score}점
                    </span>
                  </td>
                  <td style="padding: 0.8rem;">
                    ${st.score >= 80 ? '✅ 우수 (개념 습득 완료)' : '⚠️ 보충 지도 필요'}
                  </td>
                  <td style="padding: 0.8rem; text-align: right;">
                    <button class="btn btn-secondary" style="padding: 0.3rem 0.7rem; font-size: 0.75rem;" onclick="TeacherModule.showStudentDetail('${st.id}')">
                      📄 답안 확인
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

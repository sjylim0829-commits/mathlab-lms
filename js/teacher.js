/**
 * Yeongseo Middle School Teacher Management Module & Inquiry Activities Hub
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 */

const TeacherModule = {
  activeTab: 'dashboard',
  triangleExplorer: null,

  init() {
    this.bindTabEvents();
    if (this.activeTab === 'builder') {
      setTimeout(() => this.initTriangleExplorer(), 50);
    }
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

    // Close mobile menu if open
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    const contentArea = document.getElementById('teacher-main-view');
    if (!contentArea) return;

    if (tabName === 'dashboard') {
      contentArea.innerHTML = this.renderDashboard();
    } else if (tabName === 'progress-tracker') {
      contentArea.innerHTML = ProgressModule.renderView();
    } else if (tabName === 'archive-seteuk') {
      contentArea.innerHTML = ArchiveModule.renderView();
    } else if (tabName === 'builder') {
      contentArea.innerHTML = this.renderActivityBuilder();
      setTimeout(() => this.initTriangleExplorer(), 50);
    } else if (tabName === 'analytics') {
      contentArea.innerHTML = this.renderAnalytics();
    }
  },

  // 1. Dashboard View HTML
  renderDashboard() {
    const totalStudents = AppState.demoStudents.length;

    return `
      <div style="width: 100%;">
        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="glass-card metric-card hover-lift">
            <span class="metric-label">담당 수업 학급</span>
            <div class="metric-value-row">
              <span class="metric-value">24<span style="font-size: 1.2rem;">개 반</span></span>
              <span class="metric-badge violet">1~3학년 (1~8반 전체)</span>
            </div>
          </div>

          <div class="glass-card metric-card hover-lift">
            <span class="metric-label">회원가입 학생 수</span>
            <div class="metric-value-row">
              <span class="metric-value">${totalStudents}<span style="font-size: 1.2rem;">명</span></span>
              <span class="metric-badge positive">실시간 가입 반영 중</span>
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
            <span class="metric-label">생성된 AI 세특 개수</span>
            <div class="metric-value-row">
              <span class="metric-value">142<span style="font-size: 1.2rem;">건</span></span>
              <span class="metric-badge violet">나이스 입력 완료</span>
            </div>
          </div>
        </div>

        <!-- Quick Action Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; width: 100%;">
          <div class="glass-card hover-lift" style="background: rgba(139, 92, 246, 0.08); border-color: var(--border-violet); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--violet-bright);">
                📚 수업 진도 기록부
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem; margin-bottom: 1.25rem;">
                영서중학교 수학 교과 24개 전 학급의 교과서 단원, 페이지 및 과제 현황을 일괄 기록하고 구글 시트와 연동합니다.
              </p>
            </div>
            <button class="btn btn-primary teacher-tab-btn" data-tab="progress-tracker" style="width: 100%;">
              🏫 수업 진도 기록부 바로가기 →
            </button>
          </div>

          <div class="glass-card hover-lift" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-emerald);">
                📜 학생 기록 아카이브 & AI 세특 생성
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem; margin-bottom: 1.25rem;">
                학생들의 수학 탐구 실습 이력을 바탕으로 생활기록부 세부능력 및 특기사항을 맞춤 작성합니다.
              </p>
            </div>
            <button class="btn btn-outline-violet teacher-tab-btn" data-tab="archive-seteuk" style="width: 100%;">
              ✨ AI 세특 생성기 바로가기 →
            </button>
          </div>

          <div class="glass-card hover-lift" style="background: rgba(6, 182, 212, 0.08); border-color: rgba(6, 182, 212, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan);">
                📐 대화형 수학 탐구 활동
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem; margin-bottom: 1.25rem;">
                직각삼각형의 RHA & RHS 합동 조건 탐구 실습 도구를 사용하고, 학생 탐구 결과를 구글 시트로 수집합니다.
              </p>
            </div>
            <button class="btn btn-secondary teacher-tab-btn" data-tab="builder" style="width: 100%;">
              📐 탐구 활동 바로가기 →
            </button>
          </div>
        </div>

        <!-- Registered Student Accounts Roster Section -->
        <div class="glass-card" style="margin-bottom: 2rem; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.8rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎒 회원가입 학생 명부 및 계정 관리</span>
                <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); padding: 2px 8px; border-radius: 12px; font-weight: 700;">
                  총 ${totalStudents}명 가입됨
                </span>
              </h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                학생들이 로그인 화면에서 선택하여 가입한 학년 및 학반 정보가 실시간 반영됩니다.
              </p>
            </div>
            <button class="btn btn-secondary teacher-tab-btn" data-tab="analytics" style="font-size: 0.8rem;">
              📋 전체 명부 상세보기
            </button>
          </div>

          <div style="max-height: 260px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-card); color: var(--text-muted);">
                  <th style="padding: 0.6rem;">학번 (아이디)</th>
                  <th style="padding: 0.6rem;">학생 성명</th>
                  <th style="padding: 0.6rem;">소속 학급</th>
                  <th style="padding: 0.6rem;">계정 상태</th>
                  <th style="padding: 0.6rem; text-align: right;">학습 이력</th>
                </tr>
              </thead>
              <tbody>
                ${totalStudents === 0 ? `
                  <tr>
                    <td colspan="5" style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                      등록된 신규 회원가입 학생이 없습니다.
                    </td>
                  </tr>
                ` : AppState.demoStudents.slice(0, 10).map(st => `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <td style="padding: 0.6rem; font-family: var(--font-mono); color: var(--violet-bright);">${st.id}</td>
                    <td style="padding: 0.6rem; font-weight: 700;">${st.name}</td>
                    <td style="padding: 0.6rem; color: var(--text-main); font-weight: 600;">
                      영서중 ${st.grade || '1'}학년 ${st.classNum || '1'}반
                    </td>
                    <td style="padding: 0.6rem;">
                      <span style="font-size: 0.75rem; background: rgba(16,185,129,0.12); color: var(--accent-emerald); padding: 2px 7px; border-radius: 10px;">
                        ● 정상 가입됨
                      </span>
                    </td>
                    <td style="padding: 0.6rem; text-align: right;">
                      <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="TeacherModule.showStudentDetail('${st.id}')">
                        📄 답안 확인
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 700;">수업 탐구 활동 및 대화형 수학 실습</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">임종윤 교사가 생성한 중학교 대화형 수학 실습 카드입니다.</p>
          </div>
          <button class="btn btn-outline-violet teacher-tab-btn" data-tab="builder">
            📐 탐구 활동 바로가기
          </button>
        </div>

        <div class="activities-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; width: 100%;">
          <!-- Activity Card 1 -->
          <div class="glass-card hover-lift">
            <div class="activity-card-header">
              <div>
                <span class="status-indicator live">
                  <span class="dot"></span> 실시간 탐구 진행 가능
                </span>
                <h3 class="activity-title" style="margin-top: 0.5rem;">[2학년] 직각삼각형의 합동 조건 (RHA & RHS) 탐구</h3>
              </div>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              삼각형 통째 드래그 기능을 통해 두 직각삼각형을 직접 겹쳐보며 RHA 및 RHS 합동 증명
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-card); padding-top: 0.8rem;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-dim);">참여 코드</span>
                <div class="pin-code-badge">🔑 YS-2041</div>
              </div>
              <button class="btn btn-outline-violet teacher-tab-btn" data-tab="builder">
                📊 탐구 활동 시작
              </button>
            </div>
          </div>

          <!-- Activity Card 2 -->
          <div class="glass-card hover-lift">
            <div class="activity-card-header">
              <div>
                <span class="status-indicator" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">
                  ⏳ 정규 교육과정
                </span>
                <h3 class="activity-title" style="margin-top: 0.5rem;">[2학년] 이등변삼각형의 성질 및 두 밑각의 크기 증명</h3>
              </div>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              꼭짓각의 이등분선에 의해 나누어진 두 직각삼각형의 SAS 및 RHA 합동 관계 유도
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-card); padding-top: 0.8rem;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-dim);">참여 코드</span>
                <div class="pin-code-badge">🔑 YS-2088</div>
              </div>
              <button class="btn btn-secondary teacher-tab-btn" data-tab="builder">
                ▶️ 탐구 활동 시작
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  showStudentDetail(studentId) {
    const student = AppState.demoStudents.find(s => String(s.id) === String(studentId));
    if (!student) return;

    alert(`[영서중 학생 정보 및 답안]\n학생명: ${student.name}\n학번: ${student.id}\n소속: 영서중학교 ${student.grade || '1'}학년 ${student.classNum || '1'}반\n상태: ${student.status === 'submitted' ? '제출 완료' : '진행 중'}\n점수: ${student.score}점\n제출 수식: f(x) = x^2 - 2`);
  },

  // 2. Inquiry Activities View & Embed Hub (📐 탐구 활동)
  renderActivityBuilder() {
    return `
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem; background: rgba(139, 92, 246, 0.2); color: var(--primary-violet);">
                🏫 영서중학교 수학과
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 800;">📐 탐구 활동: 직각삼각형의 합동 조건 (RHA & RHS)</h2>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              담당 교사: <strong style="color: var(--text-main);">임종윤 교사 (영서중학교)</strong> | 삼각형 전체 드래그 겹치기 실습 및 구글 시트 저장
            </p>
          </div>

          <button class="btn btn-primary" onclick="TeacherModule.toggleEmbedForm()">
            ➕ 새 탐구 활동 등록 / 구글 웹앱 임베딩
          </button>
        </div>

        <!-- Custom Google Apps Script / Web App URL Registration Form -->
        <div id="activity-embed-form-container" class="glass-card" style="margin-bottom: 2rem; display: none;">
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--violet-bright); margin-bottom: 1rem;">
            🔗 구글 앱스 스크립트 웹 앱 및 탐구 도구 임베딩 등록
          </h3>
          <form onsubmit="TeacherModule.handleRegisterEmbeddedActivity(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">탐구 활동 제목</label>
                <input type="text" id="embed-title-input" class="input-control" required value="[2학년] 직각삼각형의 합동 조건 탐구 (RHA & RHS 합동 실습)">
              </div>
              <div class="form-group">
                <label class="form-label">대상 학년 및 학반</label>
                <select id="embed-grade-select" class="input-control">
                  <option value="1학년 1~8반">1학년 전체 (1~8반)</option>
                  <option value="2학년 1~8반" selected>2학년 전체 (1~8반)</option>
                  <option value="3학년 1~8반">3학년 전체 (1~8반)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" style="color: var(--violet-bright); font-weight: 700;">
                🌐 구글 앱스 스크립트 웹 앱 URL 또는 외부 탐구 도구 링크 (iframe 임베딩)
              </label>
              <input type="url" id="embed-url-input" class="input-control" placeholder="https://script.google.com/macros/s/.../exec 또는 GeoGebra/Desmos URL" value="https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec">
            </div>

            <div class="form-group">
              <label class="form-label">탐구 문제 설명 및 실습 안내</label>
              <textarea id="embed-desc-input" class="input-control" rows="2">삼각형을 통째로 마우스/손가락으로 드래그하여 두 직각삼각형을 완전 겹쳐보세요.</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.6rem;">
              <button type="button" class="btn btn-secondary" onclick="TeacherModule.toggleEmbedForm()">취소</button>
              <button type="submit" class="btn btn-primary">🚀 탐구 활동 등록 및 임베딩 적용</button>
            </div>
          </form>
        </div>

        <!-- Embedded Activity Interactive Workspace Hub -->
        <div class="glass-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.8rem;">
            <div>
              <span class="status-indicator live"><span class="dot"></span> 🖱️ 삼각형 통째로 드래그하여 겹치기 실습</span>
              <h3 style="font-size: 1.3rem; font-weight: 700; margin-top: 0.3rem;" id="active-activity-title">
                [2학년] 직각삼각형의 합동 조건 (RHA & RHS) 겹치기 탐구
              </h3>
            </div>

            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button class="btn btn-outline-violet" onclick="TeacherModule.setTriangleMode('RHA')">
                📐 RHA 합동 (빗변+한예각)
              </button>
              <button class="btn btn-outline-violet" onclick="TeacherModule.setTriangleMode('RHS')">
                📐 RHS 합동 (빗변+한변)
              </button>
              <button class="btn btn-secondary" onclick="TeacherModule.resetTrianglePos()">
                ⏪ 위치 리셋
              </button>
              <button class="btn btn-primary" onclick="TeacherModule.autoAnimateTriangleOverlay()">
                ✨ 자동으로 겹쳐보기
              </button>
            </div>
          </div>

          <!-- Interactive Embedded Canvas Workspace for Whole Triangle Dragging -->
          <div id="embed-app-container" style="background: rgba(9, 13, 22, 0.9); border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 1.25rem; min-height: 420px; display: flex; flex-direction: column; justify-content: center;">
            <div class="grapher-canvas-card" style="height: 380px; margin-bottom: 1rem;">
              <canvas id="builder-interactive-grapher" class="grapher-canvas" style="width: 100%; height: 100%;"></canvas>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem 1.2rem; border-radius: var(--radius-sm); flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 250px;">
                <label style="font-size: 0.85rem; color: var(--violet-bright); font-weight: 700; whitespace: nowrap;">🔄 이동 삼각형 회전 (0°~360°)</label>
                <input type="range" min="0" max="360" step="5" value="0" class="slider-input" oninput="TeacherModule.rotateTriangle(this.value)" style="flex: 1;">
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                💡 <strong>안내:</strong> 점을 하나씩 옮기지 않고 <strong>삼각형 통째로 마우스/손가락으로 드래그</strong>하여 끌어다 겹칩니다.
              </div>
            </div>
          </div>
        </div>

        <!-- Student Exploration Submission Test Form (Google Sheets Result Sync) -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-emerald);">
              📝 직각삼각형 합동 실습 결과 제출 및 구글 시트 (탐구활동결과 탭) 실시간 저장
            </h3>
            <span style="font-size: 0.75rem; background: rgba(16,185,129,0.15); color: var(--accent-emerald); padding: 2px 8px; border-radius: 10px; font-weight: 700;">
              자동 구글 시트 동기화
            </span>
          </div>

          <form onsubmit="TeacherModule.handleSubmitActivityResult(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem;">
              <div class="form-group">
                <label class="form-label">학번</label>
                <input type="text" id="act-student-id" class="input-control" value="20328" required>
              </div>
              <div class="form-group">
                <label class="form-label">학생 성명</label>
                <input type="text" id="act-student-name" class="input-control" value="홍길동" required>
              </div>
              <div class="form-group">
                <label class="form-label">소속 학급</label>
                <input type="text" id="act-student-class" class="input-control" value="2학년 3반" readonly style="background: rgba(255,255,255,0.05);">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">탐구 결과 및 작성 수식 메모</label>
              <textarea id="act-answer-text" class="input-control" rows="3" required placeholder="직각삼각형을 통째로 겹쳐본 후 발견한 RHA 또는 RHS 합동 조건을 설명하세요.">두 직각삼각형에서 직각(R)과 빗변의 길이(H=10cm)가 같고, 한 예각의 크기(A=37°)가 서로 같으므로 두 직각삼각형을 통째로 끌어다 포개었을 때 완전히 일치합니다. 따라서 RHA 합동(△ABC ≡ △DEF)이 성립합니다.</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" id="act-submit-btn" class="btn btn-primary" style="padding: 0.7rem 1.25rem;">
                🚀 탐구 결과 제출 및 구글 시트 (탐구활동결과 탭) 저장
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  toggleEmbedForm() {
    const container = document.getElementById('activity-embed-form-container');
    if (container) {
      container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
  },

  handleRegisterEmbeddedActivity(e) {
    e.preventDefault();
    const title = document.getElementById('embed-title-input').value.trim();
    const url = document.getElementById('embed-url-input').value.trim();

    const titleEl = document.getElementById('active-activity-title');
    if (titleEl) titleEl.innerText = title;

    if (url && url.startsWith('http')) {
      const appContainer = document.getElementById('embed-app-container');
      if (appContainer) {
        appContainer.innerHTML = `
          <iframe src="${url}" style="width: 100%; height: 450px; border: none; border-radius: var(--radius-sm);" title="${title}"></iframe>
        `;
      }
    }

    this.toggleEmbedForm();
    alert(`🎉 [탐구 활동 웹 앱 임베딩 등록 완료!]\n\n제목: ${title}\nURL: ${url}\n\n사이트에 구글 웹 앱 창이 성공적으로 내장되었습니다.`);
  },

  reloadInteractiveApp() {
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderActivityBuilder();
      setTimeout(() => this.initTriangleExplorer(), 50);
    }
  },

  toggleFullscreenEmbed() {
    const appContainer = document.getElementById('embed-app-container');
    if (appContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        appContainer.requestFullscreen().catch(err => {
          alert('전체 화면 모드를 지원하지 않는 브라우저입니다.');
        });
      }
    }
  },

  initTriangleExplorer() {
    const canvas = document.getElementById('builder-interactive-grapher');
    if (canvas) {
      this.triangleExplorer = new RightTriangleCongruenceExplorer(canvas, {
        mode: 'RHA',
        onSnap: (mode) => {
          const area = document.getElementById('act-answer-text');
          if (area) {
            if (mode === 'RHA') {
              area.value = `[RHA 합동 검증] 빗변의 길이(H=10cm)와 한 예각의 크기(A=37°)가 일치하여 두 직각삼각형을 통째로 포개었을 때 완전히 겹쳐집니다. (△ABC ≡ △DEF)`;
            } else {
              area.value = `[RHS 합동 검증] 빗변의 길이(H=10cm)와 다른 한 변의 길이(S=6cm)가 일치하여 두 직각삼각형을 통째로 포개었을 때 완전히 겹쳐집니다. (△ABC ≡ △DEF)`;
            }
          }
        }
      });
    }
  },

  setTriangleMode(mode) {
    if (this.triangleExplorer) {
      this.triangleExplorer.setMode(mode);
    }
  },

  rotateTriangle(angle) {
    if (this.triangleExplorer) {
      this.triangleExplorer.setRotation(angle);
    }
  },

  resetTrianglePos() {
    if (this.triangleExplorer) {
      this.triangleExplorer.resetPosition();
    }
  },

  autoAnimateTriangleOverlay() {
    if (this.triangleExplorer) {
      this.triangleExplorer.animateOverlay();
    }
  },

  async handleSubmitActivityResult(e) {
    e.preventDefault();
    const btn = document.getElementById('act-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ 구글 시트 (탐구활동결과 탭) 저장 중...';
    }

    try {
      const studentId = document.getElementById('act-student-id').value.trim();
      const studentName = document.getElementById('act-student-name').value.trim();
      const activityTitle = document.getElementById('active-activity-title').innerText.trim();
      const answerText = document.getElementById('act-answer-text').value.trim();

      await CloudDB.saveActivityResult({
        studentId: studentId,
        studentName: studentName,
        grade: '2',
        classNum: '3',
        activityTitle: activityTitle,
        answerText: answerText,
        score: 100
      });

      alert(`🎉 [탐구 활동 결과 제출 완료!]\n\n학생: ${studentName} (${studentId})\n활동: ${activityTitle}\n\n선생님 구글 시트의 [탐구활동결과] 탭에 성공적으로 기록되었습니다.`);
    } catch (err) {
      alert('탐구 활동 결과 제출 중 오류가 발생했습니다.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '🚀 탐구 결과 제출 및 구글 시트 (탐구활동결과 탭) 저장';
      }
    }
  },

  // 3. Student Roster & Analytics
  renderAnalytics() {
    const students = AppState.demoStudents;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800;">영서중학교 회원가입 학생 학업 성취도 & 전체 가입 명부</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">담당 교사: 임종윤 교사 | 1~3학년(1~8반) 회원가입 학생 명부 및 형성평가 결과 리포트</p>
          </div>
          <button class="btn btn-outline-violet" onclick="alert('영서중 회원가입 학생 명부 및 Excel 성적표가 다운로드되었습니다.');">
            📥 Excel 명부 내보내기
          </button>
        </div>

        <div class="glass-card">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-card); color: var(--text-muted);">
                <th style="padding: 0.8rem;">학번 / 아이디</th>
                <th style="padding: 0.8rem;">학생 성명</th>
                <th style="padding: 0.8rem;">소속 학급</th>
                <th style="padding: 0.8rem;">최근 수행 과제</th>
                <th style="padding: 0.8rem;">형성평가 점수</th>
                <th style="padding: 0.8rem;">이해도 판별</th>
                <th style="padding: 0.8rem; text-align: right;">상세 보기</th>
              </tr>
            </thead>
            <tbody>
              ${students.length === 0 ? `
                <tr>
                  <td colspan="7" style="padding: 2rem; text-align: center; color: var(--text-muted);">
                    등록된 신규 회원가입 학생이 없습니다.
                  </td>
                </tr>
              ` : students.map(st => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.8rem; font-family: var(--font-mono); color: var(--violet-bright);">${st.id}</td>
                  <td style="padding: 0.8rem; font-weight: 600;">${st.name}</td>
                  <td style="padding: 0.8rem; font-weight: 600; color: var(--text-main);">
                    영서중 ${st.grade || '1'}학년 ${st.classNum || '1'}반
                  </td>
                  <td style="padding: 0.8rem;">직각삼각형 RHA/RHS 합동</td>
                  <td style="padding: 0.8rem;">
                    <span style="font-weight: 700; color: ${st.score >= 90 ? 'var(--accent-emerald)' : 'var(--violet-bright)'};">
                      ${st.score || 100}점
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

/**
 * Teacher Management Module & Inquiry Activities Hub
 * Math LMS - CurlyMath
 */

const LOCAL_STORAGE_KEY_ACTIVITIES = 'mathlab_registered_activities';

const TeacherModule = {
  activeTab: 'dashboard',
  triangleExplorer: null,
  activeActivityId: null,

  getActivities() {
    const defaultList = [];

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVITIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 기존 REDBOOK 하드코딩 데이터 자동 정리
          const cleanList = parsed.filter(a => !a.id.startsWith('REDBOOK-'));
          this.saveActivities(cleanList);
          return cleanList;
        }
      }
    } catch(e) {}

    this.saveActivities(defaultList);
    return defaultList;
  },

  saveActivities(list) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVITIES, JSON.stringify(list));
    } catch(e) {}
  },

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
              <span class="metric-value">22<span style="font-size: 1.2rem;">개 반</span></span>
              <span class="metric-badge violet">1~2학년 (1~8반), 3학년 (1~6반)</span>
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
          <div class="glass-card hover-lift" style="background: rgba(99, 102, 241, 0.05); border-color: var(--border-violet); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--violet-bright);">
                📚 수업 진도 기록부
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.5;">
                1~3학년 1~8반 학반별 진도 단원, 진도율(%), 수업 과제 및 교사 메모를 기록하고 구글 시트 <code>수업진도</code> 탭과 실시간 동기화합니다.
              </p>
            </div>
            <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-dim);">마스터 DB</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">교육과정 48개 단원</div>
              </div>
              <button class="btn btn-primary teacher-tab-btn" data-tab="progress-tracker">
                ▶️ 진도 입력하기
              </button>
            </div>
          </div>

          <div class="glass-card hover-lift" style="background: rgba(5, 150, 105, 0.05); border-color: rgba(5, 150, 105, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-emerald);">
                📜 학생 기록 및 세특 생성
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.5;">
                수업 참여도, 질문 수준, 탐구 과제 제출 이력을 통합 아카이빙하고 AI 기반으로 세부능력 및 특기사항(세특)을 자동 작성합니다.
              </p>
            </div>
            <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-dim);">자동 생성</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">나이스 서식 호환</div>
              </div>
              <button class="btn btn-primary teacher-tab-btn" data-tab="archive-seteuk" style="background: linear-gradient(135deg, var(--accent-emerald), #047857);">
                ▶️ 세특 생성하기
              </button>
            </div>
          </div>

          <div class="glass-card hover-lift" style="background: rgba(2, 132, 199, 0.05); border-color: rgba(2, 132, 199, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan);">
                📐 탐구 활동 센터
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.5;">
                선생님이 제작하신 GAS 웹앱 URL을 등록하고, 직각삼각형 겹치기 등 교과서 연계 수학 탐구 실습을 사이트에 즉시 내장 실행합니다.
              </p>
            </div>
            <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-dim);">참여 코드</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">🔑 YS-2088</div>
              </div>
              <button class="btn btn-primary teacher-tab-btn" data-tab="builder">
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

    alert(`[학생 정보 및 답안]\n학생명: ${student.name}\n학번: ${student.id}\n소속: ${student.grade || '1'}학년 ${student.classNum || '1'}반\n상태: ${student.status === 'submitted' ? '제출 완료' : '진행 중'}\n점수: ${student.score}점\n제출 수식: f(x) = x^2 - 2`);
  },

  // 2. Inquiry Activities View & Embed Catalog Hub (📐 탐구 활동)
  renderActivityBuilder() {
    const activities = this.getActivities();
    const activeAct = activities.find(a => a.id === this.activeActivityId) || activities[0] || null;

    const catalogCardsHtml = activities.map(act => {
      const isSelected = activeAct && act.id === activeAct.id;
      return `
        <div class="glass-card hover-lift" style="padding: 1.1rem; border-color: ${isSelected ? 'var(--violet-bright)' : 'var(--border-card)'}; background: ${isSelected ? 'rgba(99, 102, 241, 0.06)' : '#ffffff'}; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-violet); background: rgba(99, 102, 241, 0.1); padding: 2px 8px; border-radius: 10px;">
                ${act.grade || '전체학년'}
              </span>
              ${isSelected ? '<span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-emerald); background: rgba(5, 150, 105, 0.12); padding: 2px 8px; border-radius: 10px;">▶️ 실행 중</span>' : ''}
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.4rem;">
              ${act.title}
            </h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.8rem;">
              ${act.desc}
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-card); padding-top: 0.6rem; margin-top: 0.4rem;">
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span style="font-size: 0.7rem; color: var(--text-dim);">🌐 GAS 웹앱</span>
              <button class="btn btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; background: rgba(239, 68, 68, 0.08); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 6px; cursor: pointer;" onclick="TeacherModule.deleteActivity('${act.id}')">
                🗑️ 삭제
              </button>
            </div>
            <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-violet'}" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;" onclick="TeacherModule.selectActivity('${act.id}')">
              ${isSelected ? '실행 중' : '▶️ 선택'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    const emptyStateHtml = `
      <div class="glass-card" style="padding: 3rem 2rem; text-align: center; border: 2px dashed var(--border-card); background: rgba(99, 102, 241, 0.02);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">등록된 탐구 활동이 없습니다</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
          위쪽의 <strong style="color: var(--violet-bright);">➕ 신규 GAS 탐구활동 주소 등록</strong> 버튼을 눌러<br>
          구글 앱스 스크립트 웹앱 URL을 입력하면 학생들에게 탐구 활동이 노출됩니다.
        </p>
      </div>
    `;

    const workspaceHtml = activeAct ? `
        <div class="glass-card embed-workspace-container" id="teacher-workspace-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.8rem;">
            <div>
              <span class="status-indicator live"><span class="dot"></span> 🖱️ 선택된 탐구 활동 실시간 실행 공간</span>
              <h3 style="font-size: 1.3rem; font-weight: 800; margin-top: 0.3rem;" id="active-activity-title">
                ${activeAct.title}
              </h3>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
              <button class="btn btn-primary" onclick="TeacherModule.toggleFullscreenEmbed()" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); font-weight: 700;">
                ⤢ 큰 화면 모드 (전체 화면)
              </button>
            </div>
          </div>
          <div id="embed-app-container" style="background: #f8fafc; border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 0.75rem; min-height: 600px; display: flex; flex-direction: column; justify-content: center;">
            <iframe src="${activeAct.url || ''}" style="width: 100%; height: 760px; border: none; border-radius: var(--radius-sm);" title="${activeAct.title}"></iframe>
          </div>
        </div>

        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-emerald);">
              📝 탐구 실습 결과 제출 및 구글 시트 저장
            </h3>
            <span style="font-size: 0.75rem; background: rgba(5, 150, 105, 0.12); color: var(--accent-emerald); padding: 2px 8px; border-radius: 10px; font-weight: 700;">
              구글 시트 & 드라이브 자동 연동
            </span>
          </div>
          <form onsubmit="TeacherModule.handleSubmitActivityResult(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem;">
              <div class="form-group">
                <label class="form-label">학번</label>
                <input type="text" id="act-student-id" class="input-control" value="${AppState.currentUser && AppState.currentUser.role !== 'teacher' ? AppState.currentUser.id : ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">학생 성명</label>
                <input type="text" id="act-student-name" class="input-control" value="${AppState.currentUser && AppState.currentUser.role !== 'teacher' ? AppState.currentUser.name : ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">소속 학급</label>
                <input type="text" id="act-student-class" class="input-control" value="" readonly style="background: #f1f5f9;">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">탐구 결과 및 작성 수식 메모</label>
              <textarea id="act-answer-text" class="input-control" rows="3" required placeholder="탐구 실습 후 발견한 수학적 개념 및 작성한 수식을 정리해 보세요."></textarea>
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" id="act-submit-btn" class="btn btn-primary" style="padding: 0.7rem 1.25rem;">
                🚀 탐구 결과 제출 및 구글 시트 저장
              </button>
            </div>
          </form>
        </div>
    ` : '';

    return `
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem; background: rgba(99, 102, 241, 0.12); color: var(--violet-bright);">
                🏫 수학과
              </span>
              <h2 style="font-size: 1.6rem; font-weight: 800;">📐 탐구 활동: 등록 & 실행 센터</h2>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              구글 앱스 스크립트 웹앱 URL을 등록하여 학년별로 학생에게 탐구 활동을 배포합니다. | 현재 등록: <strong style="color: var(--violet-bright);">${activities.length}개</strong>
            </p>
          </div>

          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; align-items: center;">
            <a href="https://docs.google.com/spreadsheets/d/1nNlovh7dRVtzUAIOaWQIBG4MmeO4JvPRr2znzgLQsOk/edit#gid=0" target="_blank" class="btn btn-emerald" style="padding: 0.6rem 1.1rem; font-size: 0.88rem; text-decoration: none; font-weight: 800; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; border: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
              📊 전용 구글 시트 DB 바로가기 🔗
            </a>
            <button class="btn btn-primary" onclick="TeacherModule.toggleEmbedForm()" style="font-weight: 800; padding: 0.6rem 1.1rem; border-radius: 10px;">
              ➕ 신규 GAS 탐구활동 주소 등록
            </button>
          </div>
        </div>

        <!-- Registration Form -->
        <div id="activity-embed-form-container" class="glass-card" style="margin-bottom: 2rem; display: none;">
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--violet-bright); margin-bottom: 1rem;">
            🔗 신규 구글 앱스 스크립트(GAS) 탐구활동 주소 등록하기
          </h3>
          <form onsubmit="TeacherModule.handleRegisterEmbeddedActivity(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">탐구 활동 제목</label>
                <input type="text" id="embed-title-input" class="input-control" required placeholder="예: [2학년] 피타고라스 정리 가상 실습">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">노출 대상 학년 선택</label>
                <select id="embed-grade-select" class="input-control" style="font-weight: 700; color: #3730a3;">
                  <option value="1">🌱 1학년 전용</option>
                  <option value="2" selected>🌿 2학년 전용</option>
                  <option value="3">🌳 3학년 전용</option>
                  <option value="all">🏫 전체 학년 공통</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" style="color: var(--violet-bright); font-weight: 700;">
                🌐 구글 앱스 스크립트 웹 앱 URL 주소
              </label>
              <input type="url" id="embed-url-input" class="input-control" required placeholder="https://script.google.com/macros/s/.../exec 주소를 입력하세요">
            </div>

            <div class="form-group">
              <label class="form-label">탐구 활동 설명 (선택)</label>
              <textarea id="embed-desc-input" class="input-control" rows="2" placeholder="학생들이 실습 시 참고할 문제 설명 및 수식 안내를 입력하세요."></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.6rem;">
              <button type="button" class="btn btn-secondary" onclick="TeacherModule.toggleEmbedForm()">취소</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 800;">🚀 탐구 활동 등록하기</button>
            </div>
          </form>
        </div>

        <!-- Catalog List -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.8rem;">
            📚 등록된 탐구 활동 목록 ${activities.length > 0 ? '(카드 선택 시 아래에서 실행)' : ''}
          </h3>
          ${activities.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
              ${catalogCardsHtml}
            </div>
          ` : emptyStateHtml}
        </div>

        ${workspaceHtml}
      </div>
    `;
  },


  selectActivity(actId) {
    this.activeActivityId = actId;
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderActivityBuilder();
      if (actId === 'act-1') {
        setTimeout(() => this.initTriangleExplorer(), 50);
      }
    }
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
    const targetGrade = document.getElementById('embed-grade-select').value;
    const url = document.getElementById('embed-url-input').value.trim();
    const desc = document.getElementById('embed-desc-input').value.trim() || '선생님이 신규 등록한 구글 앱스 스크립트 기반 수학 탐구 활동입니다.';

    if (!title || !url) {
      alert('활동 제목과 구글 앱스 스크립트 URL을 입력해 주세요.');
      return;
    }

    let gradeLabel = '전체학년공통';
    if (targetGrade === '1') gradeLabel = '1학년전용';
    else if (targetGrade === '2') gradeLabel = '2학년전용';
    else if (targetGrade === '3') gradeLabel = '3학년전용';

    const activities = this.getActivities();
    const newId = 'act-' + (activities.length + 1);
    const newAct = {
      id: newId,
      title: title,
      grade: gradeLabel,
      targetGrade: targetGrade,
      url: url,
      desc: desc,
      type: 'gas'
    };

    activities.unshift(newAct);
    this.saveActivities(activities);
    this.activeActivityId = newId;

    this.toggleEmbedForm();
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderActivityBuilder();
    }

    alert(`🎉 [신규 탐구 활동 등록 완료!]\n\n제목: ${title}\nURL: ${url}\n\n등록된 탐구 활동 목록 카드에 추가되었으며 자동으로 선택되어 실행되었습니다.`);
  },

  reloadInteractiveApp() {
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderActivityBuilder();
    }
  },

  deleteActivity(actId) {
    if (!confirm('정말 이 탐구 활동을 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.')) return;
    const activities = this.getActivities();
    const updated = activities.filter(a => a.id !== actId);
    this.saveActivities(updated);
    if (this.activeActivityId === actId) {
      this.activeActivityId = updated.length > 0 ? updated[0].id : null;
    }
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderActivityBuilder();
    }
    alert('🗑️ 탐구 활동이 삭제되었습니다.');
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

      const result = await CloudDB.saveActivityResult({
        studentId: studentId,
        studentName: studentName,
        grade: '2',
        classNum: '3',
        activityTitle: activityTitle,
        answerText: answerText,
        score: 100
      });

      if (result && result.driveFileUrl) {
        alert(`🎉 [탐구 활동 결과 제출 완료!]\n\n학생: ${studentName} (${studentId})\n활동: ${activityTitle}\n\n1. 구글 시트 [탐구활동결과] 탭에 성공적으로 기록되었습니다.\n2. 구글 드라이브 [탐구보고서] 폴더에 탐구보고서 파일이 생성되었습니다.`);
      } else {
        alert(`🎉 [탐구 활동 결과 제출 완료!]\n\n학생: ${studentName} (${studentId})\n활동: ${activityTitle}\n\n선생님 구글 시트의 [탐구활동결과] 탭에 성공적으로 기록되었습니다.`);
      }
    } catch (err) {
      alert('탐구 활동 결과 제출 중 오류가 발생했습니다.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '🚀 탐구 결과 제출 및 구글 시트 (탐구활동결과 탭) 저장';
      }
    }
  },

  showDeploymentModal() {
    alert(`⚙️ [GAS 웹앱 전용 구글 시트 & 배포 관리 설정]\n\n담당 교사: 임종윤 교사 (영서중학교)\n\n1. 📊 전용 구글 시트 마스터 DB:\n   - 시트명: [영서중] 학교 LMS DB (학생명부/수업진도/탐구활동결과)\n   - 시트 URL: https://docs.google.com/spreadsheets/d/1FyE576EICZJYkXucwJI4SsBrIXynePLPwQTvZ20UXHw/edit\n   - 연동 탭: [탐구활동결과], [학생명부], [수업진도]\n\n2. 🌐 Google Apps Script (clasp) 배포 세팅:\n   - Script ID: 17cQ5FvmIVP39-2S31_WT0tudDBgwCvyk7k6XmEMhsC-DAt-YmnftZIhT\n   - 스크립트 편집기: https://script.google.com/d/17cQ5FvmIVP39-2S31_WT0tudDBgwCvyk7k6XmEMhsC-DAt-YmnftZIhT/edit\n   - 배포 URL: https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec\n   - 배포 권한: Anyone (모든 사용자 접근 권한 허용)\n\n3. 💻 로컬 자동 배포 스크립트 실행 위치:\n   - C:\\Users\\sjyli\\.gemini\\antigravity\\scratch\\gas_circumcenter_project\\setup_clasp.bat\n   - C:\\Users\\sjyli\\.gemini\\antigravity\\scratch\\gas_circumcenter_project\\deploy.bat`);
  },

  testMathAppIntegration() {
    const demoPayload = {
      type: 'MATH_LMS_SUBMIT',
      activityTitle: '[math-app 연동 테스트] 삼각비의 활용 높이 측정 실습',
      answerText: 'tan(30°) = 0.5773 공식을 활용하여 건물 높이 H = 10m * tan(30°) + 1.6m = 7.37m 로 정확히 유도하였습니다.',
      score: 100,
      details: { angle: 30, distance: 10, eyeHeight: 1.6, computedHeight: 7.37 }
    };
    window.postMessage(demoPayload, '*');
  },

  // 3. Student Roster & Analytics & Live Submissions
  renderAnalytics() {
    const students = AppState.demoStudents;
    const submissions = typeof CloudDB !== 'undefined' ? CloudDB.getSubmissionsFromLocal() : [];

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 800;">📑 학업 이해도 분석 & 통합 탐구 제출 DB</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              math-app 연동 탐구 자료 및 영서중학교 수학 교과 전체 학생 학업 제출 이력 실시간 통합
            </p>
          </div>
          <button class="btn btn-outline-violet" onclick="TeacherModule.testMathAppIntegration()">
            ⚡ math-app 연동 데이터 수신 시뮬레이션 테스트
          </button>
        </div>

        <!-- Section 1: Integrated Activity Submissions Table -->
        <div class="glass-card" style="margin-bottom: 2rem; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--violet-bright);">
              🎯 math-app & 탐구활동 자동 수집 결과 (구글 시트/드라이브 동기화)
            </h3>
            <span style="font-size: 0.75rem; background: rgba(99, 102, 241, 0.12); color: var(--violet-bright); padding: 2px 10px; border-radius: 12px; font-weight: 700;">
              총 ${submissions.length}건 수집됨
            </span>
          </div>

          <div style="width: 100%; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-card); color: var(--text-muted); background: #f8fafc;">
                  <th style="padding: 0.75rem 1rem;">제출 일시</th>
                  <th style="padding: 0.75rem 1rem;">학생 정보</th>
                  <th style="padding: 0.75rem 1rem;">탐구활동 제목</th>
                  <th style="padding: 0.75rem 1rem;">제출 수식/답안</th>
                  <th style="padding: 0.75rem 1rem;">점수</th>
                  <th style="padding: 0.75rem 1rem;">DB 연동</th>
                </tr>
              </thead>
              <tbody>
                ${submissions.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-muted);">
                      아직 제출된 외부 math-app 탐구 자료가 없습니다. 웹 앱에서 탐구를 완료하면 실시간으로 이곳과 구글 시트 [탐구활동결과] 탭에 자동 기록됩니다.
                    </td>
                  </tr>
                ` : submissions.map(sub => `
                  <tr style="border-bottom: 1px solid var(--border-card);">
                    <td style="padding: 0.75rem 1rem; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${sub.submittedAt || '방금 전'}</td>
                    <td style="padding: 0.75rem 1rem;">
                      <strong style="color: var(--text-main);">${sub.studentName}</strong>
                      <span style="font-size: 0.75rem; color: var(--text-dim);">(${sub.studentId})</span>
                    </td>
                    <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--violet-bright);">${sub.activityTitle}</td>
                    <td style="padding: 0.75rem 1rem; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sub.answerText}</td>
                    <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--accent-emerald);">${sub.score}점</td>
                    <td style="padding: 0.75rem 1rem;">
                      <span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; background: rgba(5, 150, 105, 0.12); color: var(--accent-emerald); font-weight: 700;">
                        ✓ 구글 시트 저장완료
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Student Roster -->
        <div class="glass-card" style="width: 100%;">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">
            🏫 등록 학생 명부 (총 ${students.length}명)
          </h3>
          <div style="width: 100%; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-card); color: var(--text-muted);">
                  <th style="padding: 0.8rem 1rem;">학번</th>
                  <th style="padding: 0.8rem 1rem;">성명</th>
                  <th style="padding: 0.8rem 1rem;">소속 학급</th>
                  <th style="padding: 0.8rem 1rem;">가입 일시</th>
                  <th style="padding: 0.8rem 1rem;">상태</th>
                  <th style="padding: 0.8rem 1rem;">관리</th>
                </tr>
              </thead>
              <tbody>
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-muted);">
                      등록된 학생 데이터가 없습니다. 학생들이 가입하면 실시간으로 구글 시트와 연동됩니다.
                    </td>
                  </tr>
                ` : students.map(s => `
                  <tr style="border-bottom: 1px solid var(--border-card);">
                    <td style="padding: 0.8rem 1rem; font-family: var(--font-mono); font-weight: 700;">${s.id}</td>
                    <td style="padding: 0.8rem 1rem; font-weight: 700; color: var(--text-main);">${s.name}</td>
                    <td style="padding: 0.8rem 1rem;">영서중 ${s.grade || '1'}학년 ${s.classNum || '1'}반</td>
                    <td style="padding: 0.8rem 1rem; font-size: 0.8rem; color: var(--text-muted);">${s.createdAt || '2026. 8. 6.'}</td>
                    <td style="padding: 0.8rem 1rem;">
                      <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: rgba(5, 150, 105, 0.12); color: var(--accent-emerald); font-weight: 700;">
                        등록 완료
                      </span>
                    </td>
                    <td style="padding: 0.8rem 1rem;">
                      <button class="btn btn-secondary" style="padding: 0.3rem 0.7rem; font-size: 0.75rem;" onclick="TeacherModule.showStudentDetail('${s.id}')">
                        상세 보기
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  toggleFullscreenEmbed() {
    const card = document.getElementById('teacher-workspace-card') || document.getElementById('student-workspace-card');
    if (!card) return;
    card.classList.toggle('fullscreen-active');
    
    // Auto-scroll inside fullscreen
    if (card.classList.contains('fullscreen-active')) {
      card.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

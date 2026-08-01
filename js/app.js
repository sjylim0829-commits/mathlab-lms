/**
 * Yeongseo Middle School Math LMS - Vertical Sidebar Layout & Core Logic
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 */

const AppState = {
  currentUser: null, // { id: 'test', name: '임종윤 교사 (영서중학교)', role: 'teacher' }

  demoStudents: [
    { id: '20301', name: '강도윤', status: 'submitted', score: 95 },
    { id: '20302', name: '김민준', status: 'submitted', score: 100 },
    { id: '20303', name: '김서준', status: 'submitted', score: 90 },
    { id: '20304', name: '김예준', status: 'submitted', score: 85 },
    { id: '20305', name: '박현우', status: 'submitted', score: 95 },
    { id: '20306', name: '이도현', status: 'submitted', score: 90 },
    { id: '20307', name: '이서연', status: 'submitted', score: 100 },
    { id: '20308', name: '정지후', status: 'submitted', score: 90 },
    { id: '20309', name: '최지민', status: 'submitted', score: 85 },
    { id: '20310', name: '한지우', status: 'submitted', score: 95 },

    { id: '20311', name: '권우진', status: 'submitted', score: 90 },
    { id: '20312', name: '나성민', status: 'submitted', score: 80 },
    { id: '20313', name: '노유진', status: 'submitted', score: 88 },
    { id: '20314', name: '문태현', status: 'submitted', score: 92 },
    { id: '20315', name: '민준영', status: 'submitted', score: 84 },

    { id: '20316', name: '박세은', status: 'submitted', score: 92 },
    { id: '20317', name: '배주원', status: 'submitted', score: 88 },
    { id: '20318', name: '백하준', status: 'submitted', score: 96 },
    { id: '20319', name: '송지호', status: 'submitted', score: 90 },
    { id: '20320', name: '신유나', status: 'submitted', score: 94 },

    { id: '20321', name: '안재현', status: 'submitted', score: 86 },
    { id: '20322', name: '양시우', status: 'submitted', score: 88 },
    { id: '20323', name: '오승민', status: 'in-progress', score: 0 },
    { id: '20324', name: '유다은', status: 'in-progress', score: 0 },
    { id: '20325', name: '윤하은', status: 'in-progress', score: 0 },
    { id: '20326', name: '이준호', status: 'in-progress', score: 0 },
    { id: '20327', name: '임태양', status: 'not-started', score: 0 }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.renderAppShell();
  },

  renderAppShell() {
    const rootEl = document.getElementById('app-root');
    if (!rootEl) return;

    if (!AppState.currentUser) {
      rootEl.innerHTML = `
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
          ${this.renderLandingLogin()}
        </div>
      `;
    } else {
      const isTeacher = AppState.currentUser.role === 'teacher';

      rootEl.innerHTML = `
        <div class="app-container">
          <!-- Left Vertical Sidebar Navigation -->
          <aside class="sidebar">
            <div>
              <div class="sidebar-header">
                <a class="brand" onclick="App.init()">
                  <svg class="brand-icon" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" stroke-width="2"/>
                    <path d="M16 32 L24 16 L32 32" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div>
                    <span class="brand-name">영서중 수학 LMS</span>
                    <span class="brand-tag">${isTeacher ? '임종윤 교사' : '학생 탐구실'}</span>
                  </div>
                </a>
              </div>

              <!-- Vertical Sidebar Menu -->
              <nav class="sidebar-nav">
                ${isTeacher ? `
                  <button class="sidebar-nav-item teacher-tab-btn active" data-tab="dashboard">
                    📊 수업 메인 대시보드
                  </button>
                  <button class="sidebar-nav-item teacher-tab-btn" data-tab="progress-tracker">
                    📚 1~3학년 (1~8반) 수업 진도 관리
                  </button>
                  <button class="sidebar-nav-item teacher-tab-btn" data-tab="archive-seteuk">
                    📜 학생 기록 및 세특 생성
                  </button>
                  <button class="sidebar-nav-item teacher-tab-btn" data-tab="live-monitor">
                    🔴 실시간 수업 모니터링
                  </button>
                  <button class="sidebar-nav-item teacher-tab-btn" data-tab="builder">
                    ✨ 탐구 활동 생성기
                  </button>
                  <button class="sidebar-nav-item teacher-tab-btn" data-tab="analytics">
                    📑 학업 이해도 분석
                  </button>
                ` : `
                  <button class="sidebar-nav-item active">
                    🎒 대화형 수학 탐구실
                  </button>
                `}
              </nav>
            </div>

            <!-- Sidebar Footer -->
            <div class="sidebar-footer">
              <button class="btn btn-outline-violet" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: 100%;" onclick="App.toggleRole()">
                🔄 ${isTeacher ? '학생 화면으로 전환' : '교사 화면으로 전환'}
              </button>

              <div class="user-profile-badge">
                <div class="user-avatar">${AppState.currentUser.name[0]}</div>
                <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <div style="font-weight: 600; font-size: 0.85rem;">${AppState.currentUser.name}</div>
                  <span class="role-pill ${AppState.currentUser.role}">${isTeacher ? '교사' : '학생'}</span>
                </div>
              </div>

              <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: 100%;" onclick="App.logout()">
                🚪 로그아웃
              </button>
            </div>
          </aside>

          <!-- Right Content View Area -->
          <main id="main-container" class="main-content-right">
            ${isTeacher ? `
              <div id="teacher-main-view">
                ${TeacherModule.renderDashboard()}
              </div>
            ` : `
              <div id="student-main-view"></div>
            `}
          </main>
        </div>
      `;

      if (isTeacher) {
        TeacherModule.init();
      } else {
        StudentModule.init();
      }
    }
  },

  renderLandingLogin() {
    return `
      <div class="auth-wrapper">
        <div class="glass-card">
          <div class="auth-header">
            <svg width="60" height="60" viewBox="0 0 48 48" fill="none" style="filter: drop-shadow(0 0 16px var(--violet-glow));">
              <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" stroke-width="2.5"/>
              <path d="M16 32 L24 16 L32 32" stroke="#c084fc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="24" cy="23" r="3" fill="#10b981"/>
            </svg>
            <h1 class="auth-title">영서중학교 수학 LMS</h1>
            <p class="auth-subtitle">임종윤 교사의 1~3학년(1~8반) 수업 진도 기록 및 AI 세특 자동 생성 시스템</p>
          </div>

          <form onsubmit="App.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">아이디 (ID)</label>
              <input type="text" id="login-id-input" class="input-control" placeholder="아이디 입력 (테스트: test)" value="test" required>
            </div>

            <div class="form-group">
              <label class="form-label">비밀번호 (Password)</label>
              <input type="password" id="login-pw-input" class="input-control" placeholder="비밀번호 입력 (테스트: 11111111)" value="11111111" required>
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">
              🔓 로그인하기
            </button>
          </form>

          <div class="demo-account-box">
            <div style="font-weight: 700; color: var(--violet-bright); margin-bottom: 0.3rem;">
              💡 테스트 계정 빠른 접속 (클릭 시 자동 입력)
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              제공해주신 테스트 계정 정보:
            </p>
            <div class="demo-credentials">
              <div class="credential-chip" onclick="App.fillCredentials('test', '11111111')">
                👤 교사: test / 11111111 (임종윤 교사)
              </div>
              <div class="credential-chip" onclick="App.fillCredentials('20302', '11111111')">
                🎒 학생: 20302 (영서중 2학년 김민준)
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  fillCredentials(id, pw) {
    const idInput = document.getElementById('login-id-input');
    const pwInput = document.getElementById('login-pw-input');
    if (idInput) idInput.value = id;
    if (pwInput) pwInput.value = pw;
  },

  handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('login-id-input').value.trim();
    const pw = document.getElementById('login-pw-input').value.trim();

    if (id === 'test' && pw === '11111111') {
      AppState.currentUser = {
        id: 'test',
        name: '임종윤 교사 (영서중학교)',
        role: 'teacher'
      };
    } else {
      AppState.currentUser = {
        id: id || '20302',
        name: '김민준 학생 (영서중)',
        role: 'student'
      };
    }

    this.init();
  },

  loginAsDemo(role) {
    if (role === 'teacher') {
      AppState.currentUser = {
        id: 'test',
        name: '임종윤 교사 (영서중학교)',
        role: 'teacher'
      };
    } else {
      AppState.currentUser = {
        id: '20302',
        name: '김민준 학생 (영서중)',
        role: 'student'
      };
    }
    this.init();
  },

  toggleRole() {
    if (!AppState.currentUser) return;
    if (AppState.currentUser.role === 'teacher') {
      AppState.currentUser = { id: '20302', name: '김민준 학생 (영서중)', role: 'student' };
    } else {
      AppState.currentUser = { id: 'test', name: '임종윤 교사 (영서중학교)', role: 'teacher' };
    }
    this.init();
  },

  logout() {
    AppState.currentUser = null;
    this.init();
  }
};

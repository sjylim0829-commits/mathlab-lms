/**
 * Yeongseo Middle School Math LMS - Unified Smart Auth & Sign-Up Engine (Sleek Modern White Theme)
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 */

const AppState = {
  currentUser: null, // { id: 'test', name: '임종윤 교사 (영서중학교)', role: 'teacher' }
  demoStudents: []   // Populated dynamically from CloudDB
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  async init() {
    this.restoreUserSession();
    this.bindGlobalMessageListener();
    await this.syncCloudDatabase();
    this.checkUrlEmbedParameters();
    this.renderAppShell();
  },

  restoreUserSession() {
    try {
      const saved = localStorage.getItem('curlymath_session_user');
      if (saved) {
        AppState.currentUser = JSON.parse(saved);
      }
    } catch (e) {}
  },

  saveUserSession(user) {
    AppState.currentUser = user;
    try {
      localStorage.setItem('curlymath_session_user', JSON.stringify(user));
    } catch (e) {}
  },

  logout() {
    if (confirm('🔒 로그아웃 하시겠습니까?')) {
      AppState.currentUser = null;
      try {
        localStorage.removeItem('curlymath_session_user');
      } catch (e) {}
      this.renderAppShell();
    }
  },

  bindGlobalMessageListener() {
    if (this._listenerBound) return;
    this._listenerBound = true;

    window.addEventListener('message', async (event) => {
      if (!event.data || typeof event.data !== 'object') return;
      const data = event.data;

      if (data.type === 'MATH_LMS_REQUEST_STUDENT_INFO') {
        const student = AppState.currentUser || {
          id: '20328',
          name: '홍길동',
          grade: '2',
          classNum: '3',
          role: 'student'
        };
        if (event.source && typeof event.source.postMessage === 'function') {
          event.source.postMessage({
            type: 'MATH_LMS_INIT_STUDENT',
            student: student
          }, '*');
        }
      } else if (data.type === 'MATH_LMS_SUBMIT') {
        console.log('[LMS MessageListener] Received math-app activity submission:', data);
        const currentUser = AppState.currentUser || { id: '20328', name: '홍길동', grade: '2', classNum: '3' };
        
        const activityTitle = data.activityTitle || 'math-app 외부 수학 탐구활동';
        const answerText = data.answerText || (typeof data.details === 'object' ? JSON.stringify(data.details) : String(data.details || ''));
        const score = typeof data.score === 'number' ? data.score : 100;

        await CloudDB.saveActivityResult({
          studentId: currentUser.id || '20328',
          studentName: currentUser.name || '홍길동',
          grade: currentUser.grade || '2',
          classNum: currentUser.classNum || '3',
          activityTitle: activityTitle,
          answerText: answerText,
          score: score
        });

        console.log(`⚡ [Supabase Cloud DB] Silently saved student learning record: ${currentUser.name} (${currentUser.id}) - ${activityTitle}`);

        if (typeof TeacherModule !== 'undefined' && TeacherModule.activeTab === 'analytics') {
          TeacherModule.switchTab('analytics');
        }
      }
    });
  },

  checkUrlEmbedParameters() {
    try {
      const params = new URLSearchParams(window.location.search);
      const embedUrl = params.get('embed_url') || params.get('math_app_url');
      const title = params.get('title') || '[math-app] 외부 수학 탐구활동';

      if (embedUrl) {
        console.log('[LMS UrlEmbed] Auto-embedding math-app URL:', embedUrl);
        const activities = TeacherModule.getActivities();
        const existingIdx = activities.findIndex(a => a.url === embedUrl);
        let targetId = '';

        if (existingIdx >= 0) {
          targetId = activities[existingIdx].id;
        } else {
          targetId = 'act-auto-' + Date.now();
          activities.unshift({
            id: targetId,
            title: title,
            grade: '2학년 전체 (1~8반)',
            url: embedUrl,
            desc: 'math-app 프로젝트에서 개발하여 자동으로 LMS에 연동 임베딩된 외부 수학 탐구 모듈입니다.',
            type: 'gas'
          });
          TeacherModule.saveActivities(activities);
        }

        TeacherModule.activeActivityId = targetId;
      }
    } catch (e) {
      console.warn('[LMS UrlEmbed] Check error:', e);
    }
  },

  async syncCloudDatabase() {
    try {
      const students = await CloudDB.fetchStudents();
      AppState.demoStudents = Array.isArray(students) ? students : [];
      if (typeof CloudDB !== 'undefined' && CloudDB.fetchRegisteredActivities) {
        await CloudDB.fetchRegisteredActivities();
      }
    } catch (e) {
      console.warn('Sync failed, using fallback empty array', e);
      AppState.demoStudents = CloudDB.getStudentsFromLocal();
    }
  },

  renderAppShell() {
    const rootEl = document.getElementById('app-root');
    if (!rootEl) return;

    if (!AppState.currentUser) {
      rootEl.innerHTML = `
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.5rem;">
          ${this.renderLandingLogin()}
        </div>
      `;
    } else {
      const isTeacher = AppState.currentUser.role === 'teacher';

      rootEl.innerHTML = `
        <div style="display: flex; flex-direction: column; min-height: 100vh;">
          <!-- Mobile Top Navigation Header Bar -->
          <div class="mobile-header-bar">
            <a class="brand" onclick="App.init()">
              <svg class="brand-icon" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" stroke-width="2"/>
                <path d="M16 32 L24 16 L32 32" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>
                <span class="brand-name" style="font-size: 1.1rem;">영서중 수학 LMS</span>
              </div>
            </a>

            <button class="mobile-nav-toggle-btn" onclick="App.toggleMobileSidebar()">
              ☰ 메뉴
            </button>
          </div>

          <div class="app-container">
            <!-- Vertical Sidebar Navigation -->
            <aside class="sidebar">
              <div>
                <div class="sidebar-header">
                  <a class="brand" onclick="App.init()">
                    <svg class="brand-icon" viewBox="0 0 48 48" fill="none">
                      <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" stroke-width="2"/>
                      <path d="M16 32 L24 16 L32 32" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div>
                      <span class="brand-name" style="white-space: nowrap;">영서중 수학 LMS</span>
                      <span class="brand-tag" style="white-space: nowrap; flex-shrink: 0;">${isTeacher ? '임종윤 교사' : '학생 탐구실'}</span>
                    </div>
                  </a>
                </div>

                <!-- Vertical Sidebar Menu -->
                <nav class="sidebar-nav">
                  ${isTeacher ? `
                    <button class="sidebar-nav-item teacher-tab-btn active" data-tab="dashboard" style="white-space: nowrap;">
                      📊 수업 메인 대시보드
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="progress-tracker" style="white-space: nowrap;">
                      📚 수업 진도 관리
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="archive-seteuk" style="white-space: nowrap;">
                      📜 학생 기록 및 세특 생성
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="builder" style="white-space: nowrap;">
                      📐 탐구 활동
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="analytics" style="white-space: nowrap;">
                      📑 학업 이해도 분석
                    </button>
                  ` : `
                    <button class="sidebar-nav-item student-tab-btn active" data-tab="lab" style="white-space: nowrap;">
                      📐 나의 수학 탐구실
                    </button>
                    <button class="sidebar-nav-item student-tab-btn" data-tab="history" style="white-space: nowrap;">
                      📜 제출 이력 및 세특 기록
                    </button>
                  `}
                </nav>
              </div>

              <!-- Sidebar Footer User Profile -->
              <div class="sidebar-footer">
                ${isTeacher ? `
                  <button class="btn btn-outline-violet" style="width: 100%; margin-bottom: 0.8rem; font-size: 0.8rem; white-space: nowrap;" onclick="App.toggleUserRole()">
                    🔄 학생 화면 미리보기
                  </button>
                ` : (AppState.currentUser && AppState.currentUser.isRealTeacher) ? `
                  <button class="btn btn-outline-violet" style="width: 100%; margin-bottom: 0.8rem; font-size: 0.8rem; white-space: nowrap; background: #e0e7ff; color: #3730a3; border-color: #a5b4fc;" onclick="App.toggleUserRole()">
                    🔄 교사 대시보드로 복귀
                  </button>
                ` : ''}

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: nowrap;">
                  <div style="display: flex; align-items: center; gap: 0.6rem; min-width: 0;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isTeacher ? '#6366f1' : '#059669'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">
                      ${AppState.currentUser.name ? AppState.currentUser.name[0] : (isTeacher ? '임' : '학')}
                    </div>
                    <div style="min-width: 0; overflow: hidden;">
                      <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${AppState.currentUser.name}</div>
                      <div style="font-size: 0.7rem; color: var(--text-muted); white-space: nowrap;">${isTeacher ? '교사' : `${AppState.currentUser.grade || 1}학년 ${AppState.currentUser.classNum || 1}반 학생`}</div>
                    </div>
                  </div>
                  <button onclick="App.logout()" style="background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 800; padding: 5px 10px; white-space: nowrap; flex-shrink: 0; transition: all 0.15s ease;" title="안전하게 로그아웃">
                    🚪 로그아웃
                  </button>
                </div>
              </div>
            </aside>

            <!-- Main Content Area -->
            <main class="main-content">
              <div id="teacher-main-view">
                ${isTeacher ? TeacherModule.renderDashboard() : StudentModule.renderLabView()}
              </div>
            </main>
          </div>
        </div>
      `;

      if (isTeacher) {
        TeacherModule.init();
      } else {
        StudentModule.init();
      }
    }
  },

  toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
    }
  },

  renderLandingLogin() {
    return `
      <div class="login-card glass-card fade-in" style="max-width: 440px; width: 100%; margin: 0 auto; padding: 2.25rem 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="display: inline-flex; padding: 12px; background: rgba(99, 102, 241, 0.1); border-radius: 16px; margin-bottom: 1rem;">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" stroke-width="2"/>
              <path d="M16 32 L24 16 L32 32" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--text-main);">영서중학교 수학 LMS</h1>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.4rem;">
            담당 교사: <strong style="color: var(--violet-bright);">임종윤 교사</strong> | 대화형 수학 탐구실
          </p>
        </div>

        <form id="login-form" onsubmit="App.handleLogin(event)">
          <div class="form-group">
            <label class="form-label">아이디 / 학번</label>
            <input type="text" id="login-id" class="input-control" required placeholder="아이디 또는 학번 입력">
          </div>

          <div class="form-group">
            <label class="form-label">비밀번호</label>
            <input type="password" id="login-pw" class="input-control" required placeholder="비밀번호 입력">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.8rem; margin-top: 0.5rem; font-size: 1rem;">
            🚀 영서중 수학 LMS 접속하기
          </button>
        </form>

        <div id="signup-section" style="margin-top: 1.25rem; border-top: 1px solid var(--border-card); padding-top: 1rem; text-align: center;">
          <button type="button" class="btn btn-outline-violet" style="width: 100%; padding: 0.6rem; font-size: 0.85rem;" onclick="App.openSignupModal()">
            ✨ 신규 학생 회원가입 하기
          </button>
        </div>
      </div>

      <!-- Student Sign-Up Modal -->
      <div id="signup-modal" class="modal-overlay">
        <div class="modal-content glass-card">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">✨ 신규 학생 회원가입</h3>
            <button class="close-btn" onclick="App.closeSignupModal()">✕</button>
          </div>
          <form id="signup-form" onsubmit="App.handleSignup(event)">
            <div class="form-group">
              <label class="form-label">학번 (예: 20328 - 2학년 3반 28번)</label>
              <input type="text" id="signup-id" class="input-control" required placeholder="숫자 5자리 학번">
            </div>

            <div class="form-group">
              <label class="form-label">이름 (성명)</label>
              <input type="text" id="signup-name" class="input-control" required placeholder="학생 이름">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">학년</label>
                <select id="signup-grade" class="input-control" required>
                  <option value="1">1학년</option>
                  <option value="2" selected>2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">반 (1~8반)</label>
                <select id="signup-class" class="input-control" required>
                  <option value="1">1반</option>
                  <option value="2">2반</option>
                  <option value="3" selected>3반</option>
                  <option value="4">4반</option>
                  <option value="5">5반</option>
                  <option value="6">6반</option>
                  <option value="7">7반</option>
                  <option value="8">8반</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">비밀번호</label>
              <input type="password" id="signup-pw" class="input-control" required placeholder="비밀번호 설정">
            </div>

            <div style="display: flex; gap: 0.8rem; margin-top: 1.5rem;">
              <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="App.closeSignupModal()">취소</button>
              <button type="submit" class="btn btn-primary" style="flex: 2;">가입 완료</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  openSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) modal.classList.add('active');
  },

  closeSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) modal.classList.remove('active');
  },

  async handleSignup(e) {
    e.preventDefault();
    const id = document.getElementById('signup-id').value.trim();
    const name = document.getElementById('signup-name').value.trim();
    const grade = document.getElementById('signup-grade').value;
    const classNum = document.getElementById('signup-class').value;
    const password = document.getElementById('signup-pw').value.trim();

    if (!id || !name || !password) {
      alert('모든 가입 정보를 입력해 주세요.');
      return;
    }

    const newStudent = { id, name, grade, classNum, password };
    await CloudDB.registerStudent(newStudent);

    AppState.demoStudents.unshift(newStudent);
    AppState.currentUser = { id, name, grade, classNum, role: 'student' };

    this.closeSignupModal();
    this.renderAppShell();
    alert(`🎉 ${name} 학생 환영합니다! 가입 및 로그인이 완료되었습니다.`);
  },

  async handleLogin(e) {
    e.preventDefault();
    const inputId = document.getElementById('login-id').value.trim();
    const inputPw = document.getElementById('login-pw').value.trim();

    if (!inputId || !inputPw) {
      alert('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    // 1. Teacher Master Account Check (Secure Admin Role)
    if (inputId === 'sjylim' && (inputPw === 'whddbs012' || inputPw === 'whddbs01!')) {
      this.saveUserSession({
        id: 'sjylim',
        name: '임종윤 교사',
        role: 'teacher'
      });
      this.renderAppShell();
      return;
    }

    // 2. Initial Student Authentication Check
    let found = AppState.demoStudents.find(s => String(s.id).trim() === inputId && String(s.password).trim() === inputPw);

    // If not found or freshly updated on another PC, sync latest DB from Google Sheets
    if (!found) {
      await this.syncCloudDatabase();
      found = AppState.demoStudents.find(s => String(s.id).trim() === inputId && String(s.password).trim() === inputPw);
    }

    if (found) {
      this.saveUserSession({
        id: found.id,
        name: found.name,
        grade: found.grade || '1',
        classNum: found.classNum || '1',
        role: 'student'
      });
      this.renderAppShell();
      return;
    }

    // Check if ID exists but password was wrong
    const foundById = AppState.demoStudents.find(s => String(s.id).trim() === inputId);
    if (foundById) {
      alert(`⚠️ [로그인 실패]\n\n비밀번호가 올바르지 않습니다.\n비밀번호를 잊으신 경우 선생님께 비밀번호 초기화를 요청해 주세요.`);
      return;
    }

    alert('⚠️ [로그인 실패]\n\n가입되지 않은 학번입니다.\n아래의 [✨ 신규 학생 회원가입 하기] 버튼을 눌러 먼저 가입해 주세요.');
  },

  toggleUserRole() {
    if (!AppState.currentUser) return;

    // Only authenticated teachers can toggle/preview student mode
    if (AppState.currentUser.role !== 'teacher' && !AppState.currentUser.isRealTeacher) {
      console.warn('Unauthorized role switch attempt.');
      return;
    }

    if (AppState.currentUser.role === 'teacher') {
      AppState.currentUser = {
        id: '20328',
        name: '홍길동 (학생 모드 미리보기)',
        grade: '2',
        classNum: '3',
        role: 'student',
        isRealTeacher: true
      };
    } else if (AppState.currentUser.isRealTeacher) {
      AppState.currentUser = {
        id: 'sjylim',
        name: '임종윤 교사',
        role: 'teacher'
      };
    }

    this.renderAppShell();
  },

  logout() {
    AppState.currentUser = null;
    this.renderAppShell();
  }
};

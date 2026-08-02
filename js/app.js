/**
 * Yeongseo Middle School Math LMS - Bulletproof Auth & Sign-Up Engine
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
    await this.syncCloudDatabase();
    this.renderAppShell();
  },

  async syncCloudDatabase() {
    try {
      const students = await CloudDB.fetchStudents();
      AppState.demoStudents = Array.isArray(students) ? students : [];
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
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
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
                <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" stroke-width="2"/>
                <path d="M16 32 L24 16 L32 32" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
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
                      📚 수업 진도 관리
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="archive-seteuk">
                      📜 학생 기록 및 세특 생성
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="live-monitor">
                      🔴 실시간 수업 모니터링
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="builder">
                      📐 탐구 활동
                    </button>
                    <button class="sidebar-nav-item teacher-tab-btn" data-tab="analytics">
                      📑 학업 이해도 분석
                    </button>
                  ` : `
                    <button class="sidebar-nav-item student-tab-btn active" data-tab="lab">
                      📐 나의 수학 탐구실
                    </button>
                    <button class="sidebar-nav-item student-tab-btn" data-tab="history">
                      📜 제출 이력 및 세특 기록
                    </button>
                  `}
                </nav>
              </div>

              <!-- Sidebar Footer User Profile -->
              <div class="sidebar-footer">
                <button class="btn btn-outline-violet" style="width: 100%; margin-bottom: 0.8rem; font-size: 0.8rem;" onclick="App.toggleUserRole()">
                  🔄 ${isTeacher ? '학생 화면으로 전환' : '교사 대시보드로 전환'}
                </button>

                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-violet); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                      ${AppState.currentUser.name ? AppState.currentUser.name[0] : '임'}
                    </div>
                    <div>
                      <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">${AppState.currentUser.name}</div>
                      <div style="font-size: 0.7rem; color: var(--text-muted);">${isTeacher ? '교사' : '학생'}</div>
                    </div>
                  </div>
                  <button onclick="App.logout()" style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 0.8rem; padding: 4px;" title="로그아웃">
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
      <div class="login-card glass-card fade-in">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="display: inline-flex; padding: 12px; background: rgba(139, 92, 246, 0.15); border-radius: 16px; margin-bottom: 1rem;">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="10" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" stroke-width="2"/>
              <path d="M16 32 L24 16 L32 32" stroke="#c084fc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--text-main);">영서중학교 수학 LMS</h1>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.4rem;">
            담당 교사: <strong style="color: var(--violet-bright);">임종윤 교사</strong> | 대화형 수학 탐구실
          </p>
        </div>

        <!-- Role Toggle Tabs -->
        <div style="display: flex; background: rgba(0,0,0,0.3); padding: 4px; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <button id="role-btn-student" class="btn active" style="flex: 1; font-size: 0.85rem; padding: 0.5rem;" onclick="App.switchLoginRole('student')">
            🎒 학생 로그인 / 회원가입
          </button>
          <button id="role-btn-teacher" class="btn" style="flex: 1; font-size: 0.85rem; padding: 0.5rem;" onclick="App.switchLoginRole('teacher')">
            👨‍🏫 교사 전용 로그인
          </button>
        </div>

        <form id="login-form" onsubmit="App.handleLogin(event)">
          <div class="form-group" id="group-id">
            <label class="form-label" id="label-id">학번 (로그인 아이디)</label>
            <input type="text" id="login-id" class="input-control" required placeholder="예: 20328 (2학년 3반 28번)">
          </div>

          <div class="form-group" id="group-pw">
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

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.75rem; color: var(--text-dim);">
          🔑 테스트 교사 계정: 아이디 <code>test</code> / 비밀번호 <code>11111111</code>
        </div>
      </div>

      <!-- Student Sign-Up Modal -->
      <div id="signup-modal-overlay" class="modal-overlay">
        <div class="glass-card modal-content" style="max-width: 450px;">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--violet-bright);">✨ 영서중 수학 LMS 신규 회원가입</h3>
            <button class="close-btn" onclick="App.closeSignupModal()">×</button>
          </div>

          <form onsubmit="App.handleStudentSignup(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">학년</label>
                <select id="signup-grade" class="input-control" required>
                  <option value="1">1학년</option>
                  <option value="2" selected>2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">학반 (1~8반)</label>
                <select id="signup-class" class="input-control" required>
                  ${[1,2,3,4,5,6,7,8].map(c => `<option value="${c}">${c}반</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">학생 성명</label>
              <input type="text" id="signup-name" class="input-control" required placeholder="예: 홍길동">
            </div>

            <div class="form-group">
              <label class="form-label">학번 (로그인 아이디로 사용)</label>
              <input type="text" id="signup-id" class="input-control" required placeholder="예: 20328 (5자리 숫자로 권장)">
            </div>

            <div class="form-group">
              <label class="form-label">비밀번호</label>
              <input type="password" id="signup-pw" class="input-control" required placeholder="사용할 비밀번호 입력">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.5rem;">
              <button type="button" class="btn btn-secondary" onclick="App.closeSignupModal()">취소</button>
              <button type="submit" id="signup-submit-btn" class="btn btn-primary">💾 가입 신청 및 데이터베이스 동기화</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  currentLoginRole: 'student',

  switchLoginRole(role) {
    this.currentLoginRole = role;
    const btnStudent = document.getElementById('role-btn-student');
    const btnTeacher = document.getElementById('role-btn-teacher');
    const labelId = document.getElementById('label-id');
    const loginId = document.getElementById('login-id');
    const signupSec = document.getElementById('signup-section');

    if (role === 'student') {
      if (btnStudent) btnStudent.classList.add('active');
      if (btnTeacher) btnTeacher.classList.remove('active');
      if (labelId) labelId.innerText = '학번 (로그인 아이디)';
      if (loginId) loginId.placeholder = '예: 20328 (2학년 3반 28번)';
      if (signupSec) signupSec.style.display = 'block';
    } else {
      if (btnTeacher) btnTeacher.classList.add('active');
      if (btnStudent) btnStudent.classList.remove('active');
      if (labelId) labelId.innerText = '교사 아이디';
      if (loginId) loginId.placeholder = '교사 아이디 입력 (예: test)';
      if (signupSec) signupSec.style.display = 'none';
    }
  },

  openSignupModal() {
    const modal = document.getElementById('signup-modal-overlay');
    if (modal) modal.classList.add('active');
  },

  closeSignupModal() {
    const modal = document.getElementById('signup-modal-overlay');
    if (modal) modal.classList.remove('active');
  },

  async handleStudentSignup(e) {
    e.preventDefault();
    const btn = document.getElementById('signup-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ 구글 시트 저장 중...';
    }

    try {
      const grade = document.getElementById('signup-grade').value;
      const classNum = document.getElementById('signup-class').value;
      const name = document.getElementById('signup-name').value.trim();
      const id = document.getElementById('signup-id').value.trim();
      const password = document.getElementById('signup-pw').value.trim();

      const newStudent = { id, name, grade, classNum, password, status: 'in-progress', score: 0 };
      await CloudDB.registerStudent(newStudent);

      this.closeSignupModal();
      alert(`🎉 [회원가입 완료!]\n\n영서중학교 ${grade}학년 ${classNum}반 ${name} 학생 계정이 구글 시트에 성공적으로 저장되었습니다.\n학번(${id})으로 로그인해 주세요!`);

      const loginIdEl = document.getElementById('login-id');
      if (loginIdEl) loginIdEl.value = id;
      await this.syncCloudDatabase();
    } catch (err) {
      alert('회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '💾 가입 신청 및 데이터베이스 동기화';
      }
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pw = document.getElementById('login-pw').value.trim();

    // 1. Teacher Authentication
    if (this.currentLoginRole === 'teacher') {
      if (id === 'test' && pw === '11111111') {
        AppState.currentUser = { id: 'test', name: '임종윤 교사 (영서중학교)', role: 'teacher' };
        this.renderAppShell();
        return;
      } else {
        alert('⚠️ [교사 로그인 실패] 아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }
    }

    // 2. Student Authentication against CloudDB
    await this.syncCloudDatabase();
    const student = AppState.demoStudents.find(s => String(s.id).trim() === id);

    if (student) {
      if (String(student.password).trim() === pw) {
        AppState.currentUser = {
          id: student.id,
          name: student.name,
          grade: student.grade || '1',
          classNum: student.classNum || '1',
          role: 'student'
        };
        this.renderAppShell();
      } else {
        alert('⚠️ [로그인 실패] 비밀번호가 일치하지 않습니다.');
      }
    } else {
        alert(`⚠️ [로그인 실패] 학번 '${id}'(으)로 등록된 회원가입 학생 계정이 없습니다.\n먼저 [신규 학생 회원가입]을 진행해 주세요!`);
    }
  },

  toggleUserRole() {
    if (AppState.currentUser.role === 'teacher') {
      AppState.currentUser = { id: '20328', name: '홍길동', grade: '2', classNum: '3', role: 'student' };
    } else {
      AppState.currentUser = { id: 'test', name: '임종윤 교사 (영서중학교)', role: 'teacher' };
    }
    this.renderAppShell();
  },

  logout() {
    AppState.currentUser = null;
    this.renderAppShell();
  }
};

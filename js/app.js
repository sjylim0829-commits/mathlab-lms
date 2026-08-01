/**
 * Yeongseo Middle School Math LMS - Mobile Responsive Sidebar Layout, Auth & Persistent Student Sign-Up
 * Teacher: Jongyoon Lim (임종윤 교사 - 영서중학교)
 */

const AppState = {
  currentUser: null, // { id: 'test', name: '임종윤 교사 (영서중학교)', role: 'teacher' }

  demoStudents: [
    { id: '20301', name: '강도윤', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 95 },
    { id: '20302', name: '김민준', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 100 },
    { id: '20303', name: '김서준', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 90 },
    { id: '20304', name: '김예준', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 85 },
    { id: '20305', name: '박현우', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 95 },
    { id: '20306', name: '이도현', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 90 },
    { id: '20307', name: '이서연', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 100 },
    { id: '20308', name: '정지후', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 90 },
    { id: '20309', name: '최지민', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 85 },
    { id: '20310', name: '한지우', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 95 },

    { id: '20311', name: '권우진', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 90 },
    { id: '20312', name: '나성민', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 80 },
    { id: '20313', name: '노유진', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 88 },
    { id: '20314', name: '문태현', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 92 },
    { id: '20315', name: '민준영', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 84 },

    { id: '20316', name: '박세은', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 92 },
    { id: '20317', name: '배주원', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 88 },
    { id: '20318', name: '백하준', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 96 },
    { id: '20319', name: '송지호', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 90 },
    { id: '20320', name: '신유나', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 94 },

    { id: '20321', name: '안재현', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 86 },
    { id: '20322', name: '양시우', grade: '2', classNum: '3', password: '11', status: 'submitted', score: 88 },
    { id: '20323', name: '오승민', grade: '2', classNum: '3', password: '11', status: 'in-progress', score: 0 },
    { id: '20324', name: '유다은', grade: '2', classNum: '3', password: '11', status: 'in-progress', score: 0 },
    { id: '20325', name: '윤하은', grade: '2', classNum: '3', password: '11', status: 'in-progress', score: 0 },
    { id: '20326', name: '이준호', grade: '2', classNum: '3', password: '11', status: 'in-progress', score: 0 },
    { id: '20327', name: '임태양', grade: '2', classNum: '3', password: '11', status: 'not-started', score: 0 }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.loadStoredStudents();
    this.renderAppShell();
  },

  loadStoredStudents() {
    try {
      const stored = localStorage.getItem('ys_mathlab_registered_students');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach(st => {
            const existingIndex = AppState.demoStudents.findIndex(s => s.id === st.id);
            if (existingIndex >= 0) {
              AppState.demoStudents[existingIndex] = st;
            } else {
              AppState.demoStudents.unshift(st);
            }
          });
        }
      }
    } catch (err) {
      console.warn('Failed to load registered students from localStorage', err);
    }
  },

  saveStudentToStorage(student) {
    try {
      const stored = localStorage.getItem('ys_mathlab_registered_students');
      let parsed = stored ? JSON.parse(stored) : [];
      const existingIndex = parsed.findIndex(s => s.id === student.id);
      if (existingIndex >= 0) {
        parsed[existingIndex] = student;
      } else {
        parsed.unshift(student);
      }
      localStorage.setItem('ys_mathlab_registered_students', JSON.stringify(parsed));
    } catch (err) {
      console.warn('Failed to save student to localStorage', err);
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
              <label class="form-label">아이디 또는 학번</label>
              <input type="text" id="login-id-input" class="input-control" placeholder="교사는 test, 학생은 학번(예: 20302)" value="test" required>
            </div>

            <div class="form-group">
              <label class="form-label">비밀번호 (Password)</label>
              <input type="password" id="login-pw-input" class="input-control" placeholder="비밀번호 입력 (테스트: 11111111)" value="11111111" required>
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">
              🔓 로그인하기
            </button>
          </form>

          <!-- Student Registration Prompt -->
          <div style="margin-top: 1.25rem; text-align: center; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-card); padding-top: 1rem;">
            <span>처음 방문하셨나요?</span>
            <button type="button" class="btn btn-outline-violet" style="padding: 0.35rem 0.9rem; font-size: 0.8rem; margin-left: 0.5rem;" onclick="App.openSignupModal()">
              ✨ 신규 학생 회원가입
            </button>
          </div>

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

      <!-- Student Sign-Up Modal -->
      <div id="signup-modal-overlay" class="modal-overlay">
        <div class="glass-card modal-content" style="max-width: 480px;">
          <div class="modal-header">
            <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--violet-bright);">
              🎒 영서중학교 신규 학생 회원가입
            </h3>
            <button class="close-btn" onclick="App.closeSignupModal()">×</button>
          </div>

          <form onsubmit="App.handleStudentSignup(event)" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">학생 성명 (이름)</label>
              <input type="text" id="signup-name-input" class="input-control" required placeholder="예: 홍길동">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">학년 선택</label>
                <select id="signup-grade-select" class="input-control">
                  <option value="1">1학년</option>
                  <option value="2" selected>2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">학반 선택</label>
                <select id="signup-class-select" class="input-control">
                  ${[1,2,3,4,5,6,7,8].map(c => `<option value="${c}" ${c === 3 ? 'selected' : ''}>${c}반</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">학번 (로그인 아이디로 사용)</label>
              <input type="text" id="signup-id-input" class="input-control" required placeholder="예: 20328" value="20328">
            </div>

            <div class="form-group">
              <label class="form-label">비밀번호 설정</label>
              <input type="password" id="signup-pw-input" class="input-control" required placeholder="비밀번호 (4자리 이상)" value="11111111">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
              <button type="button" class="btn btn-secondary" onclick="App.closeSignupModal()">취소</button>
              <button type="submit" class="btn btn-primary">✨ 회원가입 완료 및 바로 로그인</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  openSignupModal() {
    const modal = document.getElementById('signup-modal-overlay');
    if (modal) modal.classList.add('active');
  },

  closeSignupModal() {
    const modal = document.getElementById('signup-modal-overlay');
    if (modal) modal.classList.remove('active');
  },

  handleStudentSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name-input').value.trim();
    const grade = document.getElementById('signup-grade-select').value;
    const classNum = document.getElementById('signup-class-select').value;
    const studentId = document.getElementById('signup-id-input').value.trim();
    const password = document.getElementById('signup-pw-input').value.trim();

    if (!name || !studentId) {
      alert('학생 이름과 학번을 입력하세요.');
      return;
    }

    const newStudent = {
      id: studentId,
      name: name,
      grade: grade,
      classNum: classNum,
      password: password || '11111111',
      status: 'in-progress',
      score: 0,
      createdAt: new Date().toISOString()
    };

    const existingIndex = AppState.demoStudents.findIndex(s => s.id === studentId);
    if (existingIndex >= 0) {
      AppState.demoStudents[existingIndex] = newStudent;
    } else {
      AppState.demoStudents.unshift(newStudent);
    }

    this.saveStudentToStorage(newStudent);

    AppState.currentUser = {
      id: studentId,
      name: `${name} 학생 (영서중 ${grade}학년 ${classNum}반)`,
      role: 'student'
    };

    this.closeSignupModal();
    this.init();

    alert(`🎉 [회원가입 완료 및 계정 저장!]\n\n환영합니다, ${name} 학생!\n영서중학교 ${grade}학년 ${classNum}반 계정(학번: ${studentId})이 안전하게 브라우저에 저장되었습니다.\n\n다음부터는 입력하신 학번(${studentId})으로 언제든 다시 로그인하실 수 있습니다.`);
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

    this.loadStoredStudents();

    if (id === 'test' && pw === '11111111') {
      AppState.currentUser = {
        id: 'test',
        name: '임종윤 교사 (영서중학교)',
        role: 'teacher'
      };
    } else {
      const foundStudent = AppState.demoStudents.find(s => s.id === id);
      const studentName = foundStudent ? foundStudent.name : (id ? `${id}` : '신규 학생');
      const studentGrade = foundStudent && foundStudent.grade ? foundStudent.grade : '2';
      const studentClass = foundStudent && foundStudent.classNum ? foundStudent.classNum : '3';

      AppState.currentUser = {
        id: id || '20302',
        name: `${studentName} 학생 (영서중 ${studentGrade}학년 ${studentClass}반)`,
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

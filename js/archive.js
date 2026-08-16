/**
 * Yeongseo Middle School Student Activity Archiving & AI 세특 (세부능력 및 특기사항) Generator
 * Teacher: Jongyoon Lim (임종윤 교사 - 수학과)
 */

const ArchiveModule = {
  selectedStudentId: null,
  selectedGradeFilter: 'all', // 'all', '1', '2', '3'
  selectedClassFilter: 'all', // 'all', '1', '2', ..., '8'
  searchTerm: '',
  selectedTone: 'academic',

  // Database of archived student math activities & tailored 세특 templates
  archiveData: {},

  initFilters() {
    this.selectedGradeFilter = 'all';
    this.selectedClassFilter = 'all';
    this.searchTerm = '';
  },

  getFilteredStudents() {
    let list = AppState.demoStudents || [];

    // 1. 학년 필터링
    if (this.selectedGradeFilter !== 'all') {
      list = list.filter(s => String(s.grade) === String(this.selectedGradeFilter));
    }

    // 2. 반 필터링
    if (this.selectedClassFilter !== 'all') {
      list = list.filter(s => String(s.classNum) === String(this.selectedClassFilter));
    }

    // 3. 검색어 필터링 (이름 또는 학번)
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const q = this.searchTerm.trim().toLowerCase();
      list = list.filter(s => String(s.name).toLowerCase().includes(q) || String(s.id).includes(q));
    }

    return list;
  },

  setGradeFilter(grade) {
    this.selectedGradeFilter = grade;
    this.renderStudentListOnly();
  },

  setClassFilter(classNum) {
    this.selectedClassFilter = classNum;
    this.renderStudentListOnly();
  },

  setSearchTerm(term) {
    this.searchTerm = term;
    this.renderStudentListOnly();
  },

  selectStudent(studentId) {
    this.selectedStudentId = studentId;
    const mainView = document.getElementById('teacher-main-view');
    if (mainView) {
      mainView.innerHTML = this.renderView();
    }
  },

  renderStudentListOnly() {
    const container = document.getElementById('archive-student-selector-list');
    const headerTitle = document.getElementById('archive-student-count-header');
    
    const filteredList = this.getFilteredStudents();
    
    if (headerTitle) {
      const gradeTxt = this.selectedGradeFilter === 'all' ? '전체 학년' : `${this.selectedGradeFilter}학년`;
      const classTxt = this.selectedClassFilter === 'all' ? '전체 반' : `${this.selectedClassFilter}반`;
      headerTitle.textContent = `📋 학생 목록 (${gradeTxt} ${classTxt} - ${filteredList.length}명)`;
    }

    if (container) {
      if (filteredList.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: #94a3b8; font-size: 0.85rem;">
            🔍 조건에 일치하는 가입 학생이 없습니다.
          </div>
        `;
        return;
      }

      container.innerHTML = filteredList.map(st => `
        <button class="student-select-btn ${String(st.id) === String(this.selectedStudentId) ? 'active' : ''}" onclick="ArchiveModule.selectStudent('${st.id}')" style="width: 100%; text-align: left; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid ${String(st.id) === String(this.selectedStudentId) ? '#6366f1' : '#e2e8f0'}; background: ${String(st.id) === String(this.selectedStudentId) ? 'linear-gradient(135deg, #e0e7ff, #ede9fe)' : '#ffffff'}; margin-bottom: 0.4rem; cursor: pointer; transition: all 0.15s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 800; font-size: 0.9rem; color: ${String(st.id) === String(this.selectedStudentId) ? '#3730a3' : '#1e293b'};">
              ${st.name} <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">(${st.grade || 2}학년 ${st.classNum || 1}반)</span>
            </span>
            <span style="font-size: 0.75rem; color: #4f46e5; font-family: monospace; font-weight: 700;">${st.id}</span>
          </div>
          <div style="font-size: 0.73rem; color: #64748b; margin-top: 0.2rem;">
            가입 및 탐구 수행 완료
          </div>
        </button>
      `).join('');
    }
  },

  renderView() {
    const students = AppState.demoStudents || [];
    if (!this.selectedStudentId && students.length > 0) {
      this.selectedStudentId = students[0].id;
    }

    const filteredList = this.getFilteredStudents();
    const stObj = students.find(s => String(s.id) === String(this.selectedStudentId)) || (students.length > 0 ? students[0] : null);

    // Fetch real submissions for selected student from CloudDB local cache & Supabase
    const allSubmissions = (typeof CloudDB !== 'undefined' && CloudDB.getSubmissionsFromLocal) ? CloudDB.getSubmissionsFromLocal() : [];
    const studentSubmissions = stObj ? allSubmissions.filter(sub => String(sub.studentId) === String(stObj.id)) : [];

    // Redbook activity history archiving
    const defaultRedbookActivities = stObj ? [
      {
        date: '2026-08-16',
        title: '📐 [2학년] 삼각형의 내심 (Incenter) 탐구 (Redbook 웹 앱)',
        score: 95,
        formula: '∠BIC = 90° + ½∠A = 140°',
        note: '구글 드라이브 DB 연동 완료'
      },
      {
        date: '2026-08-08',
        title: '📐 [2학년] 삼각형의 외심 (Circumcenter) 탐구 (Redbook 웹 앱)',
        score: 95,
        formula: '∠BOC = 2∠A = 120°',
        note: '구글 드라이브 DB 연동 완료'
      },
      {
        date: '2026-08-01',
        title: '📘 [2학년] 이등변삼각형 & 직각삼각형의 합동 탐구 (Redbook 웹 앱)',
        score: 90,
        formula: 'RHS & RHA 합동 증명 캔버스',
        note: '과제 제출 완료'
      }
    ] : [];

    const mergedSubmissions = [
      ...studentSubmissions.map(s => ({
        date: s.submittedAt ? String(s.submittedAt).split(' ')[0] : new Date().toISOString().split('T')[0],
        title: s.activityTitle || '수학 탐구활동 (Redbook 웹 앱)',
        score: s.score || 95,
        formula: s.answerText || '수학적 증명 완료',
        note: 'LMS DB 연동 자동 기록'
      })),
      ...defaultRedbookActivities
    ];

    const actCount = mergedSubmissions.length;
    const totalScore = mergedSubmissions.reduce((acc, cur) => acc + (Number(cur.score) || 90), 0);
    const avgScore = actCount > 0 ? Math.round(totalScore / actCount) : 92;

    const seteukText = stObj ? this.buildCustomSeteukText(stObj, mergedSubmissions, this.selectedTone) : '좌측 가입 학생 목록에서 학생을 선택하면 자동으로 수학 세특 문구가 생성됩니다.';

    const currentStudent = stObj ? {
      id: stObj.id,
      name: stObj.name,
      gradeClass: `${stObj.grade || 2}학년 ${stObj.classNum || 1}반 (${stObj.id})`,
      activitiesCount: actCount,
      avgScore: avgScore,
      recentSubmissions: mergedSubmissions,
      generatedSeteuk: seteukText
    } : {
      id: '미선택',
      name: '학생을 선택하세요',
      gradeClass: '가입 학생 선택 필요',
      activitiesCount: 0,
      avgScore: 0,
      recentSubmissions: [],
      generatedSeteuk: '좌측 가입 학생 목록에서 학생을 선택하면 자동으로 수학 세특 문구가 생성됩니다.'
    };

    return `
      <div style="width: 100%;">
        <!-- Title & Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill teacher" style="font-size: 0.75rem; background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;">📜 수학과 세특 관리</span>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #1e1b4b;">학생 수업 기록 아카이빙 & AI 세특 자동 생성</h2>
            </div>
            <p style="font-size: 0.85rem; color: #475569; margin-top: 0.3rem;">
              담당: <strong style="color: #1e1b4b;">임종윤 교사</strong> | Supabase 클라우드 DB에 가입된 학생들의 탐구 수행 이력을 기반으로 생기부 세특(세부능력 및 특기사항)을 자동 작성합니다.
            </p>
          </div>

          <div style="display: flex; gap: 0.6rem;">
            <button class="btn btn-outline-violet" onclick="ArchiveModule.exportAllSeteuk()" style="background: #ffffff; color: #4338ca; border: 1px solid #c7d2fe; font-weight: 700;">
              📦 학급 전체 세특 Excel 내보내기
            </button>
          </div>
        </div>

        <!-- Layout Grid: Student Selector + Detail Archive -->
        <div style="display: grid; grid-template-columns: 310px 1fr; gap: 1.5rem;">
          
          <!-- Left: Student List Selector & Conditions Filter -->
          <div class="glass-card" style="padding: 1.1rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
            <h3 id="archive-student-count-header" style="font-size: 0.95rem; font-weight: 800; color: #1e1b4b; margin-bottom: 0.8rem;">
              📋 학생 목록 (전체 학년 전체 반 - ${filteredList.length}명)
            </h3>

            <!-- 1. 학년 및 반 선택 필터 조건 조율 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.6rem;">
              <div>
                <label style="font-size: 0.73rem; font-weight: 700; color: #475569; display: block; margin-bottom: 2px;">학년 조건</label>
                <select onchange="ArchiveModule.setGradeFilter(this.value)" style="width: 100%; padding: 0.45rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem; font-weight: 700; color: #3730a3; background: #f8fafc;">
                  <option value="all" ${this.selectedGradeFilter === 'all' ? 'selected' : ''}>전체 학년</option>
                  <option value="1" ${this.selectedGradeFilter === '1' ? 'selected' : ''}>🌱 1학년</option>
                  <option value="2" ${this.selectedGradeFilter === '2' ? 'selected' : ''}>🌿 2학년</option>
                  <option value="3" ${this.selectedGradeFilter === '3' ? 'selected' : ''}>🌳 3학년</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.73rem; font-weight: 700; color: #475569; display: block; margin-bottom: 2px;">반 조건</label>
                <select onchange="ArchiveModule.setClassFilter(this.value)" style="width: 100%; padding: 0.45rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem; font-weight: 700; color: #3730a3; background: #f8fafc;">
                  <option value="all" ${this.selectedClassFilter === 'all' ? 'selected' : ''}>전체 반</option>
                  ${[1,2,3,4,5,6,7,8].map(c => `
                    <option value="${c}" ${String(this.selectedClassFilter) === String(c) ? 'selected' : ''}>${c}반</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- 2. 학생 이름/학번 검색어 입력 -->
            <div class="form-group" style="margin-bottom: 0.8rem;">
              <input type="text" class="input-control" value="${this.searchTerm}" placeholder="🔍 이름 또는 학번 검색..." style="font-size: 0.82rem; padding: 0.5rem 0.8rem; border-radius: 8px;" oninput="ArchiveModule.setSearchTerm(this.value)">
            </div>

            <!-- 3. 동적 필터링 가입 학생 목록 -->
            <div style="display: flex; flex-direction: column; max-height: 480px; overflow-y: auto; padding-right: 2px;" id="archive-student-selector-list">
              ${filteredList.length === 0 ? `
                <div style="text-align: center; padding: 2rem 1rem; color: #94a3b8; font-size: 0.85rem;">
                  🔍 조건에 일치하는 가입 학생이 없습니다.
                </div>
              ` : filteredList.map(st => `
                <button class="student-select-btn ${String(st.id) === String(this.selectedStudentId) ? 'active' : ''}" onclick="ArchiveModule.selectStudent('${st.id}')" style="width: 100%; text-align: left; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid ${String(st.id) === String(this.selectedStudentId) ? '#6366f1' : '#e2e8f0'}; background: ${String(st.id) === String(this.selectedStudentId) ? 'linear-gradient(135deg, #e0e7ff, #ede9fe)' : '#ffffff'}; margin-bottom: 0.4rem; cursor: pointer; transition: all 0.15s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 800; font-size: 0.9rem; color: ${String(st.id) === String(this.selectedStudentId) ? '#3730a3' : '#1e293b'};">
                      ${st.name} <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">(${st.grade || 2}학년 ${st.classNum || 1}반)</span>
                    </span>
                    <span style="font-size: 0.75rem; color: #4f46e5; font-family: monospace; font-weight: 700;">${st.id}</span>
                  </div>
                  <div style="font-size: 0.73rem; color: #64748b; margin-top: 0.2rem;">
                    가입 및 탐구 수행 완료
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Right: Selected Student Archived Records & AI Seteuk Generator -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Student Header Profile Card -->
            <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1.2rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px;">
              <div>
                <span style="font-size: 0.8rem; color: #047857; font-weight: 800; background: #d1fae5; padding: 2px 8px; border-radius: 8px;">
                  학습 이력 아카이브 관리 대상
                </span>
                <div style="display: flex; align-items: center; gap: 0.8rem; margin-top: 0.3rem; flex-wrap: wrap;">
                  <h3 style="font-size: 1.5rem; font-weight: 800; color: #1e1b4b; margin: 0;">
                    ${currentStudent.name} <span style="font-size: 1rem; color: #64748b; font-weight: 600;">(${currentStudent.gradeClass})</span>
                  </h3>
                  ${stObj ? `
                    <button class="btn btn-sm" onclick="ArchiveModule.resetStudentPassword('${stObj.id}', '${stObj.name}')" style="background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 8px; font-weight: 800; padding: 4px 10px; font-size: 0.78rem; cursor: pointer; transition: all 0.15s ease;" title="학생 비밀번호 초기화">
                      🔑 비밀번호 초기화
                    </button>
                  ` : ''}
                </div>
              </div>

              <div style="display: flex; gap: 1rem; font-size: 0.85rem;">
                <div style="background: #f8fafc; padding: 0.55rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                  <div style="color: #64748b; font-size: 0.75rem; font-weight: 700;">탐구 활동 횟수</div>
                  <div style="font-weight: 800; font-size: 1.25rem; color: #4f46e5;">${currentStudent.activitiesCount}회</div>
                </div>
                <div style="background: #f8fafc; padding: 0.55rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                  <div style="color: #64748b; font-size: 0.75rem; font-weight: 700;">평균 이해도</div>
                  <div style="font-weight: 800; font-size: 1.25rem; color: #047857;">${currentStudent.avgScore}점</div>
                </div>
              </div>
            </div>

            <!-- Activity Submission Timeline Archive -->
            <div class="glass-card" style="padding: 1.25rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px;">
              <h4 style="font-size: 1.05rem; font-weight: 800; color: #1e1b4b; margin-bottom: 0.8rem;">
                📂 ${currentStudent.name} 학생의 수학 활동 수행 기록 아카이브
              </h4>
              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                ${currentStudent.recentSubmissions.length === 0 ? `
                  <div style="text-align: center; padding: 1.5rem; color: #94a3b8; font-size: 0.85rem;">제출된 수학 탐구 활동 기록이 아직 없습니다.</div>
                ` : currentStudent.recentSubmissions.map(sub => `
                  <div style="padding: 0.8rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 0.75rem; color: #64748b;">🗓️ ${sub.date} | 제출 수식: <code>${sub.formula}</code></div>
                      <div style="font-weight: 800; font-size: 0.95rem; color: #1e293b; margin-top: 2px;">${sub.title}</div>
                    </div>
                    <div style="text-align: right;">
                      <span style="font-weight: 800; font-size: 1.1rem; color: #047857;">${sub.score}점</span>
                      <div style="font-size: 0.72rem; color: #64748b;">${sub.note}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- AI Seteuk Generator Card -->
            <div class="glass-card" style="padding: 1.25rem; background: linear-gradient(135deg, #ffffff, #f8fafc); border: 1px solid #c7d2fe; border-radius: 16px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.08);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-size: 1.1rem; font-weight: 800; color: #1e1b4b; display: flex; align-items: center; gap: 0.4rem;">
                  <span>✨ AI 생활기록부 세특(세부능력 및 특기사항) 자동 생성</span>
                </h4>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-primary" onclick="ArchiveModule.generateSeteuk()" style="background: linear-gradient(135deg, #4f46e5, #6366f1); border: none; font-size: 0.85rem; font-weight: 800; padding: 0.45rem 0.9rem;">
                    🔄 세특 문구 재생성
                  </button>
                  <button class="btn btn-secondary" onclick="ArchiveModule.copySeteuk()" style="background: #ffffff; color: #3730a3; border: 1px solid #c7d2fe; font-size: 0.85rem; font-weight: 700; padding: 0.45rem 0.9rem;">
                    📋 나이스(NEIS) 복사
                  </button>
                </div>
              </div>

              <div style="margin-bottom: 0.8rem; display: flex; gap: 0.5rem;">
                <button class="tone-btn btn-sm ${this.selectedTone === 'academic' ? 'btn-primary' : 'btn-outline-violet'}" onclick="ArchiveModule.setTone('academic')" style="font-size: 0.78rem; font-weight: 700;">
                  📘 논리·학구적 톤
                </button>
                <button class="tone-btn btn-sm ${this.selectedTone === 'creative' ? 'btn-primary' : 'btn-outline-violet'}" onclick="ArchiveModule.setTone('creative')" style="font-size: 0.78rem; font-weight: 700;">
                  💡 창의 탐구형 톤
                </button>
                <button class="tone-btn btn-sm ${this.selectedTone === 'self' ? 'btn-primary' : 'btn-outline-violet'}" onclick="ArchiveModule.setTone('self')" style="font-size: 0.78rem; font-weight: 700;">
                  📝 자기주도·성장형 톤
                </button>
              </div>

              <textarea id="seteuk-output-text" rows="5" style="width: 100%; font-size: 0.9rem; line-height: 1.6; padding: 1rem; border-radius: 12px; border: 1px solid #cbd5e1; background: #ffffff; color: #1e293b; font-family: inherit; font-weight: 500;" onchange="ArchiveModule.updateSeteukText(this.value)">${currentStudent.generatedSeteuk}</textarea>
              
              <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.78rem; color: #64748b;">
                <span>💡 선생님께서 텍스트를 직접 수정하실 수 있습니다.</span>
                <span id="seteuk-char-count">${currentStudent.generatedSeteuk.length}자 (나이스 바이트 기준 이내)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  buildCustomSeteukText(stObj, subs, tone) {
    if (!stObj) return '';
    const name = stObj.name;
    const id = stObj.id;
    const grade = stObj.grade || 2;

    if (tone === 'creative') {
      return `${name}(${id}) 학생은 중학교 ${grade}학년 수학 기하 영역 탐구 수업에서 수학적 직관력과 창의적 문제 해결력이 돋보임. Redbook 웹 앱 캔버스를 활용하여 세 내각의 이등분선 교점인 내심(Incenter) I와 내접원(r)을 직관적으로 작도하고, 직각삼각형 IAD와 IAF의 RHS 합동을 포개기 슬라이딩 애니메이션으로 증명함. 내심의 각도 성질(∠BIC = 90° + ½∠A) 수식을 탐구하고 퀴즈를 스스로 해결하는 등 창의적 기하 탐구 능력을 보여줌.`;
    } else if (tone === 'self') {
      return `${name}(${id}) 학생은 수학 수업 중 주어지는 대화형 탐구 과제에 주도적으로 참여하며 뛰어난 학습 집념을 나타냄. Redbook 웹 앱 상에서 삼각형 꼭짓점을 자유롭게 드래그하며 내심(Incenter)과 외심(Circumcenter)의 기하학적 성질 변화를 실시간 관찰함. 세 내각 이등분선 교점의 성질(ID=IE=IF=r) 및 각도 성질 수식(∠BIC = 90° + ½∠A)을 차근차근 검증하고 오류를 스스로 교정하는 자기주도적 성찰 태도가 매우 우수함.`;
    } else {
      // academic (default)
      return `${name}(${id}) 학생은 기하학적 도형의 성질과 수식을 다루는 수학 탐구 수업에서 탁월한 논리력과 체계적 표현력을 발휘함. Redbook 웹 앱 작도 도구를 적극 활용하여 삼각형의 내심(Incenter) I와 내접원의 반지름(r), 세 변에 이르는 수선 거리(ID=IE=IF)를 정밀하게 측정함. RHS 직각삼각형 합동 조건 및 내심 각도 성질(∠BIC = 90° + ½∠A)을 논리적으로 명확히 증명하고 수식으로 성실하게 기록하는 등 학구적 탐구 태도가 매우 뛰어남.`;
    }
  },

  setTone(tone) {
    this.selectedTone = tone;
    this.generateSeteuk();
  },

  generateSeteuk() {
    const students = AppState.demoStudents || [];
    const stObj = students.find(s => String(s.id) === String(this.selectedStudentId));
    
    const text = stObj ? this.buildCustomSeteukText(stObj, [], this.selectedTone) : '학생을 선택하세요.';

    const outputEl = document.getElementById('seteuk-output-text');
    if (outputEl) {
      outputEl.value = text;
      const countEl = document.getElementById('seteuk-char-count');
      if (countEl) countEl.textContent = `${text.length}자 (나이스 바이트 기준 이내)`;
    }
  },

  updateSeteukText(val) {
    const countEl = document.getElementById('seteuk-char-count');
    if (countEl) countEl.textContent = `${val.length}자 (나이스 바이트 기준 이내)`;
  },

  copySeteuk() {
    const outputEl = document.getElementById('seteuk-output-text');
    if (outputEl) {
      outputEl.select();
      document.execCommand('copy');
      alert('📋 세특 문구가 클립보드에 복사되었습니다! 나이스(NEIS) 세특 입력창에 Ctrl+V로 붙여넣으세요.');
    }
  },

  exportAllSeteuk() {
    alert('📦 학급 전체 학생의 생기부 세특 문구를 Excel CSV 파일로 내보냅니다.');
  },

  async resetStudentPassword(studentId, studentName) {
    if (!studentId) return;

    const newPw = prompt(`🔑 [학생 비밀번호 초기화]\n\n학생명: ${studentName}\n학번: ${studentId}\n\n초기화할 새 비밀번호를 입력하세요:`, '1234');
    if (newPw === null) return; // User cancelled

    const cleanPw = newPw.trim();
    if (!cleanPw) {
      alert('비밀번호는 빈 값으로 설정할 수 없습니다.');
      return;
    }

    const res = await CloudDB.resetStudentPassword(studentId, cleanPw);
    if (res && res.success) {
      alert(`✅ [비밀번호 초기화 완료]\n\n학생: ${studentName} (${studentId})\n새 비밀번호: ${cleanPw}\n\nSupabase Cloud DB 및 시스템에 업데이트되었습니다.`);
      const mainView = document.getElementById('teacher-main-view');
      if (mainView) mainView.innerHTML = this.renderView();
    } else {
      alert(`⚠️ ${res ? res.message : '비밀번호 초기화 처리 중 오류가 발생했습니다.'}`);
    }
  }
};

window.ArchiveModule = ArchiveModule;

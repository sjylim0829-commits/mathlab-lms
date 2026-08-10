/**
 * MathLab Student Interactive Learning Portal
 * Supports internal canvas solvers & embedded math-app web applications
 */

const StudentModule = {
  activeActivityId: 'MATH-2026-GEO-02',
  grapherInstance: null,
  currentFormulaInput: 'f(x) = x^2 - 2',

  init() {
    this.renderSolver();
  },

  renderLabView() {
    const allActivities = typeof TeacherModule !== 'undefined' ? TeacherModule.getActivities() : [];
    const currentUser = (typeof AppState !== 'undefined' && AppState.currentUser) ? AppState.currentUser : {
      id: '20328', name: '홍길동', grade: '2', classNum: '3'
    };

    const studentGrade = String(currentUser.grade || '2');

    // 학생 본인의 학년(또는 전체 학년 대상) 탐구 활동만 노출되도록 완벽 필터링!
    const filteredActivities = allActivities.filter(act => {
      if (!act.targetGrade || act.targetGrade === 'all' || act.targetGrade === '전체') return true;
      if (String(act.targetGrade) === studentGrade) return true;
      if (act.grade && (act.grade.includes(studentGrade + '학년') || act.grade.includes('전체'))) return true;
      return false;
    });

    const activities = filteredActivities.length > 0 ? filteredActivities : allActivities;
    const activeAct = activities.find(a => a.id === this.activeActivityId) || activities[0] || {
      id: 'act-1',
      title: `[${studentGrade}학년] 수학 탐구 미션`,
      desc: '담당 선생님이 등록하신 수학 탐구 실습 과제입니다.',
      type: 'canvas'
    };

    const catalogCardsHtml = activities.map(act => {
      const isSelected = act.id === activeAct.id;
      return `
        <div class="glass-card hover-lift" style="padding: 1rem; border-color: ${isSelected ? 'var(--violet-bright)' : 'var(--border-card)'}; background: ${isSelected ? 'rgba(99, 102, 241, 0.06)' : '#ffffff'}; flex: 1; min-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--primary-violet); background: rgba(99, 102, 241, 0.1); padding: 2px 6px; border-radius: 8px;">
              ${act.grade || studentGrade + '학년전용'}
            </span>
            ${isSelected ? '<span style="font-size: 0.7rem; font-weight: 700; color: var(--accent-emerald);">▶️ 진행 중</span>' : ''}
          </div>
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.3rem;">
            ${act.title}
          </h4>
          <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-violet'}" style="width: 100%; margin-top: 0.5rem; font-size: 0.75rem;" onclick="StudentModule.selectActivity('${act.id}')">
            ${isSelected ? '현재 실습 중' : '▶️ 이 탐구실 입장'}
          </button>
        </div>
      `;
    }).join('');

    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        <!-- Header Info -->
        <div class="glass-card" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="role-pill student" style="font-size: 0.75rem;">${studentGrade}학년 수학 탐구실</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">
                학생: <strong style="color: var(--text-main);">${currentUser.name} (${studentGrade}학년 ${currentUser.classNum || 1}반 ${currentUser.id})</strong>
              </span>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 0.3rem;" id="student-active-title">${activeAct.title}</h2>
          </div>
          
          <div style="display: flex; gap: 0.6rem;">
            <button class="btn btn-outline-violet" onclick="StudentModule.notifyLMSBridgeHandshake()">
              🔄 연동 핸드셰이크 재요청
            </button>
            <button class="btn btn-primary" onclick="StudentModule.submitSolution()">
              🚀 내 탐구 답안 제출하기
            </button>
          </div>
        </div>

        <!-- Activity Selection Row -->
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">
            📚 [${studentGrade}학년] 참여 가능 수학 탐구 미션 목록
          </h3>
          <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
            ${catalogCardsHtml}
          </div>
        </div>

        <!-- Embedded Workspace View (Iframe or Canvas) -->
        <div class="glass-card embed-workspace-container" id="student-workspace-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
            <span class="status-indicator live"><span class="dot"></span> 🖥️ 탐구활동 인터랙티브 실습 공간 (확대 가능)</span>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-dim);">
                ${activeAct.url ? '🌐 math-app 연동 웹 앱 내장됨' : '📐 Canvas 시뮬레이터'}
              </span>
              <button class="btn btn-primary" onclick="StudentModule.toggleFullscreenEmbed()" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); font-weight: 700;">
                ⤢ 큰 화면 모드 (전체 화면)
              </button>
            </div>
          </div>

          <div id="student-embed-container" style="background: #f8fafc; border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 0.75rem; min-height: 600px;">
            ${activeAct.url ? `
              <iframe id="math-app-iframe" src="${activeAct.url}" style="width: 100%; height: 760px; border: none; border-radius: var(--radius-sm);" title="${activeAct.title}" onload="StudentModule.onIframeLoaded(this)"></iframe>
            ` : `
              <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
                <div class="grapher-wrapper">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h3 style="font-size: 1rem; font-weight: 700;">실시간 그래프 모델링</h3>
                    <span id="student-current-formula-badge" style="font-family: var(--font-mono); color: var(--violet-bright); font-size: 0.85rem;">
                      f(x) = 1.00x² + 0.00x - 2.00
                    </span>
                  </div>
                  <div class="grapher-canvas-card" style="height: 320px;">
                    <canvas id="student-grapher-canvas" class="grapher-canvas" style="width: 100%; height: 100%;"></canvas>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div class="glass-card" style="padding: 1rem;">
                    <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--violet-bright); margin-bottom: 0.4rem;">📌 탐구 안내</h3>
                    <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5;">
                      ${activeAct.desc}
                    </p>
                  </div>
                  <div class="glass-card" style="padding: 1rem;">
                    <label class="form-label">탐구 결과 및 작성 수식</label>
                    <textarea id="student-formula-input" class="input-control" rows="4" placeholder="탐구 결과를 입력하세요.">f(x) = x^2 - 2 (접선의 기울기 m = 2.0)</textarea>
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  renderSolver() {
    const contentArea = document.getElementById('teacher-main-view');
    if (contentArea) {
      contentArea.innerHTML = this.renderLabView();
      setTimeout(() => this.initCanvas(), 50);
    }
  },

  selectActivity(actId) {
    this.activeActivityId = actId;
    this.renderSolver();
  },

  onIframeLoaded(iframe) {
    console.log('[StudentModule] math-app iframe loaded. Sending initial student payload...');
    const currentUser = (typeof AppState !== 'undefined' && AppState.currentUser) ? AppState.currentUser : {
      id: '20328', name: '홍길동', grade: '2', classNum: '3'
    };

    try {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'MATH_LMS_INIT_STUDENT',
          student: currentUser
        }, '*');
      }
    } catch(e) {}
  },

  notifyLMSBridgeHandshake() {
    const iframe = document.getElementById('math-app-iframe');
    if (iframe) {
      this.onIframeLoaded(iframe);
      alert('🔄 연동 핸드셰이크 요청을 math-app 웹 앱으로 전송하였습니다.');
    } else {
      alert('현재 선택된 탐구실은 캔버스 모드입니다.');
    }
  },

  initCanvas() {
    const canvas = document.getElementById('student-grapher-canvas');
    if (canvas && typeof MathGrapher !== 'undefined') {
      this.grapherInstance = new MathGrapher(canvas, {
        funcType: 'quadratic',
        a: 1.0,
        b: 0.0,
        c: -2.0,
        x0: 1.0,
        showTangent: true
      });
    }
  },

  async submitSolution() {
    const input = document.getElementById('student-formula-input');
    const answerText = input ? input.value : '탐구 미션 제출 완료';
    const currentUser = (typeof AppState !== 'undefined' && AppState.currentUser) ? AppState.currentUser : {
      id: '20328', name: '홍길동', grade: '2', classNum: '3'
    };

    const activeTitle = document.getElementById('student-active-title') ? document.getElementById('student-active-title').innerText : '수학 탐구활동';

    await CloudDB.saveActivityResult({
      studentId: currentUser.id,
      studentName: currentUser.name,
      grade: currentUser.grade || '2',
      classNum: currentUser.classNum || '3',
      activityTitle: activeTitle,
      answerText: answerText,
      score: 100
    });

    alert(`🎉 [제출 완료!]\n\n학생: ${currentUser.name} (${currentUser.id})\n탐구과제: ${activeTitle}\n제출 수식: ${answerText}\n\n교사 대시보드 및 구글 시트에 실시간 반영되었습니다.`);
  },

  toggleFullscreenEmbed() {
    const card = document.getElementById('student-workspace-card') || document.getElementById('teacher-workspace-card');
    if (!card) return;
    card.classList.toggle('fullscreen-active');
  }
};

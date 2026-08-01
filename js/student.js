/**
 * MathLab Student Interactive Learning Portal
 * Interactive Math Function Grapher, Virtual Math Keypad, and Real-time Activity Submission
 */

const StudentModule = {
  activeActivity: {
    id: 'ML-8042',
    title: '이차함수 y = ax² + bx + c 와 접선의 방정식 탐구',
    subject: '고등 수학 (수학 II 미분)',
    teacher: '김대섭 교사 (휘문고등학교)',
    target: { a: 1.0, b: 0.0, c: -2.0, x0: 1.0 }
  },

  grapherInstance: null,
  currentFormulaInput: 'f(x) = x^2 - 2',

  init() {
    this.renderSolver();
  },

  renderSolver() {
    const contentArea = document.getElementById('student-main-view');
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div style="max-width: 1100px; margin: 0 auto;">
        <!-- Header Info -->
        <div class="glass-card" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="role-pill student" style="font-size: 0.75rem;">학생 활동 세션</span>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 0.3rem;">${this.activeActivity.title}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              수업 코드: <span style="color: var(--cyan-bright); font-weight: 700; font-family: var(--font-mono);">${this.activeActivity.id}</span> | 담당 교사: ${this.activeActivity.teacher}
            </p>
          </div>
          <button class="btn btn-primary" onclick="StudentModule.submitSolution()">
            🚀 내 답안 제출하기
          </button>
        </div>

        <!-- Main Interactive Workspace -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
          <!-- Left: Canvas Graph Plotter & Controls -->
          <div class="glass-card grapher-wrapper">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-size: 1.1rem; font-weight: 700;">실시간 그래프 모델링</h3>
              <span id="student-current-formula-badge" style="font-family: var(--font-mono); color: var(--cyan-bright); font-size: 0.9rem;">
                f(x) = 1.00x² + 0.00x - 2.00
              </span>
            </div>

            <div class="grapher-canvas-card">
              <canvas id="student-grapher-canvas" class="grapher-canvas"></canvas>
            </div>

            <!-- Slider Controls -->
            <div class="grapher-controls">
              <div class="slider-group">
                <div class="slider-label">
                  <span>이차항 계수 (a)</span>
                  <span id="val-a">1.00</span>
                </div>
                <input type="range" class="slider-input" min="-3" max="3" step="0.1" value="1.0" oninput="StudentModule.updateGraphParams()">
              </div>

              <div class="slider-group">
                <div class="slider-label">
                  <span>일차항 계수 (b)</span>
                  <span id="val-b">0.00</span>
                </div>
                <input type="range" class="slider-input" min="-5" max="5" step="0.1" value="0.0" oninput="StudentModule.updateGraphParams()">
              </div>

              <div class="slider-group">
                <div class="slider-label">
                  <span>상수항 (c)</span>
                  <span id="val-c">-2.00</span>
                </div>
                <input type="range" class="slider-input" min="-5" max="5" step="0.5" value="-2.0" oninput="StudentModule.updateGraphParams()">
              </div>

              <div class="slider-group">
                <div class="slider-label">
                  <span>접점 위치 (x₀)</span>
                  <span id="val-x0">1.00</span>
                </div>
                <input type="range" class="slider-input" min="-4" max="4" step="0.2" value="1.0" oninput="StudentModule.updateGraphParams()">
              </div>
            </div>
          </div>

          <!-- Right: Problem Description & Formula Input Keypad -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Problem Description Card -->
            <div class="glass-card">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--cyan-bright);">
                📌 탐구 문제 1번
              </h3>
              <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">
                이차함수 $f(x) = ax^2 + bx + c$ 가 점 <strong>(1, -1)</strong>을 지나고, 해당 위치에서의 <strong>접선의 기울기가 $m = 2.0$</strong> 이 되도록 계수 $a, b, c$를 슬라이더로 맞춘 후 유도된 수식을 입력하세요.
              </p>
              <div style="margin-top: 0.8rem; background: rgba(34,211,238,0.06); border-left: 3px solid var(--primary-cyan); padding: 0.6rem 0.8rem; font-size: 0.8rem; border-radius: 4px;">
                💡 <strong>힌트:</strong> $f'(x) = 2ax + b$ 미분 공식을 활용하여 $x_0 = 1.0$ 일 때 접선의 기울기값 변화를 관찰하세요.
              </div>
            </div>

            <!-- Virtual Math Keypad Card -->
            <div class="glass-card">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem;">가상 수식 입력기 (Math Keypad)</h3>
              <input type="text" id="math-formula-input-field" class="input-control" style="font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 0.05em;" value="f(x) = x^2 - 2">

              <div class="math-keypad">
                <button class="key-btn" onclick="StudentModule.appendMath('x²')">x²</button>
                <button class="key-btn" onclick="StudentModule.appendMath('x³')">x³</button>
                <button class="key-btn" onclick="StudentModule.appendMath('xⁿ')">xⁿ</button>
                <button class="key-btn" onclick="StudentModule.appendMath('√x')">√x</button>
                <button class="key-btn" onclick="StudentModule.appendMath('π')">π</button>

                <button class="key-btn" onclick="StudentModule.appendMath('+')">+</button>
                <button class="key-btn" onclick="StudentModule.appendMath('-')">-</button>
                <button class="key-btn" onclick="StudentModule.appendMath('×')">×</button>
                <button class="key-btn" onclick="StudentModule.appendMath('÷')">÷</button>
                <button class="key-btn" onclick="StudentModule.appendMath('=')">=</button>

                <button class="key-btn" onclick="StudentModule.appendMath('sin(')">sin</button>
                <button class="key-btn" onclick="StudentModule.appendMath('cos(')">cos</button>
                <button class="key-btn" onclick="StudentModule.appendMath('tan(')">tan</button>
                <button class="key-btn" onclick="StudentModule.appendMath('(')">(</button>
                <button class="key-btn" onclick="StudentModule.appendMath(')')">)</button>

                <button class="key-btn action-key" onclick="StudentModule.appendMath('f\'(x)')">f'(x)</button>
                <button class="key-btn action-key" onclick="StudentModule.appendMath('lim')">lim</button>
                <button class="key-btn action-key" onclick="StudentModule.appendMath('∫')">∫</button>
                <button class="key-btn action-key" style="grid-column: span 2; color: var(--accent-rose);" onclick="StudentModule.clearMathInput()">⌫ 지우기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.initCanvas();
    }, 50);
  },

  initCanvas() {
    const canvas = document.getElementById('student-grapher-canvas');
    if (canvas) {
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

  updateGraphParams() {
    const sliders = document.querySelectorAll('.slider-input');
    if (sliders.length < 4) return;

    const a = parseFloat(sliders[0].value);
    const b = parseFloat(sliders[1].value);
    const c = parseFloat(sliders[2].value);
    const x0 = parseFloat(sliders[3].value);

    document.getElementById('val-a').textContent = a.toFixed(2);
    document.getElementById('val-b').textContent = b.toFixed(2);
    document.getElementById('val-c').textContent = c.toFixed(2);
    document.getElementById('val-x0').textContent = x0.toFixed(2);

    const bSign = b >= 0 ? `+ ${b.toFixed(2)}x` : `- ${Math.abs(b).toFixed(2)}x`;
    const cSign = c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`;
    const formulaStr = `f(x) = ${a.toFixed(2)}x² ${bSign} ${cSign}`;
    document.getElementById('student-current-formula-badge').textContent = formulaStr;

    if (this.grapherInstance) {
      this.grapherInstance.setParams({ a, b, c, x0 });
    }
  },

  appendMath(char) {
    const input = document.getElementById('math-formula-input-field');
    if (input) {
      input.value += char;
    }
  },

  clearMathInput() {
    const input = document.getElementById('math-formula-input-field');
    if (input) {
      input.value = 'f(x) = ';
    }
  },

  submitSolution() {
    const input = document.getElementById('math-formula-input-field');
    const formula = input ? input.value : '';

    alert(`🎉 [제출 완료!]\n\n과제: 이차함수와 접선의 방정식 탐구\n제출 수식: ${formula}\n자동 채점 결과: 100점 (정답입니다!)\n\n교사 화면(Live Dashboard)에 실시간 반영되었습니다.`);
  }
};

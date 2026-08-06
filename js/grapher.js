/**
 * MathLab Interactive Grapher Component & Right Triangle Congruence Explorer (RHA & RHS)
 * Renders mathematical functions, coordinate grids, and Interactive Whole-Triangle Dragging for Congruence Overlay
 */

class MathGrapher {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.clientWidth || 600;
    this.height = this.canvas.clientHeight || 350;
    
    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Plot parameters
    this.params = {
      funcType: options.funcType || 'quadratic', // 'quadratic', 'trig', 'cubic'
      a: options.a !== undefined ? options.a : 1,
      b: options.b !== undefined ? options.b : 0,
      c: options.c !== undefined ? options.c : -2,
      x0: options.x0 !== undefined ? options.x0 : 1, // point for tangent
      showTangent: options.showTangent !== undefined ? options.showTangent : true,
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6
    };

    this.hoverX = null;
    this.hoverY = null;

    this.bindEvents();
    this.render();
  }

  setParams(newParams) {
    this.params = { ...this.params, ...newParams };
    this.render();
  }

  // Coordinate transforms
  toScreenX(x) {
    return ((x - this.params.xMin) / (this.params.xMax - this.params.xMin)) * this.width;
  }

  toScreenY(y) {
    return this.height - ((y - this.params.yMin) / (this.params.yMax - this.params.yMin)) * this.height;
  }

  toMathX(screenX) {
    return this.params.xMin + (screenX / this.width) * (this.params.xMax - this.params.xMin);
  }

  toMathY(screenY) {
    return this.params.yMin + ((this.height - screenY) / this.height) * (this.params.yMax - this.params.yMin);
  }

  // Function evaluation
  evalFunc(x) {
    const { funcType, a, b, c } = this.params;
    if (funcType === 'quadratic') {
      return a * x * x + b * x + c;
    } else if (funcType === 'trig') {
      return a * Math.sin(b * x + c);
    } else if (funcType === 'cubic') {
      return a * Math.pow(x, 3) + b * x + c;
    }
    return x;
  }

  // Derivative calculation f'(x)
  evalDerivative(x) {
    const { funcType, a, b, c } = this.params;
    if (funcType === 'quadratic') {
      return 2 * a * x + b;
    } else if (funcType === 'trig') {
      return a * b * Math.cos(b * x + c);
    } else if (funcType === 'cubic') {
      return 3 * a * x * x + b;
    }
    return 1;
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      this.hoverX = this.toMathX(screenX);
      this.hoverY = this.evalFunc(this.hoverX);
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverX = null;
      this.hoverY = null;
      this.render();
    });
  }

  render() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Render Grid Mesh & Axes
    this.drawGrid();

    // 2. Render Main Function Curve
    this.drawCurve();

    // 3. Render Tangent Line if enabled
    if (this.params.showTangent) {
      this.drawTangentLine();
    }

    // 4. Render Hover point & Coordinates
    if (this.hoverX !== null) {
      this.drawHoverPoint();
    }
  }

  drawGrid() {
    const { ctx, width, height } = this;
    const { xMin, xMax, yMin, yMax } = this.params;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.font = '10px Fira Code, monospace';

    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const sx = this.toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (x !== 0) {
        const sy0 = this.toScreenY(0);
        ctx.fillText(x.toString(), sx - 3, Math.min(Math.max(sy0 + 12, 14), height - 6));
      }
    }

    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const sy = this.toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (y !== 0) {
        const sx0 = this.toScreenX(0);
        ctx.fillText(y.toString(), Math.min(Math.max(sx0 + 6, 6), width - 20), sy + 3);
      }
    }

    // X and Y Main Axes
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.4)';

    // X axis
    const originY = this.toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y axis
    const originX = this.toScreenX(0);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();
  }

  drawCurve() {
    const { ctx, width } = this;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#22d3ee'; // Cyan primary
    ctx.shadowColor = 'rgba(34, 211, 238, 0.6)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    let started = false;

    const step = 2;
    for (let px = 0; px <= width; px += step) {
      const x = this.toMathX(px);
      const y = this.evalFunc(x);
      const py = this.toScreenY(y);

      if (py >= -100 && py <= this.height + 100) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawTangentLine() {
    const { ctx } = this;
    const x0 = this.params.x0;
    const y0 = this.evalFunc(x0);
    const m = this.evalDerivative(x0);

    const xLeft = this.params.xMin;
    const yLeft = m * (xLeft - x0) + y0;

    const xRight = this.params.xMax;
    const yRight = m * (xRight - x0) + y0;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c084fc';
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(this.toScreenX(xLeft), this.toScreenY(yLeft));
    ctx.lineTo(this.toScreenX(xRight), this.toScreenY(yRight));
    ctx.stroke();

    ctx.setLineDash([]);

    const sx0 = this.toScreenX(x0);
    const sy0 = this.toScreenY(y0);

    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(sx0, sy0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 12px Outfit, sans-serif';
    ctx.fillText(`접선의 기울기 f'(${x0.toFixed(1)}) = ${m.toFixed(2)}`, sx0 + 10, sy0 - 10);
  }

  drawHoverPoint() {
    const { ctx } = this;
    const sx = this.toScreenX(this.hoverX);
    const sy = this.toScreenY(this.hoverY);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();

    const label = `(${this.hoverX.toFixed(2)}, ${this.hoverY.toFixed(2)})`;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

    const textWidth = ctx.measureText(label).width;
    ctx.beginPath();
    ctx.roundRect(sx + 8, sy - 25, textWidth + 16, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#67e8f9';
    ctx.font = '500 11px Fira Code, monospace';
    ctx.fillText(label, sx + 16, sy - 10);
  }
}

/**
 * Right Triangle Congruence Explorer (RHA & RHS Congruence)
 * Allows students to drag the WHOLE triangle as a single unit to overlay and prove congruence.
 */
class RightTriangleCongruenceExplorer {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.clientWidth || 700;
    this.height = this.canvas.clientHeight || 400;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Congruence Mode: 'RHA' or 'RHS'
    this.mode = options.mode || 'RHA';

    // Target Fixed Right Triangle (△ABC)
    // C is right angle at (140, 280), Leg a=160, Leg b=120
    this.t1 = {
      c: { x: 140, y: 280 }, // Right Angle C
      a: { x: 140, y: 160 }, // Top vertex A
      b: { x: 300, y: 280 }, // Right vertex B
      legA: 120, // AC = 120
      legB: 160, // BC = 160
      hyp: 200,  // AB = sqrt(120^2 + 160^2) = 200
      angleB: 36.87 // ~36.87 deg
    };

    // Moveable Right Triangle (△DEF) - Students Drag Whole Triangle
    this.t2Initial = { x: 480, y: 220, angle: 0 };
    this.t2 = {
      x: this.t2Initial.x,
      y: this.t2Initial.y,
      angle: 0 // angle in degrees
    };

    // Drag state for whole triangle dragging
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isSnapped = false;
    this.onSnapCallback = options.onSnap || null;

    this.bindEvents();
    this.render();
  }

  setMode(newMode) {
    this.mode = newMode;
    this.resetPosition();
  }

  setRotation(angle) {
    this.t2.angle = parseFloat(angle);
    this.checkSnap();
    this.render();
  }

  resetPosition() {
    this.t2.x = this.t2Initial.x;
    this.t2.y = this.t2Initial.y;
    this.t2.angle = 0;
    this.isSnapped = false;
    this.render();
  }

  // Auto-animate triangle drag & overlay onto T1
  animateOverlay() {
    const targetX = this.t1.c.x + 80; // center offset
    const targetY = this.t1.c.y - 60;
    const targetAngle = 0;

    let progress = 0;
    const startX = this.t2.x;
    const startY = this.t2.y;
    const startAngle = this.t2.angle;

    const anim = () => {
      progress += 0.05;
      if (progress >= 1) {
        this.t2.x = targetX;
        this.t2.y = targetY;
        this.t2.angle = targetAngle;
        this.isSnapped = true;
        this.render();
        if (this.onSnapCallback) this.onSnapCallback(this.mode);
        return;
      }

      this.t2.x = startX + (targetX - startX) * progress;
      this.t2.y = startY + (targetY - startY) * progress;
      this.t2.angle = startAngle + (targetAngle - startAngle) * progress;
      this.render();
      requestAnimationFrame(anim);
    };
    anim();
  }

  // Get current vertices of Moveable Triangle 2 (△DEF)
  getT2Vertices() {
    const rad = (this.t2.angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Relative local coordinates around triangle centroid (C_local = (-53, +40))
    // F (Right Angle), D (Top), E (Right)
    const localF = { x: -53, y: 40 };
    const localD = { x: -53, y: -80 };
    const localE = { x: 107, y: 40 };

    const rotatePoint = (pt) => ({
      x: this.t2.x + (pt.x * cos - pt.y * sin),
      y: this.t2.y + (pt.x * sin + pt.y * cos)
    });

    return {
      f: rotatePoint(localF), // Right angle
      d: rotatePoint(localD), // Top
      e: rotatePoint(localE)  // Right
    };
  }

  // Check if mouse point is inside Triangle 2 for whole-triangle dragging
  isPointInTriangle(px, py) {
    const { f, d, e } = this.getT2Vertices();
    // Barycentric coordinate system check
    const area = 0.5 * (-d.y * e.x + f.y * (-d.x + e.x) + f.x * (d.y - e.y) + d.x * e.y);
    const s = 1 / (2 * area) * (f.y * e.x - f.x * e.y + (e.y - f.y) * px + (f.x - e.x) * py);
    const t = 1 / (2 * area) * (f.x * d.y - f.y * d.x + (f.y - d.y) * px + (d.x - f.x) * py);
    return s > -0.1 && t > -0.1 && (1 - s - t) > -0.1;
  }

  checkSnap() {
    const targetX = this.t1.c.x + 80;
    const targetY = this.t1.c.y - 60;

    const dist = Math.hypot(this.t2.x - targetX, this.t2.y - targetY);
    const angleDiff = Math.abs((this.t2.angle % 360));

    if (dist < 35 && (angleDiff < 15 || angleDiff > 345)) {
      this.t2.x = targetX;
      this.t2.y = targetY;
      this.t2.angle = 0;
      this.isSnapped = true;
      if (this.onSnapCallback) this.onSnapCallback(this.mode);
    } else {
      this.isSnapped = false;
    }
  }

  bindEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrag = (e) => {
      const pos = getPos(e);
      if (this.isPointInTriangle(pos.x, pos.y)) {
        this.isDragging = true;
        this.dragOffset.x = pos.x - this.t2.x;
        this.dragOffset.y = pos.y - this.t2.y;
        this.canvas.style.cursor = 'grabbing';
      }
    };

    const moveDrag = (e) => {
      const pos = getPos(e);
      if (this.isDragging) {
        this.t2.x = pos.x - this.dragOffset.x;
        this.t2.y = pos.y - this.dragOffset.y;
        this.checkSnap();
        this.render();
      } else {
        if (this.isPointInTriangle(pos.x, pos.y)) {
          this.canvas.style.cursor = 'grab';
        } else {
          this.canvas.style.cursor = 'default';
        }
      }
    };

    const endDrag = () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'default';
    };

    this.canvas.addEventListener('mousedown', startDrag);
    this.canvas.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    this.canvas.addEventListener('touchstart', (e) => { startDrag(e); e.preventDefault(); });
    this.canvas.addEventListener('touchmove', (e) => { moveDrag(e); e.preventDefault(); });
    window.addEventListener('touchend', endDrag);
  }

  render() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Grid Background
    this.drawBackground();

    // 2. Draw Fixed Target Triangle 1 (△ABC)
    this.drawTriangle1();

    // 3. Draw Moveable Triangle 2 (△DEF)
    this.drawTriangle2();

    // 4. Render Congruence Proof Badge & Feedback
    this.drawProofBadge();
  }

  drawBackground() {
    const { ctx, width, height } = this;
    ctx.fillStyle = 'rgba(9, 13, 22, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Light grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  }

  drawTriangle1() {
    const { ctx } = this;
    const { a, b, c } = this.t1;

    // Fill & Outline
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Angle Symbol at C
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x, c.y - 18, 18, 18);

    // Vertex Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px Pretendard, sans-serif';
    ctx.fillText('C (90°)', c.x - 45, c.y + 15);
    ctx.fillText('A', a.x - 20, a.y - 10);
    ctx.fillText('B', b.x + 10, b.y + 15);

    // Highlight Conditions based on RHA vs RHS
    // Hypotenuse AB (H)
    ctx.strokeStyle = '#f59e0b'; // Amber Gold for Hypotenuse H
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = '700 12px Pretendard, sans-serif';
    ctx.fillText('빗변 (H = 10cm)', (a.x + b.x) / 2 + 10, (a.y + b.y) / 2 - 10);

    if (this.mode === 'RHA') {
      // Angle B (A)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 30, Math.PI, Math.PI * 1.2, false);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.font = '700 13px Pretendard, sans-serif';
      ctx.fillText('∠B (A = 37°)', b.x - 65, b.y - 10);
    } else {
      // RHS Mode: Leg AC (S)
      ctx.strokeStyle = '#10b981'; // Emerald for Side S
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(a.x, a.y);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '700 12px Pretendard, sans-serif';
      ctx.fillText('변 AC (S = 6cm)', c.x - 90, (c.y + a.y) / 2);
    }

    // Title label for Fixed Triangle
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '700 13px Pretendard, sans-serif';
    ctx.fillText('기준 직각삼각형 △ABC (고정)', c.x - 20, c.y + 40);
  }

  drawTriangle2() {
    const { ctx } = this;
    const { f, d, e } = this.getT2Vertices();

    ctx.save();

    // Fill & Glow depending on snap state
    if (this.isSnapped) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 20;
    } else {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
      ctx.shadowBlur = 10;
    }

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(d.x, d.y);
    ctx.lineTo(e.x, e.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Right angle mark at F
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(f.x, f.y - 18, 18, 18);

    // Vertex Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px Pretendard, sans-serif';
    ctx.fillText('F (90°)', f.x - 45, f.y + 15);
    ctx.fillText('D', d.x - 20, d.y - 10);
    ctx.fillText('E', e.x + 10, e.y + 15);

    // Highlight Hypotenuse DE (H)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();

    if (this.mode === 'RHA') {
      ctx.fillStyle = '#10b981';
      ctx.font = '700 13px Pretendard, sans-serif';
      ctx.fillText('∠E (A = 37°)', e.x - 65, e.y - 10);
    } else {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '700 12px Pretendard, sans-serif';
      ctx.fillText('변 DF (S = 6cm)', f.x - 90, (f.y + d.y) / 2);
    }

    // Drag Handle Helper Banner
    if (!this.isSnapped) {
      ctx.fillStyle = '#67e8f9';
      ctx.font = '600 12px Pretendard, sans-serif';
      ctx.fillText('🖱️ 삼각형 통째로 드래그하여 겹치기', this.t2.x - 90, this.t2.y + 70);
    }

    ctx.restore();
  }

  drawProofBadge() {
    const { ctx, width } = this;

    if (this.isSnapped) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(width / 2 - 210, 15, 420, 50, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#064e3b';
      ctx.font = '800 16px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🎉 [${this.mode} 합동 완료!] △ABC ≡ △DEF (완전 겹침)`, width / 2, 46);
      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(15, 15, 340, 36, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = '700 13px Pretendard, sans-serif';
      ctx.fillText(`💡 ${this.mode} 합동 실습: 이동 삼각형을 드래그하여 겹쳐보세요`, 25, 38);
    }
  }
}

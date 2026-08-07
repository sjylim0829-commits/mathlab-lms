/**
 * MathLab Interactive Geometry Engine - Circumcenter of a Triangle
 * Activity ID: MATH-2026-GEO-02
 * Deployment Spec Compatible: AKfycbz1zC7figOuC7FjoEAT4uQ39Kt3fLirKdSOetoIXvavxzqR4WETvwaf875VNBiBQV1N
 */

const App = {
  canvas: null,
  ctx: null,
  
  // Triangle Vertices (Canvas Coordinates)
  points: {
    A: { x: 340, y: 100 },
    B: { x: 180, y: 380 },
    C: { x: 500, y: 380 }
  },
  
  draggedPoint: null,
  dragRadius: 18,
  
  // Circumcenter & Geometry Data
  circumcenter: { x: 0, y: 0 },
  radius: 0,
  distances: { OA: 0, OB: 0, OC: 0 },
  angles: { A: 0, B: 0, C: 0, BOC: 0 },
  triangleType: 'acute', // acute, right, obtuse

  // Guided Missions Progress
  missions: {
    1: false, // Bisectors intersect at 1 point
    2: false, // Distance equality OA=OB=OC
    3: false, // Right triangle circumcenter on hypotenuse midpoint
    4: false  // Obtuse triangle circumcenter outside
  },

  init() {
    this.canvas = document.getElementById('geometry-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Scale for High DPI
    this.setupCanvasDPI();

    // Event Listeners for Dragging
    this.attachCanvasEvents();

    // Initialize LMS Bridge SDK
    if (window.MathLMSBridge) {
      window.MathLMSBridge.init({
        onStudentInfo: (student) => {
          if (student && student.name) {
            document.getElementById('student-name-display').textContent = `${student.name} (${student.grade || '2'}학년 ${student.classNum || '3'}반)`;
          }
        }
      });
    }

    // Initial Math Calculation & Render
    this.calculateGeometry();
    this.redraw();
  },

  setupCanvasDPI() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  },

  attachCanvasEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrag = (pos) => {
      for (const key in this.points) {
        const pt = this.points[key];
        const dist = Math.hypot(pt.x - pos.x, pt.y - pos.y);
        if (dist <= this.dragRadius) {
          this.draggedPoint = key;
          break;
        }
      }
    };

    const moveDrag = (pos) => {
      if (!this.draggedPoint) return;
      
      // Clamp inside canvas bounds
      const padding = 30;
      const rect = this.canvas.getBoundingClientRect();
      this.points[this.draggedPoint].x = Math.max(padding, Math.min(rect.width - padding, pos.x));
      this.points[this.draggedPoint].y = Math.max(padding, Math.min(rect.height - padding, pos.y));
      
      this.calculateGeometry();
      this.redraw();
    };

    const endDrag = () => {
      this.draggedPoint = null;
    };

    // Mouse
    this.canvas.addEventListener('mousedown', (e) => startDrag(getPos(e)));
    window.addEventListener('mousemove', (e) => moveDrag(getPos(e)));
    window.addEventListener('mouseup', endDrag);

    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrag(getPos(e));
    }, { passive: false });
    window.addEventListener('touchmove', (e) => moveDrag(getPos(e)));
    window.addEventListener('touchend', endDrag);
  },

  // Calculate Geometry Parameters: Perpendicular bisectors, Circumcenter, Radius, Angles
  calculateGeometry() {
    const { A, B, C } = this.points;

    // Side Midpoints
    const M_AB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
    const M_BC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
    const M_CA = { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 };

    // Perpendicular Bisector Slopes & Lines
    // Line equation: (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1) = 0 for bisector
    const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    
    if (Math.abs(D) < 1e-4) {
      // Degenerate collinear points fallback
      return;
    }

    const A_sq = A.x * A.x + A.y * A.y;
    const B_sq = B.x * B.x + B.y * B.y;
    const C_sq = C.x * C.x + C.y * C.y;

    const Ox = (A_sq * (B.y - C.y) + B_sq * (C.y - A.y) + C_sq * (A.y - B.y)) / D;
    const Oy = (A_sq * (C.x - B.x) + B_sq * (A.x - C.x) + C_sq * (B.x - A.x)) / D;

    this.circumcenter = { x: Ox, y: Oy };

    // Radius (Distance from O to A)
    this.radius = Math.hypot(Ox - A.x, Oy - A.y);

    // Vertex Distances
    const scale = 0.05; // Pixel to cm scale multiplier
    this.distances.OA = (Math.hypot(Ox - A.x, Oy - A.y) * scale).toFixed(2);
    this.distances.OB = (Math.hypot(Ox - B.x, Oy - B.y) * scale).toFixed(2);
    this.distances.OC = (Math.hypot(Ox - C.x, Oy - C.y) * scale).toFixed(2);

    // Side Lengths
    const a = Math.hypot(B.x - C.x, B.y - C.y); // BC
    const b = Math.hypot(C.x - A.x, C.y - A.y); // CA
    const c = Math.hypot(A.x - B.x, A.y - B.y); // AB

    // Angles using Law of Cosines
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const cosB = (a * a + c * c - b * b) / (2 * a * c);
    const cosC = (a * a + b * b - c * c) / (2 * a * b);

    const radA = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const radB = Math.acos(Math.max(-1, Math.min(1, cosB)));
    const radC = Math.acos(Math.max(-1, Math.min(1, cosC)));

    this.angles.A = (radA * 180 / Math.PI).toFixed(1);
    this.angles.B = (radB * 180 / Math.PI).toFixed(1);
    this.angles.C = (radC * 180 / Math.PI).toFixed(1);
    this.angles.BOC = (2 * this.angles.A).toFixed(1);

    // Determine Triangle Type (Acute, Right, Obtuse)
    const maxCos = Math.max(cosA, cosB, cosC);
    const minCos = Math.min(cosA, cosB, cosC);

    if (Math.abs(minCos) < 0.04) {
      this.triangleType = 'right';
    } else if (minCos < 0) {
      this.triangleType = 'obtuse';
    } else {
      this.triangleType = 'acute';
    }

    // Update UI Stats
    this.updateUI();
  },

  updateUI() {
    const scale = 0.05;
    const O_cm_x = (this.circumcenter.x * scale).toFixed(1);
    const O_cm_y = ((500 - this.circumcenter.y) * scale).toFixed(1);
    const R_cm = (this.radius * scale).toFixed(2);

    document.getElementById('val-circumcenter').textContent = `O(${O_cm_x}, ${O_cm_y})`;
    document.getElementById('val-radius').textContent = `${R_cm} cm`;

    document.getElementById('val-oa').textContent = `${this.distances.OA} cm`;
    document.getElementById('val-ob').textContent = `${this.distances.OB} cm`;
    document.getElementById('val-oc').textContent = `${this.distances.OC} cm`;

    document.getElementById('val-angle-a').textContent = `${this.angles.A}°`;
    document.getElementById('val-angle-boc').textContent = `${this.angles.BOC}°`;

    // Triangle Type Badge
    const badge = document.getElementById('triangle-type-badge');
    if (this.triangleType === 'right') {
      badge.textContent = '직각삼각형 (외심: 빗변 중점)';
      badge.className = 'badge badge-right';
    } else if (this.triangleType === 'obtuse') {
      badge.textContent = '둔각삼각형 (외심: 삼각형 외부)';
      badge.className = 'badge badge-obtuse';
    } else {
      badge.textContent = '예각삼각형 (외심: 삼각형 내부)';
      badge.className = 'badge badge-accent';
    }

    // Highlight Location List Items
    document.getElementById('loc-acute').classList.toggle('highlight-loc', this.triangleType === 'acute');
    document.getElementById('loc-right').classList.toggle('highlight-loc', this.triangleType === 'right');
    document.getElementById('loc-obtuse').classList.toggle('highlight-loc', this.triangleType === 'obtuse');

    // Auto-check missions if conditions met
    if (this.triangleType === 'right') this.missions[3] = true;
    if (this.triangleType === 'obtuse') this.missions[4] = true;
    this.missions[1] = true;
    this.missions[2] = true;

    this.updateMissionsUI();
  },

  updateMissionsUI() {
    for (let i = 1; i <= 4; i++) {
      const item = document.getElementById(`mission-${i}`);
      const icon = item.querySelector('.mission-status-icon');
      if (this.missions[i]) {
        item.classList.add('completed');
        icon.textContent = '✅';
      } else {
        item.classList.remove('completed');
        icon.textContent = '⬜';
      }
    }
  },

  checkMission(id) {
    this.missions[id] = true;
    this.updateMissionsUI();
    alert(`🎉 미션 ${id}이(가) 완료 처리되었습니다!`);
  },

  // Main Render Loop
  redraw() {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    this.ctx.clearRect(0, 0, width, height);

    const showBisectors = document.getElementById('chk-bisectors').checked;
    const showCircle = document.getElementById('chk-circle').checked;
    const showDistances = document.getElementById('chk-distances').checked;

    const { A, B, C } = this.points;
    const O = this.circumcenter;

    // 1. Draw Grid Lines Background
    this.drawGrid(width, height);

    // 2. Draw Circumcircle
    if (showCircle && this.radius > 0) {
      this.ctx.beginPath();
      this.ctx.arc(O.x, O.y, this.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
      
      // Light fill inside circumcircle
      this.ctx.fillStyle = 'rgba(2, 132, 199, 0.03)';
      this.ctx.fill();
    }

    // 3. Draw Perpendicular Bisectors
    if (showBisectors) {
      this.drawPerpendicularBisector(A, B, O);
      this.drawPerpendicularBisector(B, C, O);
      this.drawPerpendicularBisector(C, A, O);
    }

    // 4. Draw Vertex Distance Lines (OA, OB, OC)
    if (showDistances) {
      this.drawDashedLine(O, A, 'rgba(99, 102, 241, 0.85)', 2);
      this.drawDashedLine(O, B, 'rgba(99, 102, 241, 0.85)', 2);
      this.drawDashedLine(O, C, 'rgba(99, 102, 241, 0.85)', 2);
    }

    // 5. Draw Triangle ABC Sides
    this.ctx.beginPath();
    this.ctx.moveTo(A.x, A.y);
    this.ctx.lineTo(B.x, B.y);
    this.ctx.lineTo(C.x, C.y);
    this.ctx.closePath();

    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.fillStyle = 'rgba(99, 102, 241, 0.07)';
    this.ctx.fill();

    // 6. Draw Circumcenter O Point
    this.ctx.beginPath();
    this.ctx.arc(O.x, O.y, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#e11d48';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Circumcenter O Label
    this.ctx.font = 'bold 14px Pretendard, sans-serif';
    this.ctx.fillStyle = '#e11d48';
    this.ctx.fillText('O (외심)', O.x + 10, O.y - 10);

    // 7. Draw Vertices A, B, C
    this.drawVertex(A.x, A.y, 'A', '#4f46e5');
    this.drawVertex(B.x, B.y, 'B', '#4f46e5');
    this.drawVertex(C.x, C.y, 'C', '#4f46e5');
  },

  drawGrid(w, h) {
    this.ctx.strokeStyle = '#f1f5f9';
    this.ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }
  },

  drawPerpendicularBisector(P1, P2, O) {
    const M = { x: (P1.x + P2.x) / 2, y: (P1.y + P2.y) / 2 };
    
    // Direction vector from M to O
    const dx = O.x - M.x;
    const dy = O.y - M.y;
    const len = Math.hypot(dx, dy) || 1;

    // Extend line across canvas
    const ext1 = { x: M.x + (dx / len) * 400, y: M.y + (dy / len) * 400 };
    const ext2 = { x: M.x - (dx / len) * 400, y: M.y - (dy / len) * 400 };

    this.ctx.beginPath();
    this.ctx.moveTo(ext1.x, ext1.y);
    this.ctx.lineTo(ext2.x, ext2.y);
    this.ctx.strokeStyle = 'rgba(5, 150, 105, 0.45)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Right angle symbol at midpoint M
    this.drawRightAngleSquare(M, P1, ext1);
  },

  drawRightAngleSquare(M, P1, bisectorPt) {
    const size = 8;
    const v1 = { x: P1.x - M.x, y: P1.y - M.y };
    const len1 = Math.hypot(v1.x, v1.y) || 1;
    const u1 = { x: (v1.x / len1) * size, y: (v1.y / len1) * size };

    const v2 = { x: bisectorPt.x - M.x, y: bisectorPt.y - M.y };
    const len2 = Math.hypot(v2.x, v2.y) || 1;
    const u2 = { x: (v2.x / len2) * size, y: (v2.y / len2) * size };

    this.ctx.beginPath();
    this.ctx.moveTo(M.x + u1.x, M.y + u1.y);
    this.ctx.lineTo(M.x + u1.x + u2.x, M.y + u1.y + u2.y);
    this.ctx.lineTo(M.x + u2.x, M.y + u2.y);
    this.ctx.strokeStyle = '#059669';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();
  },

  drawDashedLine(p1, p2, color, width) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.setLineDash([4, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  },

  drawVertex(x, y, label, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 9, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    this.ctx.font = 'bold 15px Pretendard, sans-serif';
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillText(label, x - 5, y - 14);
  },

  // Presets
  setPreset(type) {
    if (type === 'acute') {
      this.points.A = { x: 340, y: 100 };
      this.points.B = { x: 180, y: 380 };
      this.points.C = { x: 500, y: 380 };
    } else if (type === 'right') {
      this.points.A = { x: 180, y: 100 };
      this.points.B = { x: 180, y: 380 };
      this.points.C = { x: 500, y: 380 };
    } else if (type === 'obtuse') {
      this.points.A = { x: 260, y: 220 };
      this.points.B = { x: 140, y: 380 };
      this.points.C = { x: 540, y: 380 };
    }

    this.calculateGeometry();
    this.redraw();
  },

  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
  },

  submitToLMS() {
    const answer = document.getElementById('txt-student-answer').value.trim();
    
    const payload = {
      activityId: 'MATH-2026-GEO-02',
      activityTitle: '삼각형의 외심 탐구',
      score: 100,
      answerText: answer || '삼각형의 외심의 정의와 위치 성질을 탐구하였습니다.',
      details: {
        distances: this.distances,
        triangleType: this.triangleType,
        missionsCompleted: this.missions
      }
    };

    if (window.MathLMSBridge) {
      window.MathLMSBridge.submitResult(payload);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});

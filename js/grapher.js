/**
 * MathLab Interactive Grapher Component
 * Renders mathematical functions, coordinate grids, and tangent lines on HTML5 Canvas
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

    const step = 2; // px step
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
    ctx.shadowBlur = 0; // reset shadow
  }

  drawTangentLine() {
    const { ctx } = this;
    const x0 = this.params.x0;
    const y0 = this.evalFunc(x0);
    const m = this.evalDerivative(x0); // slope

    // Tangent equation: y - y0 = m(x - x0) => y = m(x - x0) + y0
    const xLeft = this.params.xMin;
    const yLeft = m * (xLeft - x0) + y0;

    const xRight = this.params.xMax;
    const yRight = m * (xRight - x0) + y0;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c084fc'; // Purple accent for tangent line
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(this.toScreenX(xLeft), this.toScreenY(yLeft));
    ctx.lineTo(this.toScreenX(xRight), this.toScreenY(yRight));
    ctx.stroke();

    ctx.setLineDash([]); // Reset dash

    // Draw point of tangency (x0, y0)
    const sx0 = this.toScreenX(x0);
    const sy0 = this.toScreenY(y0);

    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(sx0, sy0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label slope m
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 12px Outfit, sans-serif';
    ctx.fillText(`접선의 기울기 f'(${x0.toFixed(1)}) = ${m.toFixed(2)}`, sx0 + 10, sy0 - 10);
  }

  drawHoverPoint() {
    const { ctx } = this;
    const sx = this.toScreenX(this.hoverX);
    const sy = this.toScreenY(this.hoverY);

    ctx.fillStyle = '#fbbf24'; // Amber
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Tooltip
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

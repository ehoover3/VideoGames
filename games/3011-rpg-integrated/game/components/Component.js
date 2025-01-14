// game/components/Component.js
export class Component {
  constructor(canvas, ctx, stateManager) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.stateManager = stateManager;
    this.isActive = true;
  }

  getScaledDimensions() {
    const scaleX = this.canvas.width / GAME_CONFIG.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / GAME_CONFIG.BASE_RESOLUTION.height;
    return { scaleX, scaleY, scale: Math.min(scaleX, scaleY) };
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  update() {
    if (!this.isActive) return;
  }

  draw() {
    if (!this.isActive) return;
  }

  cleanup() {
    // Override in child classes if needed
  }
}

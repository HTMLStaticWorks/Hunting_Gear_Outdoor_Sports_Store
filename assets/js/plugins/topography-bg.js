/**
 * Vanguard Outpost — 3D Topographic Contour & Particle Background
 * Ambient procedural contour map lines with interactive mouse-depth displacement
 * and drifting embers/dust. Lightweight, high-performance, mobile-optimized.
 */

(function () {
  'use strict';

  class TopographyBackground {
    constructor(canvasSelector = '.topography-canvas') {
      this.canvases = document.querySelectorAll(canvasSelector);
      if (!this.canvases.length) return;

      this.instances = [];
      this.canvases.forEach(c => this.initCanvas(c));
    }

    initCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      let width = 0;
      let height = 0;
      let animId = null;
      let isVisible = true;
      let time = 0;

      // Mouse influence
      let mouseX = 0;
      let mouseY = 0;
      let targetMouseX = 0;
      let targetMouseY = 0;

      // Ambient particles (embers / dust)
      const particles = [];
      const particleCount = window.innerWidth < 768 ? 20 : 45;

      const resize = () => {
        const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width || window.innerWidth;
        height = rect.height || 600;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
      };

      // Populate particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * (window.innerWidth || 1000),
          y: Math.random() * (height || 600),
          size: Math.random() * 2.2 + 0.8,
          speedY: Math.random() * -0.6 - 0.2,
          speedX: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.2,
          hue: Math.random() > 0.6 ? 24 : 140 // Burnt Orange or Deep Forest Pine
        });
      }

      window.addEventListener('resize', () => resize(), { passive: true });
      resize();

      window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          targetMouseX = (e.clientX - rect.left) / width - 0.5;
          targetMouseY = (e.clientY - rect.top) / height - 0.5;
        }
      }, { passive: true });

      // Intersection Observer for battery/perf optimization
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(draw);
          } else if (!isVisible && animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      }, { threshold: 0.05 });

      observer.observe(canvas);

      const draw = () => {
        if (!isVisible) return;
        time += 0.007;

        // Smooth mouse lag
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        ctx.clearRect(0, 0, width, height);

        // Check if dark or light mode
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const lineBaseColor = isLight ? 'rgba(74, 88, 57, ' : 'rgba(224, 93, 38, ';
        const lineSecondaryColor = isLight ? 'rgba(23, 42, 30, ' : 'rgba(74, 88, 57, ';

        // 1. Draw Topographic Contours (elevation waves)
        const lineCount = window.innerWidth < 768 ? 9 : 14;
        const stepY = (height + 160) / lineCount;

        for (let i = 0; i < lineCount; i++) {
          const baseY = i * stepY - 60;
          ctx.beginPath();

          const lineAlpha = (0.05 + (i / lineCount) * 0.12).toFixed(3);
          ctx.strokeStyle = i % 3 === 0 ? `${lineBaseColor}${lineAlpha})` : `${lineSecondaryColor}${lineAlpha})`;
          ctx.lineWidth = i % 4 === 0 ? 1.8 : 1.0;

          const segments = window.innerWidth < 768 ? 32 : 55;
          const stepX = width / segments;

          for (let s = 0; s <= segments; s++) {
            const px = s * stepX;
            // Wave harmonics with mouse influence
            const freq1 = Math.sin(s * 0.18 + time + i * 0.4) * 22;
            const freq2 = Math.cos(s * 0.08 - time * 0.7 + i * 0.2) * 36;
            const mouseDisplacement = Math.sin((px / width + mouseX) * Math.PI) * (mouseY * 40);

            const py = baseY + freq1 + freq2 + mouseDisplacement;

            if (s === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }

          ctx.stroke();

          // Add occasional elevation coordinate marks
          if (i % 3 === 0 && width > 768) {
            ctx.fillStyle = isLight ? 'rgba(74, 88, 57, 0.45)' : 'rgba(224, 93, 38, 0.45)';
            ctx.font = '10px "JetBrains Mono", monospace';
            const elevationVal = (1420 + i * 185).toString();
            ctx.fillText(`EL. ${elevationVal}M`, width * 0.78, baseY + 18);
          }
        }

        // 2. Draw ambient drifting particles (embers / dust)
        for (let p of particles) {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          if (p.hue === 24) {
            ctx.fillStyle = `rgba(224, 93, 38, ${p.alpha * 0.65})`;
          } else {
            ctx.fillStyle = isLight ? `rgba(74, 88, 57, ${p.alpha * 0.4})` : `rgba(140, 175, 120, ${p.alpha * 0.4})`;
          }
          ctx.fill();
        }

        animId = requestAnimationFrame(draw);
      };

      animId = requestAnimationFrame(draw);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TopographyBackground());
  } else {
    new TopographyBackground();
  }
})();

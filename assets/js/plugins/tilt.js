/**
 * Vanguard Outpost — 3D Tilt Card Engine
 * Zero-dependency physics-based 3D tilt with specular glare, depth layering,
 * and responsive center alignment preservation.
 */

(function () {
  'use strict';

  class TiltCardEffect {
    constructor() {
      this.cards = [];
      this.init();
    }

    init() {
      const cardElements = document.querySelectorAll('.tilt-card');
      cardElements.forEach(card => this.attach(card));

      // Re-scan if DOM dynamically updates
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.classList && node.classList.contains('tilt-card')) {
                this.attach(node);
              }
              const nested = node.querySelectorAll ? node.querySelectorAll('.tilt-card') : [];
              nested.forEach(n => this.attach(n));
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    attach(card) {
      if (card.__tiltAttached) return;
      card.__tiltAttached = true;

      // Ensure center alignment styles are maintained
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '1200px';

      // Create dynamic glare element if not present
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      let bounds = null;
      let isHovered = false;
      let targetRotateX = 0;
      let targetRotateY = 0;
      let currentRotateX = 0;
      let currentRotateY = 0;
      let animId = null;

      const updateBounds = () => {
        bounds = card.getBoundingClientRect();
      };

      const render = () => {
        if (!isHovered) {
          // Smooth return to zero
          currentRotateX += (0 - currentRotateX) * 0.12;
          currentRotateY += (0 - currentRotateY) * 0.12;

          if (Math.abs(currentRotateX) < 0.05 && Math.abs(currentRotateY) < 0.05) {
            currentRotateX = 0;
            currentRotateY = 0;
            card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            glare.style.opacity = '0';
            cancelAnimationFrame(animId);
            animId = null;
            return;
          }
        } else {
          // Smooth interpolation towards mouse target
          currentRotateX += (targetRotateX - currentRotateX) * 0.15;
          currentRotateY += (targetRotateY - currentRotateY) * 0.15;
        }

        card.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`;
        animId = requestAnimationFrame(render);
      };

      const onMouseEnter = () => {
        isHovered = true;
        updateBounds();
        card.classList.add('is-tilting');
        if (!animId) animId = requestAnimationFrame(render);
      };

      const onMouseMove = (e) => {
        if (!bounds) updateBounds();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const percentX = (mouseX / bounds.width) * 2 - 1; // -1 to 1
        const percentY = (mouseY / bounds.height) * 2 - 1; // -1 to 1

        const maxTilt = parseFloat(card.getAttribute('data-max-tilt') || '14');
        targetRotateX = -percentY * maxTilt;
        targetRotateY = percentX * maxTilt;

        // Glare calculation
        const glareX = (mouseX / bounds.width) * 100;
        const glareY = (mouseY / bounds.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(224, 93, 38, 0.22) 0%, rgba(255, 255, 255, 0.08) 25%, transparent 65%)`;
        glare.style.opacity = '0.9';

        if (!animId) animId = requestAnimationFrame(render);
      };

      const onMouseLeave = () => {
        isHovered = false;
        targetRotateX = 0;
        targetRotateY = 0;
        card.classList.remove('is-tilting');
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave);

      // Mobile Touch Handling (Subtle touch-responsive tilt)
      card.addEventListener('touchstart', () => {
        updateBounds();
        card.classList.add('is-tilting');
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        if (!bounds || !e.touches[0]) return;
        const touch = e.touches[0];
        const touchX = touch.clientX - bounds.left;
        const touchY = touch.clientY - bounds.top;
        if (touchX < 0 || touchX > bounds.width || touchY < 0 || touchY > bounds.height) return;

        const percentX = (touchX / bounds.width) * 2 - 1;
        const percentY = (touchY / bounds.height) * 2 - 1;
        targetRotateX = -percentY * 8;
        targetRotateY = percentX * 8;
        if (!animId) animId = requestAnimationFrame(render);
      }, { passive: true });

      card.addEventListener('touchend', () => {
        onMouseLeave();
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TiltCardEffect());
  } else {
    new TiltCardEffect();
  }
})();

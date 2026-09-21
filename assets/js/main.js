/**
 * Vanguard Outpost & Expedition Co. — Main Application Engine
 * Pure ES6+, Zero console logs in production, Accessible, Modular
 */

(function () {
  'use strict';

  // State Management
  const AppState = {
    theme: localStorage.getItem('vanguard_theme') || 'dark',
    dir: localStorage.getItem('vanguard_dir') || 'ltr',
    products: []
  };

  /* ==========================================================================
     1. THEME & RTL CONTROLLERS
     ========================================================================== */
  function initTheming() {
    const htmlEl = document.documentElement;
    
    // Apply saved or system theme
    if (AppState.theme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
    } else {
      htmlEl.setAttribute('data-theme', 'dark');
    }

    // Apply RTL
    htmlEl.setAttribute('dir', AppState.dir);

    // Theme toggle button click handlers
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('vanguard_theme', next);
        AppState.theme = next;
        updateThemeIcons(next);
      });
    });

    // RTL toggle button click handlers
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('dir') || 'ltr';
        const next = current === 'ltr' ? 'rtl' : 'ltr';
        htmlEl.setAttribute('dir', next);
        localStorage.setItem('vanguard_dir', next);
        AppState.dir = next;
        updateRtlIcons(next);
      });
    });

    updateThemeIcons(AppState.theme);
    updateRtlIcons(AppState.dir);
  }

  function updateThemeIcons(theme) {
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    const moonSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: block;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: block;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    themeBtns.forEach(btn => {
      btn.innerHTML = theme === 'light' ? moonSvg : sunSvg;
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
  }

  function updateRtlIcons(dir) {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR Layout' : 'Switch to RTL Layout');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR Layout' : 'Switch to RTL Layout');
    });
  }

  /* ==========================================================================
     2. NAVIGATION & MOBILE DRAWER
     ========================================================================== */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.mobile-drawer-backdrop');

    // Header scroll background transition
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }, { passive: true });
    }

    // Mobile menu toggle
    if (toggle && drawer) {
      const openMenu = () => {
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        drawer.classList.add('is-open');
        if (backdrop) backdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      };

      const closeMenu = () => {
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        if (backdrop) backdrop.classList.remove('is-active');
        document.body.style.overflow = '';
      };

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = drawer.classList.contains('is-open');
        if (isOpen) closeMenu();
        else openMenu();
      });

      if (backdrop) {
        backdrop.addEventListener('click', closeMenu);
      }

      // Close menu when clicking drawer close button
      const drawerCloseBtns = drawer.querySelectorAll('.mobile-drawer-close');
      drawerCloseBtns.forEach(btn => btn.addEventListener('click', closeMenu));

      // Close menu on pressing Escape key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
          closeMenu();
        }
      });

      // Close menu on navigation link click
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }

    // Highlight current active link
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href && (currentPath.endsWith(href) || (currentPath === '/' && href.includes('index.html')))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ==========================================================================
     3. BACK TO TOP CONTROLLER
     ========================================================================== */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     4. FAQ ACCORDION ENGINE
     ========================================================================== */
  function initAccordion() {
    const accordions = document.querySelectorAll('.faq-accordion');
    accordions.forEach(acc => {
      const items = acc.querySelectorAll('.accordion-item');
      items.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const content = item.querySelector('.accordion-content');
        if (!trigger || !content) return;

        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          // Close siblings
          items.forEach(sib => {
            if (sib !== item) {
              sib.classList.remove('is-open');
              const sibTrigger = sib.querySelector('.accordion-trigger');
              const sibContent = sib.querySelector('.accordion-content');
              if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
              if (sibContent) sibContent.style.maxHeight = null;
            }
          });

          if (isOpen) {
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = null;
          } else {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. PRODUCT CATALOG FILTER, SEARCH & QUICK LOOK MODAL
     ========================================================================== */
  function initCatalog() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;

    const pills = document.querySelectorAll('.cat-pill');
    const searchInput = document.getElementById('catalog-search');
    const sortSelect = document.getElementById('catalog-sort');
    const cards = Array.from(catalogGrid.querySelectorAll('.product-card-item'));

    let currentCategory = 'all';
    let currentSearch = '';
    let currentSort = 'default';

    const filterAndSortCards = () => {
      let visibleCards = cards.filter(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardTitle = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
        const cardDesc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();
        const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();

        const matchesCat = currentCategory === 'all' || cardCategory === currentCategory;
        const matchesSearch = !currentSearch || 
          cardTitle.includes(currentSearch) || 
          cardDesc.includes(currentSearch) || 
          cardTags.includes(currentSearch);

        return matchesCat && matchesSearch;
      });

      // Sort
      if (currentSort === 'price-low') {
        visibleCards.sort((a, b) => parseFloat(a.getAttribute('data-price') || 0) - parseFloat(b.getAttribute('data-price') || 0));
      } else if (currentSort === 'price-high') {
        visibleCards.sort((a, b) => parseFloat(b.getAttribute('data-price') || 0) - parseFloat(a.getAttribute('data-price') || 0));
      } else if (currentSort === 'rating') {
        visibleCards.sort((a, b) => parseFloat(b.getAttribute('data-rating') || 0) - parseFloat(a.getAttribute('data-rating') || 0));
      }

      // Hide all first and remove helper classes
      cards.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('is-last-centered-2col', 'is-last-centered-3col');
      });

      // Append and display filtered
      visibleCards.forEach(card => {
        card.style.display = '';
        catalogGrid.appendChild(card);
      });

      if (visibleCards.length > 0) {
        const lastCard = visibleCards[visibleCards.length - 1];
        if (visibleCards.length % 2 === 1) {
          lastCard.classList.add('is-last-centered-2col');
        }
        if (visibleCards.length % 3 === 1) {
          lastCard.classList.add('is-last-centered-3col');
        }
      }

      // No results notice
      let noResultEl = document.getElementById('no-results-msg');
      if (visibleCards.length === 0) {
        if (!noResultEl) {
          noResultEl = document.createElement('div');
          noResultEl.id = 'no-results-msg';
          noResultEl.style.gridColumn = '1 / -1';
          noResultEl.style.textAlign = 'center';
          noResultEl.style.padding = '40px 20px';
          noResultEl.innerHTML = `
            <p style="font-family: var(--font-display); font-size: 1.6rem; color: var(--color-blaze);">NO MATCHING FIELD GEAR FOUND</p>
            <p style="color: var(--text-muted); margin-top: 8px;">Try clearing your search query or selecting "All Gear".</p>
          `;
          catalogGrid.appendChild(noResultEl);
        }
        noResultEl.style.display = 'block';
      } else if (noResultEl) {
        noResultEl.style.display = 'none';
      }
    };

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-cat') || 'all';
        filterAndSortCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim().toLowerCase();
        filterAndSortCards();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndSortCards();
      });
    }

    // Quick Look Modal Setup
    initQuickLookModal();
  }

  function initQuickLookModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');
    const modalTitle = modal.querySelector('#modal-title');
    const modalCategory = modal.querySelector('#modal-category');
    const modalPrice = modal.querySelector('#modal-price');
    const modalDesc = modal.querySelector('#modal-desc');
    const modalImg = modal.querySelector('#modal-img');
    const modalSpecs = modal.querySelector('#modal-specs');
    const modalInquireBtn = modal.querySelector('#modal-inquire-btn');

    const openModal = (card) => {
      const title = card.querySelector('.card-title')?.textContent || '';
      const cat = card.getAttribute('data-category-label') || 'FIELD GEAR';
      const price = card.querySelector('.card-price')?.textContent || '';
      const desc = card.getAttribute('data-full-desc') || card.querySelector('.card-desc')?.textContent || '';
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
      const specsRaw = card.getAttribute('data-specs') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = cat;
      if (modalPrice) modalPrice.textContent = price;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalImg) modalImg.src = imgSrc;

      if (modalSpecs) {
        modalSpecs.innerHTML = '';
        if (specsRaw) {
          const specsArr = specsRaw.split('|');
          specsArr.forEach(spec => {
            const span = document.createElement('span');
            span.className = 'spec-chip';
            span.textContent = spec.trim();
            modalSpecs.appendChild(span);
          });
        }
      }

      if (modalInquireBtn) {
        modalInquireBtn.setAttribute('href', `contact.html?gear=${encodeURIComponent(title)}`);
      }

      modal.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('is-visible');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.open-quick-look').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.tilt-card') || btn.closest('.product-card-item');
        if (card) openModal(card);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     6. TRADE-IN VALUATION APPRAISAL CALCULATOR
     ========================================================================== */
  function initTradeInCalculator() {
    const form = document.getElementById('trade-in-calc-form');
    if (!form) return;

    const catSelect = document.getElementById('calc-category');
    const brandSelect = document.getElementById('calc-brand');
    const conditionSelect = document.getElementById('calc-condition');
    const yearSelect = document.getElementById('calc-year');
    const valueDisplay = document.getElementById('calc-result-value');
    const bonusDisplay = document.getElementById('calc-bonus-value');
    const lockInBtn = document.getElementById('lock-in-quote-btn');

    const baseValues = {
      optics: { vortex: 480, leupold: 620, swarovski: 1450, zeiss: 1100, other: 350 },
      archery: { mathews: 650, hoyt: 680, bowtech: 540, elite: 490, other: 300 },
      rangefinder: { sig: 380, leica: 550, vortex: 290, bushnell: 220, other: 180 },
      packs: { mystery_ranch: 320, stone_glacier: 360, kuiu: 280, sitka: 310, other: 150 }
    };

    const conditionMultipliers = {
      mint: 1.0,
      excellent: 0.88,
      good: 0.72,
      fair: 0.54
    };

    const calculate = () => {
      const cat = catSelect.value || 'optics';
      const brand = brandSelect.value || 'vortex';
      const cond = conditionSelect.value || 'excellent';
      const year = parseInt(yearSelect.value || '2024', 10);

      const base = (baseValues[cat] && baseValues[cat][brand]) ? baseValues[cat][brand] : 400;
      const condMultiplier = conditionMultipliers[cond] || 0.8;
      const ageDiff = Math.max(0, 2026 - year);
      const ageMultiplier = Math.max(0.65, 1 - (ageDiff * 0.07));

      const finalEstimate = Math.round(base * condMultiplier * ageMultiplier);
      const storeCreditBonus = Math.round(finalEstimate * 1.18); // +18% trade-in bonus

      if (valueDisplay) valueDisplay.textContent = `$${finalEstimate}`;
      if (bonusDisplay) bonusDisplay.textContent = `$${storeCreditBonus}`;
    };

    [catSelect, brandSelect, conditionSelect, yearSelect].forEach(elem => {
      if (elem) elem.addEventListener('change', calculate);
    });

    calculate();

    if (lockInBtn) {
      lockInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const quoteVal = valueDisplay ? valueDisplay.textContent : '$450';
        const tradeForm = document.getElementById('trade-in-submit-form');
        if (tradeForm) {
          tradeForm.scrollIntoView({ behavior: 'smooth' });
          const descInput = document.getElementById('trade-gear-description');
          if (descInput) {
            descInput.value = `[Pre-Appraisal Quote: ${quoteVal}] Category: ${catSelect.value.toUpperCase()} | Brand: ${brandSelect.options[brandSelect.selectedIndex].text} | Condition: ${conditionSelect.options[conditionSelect.selectedIndex].text}`;
          }
        }
      });
    }
  }

  /* ==========================================================================
     7. HOME 2 PACK WEIGHT OPTIMIZER
     ========================================================================== */
  function initPackWeightOptimizer() {
    const packTracker = document.getElementById('pack-weight-tracker');
    if (!packTracker) return;

    const checkboxes = packTracker.querySelectorAll('.gear-weight-check');
    const totalWeightEl = document.getElementById('total-pack-weight');
    const weightStatusEl = document.getElementById('pack-status-badge');
    const weightProgressBar = document.getElementById('pack-progress-bar');
    const basePackWeight = 4.2; // Dry pack frame weight in lbs

    const updateWeight = () => {
      let total = basePackWeight;
      checkboxes.forEach(chk => {
        if (chk.checked) {
          total += parseFloat(chk.getAttribute('data-weight') || 0);
        }
      });

      const rounded = total.toFixed(1);
      if (totalWeightEl) totalWeightEl.textContent = `${rounded} LBS`;

      // Status indicator
      if (weightStatusEl && weightProgressBar) {
        const percent = Math.min(100, Math.round((total / 65) * 100));
        weightProgressBar.style.width = `${percent}%`;

        if (total < 28) {
          weightStatusEl.textContent = 'RAPID ALPINE / ULTRALIGHT';
          weightStatusEl.style.color = '#d8521a';
          weightProgressBar.style.background = 'linear-gradient(90deg, #d8521a, #ff7e47)';
        } else if (total <= 48) {
          weightStatusEl.textContent = 'BALANCED 5-DAY BACKCOUNTRY';
          weightStatusEl.style.color = '#d8521a';
          weightProgressBar.style.background = 'linear-gradient(90deg, #d8521a, #ff6b35)';
        } else {
          weightStatusEl.textContent = 'HEAVY EXPEDITION LOADOUT';
          weightStatusEl.style.color = '#c0392b';
          weightProgressBar.style.background = 'linear-gradient(90deg, #d8521a, #c0392b)';
        }
      }
    };

    checkboxes.forEach(chk => chk.addEventListener('change', updateWeight));
    updateWeight();
  }

  /* ==========================================================================
     8. CLIENT-SIDE FORM VALIDATION (Accessible error tooltips & messages)
     ========================================================================== */
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate="true"]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
          const val = input.value.trim();
          const errorMsg = form.querySelector(`[data-error-for="${input.id}"]`);

          if (!val) {
            isValid = false;
            input.classList.add('is-invalid');
            if (errorMsg) {
              errorMsg.textContent = 'This field is required for outfitter dispatch.';
              errorMsg.classList.add('visible');
            }
          } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            isValid = false;
            input.classList.add('is-invalid');
            if (errorMsg) {
              errorMsg.textContent = 'Please enter a valid wilderness radio/email address.';
              errorMsg.classList.add('visible');
            }
          } else {
            input.classList.remove('is-invalid');
            if (errorMsg) errorMsg.classList.remove('visible');
          }
        });

        if (isValid) {
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn ? submitBtn.innerHTML : 'SUBMIT';
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'TRANSMITTING DISPATCH...';
          }

          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
            showSuccessModal(form.getAttribute('data-success-title') || 'DISPATCH TRANSMITTED', form.getAttribute('data-success-msg') || 'Your inquiry has been routed to our regional pro-staff outfitter team.');
            form.reset();
          }, 800);
        }
      });

      // Clear error on input
      form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          const errorMsg = form.querySelector(`[data-error-for="${input.id}"]`);
          if (errorMsg) errorMsg.classList.remove('visible');
        });
      });
    });
  }

  function showSuccessModal(title, msg) {
    let successModal = document.getElementById('action-success-modal');
    if (!successModal) {
      successModal = document.createElement('div');
      successModal.id = 'action-success-modal';
      successModal.className = 'modal-overlay is-visible';
      successModal.innerHTML = `
        <div class="modal-box" style="max-width: 480px; text-align: center;">
          <div class="card-icon-wrap" style="color: var(--color-blaze); border-color: var(--color-blaze); margin-bottom: 20px;">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <h3 id="success-title-text" style="font-family: var(--font-display); font-size: 1.8rem; color: var(--text-main); margin-bottom: 12px;">${title}</h3>
          <p id="success-msg-text" style="color: var(--text-muted); margin-bottom: 24px;">${msg}</p>
          <button type="button" class="btn btn-primary" id="close-success-btn">DISMISS DISPATCH</button>
        </div>
      `;
      document.body.appendChild(successModal);
      successModal.querySelector('#close-success-btn').addEventListener('click', () => {
        successModal.classList.remove('is-visible');
      });
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) successModal.classList.remove('is-visible');
      });
    } else {
      successModal.querySelector('#success-title-text').textContent = title;
      successModal.querySelector('#success-msg-text').textContent = msg;
      successModal.classList.add('is-visible');
    }
  }

  /* ==========================================================================
     9. COUNTDOWN TIMER (COMING SOON PAGE)
     ========================================================================== */
  function initCountdownTimer() {
    const timerContainer = document.getElementById('countdown-timer');
    if (!timerContainer) return;

    // Target: 45 days from current
    const targetDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) return;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const dEl = document.getElementById('timer-days');
      const hEl = document.getElementById('timer-hours');
      const mEl = document.getElementById('timer-minutes');
      const sEl = document.getElementById('timer-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     10. INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheming();
    initNavigation();
    initBackToTop();
    initAccordion();
    initCatalog();
    initTradeInCalculator();
    initPackWeightOptimizer();
    initFormValidation();
    initCountdownTimer();
  });
})();

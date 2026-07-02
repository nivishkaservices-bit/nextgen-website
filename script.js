window.addEventListener("load", function () {

  // ================= SLIDER =================
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");

  let index = 0;
  const intervalTime = 3000;

  // CREATE DOTS
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      index = i;
      updateSlider();
      slideInterval = setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlider();
      }, intervalTime);
    });
  });

  const dots = document.querySelectorAll(".dot");

  function updateSlider() {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  let slideInterval = setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, intervalTime);

  // ================= HAMBURGER =================
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".nav-menu");

  function toggleMenu() {
    const isActive = navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive.toString());
  }

  hamburger.addEventListener("click", toggleMenu);

  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // ================= HERO BUTTON LOGIC (FIXED FOR ALL DIRECTIONS) =================
  const buttons = document.querySelectorAll(".hero-btn");
  const container = document.querySelector(".hero-buttons");

  let leaveTimeout = null;

  function resetButtons() {
    buttons.forEach(btn => {
      btn.style.background = "transparent";
      btn.style.color = "#00FFE7";
      btn.style.border = "2px solid #00FFE7";
    });
    buttons[0].style.background = "#00FFE7";
    buttons[0].style.color = "#000";
  }

  function resetIfNoButtonHovered() {
    const hoveredBtn = document.querySelector(".hero-btn:hover");
    if (!hoveredBtn) {
      resetButtons();
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      if (leaveTimeout) clearTimeout(leaveTimeout);
      buttons.forEach(b => {
        b.style.background = "transparent";
        b.style.color = "#00FFE7";
        b.style.border = "2px solid #00FFE7";
      });
      btn.style.background = "#00FFE7";
      btn.style.color = "#000";
    });

    btn.addEventListener("mouseleave", () => {
      if (leaveTimeout) clearTimeout(leaveTimeout);
      leaveTimeout = setTimeout(() => {
        resetIfNoButtonHovered();
        leaveTimeout = null;
      }, 10);
    });
  });

  container.addEventListener("mouseleave", () => {
    if (leaveTimeout) clearTimeout(leaveTimeout);
    resetIfNoButtonHovered();
  });

  resetButtons();

  // ================= SERVICE CARDS LOGIC =================
  const cards = document.querySelectorAll(".service-card");

  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".card-cta")) return;
      const serviceSlug = card.getAttribute("data-service");
      if (serviceSlug) {
        window.location.href = `${serviceSlug}.html`;
      }
    });

    const cta = card.querySelector(".card-cta");
    if (cta) {
      cta.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  });

  // ================= VIEW MORE BUTTON =================
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function (e) {
      // handled by href
    });
  }

  // ================= GLASS NAVBAR ON SCROLL =================
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

});

// ================= TESTIMONIALS SLIDER (unchanged) =================
window.addEventListener("load", function () {

  const wrapper = document.querySelector(".testimonials-slider-wrapper");
  const track = document.querySelector(".testimonials-track");
  const trackContainer = document.querySelector(".testimonials-track-container");
  const leftOverlay = document.querySelector(".slider-overlay--left");
  const rightOverlay = document.querySelector(".slider-overlay--right");

  if (!wrapper || !track || !trackContainer || !leftOverlay || !rightOverlay) return;

  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  const cardEl = track.querySelector(".testimonial-card");
  if (!cardEl) return;

  const cardWidth = cardEl.offsetWidth;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const moveStep = cardWidth + gap;
  const setWidth = originalCards.length * moveStep;

  let currentTranslate = 0;
  let isDragging = false;
  let startX = 0;
  let startTranslate = 0;
  let isAutoScrolling = false;

  function stopAutoScroll() {
    if (!isAutoScrolling) return;
    isAutoScrolling = false;
    track.style.transition = 'none';
    const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    currentTranslate = matrix.m41;
    track.offsetHeight;
  }

  function applyTranslate(value, useTransition = false, duration = 0.4) {
    currentTranslate = value;
    if (useTransition) {
      track.style.transition = `transform ${duration}s ease-in-out`;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function handleInfiniteLoop() {
    if (currentTranslate <= -setWidth) {
      currentTranslate += setWidth;
      track.style.transition = 'none';
      track.style.transform = `translateX(${currentTranslate}px)`;
      track.offsetHeight;
      track.style.transition = '';
    } else if (currentTranslate > 0) {
      currentTranslate -= setWidth;
      track.style.transition = 'none';
      track.style.transform = `translateX(${currentTranslate}px)`;
      track.offsetHeight;
      track.style.transition = '';
    }
  }

  function moveLeft() {
    if (isAutoScrolling) stopAutoScroll();
    applyTranslate(currentTranslate + moveStep, true, 0.4);
  }

  function moveRight() {
    if (isAutoScrolling) stopAutoScroll();
    applyTranslate(currentTranslate - moveStep, true, 0.4);
  }

  leftOverlay.addEventListener("click", moveLeft);
  rightOverlay.addEventListener("click", moveRight);

  track.addEventListener("transitionend", () => {
    track.style.transition = '';
    handleInfiniteLoop();
  });

  trackContainer.setAttribute("tabindex", "0");
  trackContainer.style.outline = "none";

  trackContainer.addEventListener("click", () => {
    trackContainer.focus();
  });

  trackContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveLeft();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      moveRight();
    }
  });

  function onDragStart(e) {
    if (isAutoScrolling) stopAutoScroll();
    isDragging = true;
    track.style.transition = 'none';
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    startTranslate = currentTranslate;
    track.style.cursor = 'grabbing';
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    applyTranslate(startTranslate + deltaX, false);
    handleInfiniteLoop();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';
    handleInfiniteLoop();
  }

  track.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  track.addEventListener("touchstart", onDragStart, { passive: false });
  window.addEventListener("touchmove", onDragMove, { passive: false });
  window.addEventListener("touchend", onDragEnd);

  track.addEventListener("dragstart", (e) => e.preventDefault());

  function playReveal() {
    wrapper.classList.add("revealed");
    isAutoScrolling = true;
    applyTranslate(0, false);
    const speed = 1000;
    const duration = Math.max(1.5, setWidth / speed);

    setTimeout(() => {
      if (isAutoScrolling && wrapper.classList.contains("revealed")) {
        applyTranslate(-setWidth, true, duration);
      }
    }, 400);

    const onAutoScrollEnd = () => {
      track.removeEventListener("transitionend", onAutoScrollEnd);
      if (isAutoScrolling) {
        currentTranslate = -setWidth;
        handleInfiniteLoop();
        isAutoScrolling = false;
      }
    };
    track.addEventListener("transitionend", onAutoScrollEnd);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!wrapper.classList.contains("revealed")) {
          playReveal();
        }
      } else {
        wrapper.classList.remove("revealed");
        isAutoScrolling = false;
      }
    });
  }, { threshold: 0.2 });

  observer.observe(wrapper);

  applyTranslate(0, false);
  if (wrapper.getBoundingClientRect().top < window.innerHeight && wrapper.getBoundingClientRect().bottom > 0) {
    playReveal();
  }
});

// ================= FREE LOCATION DETECTION (unchanged) =================
window.addEventListener("load", function () {

  const detectBtn = document.getElementById("detectLocationBtn");
  const locationInput = document.getElementById("location");

  if (!detectBtn || !locationInput) return;

  detectBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    detectBtn.classList.add("detecting");
    detectBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          locationInput.value = data.display_name || `${latitude}, ${longitude}`;
        } catch (error) {
          locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        detectBtn.classList.remove("detecting");
        detectBtn.disabled = false;
      },

      (error) => {
        detectBtn.classList.remove("detecting");
        detectBtn.disabled = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please enable it in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Please enter manually.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out. Please try again.");
            break;
          default:
            alert("An unknown error occurred. Please enter location manually.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });

});

// ================= URGENT POPUP MODAL (now uses 1.5s timeout like the booking form) =================
window.addEventListener("load", function () {
  const urgentLine = document.querySelector(".booking-urgent");
  const modalOverlay = document.getElementById("urgentModal");
  const closeBtn = document.getElementById("closeUrgentModal");
  const urgentForm = document.getElementById("urgentPopupForm");
  const formContent = document.getElementById("urgentFormContent");
  const successContent = document.getElementById("urgentSuccessContent");

  const phoneNumberInput = document.getElementById("urgentPhone");
  const nameInput = document.getElementById("urgentName");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");

  if (!urgentLine || !modalOverlay) return;

  urgentLine.addEventListener("click", function (e) {
    e.preventDefault();
    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
    formContent.classList.remove("hidden");
    successContent.classList.add("hidden");
    urgentForm.reset();
    clearErrors();
  });

  function closeModal() {
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
  }
  closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  phoneNumberInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
  });

  function clearErrors() {
    if (nameError) nameError.textContent = "";
    if (phoneError) phoneError.textContent = "";
  }

  function validateForm() {
    let valid = true;
    clearErrors();

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = "Please enter your name.";
      valid = false;
    }

    const numberValue = phoneNumberInput.value.trim();
    if (!numberValue) {
      if (phoneError) phoneError.textContent = "Please enter your phone number.";
      valid = false;
    } else if (!/^\d{10}$/.test(numberValue)) {
      if (phoneError) phoneError.textContent = "Enter a valid 10‑digit mobile number.";
      valid = false;
    }

    return valid;
  }

  urgentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: nameInput.value.trim(),
      phone: phoneNumberInput.value.trim()
    };

    // Show the branded loading animation
    if (typeof startLoadingAnimation === 'function') {
      startLoadingAnimation();
    }

    // Fire-and-forget the data
    fetch('https://script.google.com/macros/s/AKfycbzM23mnhHo8rFYSLomFeWc-RqrCTrAzIueLnSs5332-nAk30oyYgKz1F8ri9lhHoT2_/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });

    // After 1.5s, hide loader and show success (same rhythm as footer & booking form)
    setTimeout(function() {
      if (typeof stopLoadingAnimation === 'function') {
        stopLoadingAnimation();
      }

      formContent.classList.add("hidden");
      successContent.classList.remove("hidden");
      successContent.innerHTML = `
        <div style="text-align:center;">
          <div class="urgent-success-icon">✅</div>
          <p style="font-family:'Inter',sans-serif;color:#333;margin-bottom:1.5rem;font-size:0.95rem;">Your request has been sent.</p>
          <div style="background:#f9f9f9;border-radius:12px;padding:1.25rem;margin-bottom:1.25rem;">
            <p style="font-family:'Inter',sans-serif;font-size:0.95rem;margin:0.5rem 0;color:#111;">
              <span style="display:inline-block;width:24px;">📞</span>
              <a href="tel:9900840337" style="color:#111;text-decoration:none;font-weight:600;">9900840337</a>
            </p>
            <p style="font-family:'Inter',sans-serif;font-size:0.95rem;margin:0.5rem 0;color:#111;">
              <span style="display:inline-block;width:24px;">✉️</span>
              <a href="mailto:contact@nextgenultrasolutions.in" style="color:#111;text-decoration:none;font-weight:600;">contact@nextgenultrasolutions.in</a>
            </p>
          </div>
          <button class="btn booking-submit" id="urgentCloseSuccess" style="width:100%;">Close</button>
        </div>
      `;

      const closeSuccessBtn = document.getElementById("urgentCloseSuccess");
      if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", closeModal);
      }
    }, 1500);
  });
});

// ================= FOOTER BUTTON TRANSITIONS & URGENT POPUP AUTO-CLICK =================

// "Request a Quote" button transition
(function() {
    const btn = document.getElementById('footerRequestQuoteBtn');
    const overlay = document.getElementById('pageTransitionOverlay');
    const progressBar = document.getElementById('transitionProgressBar');

    if (!btn || !overlay || !progressBar) return;

    let isTransitioning = false;
    const textSpans = overlay.querySelectorAll('.transition-text:not(.completion-text)');
    const completionText = overlay.querySelector('.transition-text.completion-text');
    let textCycleInterval = null;
    let currentTextIndex = 0;

    function startTextCycling() {
        textSpans.forEach(t => t.classList.remove('active'));
        if (textSpans.length > 0) textSpans[0].classList.add('active');
        currentTextIndex = 0;
        textCycleInterval = setInterval(() => {
            textSpans.forEach(t => t.classList.remove('active'));
            currentTextIndex = (currentTextIndex + 1) % textSpans.length;
            textSpans[currentTextIndex].classList.add('active');
        }, 420);
    }

    function stopTextCycling() {
        if (textCycleInterval) {
            clearInterval(textCycleInterval);
            textCycleInterval = null;
        }
    }

    btn.addEventListener('click', function(e) {
        if (isTransitioning) return;
        isTransitioning = true;

        e.preventDefault();
        const targetUrl = btn.getAttribute('href');

        overlay.classList.remove('complete');
        progressBar.style.width = '0%';
        if (completionText) completionText.classList.remove('active');
        textSpans.forEach(t => t.classList.remove('active'));

        overlay.classList.add('active');
        startTextCycling();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progressBar.style.width = '100%';
            });
        });

        const completeDelay = 1250;
        setTimeout(() => {
            stopTextCycling();
            textSpans.forEach(t => t.classList.remove('active'));
            if (completionText) completionText.classList.add('active');
            overlay.classList.add('complete');
        }, completeDelay);

        const navigateDelay = 1550;
        setTimeout(() => {
            window.location.href = targetUrl;
        }, navigateDelay);
    });

    window.addEventListener('pageshow', function() {
        overlay.classList.remove('active', 'complete');
        progressBar.style.width = '0%';
        stopTextCycling();
        textSpans.forEach(t => t.classList.remove('active'));
        if (completionText) completionText.classList.remove('active');
        isTransitioning = false;
    });
})();

// "Need Instant Services?" button transition (with urgent popup flag)
(function() {
    const btn = document.getElementById('footerInstantCta');
    const overlay = document.getElementById('pageTransitionOverlay');
    const progressBar = document.getElementById('transitionProgressBar');

    if (!btn || !overlay || !progressBar) return;

    let isTransitioning = false;
    const textSpans = overlay.querySelectorAll('.transition-text:not(.completion-text)');
    const completionText = overlay.querySelector('.transition-text.completion-text');
    let textCycleInterval = null;
    let currentTextIndex = 0;

    function startTextCycling() {
        textSpans.forEach(t => t.classList.remove('active'));
        if (textSpans.length > 0) textSpans[0].classList.add('active');
        currentTextIndex = 0;
        textCycleInterval = setInterval(() => {
            textSpans.forEach(t => t.classList.remove('active'));
            currentTextIndex = (currentTextIndex + 1) % textSpans.length;
            textSpans[currentTextIndex].classList.add('active');
        }, 420);
    }

    function stopTextCycling() {
        if (textCycleInterval) {
            clearInterval(textCycleInterval);
            textCycleInterval = null;
        }
    }

    btn.addEventListener('click', function(e) {
        if (isTransitioning) return;
        isTransitioning = true;

        e.preventDefault();
        const targetUrl = btn.getAttribute('href');

        sessionStorage.setItem('showUrgentPopup', 'true');

        overlay.classList.remove('complete');
        progressBar.style.width = '0%';
        if (completionText) completionText.classList.remove('active');
        textSpans.forEach(t => t.classList.remove('active'));

        overlay.classList.add('active');
        startTextCycling();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progressBar.style.width = '100%';
            });
        });

        const completeDelay = 1250;
        setTimeout(() => {
            stopTextCycling();
            textSpans.forEach(t => t.classList.remove('active'));
            if (completionText) completionText.classList.add('active');
            overlay.classList.add('complete');
        }, completeDelay);

        const navigateDelay = 1550;
        setTimeout(() => {
            window.location.href = targetUrl;
        }, navigateDelay);
    });

    window.addEventListener('pageshow', function() {
        overlay.classList.remove('active', 'complete');
        progressBar.style.width = '0%';
        stopTextCycling();
        textSpans.forEach(t => t.classList.remove('active'));
        if (completionText) completionText.classList.remove('active');
        isTransitioning = false;
    });
})();

// Auto‑trigger urgent popup when redirected from footer (only on homepage)
(function() {
    if (sessionStorage.getItem('showUrgentPopup') === 'true') {
        sessionStorage.removeItem('showUrgentPopup');

        window.addEventListener('load', function() {
            setTimeout(function() {
                const urgentBtn = document.getElementById('urgentServiceTrigger');
                if (urgentBtn) {
                    urgentBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(function() {
                        urgentBtn.click();
                    }, 800);
                }
            }, 500);
        });
    }
})();

// ========== LOADING OVERLAY TEXT ANIMATION ENHANCER ==========
(function () {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;

    // Remove duplicate overlays (just in case)
    document.querySelectorAll('#loadingOverlay').forEach((el, i) => {
        if (i > 0) el.remove();
    });

    // Inject text container if missing
    if (!overlay.querySelector('.transition-text-container')) {
        const container = document.createElement('div');
        container.className = 'transition-text-container';
        container.innerHTML = `
            <span class="transition-text active">Preparing your quote…</span>
            <span class="transition-text">Customizing your options…</span>
            <span class="transition-text">Almost ready…</span>
            <span class="transition-text completion-text">✓ Ready!</span>
        `;
        overlay.appendChild(container);
    }

    // Inject progress bar if missing
    if (!overlay.querySelector('.transition-progress')) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'transition-progress';
        progressDiv.innerHTML = '<div class="transition-progress-bar"></div>';
        overlay.appendChild(progressDiv);
    }

    const textSpans = overlay.querySelectorAll('.transition-text:not(.completion-text)');
    const completionText = overlay.querySelector('.completion-text');
    const progressBar = overlay.querySelector('.transition-progress-bar');
    let cycleInterval = null;
    let currentIndex = 0;

    function startCycling() {
        textSpans.forEach(s => s.classList.remove('active'));
        if (textSpans.length > 0) textSpans[0].classList.add('active');
        currentIndex = 0;
        cycleInterval = setInterval(() => {
            textSpans.forEach(s => s.classList.remove('active'));
            currentIndex = (currentIndex + 1) % textSpans.length;
            textSpans[currentIndex].classList.add('active');
        }, 420);
    }

    function stopCycling() {
        if (cycleInterval) {
            clearInterval(cycleInterval);
            cycleInterval = null;
        }
        textSpans.forEach(s => s.classList.remove('active'));
        if (completionText) completionText.classList.remove('active');
    }

    window.startLoadingAnimation = function () {
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        progressBar.style.width = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progressBar.style.width = '100%';
            });
        });
        startCycling();
    };

    window.stopLoadingAnimation = function (showComplete = false) {
        stopCycling();
        if (showComplete && completionText) {
            completionText.classList.add('active');
        }
        overlay.classList.remove('active');
        overlay.style.display = 'none';
        progressBar.style.width = '0%';
    };

    // Clean up if overlay is hidden manually
    new MutationObserver(() => {
        if (!overlay.classList.contains('active')) {
            stopCycling();
            progressBar.style.width = '0%';
        }
    }).observe(overlay, { attributes: true, attributeFilter: ['class', 'style'] });
})();

// ================= INTERACTIVE CLEAN-TO-REVEAL LOGO (FOOTER) =================
(function() {
  const logoContainer = document.querySelector('.footer-logo');
  const dirtCanvas = document.getElementById('dirtCanvas');
  const waterCanvas = document.getElementById('waterCanvas');
  const hint = document.querySelector('.clean-hint');
  let dirtCtx, waterCtx, width, height, totalPixels;
  let waterDroplets = [];
  let animationFrame;
  let hintRemoved = false;
  let autoCleanTimer = null;
  const AUTO_CLEAN_DELAY = 10000; // 10 seconds
  const CLEAN_THRESHOLD = 0.9;

  function removeHintPermanently() {
    if (hint && !hintRemoved) {
      hint.remove();
      hintRemoved = true;
    }
  }

  function startAutoCleanTimer() {
    stopAutoCleanTimer();
    if (dirtCanvas.classList.contains('clean')) return;
    autoCleanTimer = setTimeout(() => {
      finishCleaning();
    }, AUTO_CLEAN_DELAY);
  }

  function stopAutoCleanTimer() {
    if (autoCleanTimer) {
      clearTimeout(autoCleanTimer);
      autoCleanTimer = null;
    }
  }

  function initCanvas() {
    const svg = logoContainer.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    width = dirtCanvas.width = waterCanvas.width = rect.width;
    height = dirtCanvas.height = waterCanvas.height = rect.height;
    dirtCanvas.style.width = waterCanvas.style.width = width + 'px';
    dirtCanvas.style.height = waterCanvas.style.height = height + 'px';
    dirtCtx = dirtCanvas.getContext('2d');
    waterCtx = waterCanvas.getContext('2d');
    drawElegantDust();
    totalPixels = width * height;
    dirtCanvas.classList.add('dirty');
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animateDroplets();
    startAutoCleanTimer();
  }

  function drawElegantDust() {
    dirtCtx.fillStyle = 'rgba(10, 15, 20, 0.82)';
    dirtCtx.fillRect(0, 0, width, height);

    const gradient = dirtCtx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)*0.7);
    gradient.addColorStop(0, 'rgba(0, 255, 231, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 255, 231, 0)');
    dirtCtx.fillStyle = gradient;
    dirtCtx.fillRect(0, 0, width, height);

    for (let i = 0; i < 400; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2 + 0.3;
      const alpha = Math.random() * 0.5 + 0.2;
      dirtCtx.beginPath();
      dirtCtx.arc(x, y, radius, 0, Math.PI * 2);
      dirtCtx.fillStyle = `rgba(0, 255, 231, ${alpha})`;
      dirtCtx.fill();
    }
  }

  function getCleanedPercentage() {
    if (!dirtCtx) return 0;
    const imageData = dirtCtx.getImageData(0, 0, width, height).data;
    let dirtyPixels = 0;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] > 0) dirtyPixels++;
    }
    return 1 - (dirtyPixels / totalPixels);
  }

  function cleanAt(x, y) {
    if (!dirtCtx) return;
    dirtCtx.globalCompositeOperation = 'destination-out';
    dirtCtx.beginPath();
    dirtCtx.arc(x, y, 15, 0, Math.PI * 2);
    dirtCtx.fillStyle = 'rgba(0,0,0,1)';
    dirtCtx.fill();
    dirtCtx.globalCompositeOperation = 'source-over';

    if (!dirtCanvas.classList.contains('clean')) {
      const cleaned = getCleanedPercentage();
      if (cleaned >= CLEAN_THRESHOLD) {
        finishCleaning();
      }
    }
  }

  function addWaterDrop(x, y) {
    waterDroplets.push({
      x: x,
      y: y,
      size: Math.random() * 4 + 2,
      opacity: 1,
      life: 1,
      decay: 0.02 + Math.random() * 0.03
    });
  }

  function animateDroplets() {
    if (!waterCtx) return;
    waterCtx.clearRect(0, 0, width, height);
    for (let i = waterDroplets.length - 1; i >= 0; i--) {
      const d = waterDroplets[i];
      d.life -= d.decay;
      d.opacity = Math.max(0, d.life);
      if (d.life <= 0) {
        waterDroplets.splice(i, 1);
        continue;
      }
      waterCtx.beginPath();
      waterCtx.arc(d.x, d.y, d.size * (0.6 + 0.4 * d.life), 0, Math.PI * 2);
      waterCtx.fillStyle = `rgba(0, 255, 231, ${d.opacity * 0.8})`;
      waterCtx.fill();
      waterCtx.strokeStyle = `rgba(255, 255, 255, ${d.opacity * 0.6})`;
      waterCtx.lineWidth = 0.8;
      waterCtx.stroke();
    }
    animationFrame = requestAnimationFrame(animateDroplets);
  }

  function finishCleaning() {
    stopAutoCleanTimer();
    removeHintPermanently();
    dirtCanvas.classList.add('clean');
    dirtCanvas.classList.remove('dirty');
    logoContainer.classList.add('premium-reveal');
    setTimeout(() => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      waterCtx.clearRect(0, 0, width, height);
    }, 600);
  }

  // ---- Event Listeners ----
  dirtCanvas.addEventListener('mouseenter', () => {
    removeHintPermanently();
    stopAutoCleanTimer();
  });
  dirtCanvas.addEventListener('mouseleave', () => {
    if (!dirtCanvas.classList.contains('clean')) startAutoCleanTimer();
  });
  dirtCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    removeHintPermanently();
    stopAutoCleanTimer();
  });
  dirtCanvas.addEventListener('touchend', () => {
    if (!dirtCanvas.classList.contains('clean')) startAutoCleanTimer();
  });
  dirtCanvas.addEventListener('mousemove', (e) => {
    if (!dirtCtx || dirtCanvas.classList.contains('clean')) return;
    const rect = dirtCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cleanAt(x, y);
    for (let i = 0; i < 2; i++) {
      addWaterDrop(x + (Math.random() - 0.5) * 14, y + (Math.random() - 0.5) * 14);
    }
  });
  dirtCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!dirtCtx || dirtCanvas.classList.contains('clean')) return;
    const rect = dirtCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    cleanAt(x, y);
    for (let i = 0; i < 2; i++) {
      addWaterDrop(x + (Math.random() - 0.5) * 14, y + (Math.random() - 0.5) * 14);
    }
  });

  // Lazy initialisation when footer enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initCanvas();
        observer.unobserve(logoContainer);
      }
    });
  }, { threshold: 0.3 });

  if (logoContainer) observer.observe(logoContainer);

  window.addEventListener('resize', () => {
    if (dirtCanvas.classList.contains('clean')) return;
    initCanvas();
  });
})();
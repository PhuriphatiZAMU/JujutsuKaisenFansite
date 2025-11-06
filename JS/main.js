document.addEventListener('DOMContentLoaded', function () {
  // Navbar enhancements
  const menuToggle = document.getElementById('menu-toggle');
  const menuWrapper = document.querySelector('.menu-wrapper');
  const dropdown = menuWrapper ? menuWrapper.querySelector('.dropdown-menu') : null;

  if (menuToggle && menuWrapper && dropdown) {
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuWrapper.contains(e.target) && menuToggle.checked) {
        menuToggle.checked = false;
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.checked) {
        menuToggle.checked = false;
      }
    });

    // Ensure keyboard accessibility: toggle checkbox when label is Space/Enter
    const label = document.querySelector('label[for="menu-toggle"]');
    if (label) {
      label.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          menuToggle.checked = !menuToggle.checked;
        }
      });
    }
  }

  // Carousel enhancements (works if radio inputs exist)
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carouselWrapper) {
    const radios = Array.from(document.querySelectorAll('input[name="carousel"]'));
    if (radios.length > 0) {
      let current = radios.findIndex(r => r.checked) || 0;
      let interval = null;
      const delay = 5000; // 5s
      const start = () => {
        stop();
        interval = setInterval(() => goTo((current + 1) % radios.length), delay);
      };
      const stop = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };
      const goTo = (index) => {
        current = (index + radios.length) % radios.length;
        radios.forEach((r, i) => r.checked = i === current);
      };

      // Start auto-advance
      start();

      // Pause on hover/focus
      const carouselEl = document.querySelector('.carousel');
      if (carouselEl) {
        carouselEl.addEventListener('mouseenter', stop);
        carouselEl.addEventListener('mouseleave', start);
        carouselEl.addEventListener('focusin', stop);
        carouselEl.addEventListener('focusout', start);

        // Keyboard left/right navigation
        carouselEl.tabIndex = carouselEl.tabIndex || 0;
        carouselEl.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault(); goTo(current - 1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault(); goTo(current + 1);
          }
        });

        // Touch swipe support
        let touchStartX = null;
        carouselEl.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          stop();
        }, {passive:true});
        carouselEl.addEventListener('touchend', (e) => {
          if (touchStartX === null) return;
          const touchEndX = e.changedTouches[0].clientX;
          const dx = touchEndX - touchStartX;
          if (Math.abs(dx) > 40) {
            if (dx > 0) goTo(current - 1); else goTo(current + 1);
          }
          touchStartX = null;
          start();
        });
      }

      // Wire radio nav labels (so clicks also reset timer)
      const navLabels = Array.from(document.querySelectorAll('.carousel-nav label'));
      navLabels.forEach((lbl, i) => {
        lbl.addEventListener('click', () => {
          goTo(i);
          stop();
          setTimeout(start, 3000); // resume after short pause
        });
      });

      // If user manually checks radio inputs (e.g., keyboard), update current
      radios.forEach((r, i) => r.addEventListener('change', () => { if (r.checked) current = i; }));
    }
  }
});

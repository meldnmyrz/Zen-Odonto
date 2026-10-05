/**
 * ZEN ODONTO — CLÍNICA DENTAL Y FACIAL
 * Interactive Before & After Smile Slider
 */

function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  if (!container) return;

  const afterWrap = container.querySelector('.ba-image-after-wrap');
  const divider = container.querySelector('.ba-divider');
  const handle = container.querySelector('.ba-handle');
  const imgBefore = container.querySelector('.ba-image-before');
  const imgAfter = container.querySelector('.ba-image-after');

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    if (afterWrap) afterWrap.style.width = `${percentage}%`;
    if (divider) divider.style.left = `${percentage}%`;
    if (imgAfter) imgAfter.style.width = `${rect.width}px`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events (Mobile support)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keep internal after-image aligned with full container width
  function syncDimensions() {
    if (imgAfter && container) {
      imgAfter.style.width = `${container.clientWidth}px`;
    }
  }

  window.addEventListener('resize', syncDimensions);
  syncDimensions();

  // Case Switcher
  const caseButtons = document.querySelectorAll('.ba-case-btn');
  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      caseButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const beforeSrc = btn.getAttribute('data-before');
      const afterSrc = btn.getAttribute('data-after');
      const caseTitle = btn.getAttribute('data-title');
      const caseDesc = btn.getAttribute('data-desc');

      if (imgBefore && beforeSrc) imgBefore.src = beforeSrc;
      if (imgAfter && afterSrc) imgAfter.src = afterSrc;

      const titleEl = document.getElementById('baCaseTitle');
      const descEl = document.getElementById('baCaseDesc');
      if (titleEl && caseTitle) titleEl.textContent = caseTitle;
      if (descEl && caseDesc) descEl.textContent = caseDesc;

      // Reset to 50%
      if (afterWrap) afterWrap.style.width = '50%';
      if (divider) divider.style.left = '50%';
      syncDimensions();
    });
  });
}

document.addEventListener('DOMContentLoaded', initBeforeAfterSlider);

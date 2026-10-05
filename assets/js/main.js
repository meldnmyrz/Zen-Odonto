/**
 * ZEN ODONTO — CLÍNICA DENTAL Y FACIAL
 * Main Interaction & Ambient Sound Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initAmbientZenSound();
  initFaqAccordion();
});

// Sticky Navbar Scroll
function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile Drawer
function initMobileDrawer() {
  const openBtn = document.querySelector('.hamburger-btn');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay');

  if (!drawer || !overlay) return;

  function toggle(open) {
    if (open) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  overlay.addEventListener('click', () => toggle(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
}

// Relaxing Zen Ambient Audio Generator (Web Audio API - No external files required)
let audioCtx = null;
let isPlayingZenSound = false;
let ambientInterval = null;

function initAmbientZenSound() {
  const soundBtn = document.getElementById('zenSoundToggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (isPlayingZenSound) {
        // Stop
        isPlayingZenSound = false;
        clearInterval(ambientInterval);
        soundBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          <span>Activar Sonido Zen</span>
        `;
        showToast('Ambiente Zen en pausa');
      } else {
        // Play
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        isPlayingZenSound = true;
        playTibetanChime();
        ambientInterval = setInterval(() => {
          if (isPlayingZenSound) playTibetanChime();
        }, 7000);

        soundBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <span>Ambiente Zen Activo</span>
        `;
        showToast('Reproduciendo frecuencias de relajación Zen');
      }
    } catch (e) {
      console.warn('Audio API unavailable:', e);
    }
  });
}

function playTibetanChime() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  
  // Harmonics: 432Hz healing resonance base & soothing overtones
  const freqs = [432, 576, 648, 864];
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.04, now);
  masterGain.connect(audioCtx.destination);

  freqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.15);

    // Smooth bell envelope
    gain.gain.setValueAtTime(0, now + idx * 0.15);
    gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + idx * 0.15 + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 4.5);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now + idx * 0.15);
    osc.stop(now + idx * 0.15 + 5);
  });
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('zenToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'zenToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    }
  });
}

// Hero Video Mute/Unmute Toggle
function toggleHeroMute(videoId, btnEl) {
  const video = document.getElementById(videoId);
  if (!video) return;

  if (video.muted) {
    video.muted = false;
    btnEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      <span>Silenciar Video</span>
    `;
    if (typeof showToast === 'function') showToast('Audio del video activado');
  } else {
    video.muted = true;
    btnEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
      <span>Activar Audio Video</span>
    `;
    if (typeof showToast === 'function') showToast('Video silenciado');
  }
}


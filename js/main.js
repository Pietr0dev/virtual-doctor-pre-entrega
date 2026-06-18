// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ========== FADE-IN ON SCROLL ==========
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// ========== COUNTER ANIMATION ==========
const metricNumbers = document.querySelectorAll('.metric-number');

let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  metricNumbers.forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    counter.textContent = '0';

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = Number.isInteger(target) ? target : target.toFixed(1);
        return;
      }
      counter.textContent = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
      requestAnimationFrame(updateCounter);
    };

    requestAnimationFrame(updateCounter);
  });
}

// Trigger counters when metrics section is visible
const metricsSection = document.querySelector('.metrics');
if (metricsSection) {
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        metricsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  metricsObserver.observe(metricsSection);
}

// ========== MODAL SYSTEM ==========
function setupModal(modalId, closeId) {
  const overlay = document.getElementById(modalId);
  const close = document.getElementById(closeId);
  if (!overlay) return;

  function open() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFn() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (close) close.addEventListener('click', closeFn);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeFn();
  });

  return { overlay, open, close: closeFn };
}

const demoModal = setupModal('demoModal', 'modalClose');
const brochureModal = setupModal('brochureModal', 'brochureClose');

document.querySelectorAll('.nav-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (btn.getAttribute('href') === '#') {
      e.preventDefault();
      if (demoModal) demoModal.open();
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (demoModal && demoModal.overlay.classList.contains('active')) demoModal.close();
    if (brochureModal && brochureModal.overlay.classList.contains('active')) brochureModal.close();
  }
});

// ========== FORM HANDLING ==========
function handleFormSubmit(form, formName) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    const originalBg = btn.style.background;
    const originalBorder = btn.style.borderColor;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Enviado';
      btn.style.background = '#183D52';
      btn.style.borderColor = '#183D52';

      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = originalBg;
        btn.style.borderColor = originalBorder;
        if (formName === 'modal' && demoModal) demoModal.close();
        if (formName === 'brochure' && brochureModal) brochureModal.close();
      }, 2000);
    }, 1500);
  });
}

const demoForm = document.getElementById('demoForm');
const modalForm = document.getElementById('modalForm');
const contactForm = document.getElementById('contactForm');
const brochureForm = document.getElementById('brochureForm');

if (demoForm) handleFormSubmit(demoForm, 'demo');
if (modalForm) handleFormSubmit(modalForm, 'modal');
if (contactForm) handleFormSubmit(contactForm, 'contact');
if (brochureForm) handleFormSubmit(brochureForm, 'brochure');

// ========== VERTICAL TABS ==========
const vtabBtns = document.querySelectorAll('.vtab-btn');
const vtabPanels = document.querySelectorAll('.vtab-panel');

function activateTab(tabId) {
  vtabBtns.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });

  vtabPanels.forEach(panel => {
    const isActive = panel.id === 'panel-' + tabId;
    panel.classList.toggle('active', isActive);
  });
}

vtabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activateTab(btn.dataset.tab);
  });
});

// Accordion on mobile
const accHeaders = document.querySelectorAll('.vtab-acc-header');

accHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const panel = header.closest('.vtab-panel');
    const isOpen = panel.classList.contains('active');

    // Close all panels
    document.querySelectorAll('.vtab-panel').forEach(p => {
      p.classList.remove('active');
      p.querySelector('.vtab-acc-header').setAttribute('aria-expanded', 'false');
      // Also sync tab buttons
    });

    // If it wasn't open, open it and sync tab
    if (!isOpen) {
      panel.classList.add('active');
      header.setAttribute('aria-expanded', 'true');
      const tabNum = panel.id.replace('panel-', '');
      activateTab(tabNum);
    }
  });
});

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===================== header scroll state + progress bar =====================
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle('scrolled', scrollTop > 12);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===================== mobile nav toggle =====================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ===================== scroll reveal =====================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ===================== hero stat counters =====================
const statEls = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
statEls.forEach((el) => statObserver.observe(el));

// ===================== contact form (calls Cloudflare Worker + Resend) =====================
// 部署完 網站/worker 後，把 wrangler deploy 印出的網址貼在這裡
const CONTACT_ENDPOINT = 'https://cgu-mec-studio-contact-form.xiageemail.workers.dev';

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const submitBtn = contactForm.querySelector('button[type="submit"]');

function setFormNote(text, color) {
  formNote.textContent = text;
  formNote.style.color = color;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    setFormNote('請確認姓名、Email 與專案內容都已填寫。', '#ff8a8a');
    contactForm.reportValidity();
    return;
  }

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    service: document.getElementById('service').value,
    message: document.getElementById('message').value.trim(),
    website: document.getElementById('website').value, // honeypot，一般使用者應為空
  };

  submitBtn.disabled = true;
  setFormNote('送出中…', 'rgba(255,255,255,.6)');

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data.error || '送出失敗');
    }

    setFormNote(`謝謝 ${payload.name}！我們已收到你的需求，會盡快透過 Email 與你聯繫。`, '#86e0b0');
    contactForm.reset();
  } catch (err) {
    setFormNote('送出失敗，請稍後再試，或直接寄信到 hello@cgumecstudio.tw。', '#ff8a8a');
  } finally {
    submitBtn.disabled = false;
  }
});

// ===================== active nav link on scroll =====================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.style.color = '');
        link.style.color = 'var(--ink)';
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));

// ===================== back to top =====================
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== footer year =====================
document.getElementById('year').textContent = new Date().getFullYear();

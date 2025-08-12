// Wait until DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const modeToggle = document.getElementById('modeToggle');
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.progress-bar');

  /* ---------------------------
     1) Dark / Light Mode Toggle
     --------------------------- */
  // Apply saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    modeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    modeToggle.textContent = '🌙';
  }

  // Toggle handler
  modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    modeToggle.textContent = isDark ? '☀️' : '🌙';
  });

  /* ---------------------------
     2) Initialize AOS (scroll reveal)
     --------------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }

  /* ---------------------------
     3) Smooth scrolling with header offset
     --------------------------- */
  const headerHeight = () => header.offsetHeight || 70;

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 10;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  /* ---------------------------
     4) Active nav link highlight on scroll
     --------------------------- */
  function setActiveNav() {
    const scrollPos = window.pageYOffset + headerHeight() + 15;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      if (scrollPos >= top && scrollPos < bottom) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveNav);
  setActiveNav(); // initial call

  /* ---------------------------
     5) Animate skill progress bars when in view
     --------------------------- */
  // Save target widths (read from inline style if present)
  progressBars.forEach(pb => {
    // read width like "85%" from inline style or data attribute
    const inline = pb.style.width;
    const target = inline && inline.includes('%') ? inline : pb.dataset.progress || '0%';
    pb.dataset.target = target.trim();
    // set initial width to 0 for animation
    pb.style.width = '0%';
  });

  if ('IntersectionObserver' in window && skillsSection) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(pb => {
            pb.style.transition = 'width 1.2s ease';
            pb.style.width = pb.dataset.target;
          });
          observer.unobserve(skillsSection);
        }
      });
    }, { threshold: 0.35 });
    obs.observe(skillsSection);
  } else {
    // fallback: animate immediately
    progressBars.forEach(pb => {
      pb.style.transition = 'width 1.2s ease';
      pb.style.width = pb.dataset.target;
    });
  }



}); 
/* ==========================
   Mouse Glow Trail Effect
========================== */
const canvas = document.getElementById("cursorCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let w, h;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.addEventListener("mousemove", function (e) {
    particles.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        size: 8,
        color: "rgba(0, 229, 255, 1)"
    });
});

function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.alpha -= 0.02;
        p.size *= 0.96;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    });

    requestAnimationFrame(draw);
}
draw();

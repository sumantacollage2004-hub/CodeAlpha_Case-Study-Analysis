/* =============================================
   MODERNA CASE STUDY — JAVASCRIPT
   Slide navigation + keyboard + animations
   ============================================= */

const totalSlides = 11;
let currentSlide = 0;
let isAnimating = false;

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const counter = document.getElementById('slide-counter');
const progressFill = document.getElementById('progress-fill');

function updateUI() {
  // Counter
  const num = String(currentSlide + 1).padStart(2, '0');
  const tot = String(totalSlides).padStart(2, '0');
  counter.textContent = `${num} / ${tot}`;

  // Progress bar
  const pct = ((currentSlide + 1) / totalSlides) * 100;
  progressFill.style.width = pct + '%';

  // Dots
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

  // Prev/Next buttons
  document.getElementById('prev-btn').style.opacity = currentSlide === 0 ? '0.3' : '1';
  document.getElementById('next-btn').style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
}

function goToSlide(index) {
  if (isAnimating || index === currentSlide) return;
  if (index < 0 || index >= totalSlides) return;

  isAnimating = true;

  const oldSlide = slides[currentSlide];
  const newSlide = slides[index];
  const goingForward = index > currentSlide;

  // Exit current
  oldSlide.classList.remove('active');
  oldSlide.classList.add('exit-left');

  // Set up entering slide direction
  newSlide.style.transform = goingForward ? 'translateX(60px)' : 'translateX(-60px)';
  newSlide.style.opacity = '0';

  // Tiny delay for browser paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      newSlide.classList.add('active');
      newSlide.style.transform = '';
      newSlide.style.opacity = '';

      setTimeout(() => {
        oldSlide.classList.remove('exit-left');
        isAnimating = false;
      }, 520);
    });
  });

  currentSlide = index;
  updateUI();
}

function changeSlide(direction) {
  goToSlide(currentSlide + direction);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    changeSlide(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    changeSlide(-1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(totalSlides - 1);
  }
});

// Touch/swipe support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = touchStartX - e.changedTouches[0].screenX;
  const dy = touchStartY - e.changedTouches[0].screenY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    changeSlide(dx > 0 ? 1 : -1);
  }
}, { passive: true });

// Mouse wheel support (debounced)
let wheelTimeout = null;
document.addEventListener('wheel', (e) => {
  if (wheelTimeout) return;
  wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 600);
  if (Math.abs(e.deltaY) > 30) changeSlide(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

// Entrance animations for active slide elements
function animateSlideIn() {
  const active = slides[currentSlide];
  const cards = active.querySelectorAll('.stat-card, .app-card, .challenge-card, .process-step, .tl-item, .outlook-card, .rc-bar-wrap');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '';
      card.style.transform = '';
    }, i * 80 + 100);
  });
}

// Watch for slide changes to trigger animations
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mut) => {
    if (mut.type === 'attributes' && mut.attributeName === 'class') {
      const el = mut.target;
      if (el.classList.contains('active')) {
        setTimeout(animateSlideIn, 100);
      }
    }
  });
});

slides.forEach(s => observer.observe(s, { attributes: true }));

// Init
updateUI();
setTimeout(animateSlideIn, 200);

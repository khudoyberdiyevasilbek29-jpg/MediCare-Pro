// ===== NAV SCROLL =====
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav && (nav.classList.toggle('scrolled', window.scrollY > 40));
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ['home','features','services','doctors','testimonials','pricing','contact'];
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.textContent.toLowerCase().includes(current) || (current === 'home' && link.textContent === 'Home')) {
      link.classList.add('active');
    }
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); closeMobileMenu(); }
}

// ===== MOBILE MENU =====
function openMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('open');
  document.getElementById('mobileOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('mobileMenuClose')?.addEventListener('click', closeMobileMenu);
document.getElementById('mobileOverlay')?.addEventListener('click', closeMobileMenu);

// ===== MODALS =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
});

// ===== BOOKING MODAL =====
let currentStep = 1;
const TOTAL_STEPS = 3;

function openBookingModal(service = '', doctor = '') {
  currentStep = 1;
  updateBookingStep();
  if (service && document.getElementById('bookingService')) document.getElementById('bookingService').value = service;
  if (doctor && document.getElementById('bookingDoctor')) document.getElementById('bookingDoctor').value = doctor;
  openModal('bookingModal');
  initCalendar();
}

function updateBookingStep() {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const step = document.getElementById(`booking-step-${i}`);
    const bar = document.getElementById(`step-bar-${i}`);
    if (step) step.style.display = i === currentStep ? 'block' : 'none';
    if (bar) bar.classList.toggle('active', i <= currentStep);
  }
  const success = document.getElementById('booking-success');
  const footer = document.getElementById('bookingFooter');
  const prevBtn = document.getElementById('bookingPrevBtn');
  const nextBtn = document.getElementById('bookingNextBtn');
  if (success) success.classList.remove('show');
  if (footer) footer.style.display = 'flex';
  if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
  if (nextBtn) nextBtn.textContent = currentStep === TOTAL_STEPS ? '✅ Confirm Booking' : 'Continue →';
}

function bookingNext() {
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    updateBookingStep();
    if (currentStep === 2) initCalendar();
  } else {
    // Show success
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const s = document.getElementById(`booking-step-${i}`); if (s) s.style.display = 'none';
    }
    document.getElementById('booking-success')?.classList.add('show');
    document.getElementById('bookingFooter').style.display = 'none';
    showToast('success', 'Appointment Booked!', 'Confirmation sent to your email.');
  }
}

function bookingPrev() {
  if (currentStep > 1) { currentStep--; updateBookingStep(); }
}

// Time slot selection
document.addEventListener('click', e => {
  if (e.target.classList.contains('time-slot') && !e.target.classList.contains('disabled')) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    e.target.classList.add('selected');
  }
});

// ===== MINI CALENDAR =====
let calYear = 2026, calMonth = 1; // 0-indexed, Feb
function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const cal = document.getElementById('bookingCalendar');
  if (!cal) return;
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  let html = `<div class="calendar-header">
    <button class="calendar-nav" onclick="prevMonth()">‹</button>
    <span class="calendar-month">${monthNames[calMonth]} ${calYear}</span>
    <button class="calendar-nav" onclick="nextMonth()">›</button>
  </div>
  <div class="calendar-grid">
    ${days.map(d => `<div class="calendar-day-name">${d}</div>`).join('')}`;

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-day other-month">${new Date(calYear, calMonth, -firstDay + i + 1).getDate()}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
    const isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    html += `<div class="calendar-day${isToday ? ' today' : ''}${isPast ? ' disabled' : ''}" onclick="selectDay(this, ${d})">${d}</div>`;
  }
  html += '</div>';
  cal.innerHTML = html;
}

function prevMonth() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); }
function nextMonth() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); }
function selectDay(el, d) {
  if (el.classList.contains('disabled')) return;
  document.querySelectorAll('.calendar-day').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ===== CONTACT FORM =====
function submitContactForm(e) {
  e.preventDefault();
  showToast('success', 'Message Sent!', "We'll get back to you within 24 hours.");
  e.target.reset();
}

// ===== TOAST =====
function showToast(type, title, message, duration = 4000) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close" onclick="this.parentElement.remove()">✕</div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
});

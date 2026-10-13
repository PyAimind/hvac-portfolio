// ===== Main logic — populate sections from JSON =====

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }
});
// ===== About page — populate dynamic content =====

document.addEventListener('DOMContentLoaded', async function() {
  const profile = await fetchJSON('data/profile.json');
  if (!profile) return;

  const summary = document.getElementById('about-summary');
  if (summary && profile.summary) summary.textContent = profile.summary;

  const location = document.getElementById('about-location');
  if (location && profile.location) location.textContent = profile.location;
});
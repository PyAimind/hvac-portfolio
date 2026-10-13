// ===== Projects page — render all projects =====

document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const projects = await fetchJSON('data/projects.json');
  if (!projects || projects.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);">No projects available yet.</p>';
    return;
  }

  projects.forEach(function(project, index) {
    const card = createProjectCard(project, index);
    container.appendChild(card);
  });

  if (window.AOS) AOS.refresh();
});

function createProjectCard(project, index) {
  const tagsHTML = (project.tags || []).map(function(tag) {
    return '<span class="tag">' + escapeHTML(tag) + '</span>';
  }).join('');

  const statsHTML = (project.stats || []).map(function(stat) {
    return '<div>' +
      '<span class="project-card__stat-value">' + escapeHTML(stat.value) + '</span>' +
      '<span class="project-card__stat-label">' + escapeHTML(stat.label) + '</span>' +
      '</div>';
  }).join('');

  const card = createElement('article', 'project-card',
    '<div class="project-card__image">' +
      '<img src="' + escapeHTML(project.cover) + '" alt="' + escapeHTML(project.name) + '" loading="lazy">' +
    '</div>' +
    '<div class="project-card__body">' +
      '<div class="project-card__tags">' + tagsHTML + '</div>' +
      '<h3>' + escapeHTML(project.name) + '</h3>' +
      '<p>' + escapeHTML(project.summary) + '</p>' +
      (statsHTML ? '<div class="project-card__stats">' + statsHTML + '</div>' : '') +
      '<a href="project.html?id=' + encodeURIComponent(project.id) + '" class="project-card__link">View Case Study →</a>' +
    '</div>'
  );
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', (index * 100).toString());
  card.addEventListener('click', function(e) {
    if (e.target.closest('a')) return;
    window.location.href = 'project.html?id=' + encodeURIComponent(project.id);
  });
  return card;
}
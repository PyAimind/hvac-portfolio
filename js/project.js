// ===== Project detail page =====

document.addEventListener('DOMContentLoaded', async function() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    showError('No project specified.');
    return;
  }

  const projects = await fetchJSON('data/projects.json');
  if (!projects) {
    showError('Could not load project data.');
    return;
  }

  const project = projects.find(function(p) { return p.id === projectId; });
  if (!project) {
    showError('Project not found.');
    return;
  }

  document.title = project.name + ' — Reza Valizadeh';
  renderProject(project);
});

function showError(message) {
  const title = document.getElementById('project-title');
  if (title) title.textContent = message;
  const back = document.querySelector('.back-link');
  if (back) back.href = 'projects.html';
}

function renderProject(project) {
  // Title & summary
  document.getElementById('project-title').textContent = project.name;
  document.getElementById('project-summary').textContent = project.summary || '';

  // Tags
  const tagsContainer = document.getElementById('project-tags');
  (project.tags || []).forEach(function(tag) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagsContainer.appendChild(span);
  });

  // Cover
  const coverImg = document.getElementById('project-cover');
  if (project.cover) {
    coverImg.src = project.cover;
    coverImg.alt = project.name;
  } else {
    document.querySelector('.project-cover-section').style.display = 'none';
  }

  // Meta grid
  const meta = document.getElementById('project-meta');
  const metaItems = [
    { label: 'Location', value: project.location },
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
    { label: 'Category', value: project.category }
  ];
  metaItems.forEach(function(item) {
    if (!item.value) return;
    const div = document.createElement('div');
    div.className = 'meta-card';
    div.setAttribute('data-aos', 'fade-up');
    div.innerHTML =
      '<span class="meta-card__label">' + escapeHTML(item.label) + '</span>' +
      '<span class="meta-card__value">' + escapeHTML(item.value) + '</span>';
    meta.appendChild(div);
  });

  // Stats
  if (project.stats && project.stats.length > 0) {
    const statsDiv = document.createElement('div');
    statsDiv.className = 'meta-card meta-card--stats';
    statsDiv.setAttribute('data-aos', 'fade-up');
    let statsHTML = '<span class="meta-card__label">Key Numbers</span>';
    statsHTML += '<div class="meta-stats">';
    project.stats.forEach(function(stat) {
      statsHTML +=
        '<div class="meta-stat">' +
          '<span class="meta-stat__value">' + escapeHTML(stat.value) + '</span>' +
          '<span class="meta-stat__label">' + escapeHTML(stat.label) + '</span>' +
        '</div>';
    });
    statsHTML += '</div>';
    statsDiv.innerHTML = statsHTML;
    meta.appendChild(statsDiv);
  }

  // Challenges
  const challengesContainer = document.getElementById('project-challenges');
  if (project.challenges && project.challenges.length > 0) {
    project.challenges.forEach(function(item, index) {
      const div = document.createElement('div');
      div.className = 'challenge-card';
      div.setAttribute('data-aos', 'fade-up');
      div.setAttribute('data-aos-delay', (index * 100).toString());
      div.innerHTML =
        '<div class="challenge-card__row">' +
          '<span class="challenge-card__label challenge-card__label--problem">Challenge</span>' +
          '<p class="challenge-card__text">' + escapeHTML(item.problem) + '</p>' +
        '</div>' +
        '<div class="challenge-card__row">' +
          '<span class="challenge-card__label challenge-card__label--solution">Solution</span>' +
          '<p class="challenge-card__text">' + escapeHTML(item.solution) + '</p>' +
        '</div>';
      challengesContainer.appendChild(div);
    });
  } else {
    document.querySelector('.project-challenges-section').style.display = 'none';
  }

  if (window.AOS) AOS.refresh();
}
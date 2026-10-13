// ===== Main logic — populate sections from JSON =====

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize AOS animations
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }

  // Mobile navbar toggle
  var toggle = document.getElementById('navbar-toggle');
  var nav = document.getElementById('navbar-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('is-open');
    });
  }

  // Load all data in parallel
  const [profile, skills, experience, certifications, projects] = await Promise.all([
    fetchJSON('data/profile.json'),
    fetchJSON('data/skills.json'),
    fetchJSON('data/experience.json'),
    fetchJSON('data/certifications.json'),
    fetchJSON('data/projects.json')
  ]);

  // Populate sections
  if (profile) {
    renderHeroTagline(profile);
    renderHeroStats(profile);
    renderLanguages(profile.languages);
  }
  if (skills) renderSkills(skills);
  if (experience) renderExperience(experience);
  if (certifications) renderCertifications(certifications);
  if (projects) renderFeaturedProjects(projects);

  // Refresh AOS after all content is rendered
  if (window.AOS) AOS.refresh();
});

// ===== HERO =====
function renderHeroTagline(profile) {
  const el = document.getElementById('hero-tagline');
  if (el && profile.tagline) el.textContent = profile.tagline;
}

function renderHeroStats(profile) {
  const container = document.getElementById('hero-stats');
  if (!container || !profile.stats) return;
  container.innerHTML = '';
  profile.stats.forEach(function(stat) {
    const el = createElement('div', 'stat',
      '<span class="stat__value">' + escapeHTML(stat.value) + '</span>' +
      '<span class="stat__label">' + escapeHTML(stat.label) + '</span>'
    );
    container.appendChild(el);
  });
}

// ===== SKILLS =====
function renderSkills(skills) {
  const container = document.getElementById('skills-grid');
  if (!container) return;
  container.innerHTML = '';
  skills.forEach(function(group, index) {
    const itemsHTML = group.items.map(function(item) {
      return '<li>' + escapeHTML(item) + '</li>';
    }).join('');
    const el = createElement('div', 'skill-card',
      '<h3>' + escapeHTML(group.title) + '</h3>' +
      '<ul>' + itemsHTML + '</ul>'
    );
    el.setAttribute('data-aos', 'fade-up');
    el.setAttribute('data-aos-delay', (index * 100).toString());
    container.appendChild(el);
  });
}

// ===== EXPERIENCE =====
function renderExperience(experience) {
  const container = document.getElementById('experience-timeline');
  if (!container) return;
  container.innerHTML = '';
  experience.forEach(function(job, index) {
    const highlightsHTML = (job.highlights || []).map(function(h) {
      return '<li>' + escapeHTML(h) + '</li>';
    }).join('');
    const el = createElement('div', 'timeline__item',
      '<span class="timeline__date">' + escapeHTML(job.period) + '</span>' +
      '<h3 class="timeline__role">' + escapeHTML(job.role) + '</h3>' +
      '<p class="timeline__company">' + escapeHTML(job.company) +
        (job.location ? ' · ' + escapeHTML(job.location) : '') + '</p>' +
      '<ul class="timeline__highlights">' + highlightsHTML + '</ul>'
    );
    el.setAttribute('data-aos', 'fade-up');
    el.setAttribute('data-aos-delay', (index * 100).toString());
    container.appendChild(el);
  });
}

// ===== CERTIFICATIONS =====
function renderCertifications(certifications) {
  const container = document.getElementById('certifications-grid');
  if (!container) return;
  container.innerHTML = '';
  certifications.forEach(function(cert, index) {
    let meta = '';
    if (cert.issuer) meta += escapeHTML(cert.issuer);
    if (cert.year) meta += (meta ? ' · ' : '') + escapeHTML(cert.year);
    const el = createElement('div', 'cred-card',
      '<h4>' + escapeHTML(cert.title) + '</h4>' +
      (meta ? '<p>' + meta + '</p>' : '')
    );
    el.setAttribute('data-aos', 'fade-up');
    el.setAttribute('data-aos-delay', (index * 80).toString());
    container.appendChild(el);
  });
}

// ===== LANGUAGES =====
function renderLanguages(languages) {
  const container = document.getElementById('languages-grid');
  if (!container || !languages) return;
  container.innerHTML = '';
  languages.forEach(function(lang, index) {
    const el = createElement('div', 'lang-card',
      '<div class="lang-card__name">' + escapeHTML(lang.name) + '</div>' +
      '<div class="lang-card__level">' + escapeHTML(lang.level) + '</div>'
    );
    el.setAttribute('data-aos', 'zoom-in');
    el.setAttribute('data-aos-delay', (index * 100).toString());
    container.appendChild(el);
  });
}

// ===== FEATURED PROJECTS =====
function renderFeaturedProjects(projects) {
  const container = document.getElementById('featured-projects');
  if (!container) return;
  container.innerHTML = '';

  // Only take projects that are featured or starred (or first 3)
  const featured = projects.filter(function(p) {
    return p.featured || p.starred;
  }).slice(0, 3);

  // If no featured flag, take first 3
  const list = featured.length > 0 ? featured : projects.slice(0, 3);

  list.forEach(function(project, index) {
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

    // Make whole card clickable
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
      window.location.href = 'project.html?id=' + encodeURIComponent(project.id);
    });

    container.appendChild(card);
  });
}
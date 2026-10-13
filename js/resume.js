// ===== Resume page — populate from JSON =====

document.addEventListener('DOMContentLoaded', async function() {
  const [profile, skills, experience, certifications] = await Promise.all([
    fetchJSON('data/profile.json'),
    fetchJSON('data/skills.json'),
    fetchJSON('data/experience.json'),
    fetchJSON('data/certifications.json')
  ]);

  if (profile) {
    document.getElementById('resume-name').textContent = profile.name || '—';
    document.getElementById('resume-title').textContent = profile.title || '—';
    document.getElementById('resume-location').textContent = profile.location || '';
    document.getElementById('resume-summary').textContent = profile.summary || '';

    // Languages
    const langContainer = document.getElementById('resume-languages');
    (profile.languages || []).forEach(function(lang) {
      const div = document.createElement('div');
      div.className = 'resume__language';
      div.innerHTML =
        '<span class="resume__language-name">' + escapeHTML(lang.name) + '</span>' +
        '<span class="resume__language-level">' + escapeHTML(lang.level) + '</span>';
      langContainer.appendChild(div);
    });
  }

  if (skills) renderResumeSkills(skills);
  if (experience) renderResumeExperience(experience);
  if (certifications) renderResumeCertifications(certifications);

  if (window.AOS) AOS.refresh();
});

function renderResumeSkills(skills) {
  const container = document.getElementById('resume-skills');
  skills.forEach(function(group) {
    const div = document.createElement('div');
    div.className = 'resume__skill-group';
    const itemsHTML = group.items.map(function(item) {
      return '<li>' + escapeHTML(item) + '</li>';
    }).join('');
    div.innerHTML =
      '<h4>' + escapeHTML(group.title) + '</h4>' +
      '<ul>' + itemsHTML + '</ul>';
    container.appendChild(div);
  });
}

function renderResumeExperience(experience) {
  const container = document.getElementById('resume-experience');
  experience.forEach(function(job) {
    const div = document.createElement('div');
    div.className = 'resume__job';
    const highlightsHTML = (job.highlights || []).map(function(h) {
      return '<li>' + escapeHTML(h) + '</li>';
    }).join('');
    div.innerHTML =
      '<div class="resume__job-header">' +
        '<h4 class="resume__job-role">' + escapeHTML(job.role) + '</h4>' +
        '<span class="resume__job-period">' + escapeHTML(job.period) + '</span>' +
      '</div>' +
      '<p class="resume__job-company">' + escapeHTML(job.company) +
        (job.location ? ' · ' + escapeHTML(job.location) : '') + '</p>' +
      '<ul class="resume__job-highlights">' + highlightsHTML + '</ul>';
    container.appendChild(div);
  });
}

function renderResumeCertifications(certifications) {
  const container = document.getElementById('resume-certifications');
  certifications.forEach(function(cert) {
    const div = document.createElement('div');
    div.className = 'resume__cert';
    let meta = '';
    if (cert.issuer) meta += escapeHTML(cert.issuer);
    if (cert.year) meta += (meta ? ' · ' : '') + escapeHTML(cert.year);
    div.innerHTML =
      '<h4>' + escapeHTML(cert.title) + '</h4>' +
      (meta ? '<p>' + meta + '</p>' : '');
    container.appendChild(div);
  });
}
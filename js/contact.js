// ===== Contact page =====

document.addEventListener('DOMContentLoaded', async function() {
  // ============ Contact info from profile.json ============
  const profile = await fetchJSON('data/profile.json');
  const list = document.getElementById('contact-info-list');
  if (profile && list) {
    const items = [
      { label: 'Email', value: profile.contact && profile.contact.email, href: 'mailto:' + (profile.contact?.email || '') },
      { label: 'LinkedIn', value: profile.contact && profile.contact.linkedin, href: profile.contact?.linkedin },
      { label: 'WhatsApp', value: profile.contact && profile.contact.whatsapp, href: 'https://wa.me/' + (profile.contact?.whatsapp || '').replace(/\D/g, '') },
      { label: 'Telegram', value: profile.contact && profile.contact.telegram, href: 'https://t.me/' + (profile.contact?.telegram || '').replace('@', '') },
      { label: 'Location', value: profile.location }
    ];

    items.forEach(function(item) {
      if (!item.value) return;
      const li = document.createElement('li');
      li.className = 'contact-item';
      let valueHTML = escapeHTML(item.value);
      if (item.href && item.value) {
        valueHTML = '<a href="' + escapeHTML(item.href) + '" target="_blank" rel="noopener">' + valueHTML + '</a>';
      }
      li.innerHTML =
        '<span class="contact-item__label">' + escapeHTML(item.label) + '</span>' +
        '<span class="contact-item__value">' + valueHTML + '</span>';
      list.appendChild(li);
    });

    if (list.children.length === 0) {
      list.innerHTML = '<li class="contact-item"><span class="contact-item__value">Contact details coming soon.</span></li>';
    }
  }

  // ============ Form submit handler (AJAX) ============
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Validation
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all required fields.';
        status.className = 'contact-form__status contact-form__status--error';
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      status.textContent = '';
      status.className = 'contact-form__status';

      // Gather form data
      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          status.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
          status.className = 'contact-form__status contact-form__status--success';
          form.reset();
        } else {
          throw new Error(result.message || 'Something went wrong.');
        }
      } catch (err) {
        status.textContent = 'Sorry, something went wrong. Please try again or email directly.';
        status.className = 'contact-form__status contact-form__status--error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }
});
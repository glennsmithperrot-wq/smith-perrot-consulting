(function () {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const navToggle = $('#nav-toggle');
  const navLinks = $('#nav-links');

  function closeNav() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    $$('.nav-links a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', anchor.getAttribute('href'));
    });
  });

  const sections = $$('section[id], header[id]');
  const navAnchors = $$('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const activateNav = () => {
      const current = sections.reduce((active, section) => {
        return section.getBoundingClientRect().top <= 130 ? section.id : active;
      }, 'home');

      navAnchors.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    };
    activateNav();
    window.addEventListener('scroll', activateNav, { passive: true });
  }

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  const scrollTop = $('#scroll-top');
  if (scrollTop) {
    const toggleScrollTop = () => scrollTop.classList.toggle('show', window.scrollY > 520);
    toggleScrollTop();
    window.addEventListener('scroll', toggleScrollTop, { passive: true });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function showMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-msg show ${type}`;
  }

  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const msg = $('#contact-msg');
      const submit = $('#contact-submit');

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        showMessage(msg, 'Please complete the required fields before sending.', 'error');
        return;
      }

      const originalText = submit ? submit.textContent : '';
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('Form submission failed');
        contactForm.reset();
        showMessage(msg, 'Thank you. Your message has been sent, and Glenn will follow up soon.', 'success');
      } catch (error) {
        showMessage(msg, 'Something went wrong. Please try again or email glennsmithperrot@gmail.com.', 'error');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = originalText;
        }
      }
    });
  }
})();

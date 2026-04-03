document.addEventListener('DOMContentLoaded', function () {

  // ===== SCROLL FADE-IN =====
  function initFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ===== SMOOTH ANCHOR SCROLL =====
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ===== ACTIVE NAV HIGHLIGHT =====
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.style.color = '';
          });
          var active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (active) {
            active.style.color = 'var(--accent-light)';
          }
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ===== REAL-TIME CITATION & PUBLICATION COUNT (OpenAlex) =====
  function initLiveStats() {
    var AUTHOR_ID = 'A5019932260';
    var API_URL = 'https://api.openalex.org/authors/' + AUTHOR_ID + '?select=cited_by_count,works_count';
    var FALLBACK_CITATIONS = '1,213+';
    var FALLBACK_WORKS = '64+';
    var TIMEOUT_MS = 5000;

    var elCitations = document.getElementById('stat-citations');
    var elPublications = document.getElementById('stat-publications');
    if (!elCitations && !elPublications) { return; }

    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    fetch(API_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) { throw new Error('Network response was not ok'); }
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data !== 'object') { throw new Error('Invalid response'); }

        var citations = data.cited_by_count;
        if (
          elCitations &&
          typeof citations === 'number' &&
          Number.isFinite(citations) &&
          citations >= 0
        ) {
          elCitations.textContent = citations.toLocaleString() + '+';
        }

        var works = data.works_count;
        if (
          elPublications &&
          typeof works === 'number' &&
          Number.isFinite(works) &&
          works >= 0
        ) {
          elPublications.textContent = works.toLocaleString() + '+';
        }
      })
      .catch(function () {
        clearTimeout(timer);
        if (elCitations) { elCitations.textContent = FALLBACK_CITATIONS; }
        if (elPublications) { elPublications.textContent = FALLBACK_WORKS; }
      });
  }

  // ===== HAMBURGER NAV TOGGLE =====
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!toggle || !nav) { return; }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      });
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  initFadeIn();
  initSmoothScroll();
  initNavHighlight();
  initLiveStats();
  initNavToggle();
});

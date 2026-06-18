document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var mobileMenu = document.querySelector('.mobile-menu-panel');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.hidden = !mobileMenu.hidden;
      menuButton.textContent = mobileMenu.hidden ? '☰' : '×';
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var selected = i === current;
        slide.classList.toggle('is-current', selected);
        slide.classList.toggle('opacity-100', selected);
        slide.classList.toggle('opacity-0', !selected);
      });
      dots.forEach(function (dot, i) {
        var selected = i === current;
        dot.classList.toggle('w-8', selected);
        dot.classList.toggle('bg-white', selected);
        dot.classList.toggle('w-2', !selected);
        dot.classList.toggle('bg-white/50', !selected);
      });
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    showSlide(0);
    restart();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var container = document.querySelector('[data-card-container]');
  var empty = document.querySelector('.search-empty');
  var searchPageForm = document.querySelector('[data-search-page-form]');

  function applyFilters() {
    if (!container) return;
    var cards = Array.prototype.slice.call(container.querySelectorAll('[data-search-card]'));
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-year') || ''
      ].join(' ').toLowerCase();
      var matchedQuery = !query || haystack.indexOf(query) !== -1;
      var matchedYear = !year || (card.getAttribute('data-year') || '') === year;
      var matched = matchedQuery && matchedYear;
      card.classList.toggle('card-hidden', !matched);
      if (matched) visible += 1;
    });

    if (empty) empty.hidden = visible !== 0;
  }

  if (filterInput && container) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) filterInput.value = q;
    filterInput.addEventListener('input', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    applyFilters();
  }

  if (searchPageForm && filterInput) {
    searchPageForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var nextUrl = './search.html';
      var value = filterInput.value.trim();
      if (value) nextUrl += '?q=' + encodeURIComponent(value);
      window.history.replaceState(null, '', nextUrl);
      applyFilters();
    });
  }
});

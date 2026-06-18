(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    var nextSlide = function () {
      showSlide(current + 1);
    };

    var startTimer = function () {
      window.clearInterval(timer);
      timer = window.setInterval(nextSlide, 5000);
    };

    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    startTimer();
  }

  var filterScope = document.querySelector('[data-filter-scope]');

  if (filterScope) {
    var searchInput = filterScope.querySelector('[data-card-search]');
    var sortSelect = filterScope.querySelector('[data-card-sort]');
    var list = document.querySelector('[data-card-list]');
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];

    var applyFilter = function () {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        card.style.display = text.indexOf(query) === -1 ? 'none' : '';
      });
    };

    var applySort = function () {
      if (!list || !sortSelect) {
        return;
      }
      var value = sortSelect.value;
      var sorted = cards.slice();
      if (value === 'year') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        });
      }
      if (value === 'title') {
        sorted.sort(function (a, b) {
          return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
        });
      }
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
      cards = sorted;
      applyFilter();
    };

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', applySort);
    }
  }

  var results = document.getElementById('search-results');

  if (results && window.SEARCH_ITEMS) {
    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get('q') || '';
    var pageInput = document.querySelector('.page-search input[name="q"]');
    var summary = document.querySelector('.search-summary');

    if (pageInput) {
      pageInput.value = queryValue;
    }

    var query = queryValue.trim().toLowerCase();
    var matched = query ? window.SEARCH_ITEMS.filter(function (item) {
      return [item.title, item.category, item.region, item.genre, item.tags, item.oneLine].join(' ').toLowerCase().indexOf(query) !== -1;
    }).slice(0, 120) : [];

    if (summary) {
      summary.textContent = query ? '与“' + queryValue + '”相关的影片。' : '输入关键词后展示相关影片。';
    }

    results.innerHTML = matched.map(function (item) {
      return '<article class="movie-card">' +
        '<a href="' + item.url + '" class="card-cover" aria-label="' + escapeHtml(item.title) + '">' +
        '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<span class="duration">' + item.duration + '</span>' +
        '<span class="play-badge"></span>' +
        '</a>' +
        '<div class="card-body">' +
        '<div class="card-meta"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.year) + '</span></div>' +
        '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>' +
        '<p>' + escapeHtml(item.oneLine) + '</p>' +
        '<div class="tag-list">' + item.tags.split(',').slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>' +
        '<div class="card-stats"><span>' + item.views + ' 观看</span><span>' + item.likes + ' 喜欢</span></div>' +
        '</div>' +
        '</article>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }
})();

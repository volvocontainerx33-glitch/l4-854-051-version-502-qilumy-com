(function () {
  var body = document.body;
  var menuButton = document.querySelector('[data-menu-toggle]');

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    startTimer();
  }

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var input = searchPage.querySelector('[data-search-input]');
    var category = searchPage.querySelector('[data-category-filter]');
    var year = searchPage.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-movie-card]'));
    var emptyState = searchPage.querySelector('[data-empty-state]');

    if (input) {
      input.value = params.get('q') || '';
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var keyword = normalize(input && input.value);
      var categoryValue = category ? category.value : '';
      var yearValue = year ? year.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search') || card.textContent);
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
        var matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var show = matchKeyword && matchCategory && matchYear;

        card.hidden = !show;

        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [input, category, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();

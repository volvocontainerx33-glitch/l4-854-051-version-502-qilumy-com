(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  ready(function() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function() {
        mobileNav.classList.toggle("open");
        document.body.classList.toggle("nav-open", mobileNav.classList.contains("open"));
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      }

      function play() {
        stop();
        timer = window.setInterval(function() {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function() {
          show(current - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function() {
          show(current + 1);
          play();
        });
      }

      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          show(Number(dot.getAttribute("data-hero-dot") || 0));
          play();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", play);
      show(0);
      play();
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var searchInput = filterRoot.querySelector("[data-local-search]");
      var yearSelect = filterRoot.querySelector("[data-year-filter]");
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
      var empty = filterRoot.querySelector("[data-empty-state]");

      function applyFilter() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function(card) {
          var text = card.getAttribute("data-search") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matched = (!keyword || text.indexOf(keyword) !== -1) && (!year || cardYear === year);
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("active", visible === 0);
        }
      }

      if (searchInput) {
        searchInput.addEventListener("input", applyFilter);
      }
      if (yearSelect) {
        yearSelect.addEventListener("change", applyFilter);
      }
      applyFilter();
    }

    var searchPage = document.querySelector("[data-search-page]");
    if (searchPage && window.siteMovies) {
      var form = searchPage.querySelector("[data-global-search-form]");
      var input = searchPage.querySelector("[data-global-search-input]");
      var results = searchPage.querySelector("[data-search-results]");
      var emptyBox = searchPage.querySelector("[data-search-empty]");
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";

      function cardTemplate(movie) {
        return [
          "<article class=\"movie-card\">",
          "<a class=\"movie-thumb\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">",
          "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
          "<span class=\"thumb-mask\"></span>",
          "<span class=\"duration\">" + escapeHtml(movie.duration) + "</span>",
          "<span class=\"play-symbol\">▶</span>",
          "</a>",
          "<div class=\"movie-info\">",
          "<a class=\"movie-title\" href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a>",
          "<p>" + escapeHtml(movie.oneLine) + "</p>",
          "<div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.genre) + "</span></div>",
          "</div>",
          "</article>"
        ].join("");
      }

      function render(query) {
        var keyword = String(query || "").trim().toLowerCase();
        if (input) {
          input.value = query || "";
        }
        if (!keyword) {
          results.innerHTML = "";
          emptyBox.textContent = "输入关键词开始查找影片";
          emptyBox.classList.add("active");
          return;
        }
        var matched = window.siteMovies.filter(function(movie) {
          return movie.search.indexOf(keyword) !== -1;
        }).slice(0, 120);
        results.innerHTML = matched.map(cardTemplate).join("");
        emptyBox.textContent = matched.length ? "" : "没有匹配的影片";
        emptyBox.classList.toggle("active", matched.length === 0);
      }

      if (form) {
        form.addEventListener("submit", function(event) {
          event.preventDefault();
          var value = input ? input.value.trim() : "";
          var nextUrl = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
          window.history.replaceState(null, "", nextUrl);
          render(value);
        });
      }

      if (input) {
        input.addEventListener("input", function() {
          render(input.value);
        });
      }

      render(initial);
    }
  });
})();

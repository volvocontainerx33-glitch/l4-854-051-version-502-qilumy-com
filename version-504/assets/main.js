(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll(".site-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          return;
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    if (slides.length) {
      var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
      var index = slides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
      });
      if (index < 0) {
        index = 0;
      }
      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }
      var prev = document.querySelector(".hero-prev");
      var next = document.querySelector(".hero-next");
      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-slide")) || 0);
        });
      });
      window.setInterval(function () {
        show(index + 1);
      }, 6500);
    }

    var cardList = document.querySelector("[data-list='cards']");
    var searchInput = document.getElementById("page-search");
    var sortSelect = document.getElementById("sort-select");
    var visibleCount = document.getElementById("visible-count");
    if (cardList && searchInput) {
      var cards = Array.prototype.slice.call(cardList.children);
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      if (query) {
        searchInput.value = query;
      }
      function refresh() {
        var term = normalize(searchInput.value);
        var shown = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-text") || card.textContent);
          var matched = !term || text.indexOf(term) !== -1;
          card.classList.toggle("is-filtered-out", !matched);
          if (matched) {
            shown += 1;
          }
        });
        if (visibleCount) {
          visibleCount.textContent = shown ? "当前显示 " + shown + " 部影片" : "没有找到匹配影片";
        }
      }
      function sortCards() {
        var mode = sortSelect ? sortSelect.value : "default";
        var sorted = cards.slice();
        if (mode === "latest") {
          sorted.sort(function (a, b) {
            return String(b.getAttribute("data-date")).localeCompare(String(a.getAttribute("data-date")));
          });
        } else if (mode === "views") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
          });
        } else if (mode === "likes") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-likes")) - Number(a.getAttribute("data-likes"));
          });
        } else if (mode === "year") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          });
        }
        sorted.forEach(function (card) {
          cardList.appendChild(card);
        });
        refresh();
      }
      searchInput.addEventListener("input", refresh);
      if (sortSelect) {
        sortSelect.addEventListener("change", sortCards);
      }
      sortCards();
    }
  });
})();

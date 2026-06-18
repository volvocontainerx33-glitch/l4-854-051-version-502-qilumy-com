(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.getElementById("mainNav");
        var search = document.querySelector(".header-search");
        if (toggle && nav && search) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("open");
                search.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (slides.length) {
            var current = 0;
            var show = function (index) {
                current = index;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });
            setInterval(function () {
                show((current + 1) % slides.length);
            }, 5200);
        }

        var filters = Array.prototype.slice.call(document.querySelectorAll("[data-live-search]"));
        filters.forEach(function (input) {
            var target = document.querySelector(input.getAttribute("data-live-search"));
            if (!target) {
                return;
            }
            var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card"));
            input.addEventListener("input", function () {
                var value = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || "")).toLowerCase();
                    card.style.display = !value || text.indexOf(value) !== -1 ? "" : "none";
                });
            });
        });

        var resultBox = document.getElementById("search-results");
        if (resultBox && window.SITE_MOVIES) {
            var params = new URLSearchParams(window.location.search);
            var q = (params.get("q") || "").trim().toLowerCase();
            var input = document.getElementById("searchInput");
            if (input) {
                input.value = params.get("q") || "";
            }
            var source = window.SITE_MOVIES.filter(function (movie) {
                if (!q) {
                    return true;
                }
                var text = [movie.title, movie.year, movie.region, movie.genre, movie.oneLine].join(" ").toLowerCase();
                return text.indexOf(q) !== -1;
            }).slice(0, 160);
            if (!source.length) {
                resultBox.innerHTML = '<div class="empty-result">没有找到匹配的影片。</div>';
                return;
            }
            resultBox.innerHTML = source.map(function (movie) {
                return [
                    '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-meta="' + escapeHtml(movie.region + ' ' + movie.genre + ' ' + movie.year) + '">',
                    '    <a class="poster" href="' + movie.url + '">',
                    '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                    '        <span class="poster-badge">' + escapeHtml(movie.region) + '</span>',
                    '    </a>',
                    '    <div class="card-body">',
                    '        <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
                    '        <p>' + escapeHtml(movie.oneLine) + '</p>',
                    '        <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
                    '    </div>',
                    '</article>'
                ].join('');
            }).join('');
        }
    });

    function escapeHtml(text) {
        return String(text || "").replace(/[&<>"']/g, function (ch) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#39;"
            }[ch];
        });
    }
})();

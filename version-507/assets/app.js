(function () {
    var navButton = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (slides.length > 1) {
        var active = 0;
        var showSlide = function (index) {
            active = index % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });
        window.setInterval(function () {
            showSlide(active + 1);
        }, 5600);
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var regionSelect = document.querySelector('[data-region-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var runFilter = function () {
        if (!cards.length || (!filterInput && !yearSelect && !regionSelect)) {
            return;
        }
        var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var y = yearSelect ? yearSelect.value : '';
        var r = regionSelect ? regionSelect.value : '';
        var shown = 0;
        cards.forEach(function (card) {
            var haystack = [card.dataset.title, card.dataset.tags, card.dataset.year, card.dataset.region].join(' ').toLowerCase();
            var okText = !q || haystack.indexOf(q) !== -1;
            var okYear = !y || card.dataset.year === y;
            var okRegion = !r || card.dataset.region === r;
            var visible = okText && okYear && okRegion;
            card.style.display = visible ? '' : 'none';
            if (visible) {
                shown += 1;
            }
        });
        if (emptyState) {
            emptyState.style.display = shown ? 'none' : 'block';
        }
    };
    [filterInput, yearSelect, regionSelect].forEach(function (el) {
        if (el) {
            el.addEventListener('input', runFilter);
            el.addEventListener('change', runFilter);
        }
    });
    runFilter();

    var searchRoot = document.querySelector('[data-search-results]');
    if (searchRoot && window.SEARCH_INDEX) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        var input = document.querySelector('[data-search-page-input]');
        if (input) {
            input.value = q;
        }
        var render = function (query) {
            var value = query.trim().toLowerCase();
            var list = window.SEARCH_INDEX.filter(function (item) {
                if (!value) {
                    return item.hot;
                }
                return [item.title, item.region, item.year, item.genre, item.tags, item.one].join(' ').toLowerCase().indexOf(value) !== -1;
            }).slice(0, 120);
            searchRoot.innerHTML = list.map(function (item) {
                return '<article class="movie-card">' +
                    '<a class="poster-link" href="./' + item.file + '" aria-label="' + escapeHtml(item.title) + '">' +
                    '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                    '<span class="poster-shade"></span><span class="play-badge">▶</span><span class="card-region">' + escapeHtml(item.region) + '</span>' +
                    '</a>' +
                    '<div class="movie-card-body">' +
                    '<a class="movie-title" href="./' + item.file + '">' + escapeHtml(item.title) + '</a>' +
                    '<p>' + escapeHtml(item.one) + '</p>' +
                    '<div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.genre) + '</span></div>' +
                    '<a class="category-chip" href="./category-' + item.category + '.html">进入分类</a>' +
                    '</div></article>';
            }).join('');
            var empty = document.querySelector('[data-search-empty]');
            if (empty) {
                empty.style.display = list.length ? 'none' : 'block';
            }
        };
        var escapeHtml = function (value) {
            return String(value).replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            });
        };
        render(q);
        var searchForm = document.querySelector('[data-search-page-form]');
        if (searchForm && input) {
            searchForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var value = input.value.trim();
                var next = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
                window.history.replaceState(null, '', next);
                render(value);
            });
        }
    }
})();

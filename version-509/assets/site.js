(function () {
    function queryAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    queryAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var value = input ? input.value.trim() : '';
            var target = './search.html';
            if (value) {
                target += '?q=' + encodeURIComponent(value);
            }
            window.location.href = target;
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = queryAll('[data-hero-slide]', hero);
        var dots = queryAll('[data-hero-dot]', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });
        show(0);
        restart();
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var regionSelect = document.querySelector('[data-region-filter]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var cards = queryAll('.searchable-card');
    var empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var region = regionSelect ? regionSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var cardRegion = card.getAttribute('data-region') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchRegion = !region || cardRegion.indexOf(region) !== -1;
            var matchYear = !year || cardYear === year;
            var shouldShow = matchKeyword && matchRegion && matchYear;
            card.style.display = shouldShow ? '' : 'none';
            if (shouldShow) {
                visible += 1;
            }
        });

        if (empty) {
            empty.style.display = visible ? 'none' : 'block';
        }
    }

    if (filterInput || regionSelect || yearSelect) {
        [filterInput, regionSelect, yearSelect].forEach(function (field) {
            if (field) {
                field.addEventListener('input', applyFilters);
                field.addEventListener('change', applyFilters);
            }
        });
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && filterInput) {
            filterInput.value = query;
        }
        applyFilters();
    }
})();

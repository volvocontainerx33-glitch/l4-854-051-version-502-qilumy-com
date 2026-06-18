(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function bindSearchForms() {
        qsa('[data-site-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = qs('input', form);
                var value = input ? input.value.trim() : '';
                var target = './search.html';
                if (value) {
                    target += '?q=' + encodeURIComponent(value);
                }
                window.location.href = target;
            });
        });
    }

    function bindMobileMenu() {
        var button = qs('[data-menu-toggle]');
        var panel = qs('[data-mobile-menu]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function bindHero() {
        var carousel = qs('[data-carousel]');
        if (!carousel) {
            return;
        }
        var slides = qsa('.hero-slide', carousel);
        var dots = qsa('.hero-dot', carousel);
        if (!slides.length) {
            return;
        }
        var active = 0;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('is-active', idx === active);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('is-active', idx === active);
            });
        }
        dots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                show(idx);
            });
        });
        window.setInterval(function () {
            show(active + 1);
        }, 5200);
    }

    function normalize(value) {
        return String(value || '').toLowerCase();
    }

    function bindFilters() {
        qsa('[data-filter-area]').forEach(function (area) {
            var input = qs('[data-filter-input]', area);
            var chips = qsa('[data-filter-chip]', area);
            var cards = qsa('[data-movie-card]', area);
            var empty = qs('[data-empty]', area);
            var activeFilter = 'all';

            function apply() {
                var query = normalize(input ? input.value : '');
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-search'));
                    var matchesText = !query || text.indexOf(query) !== -1;
                    var matchesFilter = activeFilter === 'all' || text.indexOf(normalize(activeFilter)) !== -1;
                    var keep = matchesText && matchesFilter;
                    card.style.display = keep ? '' : 'none';
                    if (keep) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }

            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    activeFilter = chip.getAttribute('data-filter-chip') || 'all';
                    chips.forEach(function (item) {
                        item.classList.toggle('is-active', item === chip);
                    });
                    apply();
                });
            });

            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q && input) {
                input.value = q;
            }
            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindSearchForms();
        bindMobileMenu();
        bindHero();
        bindFilters();
    });
}());

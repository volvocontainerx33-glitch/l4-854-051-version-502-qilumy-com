(function () {
    function mount(videoId, streamUrl) {
        var video = document.getElementById(videoId);
        if (!video) {
            return;
        }
        var box = video.closest('.player-box');
        var overlay = box ? box.querySelector('.play-overlay') : null;
        var ready = false;
        var hls = null;

        function attach() {
            if (ready) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                return;
            }
            video.src = streamUrl;
        }

        function reveal() {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        }

        function conceal() {
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
        }

        function start() {
            attach();
            reveal();
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {
                    conceal();
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', reveal);
        video.addEventListener('pause', function () {
            if (!video.ended) {
                conceal();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.MoviePlayer = {
        mount: mount
    };
}());

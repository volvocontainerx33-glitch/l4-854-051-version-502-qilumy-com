(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    shells.forEach(function (shell) {
        var video = shell.querySelector('video');
        var overlay = shell.querySelector('.video-overlay');
        var button = shell.querySelector('.video-play-button');
        if (!video || !overlay || !button) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var initialized = false;
        var hls = null;
        var prepare = function () {
            if (initialized) {
                return;
            }
            initialized = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            }
        };
        var start = function (event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            prepare();
            overlay.classList.add('is-hidden');
            video.controls = true;
            var playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        };
        overlay.addEventListener('click', start);
        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (!initialized) {
                start();
            }
        });
        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();

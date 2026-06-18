(function () {
    function bindPlayer(shell) {
        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        var button = shell.querySelector(".play-trigger");
        var source = shell.getAttribute("data-video-src");
        var loaded = false;

        function start() {
            if (!video || !source) {
                return;
            }
            if (!loaded) {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    shell._hls = hls;
                } else {
                    video.src = source;
                }
                loaded = true;
            }
            shell.classList.add("is-playing");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", start);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                start();
            });
        }
        if (video) {
            video.addEventListener("click", function () {
                if (!loaded) {
                    start();
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            Array.prototype.forEach.call(document.querySelectorAll(".player-shell"), bindPlayer);
        });
    } else {
        Array.prototype.forEach.call(document.querySelectorAll(".player-shell"), bindPlayer);
    }
})();

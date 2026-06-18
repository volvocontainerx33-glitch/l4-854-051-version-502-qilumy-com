(function () {
  window.initMoviePlayer = function (streamUrl) {
    var shell = document.querySelector(".player-shell");
    if (!shell) {
      return;
    }
    var video = shell.querySelector("video");
    var start = shell.querySelector(".player-start");
    var attached = false;
    var hls = null;

    function attach() {
      if (attached || !video) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function play() {
      attach();
      if (start) {
        start.classList.add("is-hidden");
      }
      video.controls = true;
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }

    if (start) {
      start.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
    }
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();

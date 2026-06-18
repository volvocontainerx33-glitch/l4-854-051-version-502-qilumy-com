(function () {
  window.startMoviePlayer = function (source) {
    var video = document.getElementById('main-video');
    var shell = document.getElementById('player-shell');
    var overlay = document.getElementById('player-overlay');
    var startButton = document.getElementById('player-start');
    var toggleButton = document.getElementById('player-toggle');
    var muteButton = document.getElementById('player-mute');
    var fullscreenButton = document.getElementById('player-fullscreen');
    var hls = null;

    if (!video || !source) return;

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) return;
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else {
      video.src = source;
    }

    function setOverlay() {
      if (!overlay) return;
      overlay.classList.toggle('player-overlay-hidden', !video.paused);
    }

    function updateButtons() {
      if (toggleButton) toggleButton.textContent = video.paused ? '▶' : 'Ⅱ';
      if (muteButton) muteButton.textContent = video.muted ? '🔇' : '🔊';
      setOverlay();
    }

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function toggleVideo() {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    if (startButton) startButton.addEventListener('click', playVideo);
    if (overlay) overlay.addEventListener('click', playVideo);
    if (toggleButton) toggleButton.addEventListener('click', toggleVideo);
    video.addEventListener('click', function () {
      toggleVideo();
    });

    if (muteButton) {
      muteButton.addEventListener('click', function () {
        video.muted = !video.muted;
        updateButtons();
      });
    }

    if (fullscreenButton && shell) {
      fullscreenButton.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (shell.requestFullscreen) {
          shell.requestFullscreen();
        }
      });
    }

    video.addEventListener('play', updateButtons);
    video.addEventListener('pause', updateButtons);
    video.addEventListener('volumechange', updateButtons);
    updateButtons();
  };
})();

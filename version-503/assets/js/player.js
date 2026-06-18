(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));

  players.forEach(function (box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.player-cover');
    var button = box.querySelector('.player-start');
    var stream = box.getAttribute('data-stream');
    var hlsInstance = null;
    var ready = false;

    var load = function () {
      if (!video || !stream) {
        return;
      }

      if (!ready) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
        ready = true;
      }

      box.classList.add('is-playing');
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    };

    if (cover) {
      cover.addEventListener('click', load);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        load();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          load();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();

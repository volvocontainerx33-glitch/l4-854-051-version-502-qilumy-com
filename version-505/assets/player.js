(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-player]'));

  players.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-button');
    var state = shell.querySelector('.player-state');
    var source = video ? video.getAttribute('data-play-url') : '';
    var ready = false;
    var hls = null;

    function setState(message) {
      if (state) {
        state.textContent = message;
      }
    }

    function prepareVideo() {
      if (!video || !source) {
        return Promise.reject(new Error('missing source'));
      }

      if (ready) {
        return Promise.resolve();
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        ready = true;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        return new Promise(function (resolve, reject) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            ready = true;
            resolve();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              reject(new Error(data.type || 'play error'));
            }
          });
        });
      }

      video.src = source;
      ready = true;
      return Promise.resolve();
    }

    function playVideo() {
      setState('正在载入');
      prepareVideo()
        .then(function () {
          shell.classList.add('is-playing');
          video.controls = true;
          return video.play();
        })
        .then(function () {
          setState('正在播放');
        })
        .catch(function () {
          shell.classList.remove('is-playing');
          setState('播放暂不可用');
        });
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();

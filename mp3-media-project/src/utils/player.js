const Sound = null;
const AudioContext = AudioContext || webkitAudioContext;
const context = new AudioContext();

function openUrl(url) {
  try {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.addEventListener('load', () => {
      context.decodeAudioData(
        request.response,
        async (buffer) => {
          if (Sound) Sound.stop();
          Sound = await createSound(buffer, context);
        },
        (e) => {
          console.error('ERROR: context.decodeAudioData:', e);
        },
      );
    });
    request.send();
  } catch (e) {
    cosnole.log(e);
  }
}

function createSound(buffer, context) {
  let sourceNode = null;
  let startedAt = 0;
  let pausedAt = 0;
  let playing = false;

  const play = function () {
    const offset = pausedAt;

    if (offset > getDuration()) {
      stop();
      return;
    }

    sourceNode = context.createBufferSource();
    sourceNode.connect(context.destination);
    sourceNode.buffer = buffer;
    sourceNode.start(0, offset);
    // sourceNode.start(0, 30);

    startedAt = context.currentTime - offset;
    console.log(`context : ${context.currentTime}`);
    pausedAt = 0;
    playing = true;
  };

  const forward = function () {
    pause();
    if ((pausedAt + 5) < getDuration()) {
      pausedAt += 5;
    }
    play();
  };

  var pause = function () {
    console.log(context.currentTime);
    const elapsed = context.currentTime - startedAt;
    stop();
    pausedAt = elapsed;
    console.log(`paused at : ${pausedAt}`);
  };

  var stop = function () {
    if (sourceNode) {
      sourceNode.disconnect();
      sourceNode.stop(0);
      sourceNode = null;
    }
    pausedAt = 0;
    startedAt = 0;
    playing = false;
  };

  const getPlaying = function () {
    return playing;
  };

  const getCurrentTime = function () {
    console.log(context.currentTime);
    if (pausedAt) {
      return pausedAt;
    }
    if (startedAt) {
      const audioCurrentTime = context.currentTime - startedAt;
      if (audioCurrentTime > getDuration()) { stop(); } else { return audioCurrentTime; }
    }
    return 0;
  };

  var getDuration = function () {
    return buffer.duration;
  };

  return {
    getCurrentTime,
    getDuration,
    getPlaying,
    play,
    pause,
    stop,
    forward,
  };
}

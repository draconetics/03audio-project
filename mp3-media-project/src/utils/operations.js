/* eslint-disable import/prefer-default-export */
export const isEmptyObject = (obj) => {
  const sizeIsZero = Object.keys(obj).length === 0;
  if (obj && sizeIsZero && obj.constructor === Object) {
    return true;
  }
  return false;
};

export const calculateDuration = (audioSelected) => {
  let length = 0;
  if (!isEmptyObject(audioSelected)) {
    length = parseInt(audioSelected.audio.metadata.duration, 10);

    const minutes = Math.floor(length / 60);
    const secondsInt = length - minutes * 60;
    const secondsString = secondsInt.toString();
    const seconds = secondsString.substr(0, 2);
    length = `${minutes}:${seconds}`;
  }

  return length;
};


export const formatTimer = (musicTimer) => {
    const currentMinute = parseInt(musicTimer / 60, 10) % 60;
    const currentSecondsLong = musicTimer % 60;
    const currentSeconds = currentSecondsLong.toFixed();
    const currentTime = `${
      currentMinute < 10 ? `0${currentMinute}` : currentMinute
    }:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;
    return currentTime;
  };
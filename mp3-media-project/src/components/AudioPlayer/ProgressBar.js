import React from 'react';

import './ProgressBar.css';

const ProgressBar = ({ audioSelected, musicTimer, seek }) => {
  const calculateDuration = () => {
    let length = 0;
    if (audioSelected.audio !== '') {
      length = parseInt(audioSelected.audio.metadata.duration, 10);

      const minutes = Math.floor(length / 60);
      const secondsInt = length - minutes * 60;
      const secondsString = secondsInt.toString();
      const seconds = secondsString.substr(0, 2);
      length = `${minutes}:${seconds}`;
    }

    return length;
  };

  const formatTimer = () => {
    const currentMinute = parseInt(musicTimer / 60, 10) % 60;
    const currentSecondsLong = musicTimer % 60;
    const currentSeconds = currentSecondsLong.toFixed();
    const currentTime = `${
      currentMinute < 10 ? `0${currentMinute}` : currentMinute
    }:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;
    return currentTime;
  };

  const seekBar = (event) => {
    const percent = (event.pageX - event.target.offsetLeft) / event.target.offsetWidth;
    if (audioSelected.audio) {
      const time = percent * parseInt(audioSelected.audio.metadata.duration, 10);
      seek(audioSelected.keyPlayNow, time);
    }
  };

  const getProgressValue = () => {
    if (musicTimer === 0) {
      return 0;
    }
    return musicTimer / parseInt(audioSelected.audio.metadata.duration, 10);
  };

  return (
    <div className="player-container__bar">

      <p>{ musicTimer ? formatTimer() : '00:00' }</p>

      <progress
        onClick={(event) => seekBar(event)}
        onKeyDown={() => {}}
        className="player-progress-bar"
        value={getProgressValue()}
        max="1"
        role="progress"
        tabIndex="0"
      />
      <p>
        {audioSelected.audio !== ''
          ? calculateDuration(audioSelected.audio.metadata.duration)
          : ''}
      </p>
    </div>
  );
};

export default React.memo(ProgressBar);

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from './ProgressBar';

import './AudioPlayer.css';

const AudioPlayer = ({
  audioSelected,
  playMusic,
  musicTimer,
  seek,
}) => {
  const showContent = () => {
    if (audioSelected.audio) {
      return (
        <div>
          <h2 className="player-data-song">
            {audioSelected.audio.metadata.name}
          </h2>
          <h5 className="player-data-album">
            {audioSelected.audio.metadata.album}
          </h5>
          <p className="player-data-artist">
            {audioSelected.audio.metadata.artist}
          </p>
        </div>
      );
    }
    return '';
  };

  return (
    <div
      className="player"
      style={{
        backgroundImage: `url(${
          process.env.PUBLIC_URL + '/music.jpg'
        }`,
      }}
    >
      <div className="player-container">
        <div className="player-container__data">
          <span
            onClick={() =>
              playMusic(audioSelected.audio, audioSelected.keyPlayNow)
            }
            role="button"
            tabIndex={0}
            onKeyPress={() => {}}
          >
            <FontAwesomeIcon
              icon={
                audioSelected.state === 'pause' ? faPlayCircle : faPauseCircle
              }
              size="5x"
            />{' '}
          </span>
          {showContent()}
        </div>
        <ProgressBar
          audioSelected={audioSelected}
          musicTimer={musicTimer}
          seek={seek}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;

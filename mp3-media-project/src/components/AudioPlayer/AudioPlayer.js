import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import { isEmptyObject } from '../../utils/operations';
import './AudioPlayer.css';

const AudioPlayer = ({
  audioSelected,
  playMusic,
}) => {
  const { state, keyPlayNow, audio } = audioSelected;
  const showContent = () => {
    if (!isEmptyObject(audioSelected.audio)) {
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
  console.log('render audio player');
  const image = `${process.env.PUBLIC_URL}/music.jpg`;
  return (
    <div
      className="player"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="player-container">
        <div className="player-container__data">
          <span
            onClick={() => playMusic(audio, keyPlayNow) }
            role="button"
            tabIndex={0}
            onKeyPress={() => {}}
          >
            <FontAwesomeIcon
              icon={
                state === 'pause' ? faPlayCircle : faPauseCircle
              }
              size="5x"
            />{' '}
          </span>
          {showContent()}
        </div>
        <ProgressBar
          audioSelected={audioSelected}
        /> 
      </div>
    </div>
  );
};

const audioItem = {
  audio: PropTypes.shape({
    metadata: PropTypes.shape({
      name: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }),
  }),
  keyPlayNow: PropTypes.number.isRequired,
  state: PropTypes.string.isRequired,
};
AudioPlayer.propTypes = {
  audioSelected: PropTypes.shape(audioItem).isRequired,
  playMusic: PropTypes.func.isRequired,
};

export default React.memo(AudioPlayer);

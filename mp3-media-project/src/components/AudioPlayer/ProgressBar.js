/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { AUDIOPLAYER } from '../../utils/CreateSound';
import { isEmptyObject, calculateDuration, formatTimer } from '../../utils/operations';

import './ProgressBar.css';

const ProgressBar = ({ audioSelected }) => {
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    let TIMER = setInterval(() => {
      const miliseconds = AUDIOPLAYER.getCurrentTime(audioSelected.keyPlayNow);
      console.log(miliseconds);
      setTimer(miliseconds);
    }, 100);
    return () => clearInterval(TIMER);
  }, []);

  const seekBar = (event) => {
    if (!isEmptyObject(audioSelected.audio)) {
      const percent = (event.pageX - event.target.offsetLeft) / event.target.offsetWidth;
      const time = percent * parseInt(audioSelected.audio.metadata.duration, 10);
      AUDIOPLAYER.seek(audioSelected.keyPlayNow, time);
    }
  };

  const getProgressValue = () => {
    if (timer === 0) {
      return 0;
    }
    return timer / parseInt(audioSelected.audio.metadata.duration, 10);
  };

  return (
    <div className="player-container__bar">

      <p>{ timer ? formatTimer(timer) : '00:00' }</p>

      <progress
        onClick={(event) => seekBar(event)}
        onKeyDown={() => {}}
        className="player-progress-bar"
        value={getProgressValue()}
        max="1"
      />
      <p>
        {!isEmptyObject(audioSelected.audio)
          ? calculateDuration(audioSelected)
          : ''}
      </p>
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
};
ProgressBar.propTypes = {
  audioSelected: PropTypes.shape(audioItem).isRequired,
};

export default React.memo(ProgressBar);

/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import AudioService from '../../services/AudioService';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { urlAudio, urlAudioDownload } from '../../config/http-common';
import CreateSound from '../../utils/CreateSound';
import BufferLoader from '../../utils/BufferLoader';

import './ListAudioComponent.css';

class ListAudio extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
      audioSelected: {
        audio: '',
        state: 'pause',
        keyPlayNow: -1,
      },
      musicTimer: 0,
    };
    this.AUDIOPLAYER = null;
    this.timer = null;

    this.playMusic = this.playMusic.bind(this);
    this.seek = this.seek.bind(this);
  }

  componentDidMount() {
    AudioService.getAudioList().then((res) => {
      console.log(res.data);
      this.setState({ ...this.state, list: res.data.file });
      const urlList = res.data.file.map((item) => urlAudio + item._id);
      this.initAudioPlayer(urlList);
    });
    this.timer = setInterval(() => this.initProgressBar(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  initAudioPlayer(urlList) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const bufferLoader = new BufferLoader(
      context,
      urlList,
      async (bufferList) => {
        this.AUDIOPLAYER = await new CreateSound(bufferList, context);
      },
    );
    bufferLoader.load();
  }

  initProgressBar() {
    const { audioSelected } = this.state;
    if (audioSelected.audio) {
      const currentTime = this.AUDIOPLAYER.getCurrentTime(audioSelected.keyPlayNow);
      this.setState({ ...this.state, musicTimer: currentTime });
    }
  }

  playSong(newAudioSelected, index) {
    // const url = urlAudio + newAudioSelected.audio._id;
    console.log(this.AUDIOPLAYER);
    if (this.AUDIOPLAYER.getSourceNode() == null) {
      this.AUDIOPLAYER.play(index);
    } else if (newAudioSelected.state === 'play') {
      this.AUDIOPLAYER.play(index);
    } else {
      this.AUDIOPLAYER.pause();
    }
    const { audio, state, keyPlayNow } = newAudioSelected;
    this.setState({ ...this.state, audioSelected: { audio, state, keyPlayNow } });
  }

  playMusic(item, index) {
    const { audioSelected } = this.state;
    if (item && item._id && index >= 0) {
      if (audioSelected.keyPlayNow === index) {
        audioSelected.state = (audioSelected.state === 'play') ? 'pause' : 'play';
      } else {
        audioSelected.audio = item;
        audioSelected.state = 'play';
        audioSelected.keyPlayNow = index;
      }
      this.playSong(audioSelected, index);
    }
  }

  seek(index, time) {
    this.AUDIOPLAYER.seek(index, time);
  }

  render() {
    const { list, audioSelected } = this.state;
    return (
      <>
        <div className="container">
          <div className="menu-link">
            <button type="button" className="menu-link__audio active">Audios</button>
            <button type="button" className="menu-link__video">Videos</button>
          </div>
          <h3>{list.length === 0 ? 'Audio list is empty' : null}</h3>
          <ul className="list">
            {list
              && list.map((item, index) => (
                <li className="list-item" key={item._id}>
                  <span
                    className="list-item__play"
                    onClick={() => this.playMusic(item, index)}
                    role="button"
                    tabIndex="0"
                  >
                    {JSON.stringify(item)}
                    <FontAwesomeIcon
                      icon={
                          audioSelected.keyPlayNow === index
                          && audioSelected.state === 'play'
                            ? faPauseCircle
                            : faPlayCircle
                        }
                      size="5x"
                    />
                  </span>
                  <div>
                    <h2 className="list-item__title">
                      {item.metadata.originalname}
                    </h2>
                    <p className="list-item__album">{item.metadata.artist}</p>
                  </div>
                  <a
                    className="btn btn__primary"
                    href={urlAudioDownload + item._id}
                  >
                    Buy For $0.99
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <AudioPlayer
          audioSelected={audioSelected}
          playMusic={this.playMusic}
          musicTimer={this.state.musicTimer}
          seek={this.seek}
        />
      </>
    );
  }
}

export default ListAudio;

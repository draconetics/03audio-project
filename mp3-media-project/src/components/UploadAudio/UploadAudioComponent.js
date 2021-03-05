import React, { useRef, useState } from 'react';
import AudioService from '../../services/AudioService';
import './UploadAudioComponent.css';

const UploadAudio = (props) => {
  console.log('upload');

  const [audioData, setAudioData] = useState({
    songName: '',
    songAlbum: '',
    songArtist: '',
  });
  const fileInput = useRef();

  const getSuperDuration = (file) => new Promise((resolve, reject) => { // return a promise
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl); // create audio wo/ src
    audio.oncanplaythrough = () => {
      resolve(audio.duration);
    }; // on error, reject
    audio.onerror = reject; // when done, resolve
  });

  const uploadAudio = async () => {
    console.log(fileInput.current.files[0].name);

    const formData = new FormData();
    formData.append('mp3', fileInput.current.files[0]);
    formData.append('songName', audioData.songName);
    formData.append('songArtist', audioData.songArtist);
    formData.append('songAlbum', audioData.songAlbum);
    const duration = await getSuperDuration(fileInput.current.files[0]).then((resp) => resp).catch((e) => -1);
    if (duration === -1) {
      console.error("Audio file damaged, we cannot get audio's duration.");
      return;
    }
    formData.append('duration', duration);
    const headers = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    AudioService.uploadAudio(formData, headers)
      .then((data) => {
        console.log(data);
        props.history.push('/');
      })
      .catch((e) => console.log(e));
  };

  const changeValue = (e) => {
    switch (e.target.name) {
      case 'songName':
        setAudioData({ ...audioData, songName: e.target.value });
        break;
      case 'songArtist':
        setAudioData({ ...audioData, songArtist: e.target.value });
        break;
      case 'songAlbum':
        setAudioData({ ...audioData, songAlbum: e.target.value });
        break;
      default:
    }
  };

  return (
    <>

      <form className="form container">
        <h2>Upload new Audio</h2>
        <div className="form-group">
          <label>Select new Audio :</label>
          <input type="file" name="track" ref={fileInput} accept="audio/mp3" />
        </div>
        <div className="form-group">
          <label>Song Name :</label>
          <input
            type="text"
            name="songName"
            value={audioData.songName}
            onChange={(e) => changeValue(e)}
            autocomplete="off"
          />
        </div>
        <div className="form-group">
          <label>Album :</label>
          <input
            type="text"
            name="songAlbum"
            value={audioData.songAlbum}
            onChange={(e) => changeValue(e)}
            autocomplete="off"
          />
        </div>
        <div className="form-group">
          <label>Artist :</label>
          <input
            type="text"
            name="songArtist"
            value={audioData.songArtist}
            onChange={(e) => changeValue(e)}
            autocomplete="off"
          />
        </div>
        <button type="button" className="btn btn__primary" onClick={() => uploadAudio()}>Upload</button>
      </form>
    </>
  );
};
export default UploadAudio;

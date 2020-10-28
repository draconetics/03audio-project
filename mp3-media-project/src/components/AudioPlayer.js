import React,{  useRef} from 'react'
import './AudioPlayer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons'

const AudioPlayer = (props) => {
    const progressBar = useRef(null)

    console.log("audioplayer")
    const calculateDuration = ()=> {
        let length = 0;
        if(props.audioSelected.audio !== ""){
            //console.log(props.audioSelected)
            length = parseInt(props.audioSelected.audio.metadata.duration);

        let minutes = Math.floor(length / 60),
          seconds_int = length - minutes * 60,
          seconds_str = seconds_int.toString(),
          seconds = seconds_str.substr(0, 2);
          length = minutes + ':' + seconds
            
        }
        
        return length;
    }
    
    const showContent = () =>{
        return props.audioSelected.audio?(<div>
            <h2 className="player-data-song">{props.audioSelected.audio.metadata.name}</h2>
            <h5 className="player-data-album">{props.audioSelected.audio.metadata.album}</h5>
            <p className="player-data-artist">{props.audioSelected.audio.metadata.artist}</p>
        </div>):null;
    }

    
    return <div className="player">
        <div className="player-container">
            <div className="player-container__data">
                <span onClick={()=>props.playMusic(props.audioSelected.audio, props.audioSelected.keyPlayNow)}>
                    <FontAwesomeIcon icon={props.audioSelected.state === "pause"?faPlayCircle:faPauseCircle} size="5x" />
                </span>
                {showContent()}
            </div>

            
            <div className="player-container__bar">
            <p>{props.progressValue?props.progressValue.currentTime:""}</p>
                <progress 
                ref={progressBar}
                onClick={(event)=>props.seek(event)}
                className="player-progress-bar" 
                value={props.progressValue.progressTime} 
                max="1"></progress>
                <p>{props.audioSelected.audio!==""?calculateDuration(props.audioSelected.audio.metadata.duration):""}</p>
            </div>
            
        </div>
    </div>
}

export default AudioPlayer;
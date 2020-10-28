import React, {useEffect, useState} from 'react'
import AudioService from '../services/AudioService'
import './ListAudioComponent.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import AudioPlayer from './AudioPlayer'
import { urlAudio, urlAudioDownload } from '../config/http-common'



const ListAudio = ()=>{
    let PLAYER = document.getElementById("main-audio")
    const [list, setList] = useState([]);
    const [audioSelected, setAudioSelected] = useState({audio:"",state:"pause", keyPlayNow:-1});

    const [progressValue, setProgressValue] = useState({
        currentTime:"00:00",
        progressTime: 0
    });

    useEffect(()=>{
        AudioService.getAudioList().then((res)=>{
            console.log(res.data);
            setList(res.data.file);
        });

    },[]);

    const playSong = (item) => {
        console.log(PLAYER)
        let url = urlAudio + item.audio._id
        if(url === PLAYER.src){
            if(item.state === "play")
                PLAYER.play();
            else
                PLAYER.pause();
        }else{
            PLAYER.src = url;
            PLAYER.play();
        }
    }    

    const playMusic = (item,key) =>{

        if(item && key >= 0){
            if(audioSelected.keyPlayNow === key){
                let state = "play"
                if(state === audioSelected.state)
                    state = "pause"
                else
                    state = "play"
                setAudioSelected((before)=>{
                    let updated = {...before, state};
                    playSong(updated)
                    return updated;
                })
            }else{
                
                setAudioSelected((before)=>{
                    let updated = {
                        audio: item,
                        state: "play",
                        keyPlayNow: key
                    }
                    playSong(updated);
                    return updated;
                });
            }
                
                
            
        }        
        
    }

    const seek = (event)=>{
        console.log("seek",(event.pageX - event.target.offsetLeft))
        let percent = (event.pageX - event.target.offsetLeft) / event.target.offsetWidth;
        console.log(event.target.offsetWidth)
        if(audioSelected.audio)
            //console.log(percent + " - " + parseInt(audioSelected.audio.metadata.duration))
        PLAYER.currentTime = percent * parseInt(audioSelected.audio.metadata.duration);

    }

    const initProgressBar = () => {
        //console.log(PLAYER.currentTime)
        //console.log("object duration ",audioSelected.audio.metadata.duration);
        let current_minute = parseInt(PLAYER.currentTime / 60) % 60,
        current_seconds_long = PLAYER.currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

        setProgressValue({
            currentTime:current_time,
            progressTime: PLAYER.currentTime/parseInt(audioSelected.audio.metadata.duration)
        });
    }






    return (<>
        <audio id={"main-audio"} onTimeUpdate={()=>initProgressBar()}>
        </audio> 
        <div className="container">
            <div className="menu-link">
                <button className="menu-link__audio active">Audios</button>
                <button className="menu-link__video">Videos</button>
            </div>
            

            <h3>{list.length === 0?"Audio list is empty":null}</h3>
            <ul className="list">
                { list && list.map((item,key)=>{
                        return (<li className="list-item" key={key} >
                            <span className="list-item__play" onClick={()=>playMusic(item, key)}>
                                
                                <FontAwesomeIcon 
                                    icon={audioSelected.keyPlayNow === key && audioSelected.state === "play"?faPauseCircle:faPlayCircle} 
                                    size="5x" 
                                />           
                            </span>
                            <div>
                            <h2 className="list-item__title">{item.metadata.originalname}</h2>
                            <p className="list-item__album">{item.metadata.artist}</p>
                            
                            </div>
                            <a className="btn btn__primary" href={urlAudioDownload+item._id}>Buy For $0.99</a>
                        </li>)
                })}
            </ul>
        </div>
        <div style={{height:'6rem'}}></div>
        <AudioPlayer 
                audioSelected={audioSelected} 
                playMusic={playMusic} 
                PLAYER={PLAYER}
                progressValue={progressValue}
                seek={seek}
                ></AudioPlayer>
                
    </>);
}

export default ListAudio;
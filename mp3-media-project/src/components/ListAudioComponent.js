import React, {useEffect, useState} from 'react'
import AudioService from '../services/AudioService'
import './ListAudioComponent.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircleO, faPlayCircle, faPlay } from '@fortawesome/free-solid-svg-icons'


const ListAudio = ()=>{

    const [list, setList] = useState([]);

    useEffect(()=>{
        AudioService.getAudioList().then((res)=>{
            console.log(res.data);
            setList(res.data.file)
        });
    },[]);

    return (<>
        <div className="container">
            <div className="menu-link">
                <button className="menu-link__audio active">Audios</button>
                <button className="menu-link__video">Videos</button>
            </div>
            <ul className="list">

                { list && list.map((item,key)=>{
                        return (<li className="list-item" key={key}>
                            <span className="list-item__play">
                                <FontAwesomeIcon icon={faPlayCircle} size="5x" />
                            </span>
                            <div>
                            <h2 className="list-item__title">{item.metadata.originalname}</h2>
                            <p className="list-item__album">{item.filename}</p>
                            <audio controls>
                            <source src={"http://localhost:3005/audio/"+item._id} type="audio/ogg"/>
                            
                            Your browser does not support the audio element.
                            </audio> 
                            </div>
                            <a className="btn btn__primary" href={"http://localhost:3005/audio/download/"+item._id}>Buy For $0.99</a>
                        </li>)
                })}
            </ul>
        </div>
        <h1>this is the list</h1>
    </>);
}

export default ListAudio;
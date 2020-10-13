import React,{useRef, useState} from 'react'
import AudioService from '../services/AudioService'
import './UploadAudioComponent.css'
import {getExtension} from '../utils/library'


const UploadAudio = (props) =>{

    const [submit, setSubmit] = useState(false)

    const fileInput = useRef();

    const uploadAudio = ()=>{

        if(submit === false){
            return;
        }

        console.log(fileInput.current.files[0].name)
        
        
        const formData = new FormData();
        formData.append("mp3", fileInput.current.files[0]);
        formData.append("name", "mp3-forever-"+parseInt(Math.random()*120213))
        formData.append("duration","2:30");

        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        AudioService.uploadAudio(formData, headers)
            .then(data => {
                console.log(data)
                props.history.push("/");
            })
            .catch(e => console.log(e));
        
    }

    return (<>
        
        <form className="container form">
            <h2>Upload new Audio</h2>    
            <div className="form-group">
                <label>Select new Audio :</label>
                <input type="file" name="track" ref={fileInput} accept="audio/mp3" />
            </div>
            <div className="form-group">
                <label>Song Name :</label>
                <input type="text" name="songName"/>
            </div>
            <button type="button" className="btn btn__primary" onClick={()=>uploadAudio()}>Upload</button>
        </form>
    </>);
}
export default UploadAudio;
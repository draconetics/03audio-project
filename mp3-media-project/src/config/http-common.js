import axios from "axios";

export const http =  axios.create({
  baseURL: "http://localhost:3005",
  headers: {
    "Content-type": "application/json"
  }
});

export const urlAudio = "http://localhost:3005/audio/";
export const urlAudioDownload = "http://localhost:3005/audio/download/";
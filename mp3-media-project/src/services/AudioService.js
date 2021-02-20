import { http } from '../config/http-common';

class AudioService {
  uploadAudio(data, headers) {
    return http.post('/audio/upload', data, headers);
  }

  async getAudioList() {
    return await http.get('/audio/list');
  }
}

export default new AudioService();

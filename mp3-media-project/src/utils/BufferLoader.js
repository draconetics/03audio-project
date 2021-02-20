/*
* --BUFFER LOADER--
*/

export default class BufferLoader {
  constructor(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
  }

  loadBuffer(url, index) {
    // Load buffer asynchronously
    console.log(this.context);
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      console.log(this.context);
      this.context.decodeAudioData(
        request.response,
        (buffer) => {
          if (!buffer) {
            alert(`error decoding file data: ${url}`);
            return;
          }
          this.bufferList[index] = buffer;
          if (++this.loadCount === this.urlList.length) { this.onload(this.bufferList); }
        },
        (error) => {
          console.error('decodeAudioData error', error);
        },
      );
    }.bind(this);

    request.onerror = function () {
      alert('BufferLoader: XHR error');
    };

    request.send();
  }

  load() {
    for (let i = 0; i < this.urlList.length; ++i) { this.loadBuffer(this.urlList[i], i); }
  }
}

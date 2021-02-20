export default class CreateSound {
  constructor(bufferList, context) {
    this.bufferList = bufferList;
    this.context = context;
    this.sourceNode = null;
    this.startedAt = 0;
    this.pausedAt = 0;
    this.playing = false;
  }

  play(currentId) {
    const offset = this.pausedAt;
    this.stop();
    if (offset > this.getDuration(currentId)) {
      this.stop();
      return;
    }

    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.connect(this.context.destination);
    this.sourceNode.buffer = this.bufferList[currentId];
    this.sourceNode.start(0, offset);
    // sourceNode.start(0, 30);

    this.startedAt = this.context.currentTime - offset;
    console.log(`context : ${this.context.currentTime}`);
    this.pausedAt = 0;
    this.playing = true;
  }

  seek(currentId, time) {
    this.pause();
    if (time > 0 && time < this.getDuration(currentId)) {
      this.pausedAt = time;
    }
    this.play(currentId);
  }

  pause() {
    const elapsed = this.context.currentTime - this.startedAt;
    this.stop();
    this.pausedAt = elapsed;
    console.log(`paused at : ${this.pausedAt}`);
  }

  stop() {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode.stop(0);
      this.sourceNode = null;
    }
    this.pausedAt = 0;
    this.startedAt = 0;
    this.playing = false;
  }

  getPlaying() {
    return this.playing;
  }

  getCurrentTime(currentId) {
    if (this.pausedAt) {
      return this.pausedAt;
    }
    if (this.getPlaying()) {
      const audioCurrentTime = this.context.currentTime - this.startedAt;
      if (audioCurrentTime > this.getDuration(currentId)) {
        this.stop();
      } else {
        return audioCurrentTime;
      }
    }
    return 0;
  }

  getDuration(currentId) {
    return this.bufferList[currentId].duration;
  }

  getSourceNode() {
    return this.sourceNode;
  }
}

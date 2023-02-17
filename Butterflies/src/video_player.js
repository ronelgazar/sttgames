
export class VideoPlayer{
    

    constructor(src, fps,canvas, stopFrames, words, speech, game){
        this.framePassed = 0;
        this.fps = fps;
        
        this.canvas = canvas;

        this.stopFrames = stopFrames;
        this.words = words;
        this.index = 0;

        this.game = game;

        this.mute = true;

        this.speech = speech;

        this.speechStart = false;

        this.passed = false;
        this.hasToStop = true;

        this.ended = false;
        this.video = document.createElement("video"); // create a video element

        var $this = this;


        var req = new XMLHttpRequest();
        req.open('GET', src, true);
        req.responseType = 'blob';

        req.onload = function() {
          // Onload is triggered even on 404
          // so we need to check the status code
          if (this.status === 200) {
              var videoBlob = this.response;
              var vid = URL.createObjectURL(videoBlob); // IE10+
              // Video is now downloaded
              // and we can set it as source on the video element
              $this.video.src = vid;
          }
        }
        req.onerror = function() {
          // Error
        }

        req.onloadend = function(){
          $this.game.totalLoaded += 1;
        }

        req.send();

        // this.video.src = src;
        this.next = false;
        this.video.autoPlay = false; // ensure that the video does not auto play
        this.video.loop = false; // set the video to loop.
        this.video.muted = this.mute;
        this.videoContainer = {
            // we will add properties as needed
            video: this.video,
            ready: false,
        };



        this.video.onended = function(e){
          $this.ended = true;
        }

        this.video.oncanplay = function(event){
          $this.videoContainer.scale = Math.min(
                canvas.width / this.videoWidth,
                canvas.height / this.videoHeight
            );
            $this.videoContainer.ready = true;
        } 
    }


    render(ctx){
        if (this.videoContainer !== undefined && this.videoContainer.ready) {
            // find the top left of the video on the canvas
            this.video.muted = this.mute;
            var scale = this.videoContainer.scale;
            var vidH = this.videoContainer.video.videoHeight;
            var vidW = this.videoContainer.video.videoWidth;
            var top = this.canvas.height / 2 - (vidH / 2) * scale;
            var left = this.canvas.width / 2 - (vidW / 2) * scale;
            // now just draw the video the correct size
            ctx.drawImage(this.videoContainer.video, left, top, vidW * scale, vidH * scale);
          }
    }

    update(dt){
      this.framesPassed = parseInt(this.video.currentTime*this.fps);

      if (this.hasToStop && this.index < this.stopFrames.length && this.framesPassed >=  this.stopFrames[this.index]) {
        this.videoContainer.video.pause();

        if(!this.speechStart){
          this.speech.start();
          this.speechStart = true;
        }

        if(this.speech.equals(this.words[this.index])){
          this.index += 1;
          this.videoContainer.video.play();
          this.passed = true;
          this.speechStart = false;
          this.speech.stop();

          this.game.correctAudio.play();
        }
        
      }
    }

    play(){
      this.videoContainer.video.play();

    }
    pause(){
      this.videoContainer.video.pause();
    }

    reset(){
      this.pause();
      this.video.currentTime = 0;
      this.ended = false;
      this.index = 0;
      this.framePassed = 0;
      console.log("a");
    }

    isFinished(){
      return this.ended;
    }

    ispassed(){
      let p = this.passed;
      return p;
    }

}
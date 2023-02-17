var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var framesPassed = 0;
var next = false;
var video = document.createElement("video"); // create a video element
video.src = "src/Black_v02.mp4";
video.autoPlay = false; // ensure that the video does not auto play
video.loop = false; // set the video to loop.
video.muted = true;
var videoContainer = {
  // we will add properties as needed
  video: video,
  ready: false
};

video.oncanplay = readyToPlayVideo; // set the event to the play function that
// can be found below
function readyToPlayVideo(event) {
  // this is a referance to the video
  // the video may not match the canvas size so find a scale to fit
  videoContainer.scale = Math.min(
    canvas.width / this.videoWidth,
    canvas.height / this.videoHeight
  );
  videoContainer.ready = true;
  // the video can be played so hand it off to the display function
  requestAnimationFrame(updateCanvas);
  // add instruction
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // only draw if loaded and ready
  if (videoContainer !== undefined && videoContainer.ready) {
    // find the top left of the video on the canvas
    video.muted = true;
    var scale = videoContainer.scale;
    var vidH = videoContainer.video.videoHeight;
    var vidW = videoContainer.video.videoWidth;
    var top = canvas.height / 2 - (vidH / 2) * scale;
    var left = canvas.width / 2 - (vidW / 2) * scale;
    // now just draw the video the correct size
    ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
  }
  // all done for display
  // request the next frame in 1/60th of a second
  requestAnimationFrame(updateCanvas);
}

video.addEventListener(
  "play",
  function() {
    var $this = this; //cache
    (function loop() {
      if (!$this.paused && !$this.ended) {
        ctx.drawImage($this, 0, 0);
        framesPassed = parseInt(video.currentTime*24);
        if (framesPassed >= 100 && !next) {
          videoContainer.video.pause();

          while(prompt("color?", "black") != "black");

          videoContainer.video.play();
          next = true;
          
        }

        setTimeout(loop, 1000 / 60); // drawing at 24fps
      }
    })();
  },
  0
);

videoContainer.video.play();

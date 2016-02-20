// http://www.alexkatz.me/html5-audio/building-a-custom-html5-audio-player-with-javascript/
//
var KEYCODE_ESC = 27;
var KEYCODE_F6 = 117;
var MOVE_DURATION = 3;
var audioFile = document.getElementById('audioFile'); // id for audio element
var playhead = document.getElementById('playhead'); // playhead
var playPause = document.getElementById('playPause'); // play button
var timeline = document.getElementById('timeline'); // timeline

var duration; // Duration of audio clip
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth; // timeline width adjusted for playhead

$(document).keyup(function(e) {
  if (e.which == KEYCODE_ESC) { play(); } 
  if (e.which == KEYCODE_F6) { insertTimestamp();}
});

// timeupdate event listener
audioFile.addEventListener("timeupdate", timeUpdate, false);

//Makes timeline clickable
timeline.addEventListener("click", function (event) {
  moveplayhead(event);
  audioFile.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
  return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

// Makes playhead draggable 
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
var onplayhead = false;

// insert current time into textarea
function insertTimestamp(){
  alert("Insert Timestamp not yet implemented.");
  //audioFile.duration.toHHMMSS()
  return false;
}

// mouseDown EventListener
function mouseDown() {
  onplayhead = true;
  window.addEventListener('mousemove', moveplayhead, true);
  audioFile.removeEventListener('timeupdate', timeUpdate, false);
}

// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
  if (onplayhead == true) {
    moveplayhead(e);
    window.removeEventListener('mousemove', moveplayhead, true);
    // change current time
    audioFile.currentTime = duration * clickPercent(e);
    audioFile.addEventListener('timeupdate', timeUpdate, false);
  }
  onplayhead = false;
}

// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
  var newMargLeft = e.pageX - timeline.offsetLeft;
  if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
    playhead.style.marginLeft = newMargLeft + "px";
  }
  if (newMargLeft < 0) {
    playhead.style.marginLeft = "0px";
  }
  if (newMargLeft > timelineWidth) {
    playhead.style.marginLeft = timelineWidth + "px";
  }
}

// timeUpdate 
// Synchronizes playhead position with current point in audio 
function timeUpdate() {
  var playPercent = timelineWidth * (audioFile.currentTime / duration);
  playhead.style.marginLeft = playPercent + "px";
  if (audioFile.currentTime == duration) {
    playPause.className = "";
    playPause.className = "play";
  }
  $("#currentTime").text(audioFile.currentTime.toHHMMSS());
}

//Play and Pause
function play() {
  if (audioFile.paused) {
    audioFile.play();
    $("#playPause .glyphicon").removeClass("glyphicon-play").addClass("glyphicon-pause");
    $("#playPause .text").text("Pause");
  } else { 
    audioFile.pause();
    $("#playPause .glyphicon").removeClass("glyphicon-pause").addClass("glyphicon-play");
    $("#playPause .text").text("Play");
  }
}

function forward() {
  if (audioFile.currentTime + MOVE_DURATION >= duration ) {
    audioFile.currentTime = duration;
  }
  else
  {
    audioFile.currentTime += MOVE_DURATION; 
  }
    timeUpdate();
}

function rewind() {
  if (audioFile.currentTime - MOVE_DURATION <= 0 ) {
    audioFile.currentTime = 0;
  }
  else
  {
    audioFile.currentTime -= MOVE_DURATION; 
  }
    timeUpdate();
}

// Gets audio file duration
audioFile.addEventListener("canplaythrough", function () {
  $("#playTime").text(audioFile.duration.toHHMMSS());
}, false);

// Number conversion prototype
Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours > 9) { hours = hours+":"; }
    else if ( hours > 0) { hours = "0"+hours+":";}
    else { hours = "";}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+minutes+':'+seconds;
}


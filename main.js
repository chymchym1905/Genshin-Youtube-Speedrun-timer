// const Big = require('big.js');
var totaltime = new Big(0.0); //time to be copied, in integer
var lastTime = []; //the lastest result after compute time

function compute() {

    // Initiate basic time variables
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    // Get framerate, start frame, and end frame from corresponding elements
    // Double check they all have a value
    let frameRate = parseInt(document.getElementById('framerate').value);
    let startFrame = document.getElementById('startobj').value;
    let endFrame = document.getElementById('endobj').value;
    if (typeof (startFrame) === 'undefined' || endFrame === 'undefined' || framerate === 'undefined') {
        return
    };

    // Calculate framerate
    let frames = (endFrame - startFrame) * frameRate;
    seconds = Math.floor(frames / frameRate);
    frames = frames % frameRate;
    milliseconds = Math.round(frames / frameRate * 1000);
    if (milliseconds < 10) {
        milliseconds = '00' + milliseconds;
    } else if (milliseconds < 100) {
        milliseconds = '0' + milliseconds;
    }
    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
    }
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
    }

    // Show the time and mod message in the DOM
    let finalTime = hours.toString() + 'h ' + minutes.toString() + 'm ' + seconds.toString() + 's ' + milliseconds.toString() + 'ms';

    document.getElementById('time').value = finalTime;
}

//addtime
function addTime(){
    var hours;
    var minutes;
    var milliseconds;
    var seconds;

    let inputValue = document.getElementById("time").value;
    var regex = /[0-9]+h [0-9]+m [0-9]+s [0-9]+ms/; // Regular expression pattern

    if (!regex.test(inputValue)) {
        alert("Wrong time format!")
        return null // Return the function if there is a match
    }

    if(document.getElementById("totalTime").value == ""){
        document.getElementById('totalTime').disabled = false;
        document.getElementById("totalTime").value += inputValue.toString(); 
    }else{
        document.getElementById("totalTime").value += ' +\n' + inputValue.toString();
    }
    
    let words = inputValue.split(" ");

    for (let component of words) {
        if (component.endsWith("h")) {
          hours = new Big(component.split("h")[0]);
        } else if (component.endsWith("m")) {
          minutes = new Big(component.split("m")[0]);
        } else if (component.endsWith("ms")) {
          milliseconds = new Big(component.split("ms")[0]);
        } else if (component.endsWith("s")) {
          seconds = new Big(component.split("s")[0]);
        }
    }
    // let res = new Big(0.0)
    // res = hours.times(3600).plus(minutes.times(60)).plus(milliseconds.times(0.001)).plus(seconds)
    lastTime.push(new Big(hours.times(3600).plus(minutes.times(60)).plus(milliseconds.times(0.001)).plus(seconds)));
    totaltime = totaltime.plus(hours.times(3600).plus(minutes.times(60)).plus(milliseconds.times(0.001)).plus(seconds));
    console.log(totaltime);
}
//undo
function undoAdd(){
    if(lastTime!=[]){
        console.log(lastTime);
        totaltime = totaltime.minus(lastTime[lastTime.length-1].toNumber());
        removedElement = lastTime.pop();
        removedElement = null;
    }else if (lastTime==[]){
        console.log("No number to add")
    }
    console.log(totaltime);
    deleteLastLine();

}

//Modify text area
function deleteLastLine() {
    var textarea = document.getElementById("totalTime");
    var lines = textarea.value.split("\n");

    if (lines.length > 0) {
      lines.pop(); // Remove the last line
      textarea.value = lines.join("\n");
      textarea.value = textarea.value.slice(0, -2);
    }
}

//reset
function reset(){
    document.getElementById("totalTime").value = "";
    document.getElementById('totalTime').disabled = true;
    document.getElementById("copied").style.display = "none";
    totaltime = Big(0.0);
}


//copy
function copyToClipboard() {
    document.getElementById("copied").style.display = "block";
    let content = totaltime;
    content = content.times(1000);
    console.log(content)
    navigator.clipboard.writeText(parseInt(content.toString()))
      .then(() => {
        document.getElementById("copied").textContent = 'Copied to clipboard: '+ parseInt(content);
      })
      .catch((error) => {
        console.error('Failed to copy to clipboard:', error);
      });
  }


const validateFPS = (event) => {
    // If framerate is invalid, show an error message and disable start and end frame fields
    if (event.target.value === '' || parseInt(event.target.value) <= 0 || isNaN(parseInt(event.target.value))) {
        document.getElementById('framerate').setCustomValidity('Please enter a valid framerate.');
        document.getElementById('framerate').reportValidity();
        document.getElementById('startobj').disabled = true;
        document.getElementById('endobj').disabled = true;
        document.getElementById('computeButton').disabled = true;
    } else {
        document.getElementById('startobj').disabled = false;
        document.getElementById('endobj').disabled = false;
        document.getElementById('computeButton').disabled = false;
    }
}

const parseForTime = (event) => {
    // Get current frame from input field (either start time or end time)
    let frameFromInputText = (JSON.parse(event.target.value)).lct;
    if (typeof frameFromInputText !== 'undefined') {
        // Get the framerate
        let frameRate = parseInt(document.getElementById('framerate').value);
        // Calculate the frame
        let frameFromObj = (time, fps) => Math.floor(time * fps) / fps; //round to the nearest frame
        let finalFrame = frameFromObj(frameFromInputText, frameRate);
        // Update the DOM
        document.getElementById(event.target.id).value = `${finalFrame}`;
    }
}

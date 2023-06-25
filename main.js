// const Big = require('big.js');
var totaltime = new Big(0.0); //time to be copied, in integer
var lastTime = 0; //the lastest result after compute time

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
    let modMessage = `Mod Message: Time starts at ${parseFloat(startFrame).toFixed(3)} and ends at ${parseFloat(endFrame).toFixed(3)} at ${frameRate} fps to get a final time of ${finalTime}.`;
    let credits = `Retimed using [yt-frame-timer](https://slashinfty.github.io/yt-frame-timer)`;
    lastTime = finalTime;
    document.getElementById('time').value = finalTime;
    document.getElementById('modMessage').disabled = false;
    document.getElementById('modMessage').innerText = modMessage + ' ' + credits;    
    document.getElementById("modMessageButton").disabled = false;
}


function addTime(){
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
          let hours = new Big(component.split("h")[0]);
          totaltime = totaltime.plus(hours.times(3600));
        } else if (component.endsWith("m")) {
          let minutes = new Big(component.split("m")[0]);
          totaltime = totaltime.plus(minutes.times(60));
        } else if (component.endsWith("ms")) {
          let milliseconds = new Big(component.split("ms")[0]);
          totaltime = totaltime.plus(milliseconds.times(0.001));
        } else if (component.endsWith("s")) {
          let seconds = new Big(component.split("s")[0]);
          totaltime = totaltime.plus(seconds);
        }
    }
    console.log(totaltime);
}

function undoAdd(){
    let words = lastTime.split(" ");

    for (let component of words) {
        if (component.endsWith("h")) {
            let hours = new Big(component.split("h")[0]);
            totaltime = totaltime.minus(hours.times(3600));
        } else if (component.endsWith("m")) {
            let minutes = new Big(component.split("m")[0]);
            totaltime = totaltime.minus(minutes.times(60));
        } else if (component.endsWith("ms")) {
            let milliseconds = new Big(component.split("ms")[0]);
            totaltime = totaltime.minus(milliseconds.times(0.001));
        } else if (component.endsWith("s")) {
            let seconds = new Big(component.split("s")[0]);
            totaltime = totaltime.minus(seconds);
        }
    }
    deleteLastLine();

}

function deleteLastLine() {
    var textarea = document.getElementById("totalTime");
    var lines = textarea.value.split("\n");

    if (lines.length > 0) {
      lines.pop(); // Remove the last line
      textarea.value = lines.join("\n");
      textarea.value = textarea.value.slice(0, -2);
    }
}

function reset(){
    document.getElementById("totalTime").value = "";
    document.getElementById('totalTime').disabled = true;
    document.getElementById("copied").style.display = "none";
    totaltime = Big(0.0);
}



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

const assign = (event) => {
    lastTime = event.target.value;
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

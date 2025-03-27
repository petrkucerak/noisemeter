// Global variables
let peerConnection, dataChannel;
let audioContext,
  analyser,
  volume = 0,
  maxVolume = 0;
let canvas = document.getElementById("visualizer");
let ctx = canvas.getContext("2d");

// Microphone functions
function startMicrophone() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    updateVolume();
  });
}
function updateVolume() {
  let dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  volume = Math.max(...dataArray) / 255;
  maxVolume = Math.max(maxVolume, volume);

  document.getElementById("volume").innerText = (volume * 100).toFixed(1);
  document.getElementById("maxVolume").innerText = (maxVolume * 100).toFixed(1);
  drawVolume();

  if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(volume);
  }

  requestAnimationFrame(updateVolume);
}
function drawVolume() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, canvas.width * volume, canvas.height);
}

function resetMaxVolume() {
  maxVolume = 0;
  document.getElementById("maxVolume").innerText = "0";
}

// Network functions
function startPeer() {}
function acceptPeerOffer() {}

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer({
  host: "peerjs-server.herokuapp.com",
  secure: true,
  port: 443,
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("New User Connected");
      connectToNewUser(userId, stream);
    });
  });

socket.on("user-disconnected", (userId) => {
  console.log("New User Disconnected");
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

document.getElementById("invite-button").addEventListener("click", getURL);

function getURL() {
  const c_url = window.location.href;
  copyToClipboard(c_url);
  alert("url copied to clipboard");
}

function copyToClipboard(text) {
  var copiedText = document.createElement("textarea");
  document.body.appendChild(copiedText);
  copiedText.value = text;
  copiedText.select();
  document.execCommand("copy");
  document.body.removeChild(copiedText);
}

document.getElementById("end-button").addEventListener("click", endCall);

function endCall() {
  window.location.href = "/";
}

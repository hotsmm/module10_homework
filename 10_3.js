const wsUri = 'wss://echo-ws-service.herokuapp.com';

function pageLoaded() {
  const infoOutput = document.querySelector(".info_output");
  const chatOutput = document.querySelector(".chat_output");
  const input = document.querySelector(".input");
  const btnSent = document.querySelector(".btn-sent");
  const btnGeo = document.getElementById("btn-geo");
  const geoOutput = document.querySelector('.geo-output');
  
  
  let socket = new WebSocket(wsUri);

  socket.onopen = () => {
    infoOutput.innerText = "Соединение установлено";
  }
  
  socket.onmessage = (event) => {
    writeToChat(event.data, true);
  }
  
  socket.onerror = () => {
    infoOutput.innerText = "При передаче данных произошла ошибка";
  }

  
  btnSent.addEventListener("click", sendMessage);
  
  function sendMessage() {
    if (!input.value) return;
    socket.send(input.value);
    writeToChat(input.value, false);
    input.value === "";
  }
  
  function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${isRecieved? "recieved" : "sent"}">${message}</div>`;
    chatOutput.innerHTML += messageHTML;
  }


btnGeo.addEventListener("click", getLocation);

function getLocation() {
  if ("geolocation" in navigator) {
    let locationOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  } else {
    writeOutput("Ваш браузер не поддерживает функцию определения местоположения");
  }
}

function locationSuccess(data) {
  let link = `https://www.openstreetmap.org/#map=18/${data.coords.longitude},${data.coords.latitude}`;
  writeOutput(`<a class="geo-link" href="${link}" target="_blank">Геолокация</a>`);
}

function locationError() {
  writeOutput("При получении местоположения произошла ошибка");
}

function writeOutput(message) {
  chatOutput.innerHTML += `<p>${message}</p>`;
}
}


document.addEventListener("DOMContentLoaded", pageLoaded);

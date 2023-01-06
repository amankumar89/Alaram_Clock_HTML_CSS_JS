let hours = document.getElementsByClassName("hrs");
let minutes = document.getElementsByClassName("mins");
let seconds = document.getElementsByClassName("secs");
let selectMenu = document.querySelectorAll("select");
let addBtn = document.getElementById("btn");
let alaramListContainer = document.getElementById("alaram-list-container");
let deleteBtn = document.getElementsByClassName("delete-span");

let alaramList = [];

for (let index = 1; index <= 12; index++) {
  index = index <= 9 ? `0${index}` : index;
  let options = `<option value = "${index}">${index}</option>`;
  selectMenu[0].lastElementChild.insertAdjacentHTML("afterend", options);
}

for (let index = 0; index <= 59; index++) {
  index = index <= 9 ? `0${index}` : index;
  let options = `<option value = "${index}">${index}</option>`;
  selectMenu[1].lastElementChild.insertAdjacentHTML("afterend", options);
}

for (let i = 2; i > 0; i--) {
  let ampm = i == 1 ? "AM" : "PM";
  let option = `<option value="${ampm}">${ampm}</option>`;
  selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

function displayTime() {
  updateAlaramList();
  setInterval(() => {
    const time = new Date();
    // hours
    let hr = time.getHours();
    if (hr >= 12) {
      document.getElementById("am-pm").innerText = "PM";
    } else {
      document.getElementById("am-pm").innerText = "AM";
    }
    hr = hr > 12 ? hr - 12 : hr;
    hr = hr < 10 ? `0${hr}` : hr;

    // minutes
    let min = time.getMinutes();
    min = min < 10 ? `0${min}` : min;

    // seconds
    let sec = time.getSeconds();
    sec = sec < 10 ? `0${sec}` : sec;

    hours[0].innerHTML = hr;
    minutes[0].innerHTML = min;
    seconds[0].innerHTML = sec;

    let currentAmPm = document.getElementById("am-pm").innerText;
    let result = alaramList.findIndex((alaram) => {
      return (
        alaram.hrs == hr && alaram.mins == min && alaram.amOrpm == currentAmPm
      );
    });
    if (result !== -1) {
      deleteFromList(result);
      updateAlaramList();
      playAlaram();
    }
  }, 1000);

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", () =>
      deleteAlaramFromList(deleteBtn[i].parentElement.innerText)
    );
  }
}

function deleteAlaramFromList(data) {
  let alaramTime = data.match(/.{1,2}/g);
  let time = { hrs: alaramTime[0], mins: alaramTime[1], amOrpm: alaramTime[2] };
  let ans = confirm("Are You Sure to Delete from Alaram");
  if (ans) {
    deleteFromList(time);
    // console.log("deleted");
  }
  window.location.reload();
}

function deleteFromList(result) {
  alaramList.splice(result, 1);
  // console.log(alaramList);
  localStorage.setItem("alaramData", JSON.stringify(alaramList));
}

function playAlaram() {
  let result = confirm("Alaram Ringing, Press Ok to Stop !");
  if (result) return;
  else playAlaram();
}

function addToList() {
  let hr = selectMenu[0].value;
  let min = selectMenu[1].value;
  let amOrPm = selectMenu[2].value;

  if (hr === "Hour" || min === "Minute" || amOrPm === "AM") {
    alert("All Fields are Required!");
    return;
  }
  let time = { hrs: hr, mins: min, amOrpm: amOrPm };
  // console.log(time);
  alaramList.push(time);

  // go store unique alaram list in the list
  jsonObject = alaramList.map(JSON.stringify);
  uniqueSet = new Set(jsonObject);
  alaramList = Array.from(uniqueSet).map(JSON.parse);
  localStorage.setItem("alaramData", JSON.stringify(alaramList));
  updateAlaramList();
  window.location.reload();
}

function updateAlaramList() {
  alaramList = JSON.parse(localStorage.getItem("alaramData"));
  // console.log(alaramList);
  if (alaramList === null) {
    alaramList = [];
  }
  const alaramListContainer = document.getElementById("alaram-list-container");
  alaramListContainer.innerHTML = "";
  alaramListContainer.innerHTML = `<h4>Upcoming Alarams</h4>`;
  alaramList.forEach((alaram) => {
    let element = document.createElement("div");
    element.classList.add("alaram-div");
    let hours = document.createElement("span");
    hours.innerHTML = alaram.hrs;
    let minutes = document.createElement("span");
    minutes.innerHTML = alaram.mins;
    let ampm = document.createElement("span");
    ampm.innerHTML = alaram.amOrpm;
    let deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-span");
    deleteIcon.innerHTML = `<img id="delete-btn" src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png" alt="delete-btn"/>`;
    element.appendChild(hours);
    element.appendChild(minutes);
    element.appendChild(ampm);
    element.appendChild(deleteIcon);

    alaramListContainer.appendChild(element);
  });
}

window.addEventListener("load", displayTime);
addBtn.addEventListener("click", addToList);

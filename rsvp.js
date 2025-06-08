const scriptURL = "https://script.google.com/macros/s/AKfycbztNef5f7wTMSf0qDxycVWJBOo9PIHqBcfztAwET9QaAaF3vHAqd2yYeAKpB1Ore1dIRw/exec";

let guestName = "";
let rowIndex = null;

function showStage(id) {
  document.querySelectorAll('.stage').forEach(el => el.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

function checkName() {
  const name = document.getElementById('nameInput').value.trim();
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  if (!name) return;

  error.textContent = "";
  loading.classList.add("visible");

  fetch(`${scriptURL}?name=${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      loading.classList.remove("visible");

      if (data.status === "found") {
        guestName = data.matchedName || name;
        rowIndex = data.rowIndex;

        document.getElementById("greeting").textContent = `Hello, ${guestName}`;
        document.getElementById("inviteMessage").innerHTML = `Hello <span class="guest-name">${guestName}</span>, you have been invited.`;

        if (data.response) {
          document.getElementById("existingResponse").textContent = `You already responded: "${data.response}".`;
          showStage("stage2");
        } else {
          showStage("stage3");
        }
      } else {
        error.textContent = "Sorry! The name does not exist on the guest list.";
      }
    })
    .catch(() => {
      loading.classList.remove("visible");
      error.textContent = "Error checking name. Please try again.";
    });
}

function showRSVPForm() {
  showStage("stage3");
}

function submitResponse(response) {
  if (!guestName || !rowIndex) {
    alert("Something went wrong. Please start again.");
    return;
  }

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({
      name: guestName,
      response: response,
      rowIndex: rowIndex
    }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "updated") {
        showStage("stage4");
      } else {
        alert("Something went wrong. Try again.");
      }
    })
    .catch(() => {
      alert("Failed to submit response.");
    });
}


document.getElementById('closeRSVP').onclick = function() {
  window.location.href = 'index.html';
};

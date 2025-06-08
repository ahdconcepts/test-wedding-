const scriptURL = "https://script.google.com/macros/s/AKfycbxZLrxwQ-K3Corz4UeJl2QilivjsObE3g2X2YWDUo1TO30-ouJgLC4L1vfgy4cW9I3e8w/exec";

function showStage(id) {
  document.querySelectorAll('.stage').forEach(el => el.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

// Get current values directly from sessionStorage at the START of every action!
function getGuestName() {
  return sessionStorage.getItem('guestName') || "";
}
function getRowIndex() {
  const idx = sessionStorage.getItem('rowIndex');
  return (idx !== null && idx !== "" && idx !== "null" && !isNaN(idx)) ? parseInt(idx, 10) : null;
}

function checkName() {
  const name = document.getElementById('nameInput').value.trim();
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  // Clear sessionStorage each time
  sessionStorage.removeItem('guestName');
  sessionStorage.removeItem('rowIndex');
  error.textContent = "";

  if (!name) {
    error.textContent = "Please enter your name.";
    return;
  }

  loading.classList.add("visible");

  fetch(`${scriptURL}?name=${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      loading.classList.remove("visible");
      console.log('API (checkName) response:', data);

      if (data.status === "found") {
        // Save to sessionStorage
        sessionStorage.setItem('guestName', data.matchedName || name);
        sessionStorage.setItem('rowIndex', data.rowIndex);

        document.getElementById("greeting").textContent = `Hello, ${data.matchedName || name}`;
        document.getElementById("inviteMessage").innerHTML = `Hello <span class="guest-name">${data.matchedName || name}</span>, you have been invited.`;

        if (data.response) {
          document.getElementById("existingResponse").textContent = `You already responded: "${data.response}".`;
          showStage("stage2");
        } else {
          document.getElementById("existingResponse").textContent = "";
          showStage("stage3");
        }
      } else {
        error.textContent = "Sorry! The name does not exist on the guest list.";
      }
    })
    .catch((err) => {
      loading.classList.remove("visible");
      error.textContent = "Error checking name. Please try again.";
      console.error("Fetch error in checkName:", err);
    });
}

function showRSVPForm() {
  const guestName = getGuestName();
  const rowIndex = getRowIndex();

  if (!guestName || !rowIndex) {
    alert("Session expired. Please search your name again to RSVP.");
    showStage("stage1");
    return;
  }
  showStage("stage3");
}

function submitResponse(response) {
  // Always get values directly from sessionStorage
  const guestName = getGuestName();
  const rowIndex = getRowIndex();

  // Debug info for troubleshooting!
  console.log("DEBUG: submitResponse called.");
  console.log("guestName:", guestName, "rowIndex:", rowIndex, "typeof rowIndex:", typeof rowIndex);

  if (!guestName || !rowIndex || isNaN(rowIndex) || rowIndex < 2) {
    alert("Something went wrong. Please start again.");
    showStage("stage1");
    return;
  }

  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: guestName,
      response: response,
      rowIndex: rowIndex
    })
  })
    .then(async res => {
      let text = await res.text();
      try {
        let data = JSON.parse(text);
        console.log('API (submitResponse) response:', data);

        if (data.status === "updated") {
          sessionStorage.removeItem('guestName');
          sessionStorage.removeItem('rowIndex');
          showStage("stage4");
        } else {
          alert("Something went wrong submitting your response. Please try again.");
        }
      } catch(e) {
        console.error("Non-JSON response from server:", text);
        alert("Unexpected server response. Please try again later.");
      }
    })
    .catch((err) => {
      alert("Failed to submit response. Please check your connection and try again.");
      console.error("Error in submitResponse:", err);
    });
}

document.getElementById('closeRSVP').onclick = function() {
  window.location.href = 'index.html';
};

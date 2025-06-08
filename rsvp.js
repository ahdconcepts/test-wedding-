// !! IMPORTANT: Paste your new deployment URL here (must end with /exec) !!
const scriptURL = "https://script.google.com/macros/s/AKfycbxZLrxwQ-K3Corz4UeJl2QilivjsObE3g2X2YWDUo1TO30-ouJgLC4L1vfgy4cW9I3e8w/exec";

let guestName = sessionStorage.getItem('guestName') || "";
let rowIndex = sessionStorage.getItem('rowIndex');
rowIndex = rowIndex !== null && rowIndex !== "" && rowIndex !== "null" ? parseInt(rowIndex, 10) : null;

function showStage(id) {
  document.querySelectorAll('.stage').forEach(el => el.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

function checkName() {
  const name = document.getElementById('nameInput').value.trim();
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  // Reset variables and sessionStorage
  guestName = "";
  rowIndex = null;
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
        guestName = data.matchedName || name;
        rowIndex = data.rowIndex !== undefined && data.rowIndex !== null ? parseInt(data.rowIndex, 10) : null;

        // Save to sessionStorage
        sessionStorage.setItem('guestName', guestName);
        sessionStorage.setItem('rowIndex', rowIndex);

        document.getElementById("greeting").textContent = `Hello, ${guestName}`;
        document.getElementById("inviteMessage").innerHTML = `Hello <span class="guest-name">${guestName}</span>, you have been invited.`;

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
  guestName = sessionStorage.getItem('guestName') || "";
  let storedRowIndex = sessionStorage.getItem('rowIndex');
  rowIndex = storedRowIndex !== null && storedRowIndex !== "" && storedRowIndex !== "null" ? parseInt(storedRowIndex, 10) : null;

  if (!guestName || !rowIndex) {
    alert("Session expired. Please search your name again to RSVP.");
    showStage("stage1");
    return;
  }
  showStage("stage3");
}

function submitResponse(response) {
  // Always re-fetch from sessionStorage in case of reload
  guestName = sessionStorage.getItem('guestName') || "";
  let storedRowIndex = sessionStorage.getItem('rowIndex');
  rowIndex = storedRowIndex !== null && storedRowIndex !== "" && storedRowIndex !== "null" ? parseInt(storedRowIndex, 10) : null;

  // Debug info for troubleshooting!
  console.log("DEBUG: submitResponse called.");
  console.log("guestName:", guestName, "rowIndex:", rowIndex, "typeof rowIndex:", typeof rowIndex);

  if (!guestName || !rowIndex || isNaN(rowIndex) || rowIndex < 2) {
    alert("Something went wrong. Please start again.");
    showStage("stage1");
    return;
  }

  // --- THE KEY PART: Ensures correct POST ---
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
      // For further debug, log the raw response
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

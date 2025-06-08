// ----- FILL THESE IN FROM YOUR AIRTABLE BASE -----
const AIRTABLE_BASE_ID = 'appXXXXXXXXXXXXXX';      // Your Airtable Base ID
const AIRTABLE_TABLE_ID = 'tblXXXXXXXXXXXXXX';     // Your Table ID (use the "ID", not name)
const AIRTABLE_TOKEN   = 'patXXXXXXXXXXXXXX';      // Your Personal Access Token

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
// -------------------------------------------------

function showStage(id) {
  document.querySelectorAll('.stage').forEach(el => el.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

function getGuestName() {
  return sessionStorage.getItem('guestName') || "";
}
function getRecordId() {
  return sessionStorage.getItem('recordId') || "";
}

// Show matches in a clickable list
function showMatchList(matches) {
  const matchList = document.getElementById('matchList');
  matchList.innerHTML = ""; // clear old

  matches.forEach((record, idx) => {
    const name = record.fields.Name;
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.className = "match-list-item";
    btn.onclick = () => selectGuestMatch(record);
    matchList.appendChild(btn);
  });
  matchList.style.display = "block";
}

function clearMatchList() {
  const matchList = document.getElementById('matchList');
  matchList.innerHTML = "";
  matchList.style.display = "none";
}

function selectGuestMatch(record) {
  clearMatchList();

  const guestName = record.fields.Name;
  const response = record.fields.Response || "";
  const recordId = record.id;

  sessionStorage.setItem('guestName', guestName);
  sessionStorage.setItem('recordId', recordId);

  document.getElementById("greeting").textContent = `Hello, ${guestName}`;
  document.getElementById("inviteMessage").innerHTML = `Hello <span class="guest-name">${guestName}</span>, you have been invited.`;

  if (response) {
    document.getElementById("existingResponse").textContent = `You already responded: "${response}".`;
    showStage("stage2");
  } else {
    document.getElementById("existingResponse").textContent = "";
    showStage("stage3");
  }
}

async function checkName() {
  const name = document.getElementById('nameInput').value.trim();
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  // Clear sessionStorage each time
  sessionStorage.removeItem('guestName');
  sessionStorage.removeItem('recordId');
  clearMatchList();
  error.textContent = "";

  if (!name) {
    error.textContent = "Please enter your name.";
    return;
  }

  loading.classList.add("visible");

  // Airtable formula for case-insensitive, partial match
  const filter = encodeURIComponent(`FIND(LOWER("${name}"), LOWER({Name}))`);
  const url = `${AIRTABLE_API_URL}?filterByFormula=${filter}&maxRecords=10`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`
      }
    });
    const data = await res.json();
    loading.classList.remove("visible");
    // console.log('Airtable API (checkName) response:', data);

    if (data.records && data.records.length > 1) {
      error.textContent = "Multiple matches found. Please select your name:";
      showMatchList(data.records);
    } else if (data.records && data.records.length === 1) {
      selectGuestMatch(data.records[0]);
    } else {
      error.textContent = "Sorry! The name does not exist on the guest list.";
    }
  } catch (err) {
    loading.classList.remove("visible");
    error.textContent = "Error checking name. Please try again.";
    console.error("Fetch error in checkName:", err);
  }
}

function showRSVPForm() {
  const guestName = getGuestName();
  const recordId = getRecordId();

  if (!guestName || !recordId) {
    alert("Session expired. Please search your name again to RSVP.");
    showStage("stage1");
    return;
  }
  showStage("stage3");
}

async function submitResponse(response) {
  const guestName = getGuestName();
  const recordId = getRecordId();

  if (!guestName || !recordId) {
    alert("Something went wrong. Please start again.");
    showStage("stage1");
    return;
  }

  // Update RSVP in Airtable
  try {
    const url = `${AIRTABLE_API_URL}/${recordId}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: { Response: response }
      })
    });
    const data = await res.json();
    // console.log('Airtable API (submitResponse) response:', data);

    if (data.id && data.fields.Response === response) {
      sessionStorage.removeItem('guestName');
      sessionStorage.removeItem('recordId');
      showStage("stage4");
    } else {
      alert("Something went wrong submitting your response. Please try again.");
    }
  } catch (err) {
    alert("Failed to submit response. Please check your connection and try again.");
    console.error("Error in submitResponse:", err);
  }
}

document.getElementById('closeRSVP').onclick = function() {
  window.location.href = 'index.html';
};

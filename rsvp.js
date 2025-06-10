// ----- FILL THESE IN FROM YOUR AIRTABLE BASE -----
const AIRTABLE_BASE_ID = 'appuh4AKL6ZzeOAGq';
const AIRTABLE_TABLE_ID = 'tbl0MtNUfV5p4XwA8';
const AIRTABLE_TOKEN = 'patbin8YubwZjOsYg.612dc9c67b0f43cc491bd1e2e19213e2541550b23c5042832010100d6d1a8cc8';

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

function showMatchList(matches) {
  const matchList = document.getElementById('matchList');
  matchList.innerHTML = "";

  matches.forEach(record => {
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
  const response = record.fields.Responses || "";
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

// Global storage for Airtable guest records
let allGuestRecords = [];

async function loadGuestData() {
  const loading = document.getElementById("loading");
  loading.classList.add("visible");

  try {
    let url = `${AIRTABLE_API_URL}?pageSize=100`;
    let allRecords = [];
    let offset;

    do {
      const response = await fetch(offset ? `${url}&offset=${offset}` : url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`
        }
      });

      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    allGuestRecords = allRecords;
  } catch (err) {
    console.error("Error loading Airtable data:", err);
  } finally {
    loading.classList.remove("visible");
  }
}

async function checkName() {
  const name = document.getElementById('nameInput').value.trim().toLowerCase();
  const error = document.getElementById("error");
  const loading = document.getElementById("loading");

  error.textContent = "";
  clearMatchList();
  sessionStorage.removeItem('guestName');
  sessionStorage.removeItem('recordId');

  if (!name) {
    error.textContent = "Please enter your name.";
    return;
  }

  // Load Airtable data if not already fetched
  if (allGuestRecords.length === 0) {
    await loadGuestData();
  }

  // Use Fuse.js for fuzzy + partial match
  const fuse = new Fuse(allGuestRecords, {
    keys: ['fields.Name'],
    threshold: 0.4,           // Lower is stricter; 0.4 is a good fuzzy setting
    ignoreLocation: true,
    minMatchCharLength: 2
  });

  const results = fuse.search(name);

  if (results.length === 1) {
    selectGuestMatch(results[0].item);
  } else if (results.length > 1) {
    error.textContent = "Multiple matches found. Please select your name:";
    showMatchList(results.map(r => r.item));
  } else {
    error.textContent = "Sorry! The name does not exist on the guest list.";
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

  try {
    const url = `${AIRTABLE_API_URL}/${recordId}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: { Responses: response }
      })
    });
    const data = await res.json();

    if (data.id && data.fields.Responses === response) {
      sessionStorage.removeItem('guestName');
      sessionStorage.removeItem('recordId');
      showStage("stage4");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2500);
    } else {
      alert("Something went wrong submitting your response. Please try again.");
    }
  } catch (err) {
    alert("Failed to submit response. Please check your connection and try again.");
    console.error("Error in submitResponse:", err);
  }
}

document.getElementById('closeRSVP').onclick = function () {
  window.location.href = 'index.html';
};

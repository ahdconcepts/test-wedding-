document.addEventListener("DOMContentLoaded", () => {
  const guestFullNameInput = document.getElementById("guestFullName");
  const displayFullName = document.getElementById("displayFullName");
  const errorNotFound = document.getElementById("errorNotFound");
  const alreadyRespondedMessage = document.getElementById("alreadyRespondedMessage");
  const confirmName = document.getElementById("confirmName");

  let selectedGuest = "";
  let existingResponse = "";

  const scriptURL = "https://script.google.com/macros/s/AKfycbztNef5f7wTMSf0qDxycVWJBOo9PIHqBcfztAwET9QaAaF3vHAqd2yYeAKpB1Ore1dIRw/exec";

  document.getElementById("checkNameBtn").addEventListener("click", checkGuestName);

  function checkGuestName() {
    const fullName = guestFullNameInput.value.trim();

    if (!fullName) {
      errorNotFound.textContent = "Please enter a name.";
      errorNotFound.classList.remove("hidden");
      return;
    }

    fetch(`${scriptURL}?name=${encodeURIComponent(fullName)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.status === "found") {
          selectedGuest = fullName;
          existingResponse = data.response;

          displayFullName.textContent = fullName;
          displayFullName.style.cursor = "pointer";
          displayFullName.classList.remove("hidden");

          // Fix: Always add new listener on match
          displayFullName.addEventListener("click", handleNameClick);

          errorNotFound.classList.add("hidden");
        } else {
          errorNotFound.textContent = "Sorry! The name does not exist on the guest list.";
          errorNotFound.classList.remove("hidden");
          displayFullName.classList.add("hidden");
        }
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        errorNotFound.textContent = "An error occurred. Please try again.";
        errorNotFound.classList.remove("hidden");
      });
  }

  function handleNameClick() {
    if (existingResponse) {
      alreadyRespondedMessage.textContent = `You responded '${existingResponse}'. Do you want to change it?`;
      alreadyRespondedMessage.classList.remove("hidden");
    } else {
      alreadyRespondedMessage.classList.add("hidden");
    }
    showStage("stage2");
  }

  window.handleStage2Response = (change) => {
    if (change) {
      const firstName = selectedGuest.split(" ")[0];
      confirmName.textContent = `Hello ${firstName},`;
      showStage("stage3");
    } else {
      showStage("stage4");
      startCountdownAndReload();
    }
  };

  window.submitRSVP = (response) => {
    fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: selectedGuest,
        response: response
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "updated") {
          alert(`RSVP submitted: ${selectedGuest} - ${response}`);
          goToThankYou();
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch(err => {
        console.error("Error submitting RSVP:", err);
        alert("Failed to send RSVP.");
      });
  };

  window.goToThankYou = () => {
    showStage("stage4");
    startCountdownAndReload();
  };

  function startCountdownAndReload() {
    const redirectMsg = document.querySelector("#stage4 p:last-of-type");
    let countdown = 5;
    redirectMsg.textContent = `Redirecting in ${countdown}...`;
    redirectMsg.style.opacity = 1;

    const timer = setInterval(() => {
      countdown--;
      redirectMsg.textContent = `Redirecting in ${countdown}...`;
      redirectMsg.style.opacity = 1 - (5 - countdown) * 0.15;

      if (countdown === 0) {
        clearInterval(timer);
        redirectMsg.style.opacity = 0;
        location.reload();
      }
    }, 1000);
  }

  function showStage(id) {
    document.querySelectorAll(".rsvp-stage").forEach(stage => stage.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  }

  // Show stage 1 on load
  showStage("stage1");
});

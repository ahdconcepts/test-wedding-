document.addEventListener("DOMContentLoaded", () => {
    // Slide-in Effect for Sections
    const slideElements = document.querySelectorAll(".slide-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.remove("exiting");
          } else if (
            entry.boundingClientRect.top < 0 ||
            entry.boundingClientRect.bottom > window.innerHeight
          ) {
            entry.target.classList.remove("visible");
            entry.target.classList.add("exiting");
          }
        });
      },
      { threshold: 0.9 }
    );
  
    slideElements.forEach((el) => observer.observe(el));
  
    // Floating Button Menu Toggle with auto-close
    const menuButton = document.getElementById("menuButton");
    const menuOptions = document.getElementById("menuOptions");
  
    let autoCloseTimer; // store timeout ID
  
    menuButton.addEventListener("click", () => {
      const isOpening = menuOptions.classList.contains("hidden");
      menuOptions.classList.toggle("hidden");
  
      if (isOpening) {
        clearTimeout(autoCloseTimer); // clear any previous timer
  
        autoCloseTimer = setTimeout(() => {
          menuOptions.classList.add("hidden");
        }, 1500); // 1.5 seconds
      }
    });
  
    // Slideshow Logic for Welcome Section
    const slides = document.querySelectorAll(".slideshow .slide");
    let currentSlide = 0;
  
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 3000); // Slide every 3 seconds
  });
  
  //NEW RSVP CODE//

 document.addEventListener("DOMContentLoaded", () => {
  const guestFullNameInput = document.getElementById("guestFullName");
  const displayFullName = document.getElementById("displayFullName");
  const errorNotFound = document.getElementById("errorNotFound");
  const alreadyRespondedMessage = document.getElementById("alreadyRespondedMessage");
  const confirmName = document.getElementById("confirmName");

  let selectedGuest = "";
  let existingResponse = "";

  const scriptURL = "https://script.google.com/macros/s/AKfycbx91MM2yOJpF8CuT4Ua4WqoZYYkCosevxjTvwbHZ26LoTlzUwzZuG1OjR3JGKIHQ6gi/exec"; // ✅ replace with your real URL

  window.checkGuestName = () => {
    const fullName = guestFullNameInput.value.trim();

    if (!fullName) {
      errorNotFound.textContent = "Please enter a name.";
      errorNotFound.classList.remove("hidden");
      return;
    }

    fetch(`${scriptURL}?name=${encodeURIComponent(fullName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "found") {
          selectedGuest = fullName;
          existingResponse = data.response;

          // Show matched name to click before continuing
          displayFullName.textContent = fullName;
          displayFullName.style.cursor = "pointer";
          displayFullName.classList.remove("hidden");

          displayFullName.onclick = () => {
            if (existingResponse) {
              alreadyRespondedMessage.textContent = `You responded '${existingResponse}'. Do you want to change it?`;
              alreadyRespondedMessage.classList.remove("hidden");
            } else {
              alreadyRespondedMessage.classList.add("hidden");
            }
            showStage("stage2");
          };

          errorNotFound.classList.add("hidden");
        } else {
          errorNotFound.textContent = "Sorry! The name does not exist on the guest list.";
          errorNotFound.classList.remove("hidden");
        }
      })
      .catch(err => {
        console.error("Error checking name:", err);
        errorNotFound.textContent = "An error occurred. Please try again.";
        errorNotFound.classList.remove("hidden");
      });
  };

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

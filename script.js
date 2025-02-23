document.addEventListener("DOMContentLoaded", () => {
  // Floating Menu Toggle
  const menuButton = document.getElementById("menuButton");
  const menuOptions = document.getElementById("menuOptions");

  menuButton.addEventListener("click", () => {
    menuOptions.classList.toggle("hidden");
  });

  // Progress Bar Functionality
  const progressBar = document.getElementById("progress-bar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = `${scrollPercentage}%`;
  });
});

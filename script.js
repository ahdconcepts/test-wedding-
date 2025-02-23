document.addEventListener("DOMContentLoaded", () => {
  // Slide-in Effect for Sections
  const slideElements = document.querySelectorAll(".slide-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.5 }
  );

  slideElements.forEach((el) => observer.observe(el));

  // Floating Button Menu Toggle
  const menuButton = document.getElementById("menuButton");
  const menuOptions = document.getElementById("menuOptions");

  menuButton.addEventListener("click", () => {
    menuOptions.classList.toggle("hidden");
  });

  // Scrolling Progress Bar
  const progressBar = document.getElementById("progress-bar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  });
});

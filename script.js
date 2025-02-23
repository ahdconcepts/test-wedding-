document.addEventListener("DOMContentLoaded", () => {
  // Progress Bar
  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;
    const width = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = width + "%";
  });

  // Floating Button Toggle
  const menuButton = document.getElementById("menuButton");
  const menuOptions = document.getElementById("menuOptions");
  menuButton.addEventListener("click", () => {
    menuOptions.classList.toggle("hidden");
  });

  // Slide-in Animation
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
});

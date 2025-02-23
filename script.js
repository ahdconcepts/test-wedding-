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
    { threshold: 0.5 }
  );

  slideElements.forEach((el) => observer.observe(el));

  // Floating Menu Toggle
  const menuButton = document.getElementById("menuButton");
  const menuOptions = document.getElementById("menuOptions");

  menuButton.addEventListener("click", () => {
    menuOptions.classList.toggle("hidden");
  });

  // Progress Bar
  const progressBar = document.getElementById("progress-bar");
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollPosition / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });

  // Lazy Loading for Images
  const lazyImages = document.querySelectorAll("img.lazy");
  const lazyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    },
    { threshold: 0.1 }
  );

  lazyImages.forEach((img) => lazyObserver.observe(img));
});

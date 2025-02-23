document.addEventListener("DOMContentLoaded", () => {
  // Slide-in Effect
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

  // Floating Menu Toggle
  const menuButton = document.getElementById("menuButton");
  const menuOptions = document.getElementById("menuOptions");

  menuButton.addEventListener("click", () => {
    menuOptions.classList.toggle("visible");
  });

  // Lazy Loading Images
  const lazyImages = document.querySelectorAll(".lazy-load");
  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          lazyObserver.unobserve(img);
        }
      });
    },
    { threshold: 0.1 }
  );

  lazyImages.forEach((img) => lazyObserver.observe(img));

  // Progress Bar
  const progressBar = document.getElementById("progressBar");
  document.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
});

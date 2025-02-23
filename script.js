document.addEventListener("DOMContentLoaded", () => {
  // Progress Bar
  const progressBar = document.getElementById("progressBar");
  document.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  });

  // Lazy Loading
  const lazyImages = document.querySelectorAll("img.lazy");
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        img.classList.add("lazy-loaded");
        lazyObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => lazyObserver.observe(img));

  // Floating Menu Toggle
  const menuButton = document.getElementById("menuButton");
  const menuOptions = document.getElementById("menuOptions");

  menuButton.addEventListener("click", () => {
    menuOptions.classList.toggle("hidden");
  });
});

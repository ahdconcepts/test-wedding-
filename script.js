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
  

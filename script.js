document.addEventListener("DOMContentLoaded", () => {
  const slideElements = document.querySelectorAll(".slide-in")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          entry.target.classList.remove("exiting")
        } else if (
          entry.boundingClientRect.top < 0 ||
          entry.boundingClientRect.bottom > window.innerHeight
        ) {
          entry.target.classList.remove("visible")
          entry.target.classList.add("exiting")
        }
      })
    },
    { threshold: 0.5 },
  )

  slideElements.forEach((el) => observer.observe(el))
})

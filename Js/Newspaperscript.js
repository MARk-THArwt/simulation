const screen = window.innerWidth;
const x = document.getElementById("nav");
addEventListener("scroll", function () {
  x.classList.toggle("scroled", window.scrollY > 0);
});


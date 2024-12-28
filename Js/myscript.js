const darkmode = document.querySelectorAll(".darkmode");
const inputEl = document.querySelector(".input");
const label = document.querySelector("#label");
const home = document.querySelector("#home");
const bodyEl = document.querySelector("body");

document.getElementById("show").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("cardsShowDown").style.display = "block";
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("visible");
      card.classList.toggle("invisible");
    }, index * 400 + 200);
  });
});
const screen = window.innerWidth;
const x = document.getElementById("nav");
addEventListener("scroll", function () {
  x.classList.toggle("scroled", window.scrollY > 0);
});

inputEl.checked = JSON.parse(localStorage.getItem("mode"));

updateBody();

function updateBody() {
  if (inputEl.checked) {
    bodyEl.style.background = "black";
    home.style.filter = "brightness(65%)";
    darkmode.forEach((item, index) => {
      item.style.color = "white";
    });
  } else {
    bodyEl.style.background = "white";
    home.style.filter = "brightness(90%)";
    darkmode.forEach((item, index) => {
      item.style.color = "black";
    });
  }
}

inputEl.addEventListener("input", () => {
  updateBody();
  updateLocalStorage();
});

function updateLocalStorage() {
  localStorage.setItem("mode", JSON.stringify(inputEl.checked));
}

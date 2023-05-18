const buttonTheme = document.getElementById("theme");
const body = document.querySelector("body");
const imgTheme = document.querySelector(".img-button");
buttonTheme.addEventListener("click", () => {

  if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode")
      imgTheme.setAttribute("src", "./src/imagens/sun.png")
  }
  else {
      body.classList.add("dark-mode")
      imgTheme.setAttribute("src", "./src/imagens/moon.png")
  }
})
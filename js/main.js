// Cambiar header al hacer scroll
const header = document.getElementById("header");


window.addEventListener("scroll", () => {
if (window.scrollY > 60) header.classList.add("scrolled");
else header.classList.remove("scrolled");
});
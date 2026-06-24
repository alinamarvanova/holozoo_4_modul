// поп ап

const contactPopup = document.getElementById("contactPopup");
const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");
const send_button = document.querySelector(".send_button");

send_button.addEventListener("click", () => {
  contactPopup.classList.add("active");
});

popupClose.addEventListener("click", () => {
  contactPopup.classList.remove("active");
});

popupOverlay.addEventListener("click", () => {
  contactPopup.classList.remove("active");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && contactPopup.classList.contains("active")) {
    contactPopup.classList.remove("active");
  }
});

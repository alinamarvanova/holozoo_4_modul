const bookArea = document.getElementById("bookArea");

const bookImages = ["book_1.png", "book_2.png", "book_3.png", "book_4.png"];

let currentImageIndex = 0;

bookArea.addEventListener("mousemove", (e) => {
  const rect = bookArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;

  bookArea.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

bookArea.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % bookImages.length;
  bookArea.style.backgroundImage = `url('${bookImages[currentImageIndex]}')`;
});

window.addEventListener("load", () => {
  if (bookImages[0]) {
    bookArea.style.backgroundImage = `url('${bookImages[0]}')`;
  }
});

bookArea.addEventListener("mouseleave", () => {
  bookArea.style.backgroundPosition = "center";
});

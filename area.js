let filterButtons = document.querySelectorAll(".filter-btn");
let areaName = document.getElementById("areaName");
let areaDescription = document.getElementById("areaDescription");
let areaImage = document.getElementById("areaImage");

let areaData = {
  водопад: {
    name: "ВОДОПАД",
    description:
      "водопад расположен недалеко от моста, часто в пределах этой территории можно встретить голограммы северного медведя, стаи диких уток и древесные лягушки",
    image: "waterfall.png",
  },
  лес: {
    name: "ЛЕС",
    description:
      "густой лес где обитают различне виды волков и диких оленей ",
    image: "forest.png",
  },
  мост: {
    name: "МОСТ",
    description:
      "старинный каменный мост через реку, здесь часто видны голограммы птиц",
    image: "bridge2.png",
  },
  деревня: {
    name: "ДЕРЕВНЯ",
    description:
      "заброшенная деревня где обитают голограммы различных животных",
    image: "village.png",
  },
  бассейн: {
    name: "БАССЕЙН",
    description:
      "большой бассейн с голографическими рыбами и водными существами",
    image: "undercave2.png",
  },
  озеро: {
    name: "ОЗЕРО",
    description: "спокойное озеро окруженное лесом где живут утки и рыбы",
    image: "lake.png",
  },
};

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    let area = btn.dataset.area;
    let data = areaData[area];

    areaName.textContent = data.name;
    areaDescription.textContent = data.description;

    areaImage.style.backgroundImage = `url('${data.image}')`;

    document.querySelector(".area-coordinates").textContent = data.coordinates;
  });
});

window.addEventListener("load", () => {
  const firstBtn = filterButtons[0];
  firstBtn.click();
});

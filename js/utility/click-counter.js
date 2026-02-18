document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".trading-chart");

  let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;

  button.addEventListener("click", () => {
    clickCount++;

    localStorage.setItem("clickCount", clickCount);

    if (clickCount % 5 === 0) {
      // milestone atteint
    }

    if (clickCount % 10 === 0) {
      button.classList.toggle("grow");
    }

    if (clickCount >= 20) {
      localStorage.removeItem("clickCount");
      clickCount = 0;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // === CRÉATION DES ÉLÉMENTS ===
  const dateContainer = document.createElement("div");
  dateContainer.id = "date-container";
  dateContainer.className = "date-container";
  document.querySelector(".header-row").appendChild(dateContainer);

  const clockElement = document.createElement("span");
  clockElement.id = "live-clock";
  clockElement.className = "live-clock";
  clockElement.textContent = "12:34:56";
  clockElement.style.display = "none";
  document.querySelector(".date-container").appendChild(clockElement);

  const dateElement = document.createElement("span");
  dateElement.id = "current-date";
  dateElement.className = "current-date";
  dateElement.textContent = "01/01/2024";
  dateElement.style.display = "none";
  document.querySelector(".date-container").appendChild(dateElement);

  const greetingElement = document.createElement("span");
  greetingElement.className = "greeting-text";
  greetingElement.textContent = greeting();
  dateContainer.appendChild(greetingElement);

  // === FONCTIONS UTILITAIRES ===
  const ajouterZero = (nombre) => String(nombre).padStart(2, "0");

  function greeting() {
    const hours = new Date().getHours();
    return hours > 5 && hours < 18 ? "Bonjour" : "Bonsoir";
  }

  const updateDateContainer = () => {
    const now = new Date();
    const hours = ajouterZero(now.getHours());
    const minutes = ajouterZero(now.getMinutes());
    const seconds = ajouterZero(now.getSeconds());
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    const day = ajouterZero(now.getDate());
    const month = ajouterZero(now.getMonth() + 1);
    const year = now.getFullYear();
    dateElement.textContent = `${day}/${month}/${year}`;
  };

  // === ANIMATION DE TRANSITION ===
  setTimeout(() => {
    greetingElement.style.opacity = "0";

    setTimeout(() => {
      greetingElement.style.display = "none";
      clockElement.style.opacity = "0";
      dateElement.style.opacity = "0";
      clockElement.style.display = "block";
      dateElement.style.display = "block";

      updateDateContainer();
      setInterval(updateDateContainer, 1000);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clockElement.style.opacity = "1";
          dateElement.style.opacity = "0.7";
        });
      });
    }, 500);
  }, 3000);
});

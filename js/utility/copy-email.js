document.addEventListener("DOMContentLoaded", function () {
  // variables
  const emailButton = document.getElementById("email-link");
  const emailAddress = "paul.alessandrini@email.com";
  let hoverTooltip = null;
  let successTooltip = null;
  let errorTooltip = null;
  // wrapper
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  emailButton.parentNode.insertBefore(wrapper, emailButton);
  wrapper.appendChild(emailButton);
  // functions
  function successDelete() {
    if (successTooltip) {
      successTooltip.remove();
      successTooltip = null;
    }
  }

  function hoverDelete() {
    if (hoverTooltip) {
      hoverTooltip.remove();
      hoverTooltip = null;
    }
  }

  function errorDelete() {
    if (errorTooltip) {
      errorTooltip.remove();
      errorTooltip = null;
    }
  }

  function createTooltip(message, type) {
    const tooltip = document.createElement("div");
    tooltip.className = `tooltip tooltip-${type}`;
    tooltip.classList.add("show");
    tooltip.textContent = message;
    return tooltip;
  }
  // event listeners
  emailButton.addEventListener("mouseenter", () => {
    successDelete();
    errorDelete();
    if (hoverTooltip) return;
    hoverTooltip = createTooltip("Copier l'email", "hover");
    wrapper.appendChild(hoverTooltip);
  });

  emailButton.addEventListener("mouseleave", () => {
    hoverDelete();
  });

  emailButton.addEventListener("click", () => {
    hoverDelete();

    navigator.clipboard
      .writeText(emailAddress)
      .then(() => {
        emailButton.classList.remove("email-copied");
        void emailButton.offsetWidth;
        emailButton.classList.add("email-copied");

        successDelete();

        successTooltip = createTooltip("✓ Copié !", "success");
        wrapper.appendChild(successTooltip);

        setTimeout(() => {
          emailButton.classList.remove("email-copied");
        }, 1000);

        setTimeout(() => {
          successDelete();
        }, 1500);
      })

      .catch((err) => {
        console.error("Erreur copie : ", err);
        successDelete();
        hoverDelete();
        errorDelete();

        errorTooltip = createTooltip("❌ Impossible de copier", "error");
        wrapper.appendChild(errorTooltip);

        setTimeout(() => {
          errorDelete();
        }, 3000);
      });
  });
});

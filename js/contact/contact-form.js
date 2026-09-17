(() => {
  const form = document.querySelector(".contact-form");

  if (!form) return;

  const submitButton = form.querySelector(".contact-submit-btn");
  const status = form.querySelector(".contact-form-status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Envoi...";
    status.textContent = "";
    status.className = "contact-form-status";

    const genericErrorMessage = "Une erreur est survenue. Veuillez réessayer.";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        const apiMessage = result.message || result.body?.message;
        const error = new Error(apiMessage || genericErrorMessage);
        error.isApiError = true;
        throw error;
      }

      form.reset();
      status.textContent = "Votre message a bien été envoyé.";
      status.classList.add("is-success");
      window.toast?.success("Votre message a bien été envoyé.");
    } catch (error) {
      status.textContent = error.isApiError
        ? error.message
        : genericErrorMessage;
      status.classList.add("is-error");
      window.toast?.error(status.textContent);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer";
    }
  });
})();

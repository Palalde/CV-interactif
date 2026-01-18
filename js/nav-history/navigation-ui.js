import { NavigationHistory } from "./navigation-history.js";

// flag

let isNavigatingFromHistory = false;

// instance

const history = new NavigationHistory();

// functions button

function setupNavigationButtons() {
  // button dom
  // desktop
  const backButton = document.getElementById("nav-back");
  const forwardButton = document.getElementById("nav-forward");
  // mobile
  const backButtonMobile = document.getElementById("nav-back-mobile");
  const forwardButtonMobile = document.getElementById("nav-forward-mobile");

  // maj l'etat des boutons
  function updateButtons() {
    // etat des boutons
    const canGoBack = history.canGoBack();
    const canGoForward = history.canGoForward();

    // desktop
    if (!backButton || !forwardButton) return;

    backButton.disabled = !canGoBack;
    forwardButton.disabled = !canGoForward;
    // mobile
    if (!backButtonMobile || !forwardButtonMobile) return;

    backButtonMobile.disabled = !canGoBack;
    forwardButtonMobile.disabled = !canGoForward;
  }

  // event listeners
  // back
  if (backButton) {
    backButton.addEventListener("click", () => {
      const periode = history.back();
      if (periode) {
        navigateToPeriode(periode);
      }
      updateButtons();
    });
  }
  // forward
  if (forwardButton) {
    forwardButton.addEventListener("click", () => {
      const periode = history.forward();
      if (periode) {
        navigateToPeriode(periode);
      }
      updateButtons();
    });
  }

  // mobile back
  if (backButtonMobile) {
    backButtonMobile.addEventListener("click", () => {
      const periode = history.back();
      if (periode) {
        navigateToPeriode(periode);
      }
      updateButtons();
    });
  }

  // mobile forward
  if (forwardButtonMobile) {
    forwardButtonMobile.addEventListener("click", () => {
      const periode = history.forward();
      if (periode) {
        navigateToPeriode(periode);
      }
      updateButtons();
    });
  }

  return updateButtons;
}

// navigation function
function navigateToPeriode(periode) {
  // anti boucle
  isNavigatingFromHistory = true;
  // fonction de navigation sur main.js
  window.navigateTimelineToPeriode(periode);
  // reset flag
  isNavigatingFromHistory = false;
}

// current periode slider navigation
function getCurrentPeriodeFromSlider() {
  // check slider
  const rangeSlider = document.getElementById("myRange");
  if (!rangeSlider) return null;

  // get value
  const value = parseFloat(rangeSlider.value);

  // return value selon la periode
  if (value < 37.5) return "etudes";
  if (value < 75) return "trading";
  if (value < 112.5) return "leclerc";
  return "dev";
}

// hook sur le slider pour track la nav
function setupSliderHook(updateButtons) {
  // check slider
  const rangeSlider = document.getElementById("myRange");
  if (!rangeSlider) return;

  // event listener
  rangeSlider.addEventListener("change", () => {
    // anti boucle
    if (isNavigatingFromHistory) return;

    // get current periode
    const periode = getCurrentPeriodeFromSlider();
    if (!periode) return;

    // push dans l'historique
    history.push(periode);

    // maj boutons
    updateButtons();
  });
}

// initialisation
export function initNavigationHistory() {
  // call setupNavigationButtons
  const updateButtons = setupNavigationButtons();

  // call setupSliderHook
  setupSliderHook(updateButtons);

  // periode initiale a l'historique
  const initialPeriode = getCurrentPeriodeFromSlider();
  history.push(initialPeriode);

  // maj boutons
  updateButtons();
}

// auto init
document.addEventListener("DOMContentLoaded", () => {
  initNavigationHistory();
});

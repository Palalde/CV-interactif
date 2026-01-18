// Module pour gérer le filtre des favoris
export function initFavoritesFilter(onFilterChange) {
  const filterBtn = document.getElementById("filter-favorites-only");
  if (!filterBtn) return;

  let isActive = false;

  filterBtn.addEventListener("click", () => {
    // Toggle état
    isActive = !isActive;
    filterBtn.setAttribute("aria-pressed", isActive);

    // Callback pour relancer la recherche
    if (typeof onFilterChange === "function") {
      onFilterChange(isActive);
    }
  });

  // Retourner l'état actuel (utile pour la recherche)
  return {
    isActive: () => isActive,
  };
}

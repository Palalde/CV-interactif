// Module pour gérer les filtres par période et catégorie
export function initCompetenceFilters(onFilterChange) {
  const periodeBtns = document.querySelectorAll(".filter-periode");
  const categoryBtns = document.querySelectorAll(".filter-category");

  if (!periodeBtns.length && !categoryBtns.length) return null;

  const activeFilters = {
    periodes: new Set(),
    categories: new Set(),
  };

  function toggleFilter(btn, set, key) {
    const isActive = btn.getAttribute("aria-pressed") === "true";
    if (isActive) {
      set.delete(key);
      btn.setAttribute("aria-pressed", "false");
    } else {
      set.add(key);
      btn.setAttribute("aria-pressed", "true");
    }

    if (typeof onFilterChange === "function") {
      onFilterChange();
    }
  }

  periodeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const periode = btn.dataset.filterPeriode;
      toggleFilter(btn, activeFilters.periodes, periode);
    });
  });

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filterCategory;
      toggleFilter(btn, activeFilters.categories, category);
    });
  });

  return {
    isActive: () =>
      activeFilters.periodes.size > 0 || activeFilters.categories.size > 0,
    getActivePeriodes: () => activeFilters.periodes,
    getActiveCategories: () => activeFilters.categories,
    applyFilters(competences) {
      return competences.filter((comp) => {
        // Période filter: compétence doit matcher une des périodes sélectionnées
        const matchPeriode =
          activeFilters.periodes.size === 0 ||
          activeFilters.periodes.has(comp.periode);

        // Catégorie filter: compétence doit avoir au moins une des catégories sélectionnées
        const matchCategory =
          activeFilters.categories.size === 0 ||
          (Array.isArray(comp.categories) &&
            comp.categories.some((cat) => activeFilters.categories.has(cat)));

        return matchPeriode && matchCategory;
      });
    },
  };
}

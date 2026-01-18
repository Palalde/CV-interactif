// index-landing.js : interactions spécifiques à la page d'accueil (landing)
// Réutilise le système de thème existant (theme-toggle.js) et le style global

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // Activer stable viewport hauteur si main.js n'est pas chargé ici
    (function setupStableVh() {
      const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--app-vh", `${vh}vh`);
      };
      setVh();
      window.addEventListener("resize", setVh);
      window.addEventListener("orientationchange", setVh);
    })();

    const sections = Array.from(document.querySelectorAll(".landing-block"));
    const dotsNav = document.getElementById("dotsNav");
    if (dotsNav) {
      sections.forEach((s, i) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Aller à section " + (i + 1));
        b.addEventListener("click", () =>
          s.scrollIntoView({ behavior: "smooth" }),
        );
        dotsNav.appendChild(b);
      });
    }
    const dots = dotsNav ? Array.from(dotsNav.children) : [];

    // IntersectionObserver pour reveal + dot actif
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            const idx = sections.indexOf(e.target);
            dots.forEach((d) => d.classList.remove("active"));
            if (dots[idx]) dots[idx].classList.add("active");
          }
        });
      },
      { threshold: 0.45 },
    );
    sections.forEach((s) => io.observe(s));

    // Synchroniser initialement les icônes si updateNavIcons existe
    if (typeof window.updateNavIcons === "function") {
      const isLight = document.body.classList.contains("light");
      window.updateNavIcons(isLight);
    }

    // ----- Fixer le logo + titres en haut à gauche façon discord -----
    (function fixBrandTopLeft() {
      if (!document.body.classList.contains("landing")) return;
      const original = document.querySelector(".header-row .header-home-link");
      if (!original) return;
      // Eviter double injection
      if (document.querySelector(".fixed-brand-clone")) return;
      const clone = original.cloneNode(true);
      clone.classList.add("fixed-brand-clone");
      // Marquer l'original comme placeholder pour conserver l'espace
      original.classList.add("brand-placeholder");
      document.body.appendChild(clone);
    })();
  });
})();

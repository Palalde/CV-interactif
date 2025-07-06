document.addEventListener('DOMContentLoaded', function() {
  const homeLink = document.getElementById('header-home-link');
  if (homeLink) {
    homeLink.addEventListener('click', function() {
      window.location.href = 'CV.HTML';
    });
  }
});
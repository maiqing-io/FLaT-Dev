document.querySelectorAll('.team-avatar[data-photo]').forEach((el) => {
  const img = document.createElement('img');
  img.src = el.getAttribute('data-photo');
  img.alt = el.getAttribute('data-alt') || '';
  img.width = 56;
  img.height = 56;
  img.loading = 'lazy';
  img.addEventListener('error', () => img.remove());
  el.prepend(img);
});

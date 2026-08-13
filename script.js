document.querySelectorAll('.evidence-toggle').forEach((button) => {
  const detail = document.getElementById(button.getAttribute('aria-controls'));
  if (!detail) return;

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    detail.hidden = expanded;
    button.textContent = expanded ? '자세히 보기' : '접기';
  });
});

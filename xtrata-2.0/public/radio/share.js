for (const mode of ['compact', 'minimal']) {
  const url = new URL('/radio/embed.html', location.origin);
  if (mode === 'minimal') url.searchParams.set('mode', mode);
  document.getElementById(mode).value = `<iframe src="${url.href}" title="Xtrata Radio" width="100%" height="${mode === 'minimal' ? 72 : 140}" style="border:0" allow="autoplay" loading="lazy"></iframe>`;
}
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.onclick = async () => {
    const field = document.getElementById(button.dataset.copy);
    try { await navigator.clipboard.writeText(field.value); document.getElementById('feedback').textContent = 'Embed code copied.'; }
    catch { field.focus(); field.select(); document.getElementById('feedback').textContent = 'Select and copy the embed code above.'; }
  };
});

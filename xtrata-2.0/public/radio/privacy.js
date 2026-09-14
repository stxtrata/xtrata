const choice = document.getElementById('analytics-choice');
const status = document.getElementById('analytics-status');
function render() {
  try {
    const off = localStorage.getItem('xtrata.radio.analytics.disabled') === '1';
    choice.textContent = off ? 'Allow listening statistics' : 'Turn off listening statistics';
    status.textContent = navigator.globalPrivacyControl ? 'Counting is disabled by Global Privacy Control.' : off ? 'Listening statistics are off in this browser.' : 'Listening statistics are allowed when the counter is enabled.';
  } catch { choice.disabled = true; status.textContent = 'This browser does not allow saving a preference.'; }
}
choice.addEventListener('click', () => {
  try {
    const off = localStorage.getItem('xtrata.radio.analytics.disabled') === '1';
    localStorage.setItem('xtrata.radio.analytics.disabled', off ? '0' : '1');
    if (!off) { localStorage.removeItem('xtrata.radio.browser.v1'); sessionStorage.removeItem('xtrata.radio.counter.v1'); }
    render();
  } catch { status.textContent = 'Could not save your preference.'; }
});
render();

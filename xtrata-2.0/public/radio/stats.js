const element = (id) => document.getElementById(id);
async function refresh() {
  element('status').textContent = 'Loading…';
  try {
    const response = await fetch('/debug/radio?range=' + element('range').value, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Statistics unavailable');
    element('tracks').replaceChildren();
    for (const row of data.tracks) {
      const tr = document.createElement('tr');
      for (const value of [`${row.contract} / #${row.token_id} · ${row.source} · rules v${row.rule_version}`, row.starts, row.partials, row.in_progress, row.qualified_plays, row.unique_browsers, Math.max(0,row.qualified_plays-row.unique_browsers),row.completions,(row.session_listening_seconds/60).toFixed(1)]) {
        const td = document.createElement('td'); td.textContent = String(value); tr.append(td);
      }
      element('tracks').append(tr);
    }
    element('days').replaceChildren();
    for (const day of data.daily) { const li = document.createElement('li'); li.textContent = `${day.day_utc}: ${day.qualified_plays} plays · ${day.unique_browsers} unique browsers`; element('days').append(li); }
    element('notice').textContent = data.notice;
    element('status').textContent = data.tracks.length ? 'Updated ' + new Date(data.until).toLocaleString() : 'No measured playback in this period.';
  } catch (error) { element('status').textContent = error.message; }
}
element('refresh').addEventListener('click',refresh);
element('range').addEventListener('change',refresh);
void refresh();

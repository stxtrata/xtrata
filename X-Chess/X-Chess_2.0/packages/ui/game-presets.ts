/** Presets only edit the draft. Canonical rules validation still gates signing. */
export function applyGamePreset(doc: Document, preset: string, address: string | null): void {
  if (!['friend', 'first-two', 'community'].includes(preset)) return;
  for (const color of ['white', 'black']) {
    const seat = doc.getElementById(`rules-${color}`) as HTMLSelectElement;
    const who = doc.getElementById(`rules-${color}-who`) as HTMLInputElement;
    seat.value = preset === 'friend' ? 'named' : preset === 'first-two' ? 'first-mover' : 'anyone';
    who.value = preset === 'friend' && color === 'white' ? address ?? '' : '';
  }
  // Open participation cannot satisfy the ranked identity requirements.
  if (preset === 'community') (doc.getElementById('rules-ranked') as HTMLInputElement).checked = false;
}

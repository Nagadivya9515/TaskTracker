export function formatDuration(ms) {
  if (typeof ms !== 'number' || Number.isNaN(ms)) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const pad = (v) => (v < 10 ? '0' + v : v);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatNoteText(text) {
  if (!text) return '';
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\n/g, '<br/>');
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}
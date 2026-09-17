const parameters = new URLSearchParams(window.location.search);
const selectedTheme = parameters.get('theme');
const availableThemes = ['island', 'farm', 'dungeon', 'cyber', 'pixel', 'wasteland', 'steampunk', 'console'];
if (selectedTheme === 'classic') {
  delete document.documentElement.dataset.theme;
} else {
  document.documentElement.dataset.theme = availableThemes.includes(selectedTheme) ? selectedTheme : 'dungeon';
}
if (['console', 'dungeon'].includes(document.documentElement.dataset.theme)) {
  document.documentElement.dataset.mode = parameters.get('mode') === 'light' ? 'light' : 'dark';
}
if (parameters.get('embed') === '1') {
  document.documentElement.dataset.embed = 'true';
  if (parameters.get('transparent') === '1') {
    document.documentElement.dataset.transparent = 'true';
  }
}

const parameters = new URLSearchParams(window.location.search);
const selectedTheme = parameters.get('theme');
const availableThemes = ['island', 'farm', 'dungeon', 'cyber', 'pixel', 'wasteland', 'steampunk'];
if (selectedTheme === 'classic') {
  delete document.documentElement.dataset.theme;
} else {
  document.documentElement.dataset.theme = availableThemes.includes(selectedTheme) ? selectedTheme : 'dungeon';
}
if (parameters.get('embed') === '1') {
  document.documentElement.dataset.embed = 'true';
  if (parameters.get('transparent') === '1') {
    document.documentElement.dataset.transparent = 'true';
  }
}

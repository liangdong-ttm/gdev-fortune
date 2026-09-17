const dialog = document.getElementById('fortune-dialog');
const launcher = document.getElementById('open-fortune');
const closeButton = document.getElementById('close-fortune');
const frame = document.getElementById('fortune-frame');
const darkMode = document.getElementById('dark-mode');

function updateMode() {
  const mode = darkMode.checked ? 'dark' : 'light';
  document.documentElement.dataset.mode = mode;
  const url = new URL(frame.src, window.location.href);
  url.searchParams.set('mode', mode);
  if (frame.src !== url.href) frame.src = url.href;
}

darkMode.checked = new URL(window.location.href).searchParams.get('mode') !== 'light';
darkMode.addEventListener('change', updateMode);
updateMode();

launcher.addEventListener('click', () => dialog.showModal());
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    dialog.close();
  }
});
dialog.addEventListener('close', () => launcher.focus());
window.addEventListener('message', event => {
  if (dialog.open && event.source === frame.contentWindow && event.origin === new URL(frame.src, window.location.href).origin && event.data?.type === 'gdev-fortune:escape') {
    dialog.close();
  }
});

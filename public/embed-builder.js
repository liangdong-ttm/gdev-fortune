const theme = document.getElementById('theme');
const mode = document.getElementById('mode');
const transparent = document.getElementById('transparent');
const code = document.getElementById('embed-code');
const status = document.getElementById('copy-status');
const publicRoot = 'https://liangdong-ttm.github.io/gdev-fortune/';
const localRoot = new URL('./', window.location.href);

function update() {
  const url = new URL(publicRoot);
  url.searchParams.set('embed', '1');
  url.searchParams.set('theme', theme.value);
  mode.disabled = !['console', 'dungeon'].includes(theme.value);
  if (!mode.disabled) url.searchParams.set('mode', mode.value === 'light' ? 'light' : 'dark');
  if (transparent.checked) url.searchParams.set('transparent', '1');
  document.getElementById('embed-url').value = url.href;
  const lines = [
    '<iframe',
    '  src="' + url.href.replaceAll('&', '&amp;') + '"',
    '  title="gDEV日签 · 独立游戏开发者老黄历"',
    '  width="380" height="820"',
    '  style="display:block;width:100%;max-width:380px;border:0"',
    '  loading="lazy"',
    '  referrerpolicy="no-referrer"',
    '></iframe>',
  ];
  code.value = lines.join(String.fromCharCode(10));
  const previewUrl = new URL(localRoot);
  previewUrl.search = url.search;
  document.getElementById('preview').src = previewUrl.href;
  status.textContent = '';
}

theme.addEventListener('change', update);
mode.addEventListener('change', update);
transparent.addEventListener('change', update);
document.getElementById('copy').addEventListener('click', async () => {
  const currentCode = code.value;
  try {
    await navigator.clipboard.writeText(currentCode);
    status.textContent = code.value === currentCode ? '已复制，可以粘贴到你的网站。' : '已复制上一组选项的代码；设置已变化，请重新复制。';
  } catch {
    code.focus();
    code.select();
    status.textContent = '浏览器未允许自动复制，代码已选中，请按 Ctrl+C 或 ⌘C。';
  }
});
document.getElementById('address-note').textContent = localRoot.href === publicRoot
  ? '代码直接引用本站 GitHub Pages 地址，内容随本站更新。'
  : '当前为本地或其他部署环境预览；生成代码仍指向正式 GitHub Pages 地址。请先将此版本发布，再把代码交给别人使用。';
update();

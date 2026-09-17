import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/embed-builder.js', import.meta.url), 'utf8');

function createBuilder(href, clipboard) {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          value: id === 'theme' ? 'dungeon' : '', checked: false, textContent: '', handlers: {},
          addEventListener(event, handler) { this.handlers[event] = handler; },
          focus() { this.focused = true; },
          select() { this.selected = true; },
        });
      }
      return elements.get(id);
    },
  };
  runInNewContext(source, { document, window: { location: { href } }, navigator: { clipboard }, URL });
  return id => elements.get(id);
}

test('本地预览用本地资源，生成代码始终引用正式 Pages 地址', () => {
  const element = createBuilder('http://localhost:4173/embed.html');
  assert.equal(element('embed-url').value, 'https://liangdong-ttm.github.io/gdev-fortune/?embed=1&theme=dungeon');
  assert.equal(element('preview').src, 'http://localhost:4173/?embed=1&theme=dungeon');
  assert.ok(element('embed-code').value.includes('?embed=1&amp;theme=dungeon'));
  assert.ok(!element('embed-code').value.includes('localhost'));
  assert.ok(element('address-note').textContent.includes('请先将此版本发布'));
});

test('更换主题和透明设置时同步更新代码与预览，关闭后清除参数', () => {
  const element = createBuilder('https://liangdong-ttm.github.io/gdev-fortune/embed.html');
  element('theme').value = 'cyber';
  element('transparent').checked = true;
  element('theme').handlers.change();
  assert.equal(element('embed-url').value, 'https://liangdong-ttm.github.io/gdev-fortune/?embed=1&theme=cyber&transparent=1');
  assert.equal(element('preview').src, element('embed-url').value);
  element('transparent').checked = false;
  element('transparent').handlers.change();
  assert.ok(!element('embed-url').value.includes('transparent'));
});

test('复制成功提供提示，剪贴板不可用则选中文本供手动复制', async () => {
  let copied;
  const success = createBuilder('http://localhost:4173/embed.html', { async writeText(value) { copied = value; } });
  await success('copy').handlers.click();
  assert.equal(copied, success('embed-code').value);
  assert.ok(success('copy-status').textContent.includes('已复制'));
  const fallback = createBuilder('http://localhost:4173/embed.html');
  await fallback('copy').handlers.click();
  assert.equal(fallback('embed-code').selected, true);
  assert.equal(fallback('embed-code').focused, true);
  assert.ok(fallback('copy-status').textContent.includes('代码已选中'));
});

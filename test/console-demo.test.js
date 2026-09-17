import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/console-demo.js', import.meta.url), 'utf8');

function setup(href = 'https://example.com/console/') {
  const elements = new Map();
  for (const id of ['fortune-dialog', 'open-fortune', 'close-fortune', 'fortune-frame', 'dark-mode']) {
    elements.set(id, {
      open: false, handlers: {}, contentWindow: {},
      src: 'https://liangdong-ttm.github.io/gdev-fortune/?embed=1&theme=console',
      addEventListener(event, handler) { this.handlers[event] = handler; },
      showModal() { this.open = true; },
      close() { this.open = false; this.handlers.close?.(); },
      focus() { this.focused = true; },
      getBoundingClientRect() { return { left: 100, right: 460, top: 100, bottom: 700 }; },
    });
  }
  const window = { location: { href }, handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; } };
  const document = { documentElement: { dataset: {} }, getElementById: id => elements.get(id) };
  runInNewContext(source, { document, window, URL });
  return { dialog: elements.get('fortune-dialog'), launcher: elements.get('open-fortune'), closeButton: elements.get('close-fortune'), frame: elements.get('fortune-frame'), darkMode: elements.get('dark-mode'), document, window };
}

test('演示默认深色，切换时同步宿主与 iframe，支持浅色直达', () => {
  const { document, darkMode, frame } = setup();
  assert.equal(document.documentElement.dataset.mode, 'dark');
  assert.equal(darkMode.checked, true);
  darkMode.checked = false;
  darkMode.handlers.change();
  assert.equal(document.documentElement.dataset.mode, 'light');
  assert.ok(frame.src.includes('theme=console&mode=light'));
  assert.equal(setup('https://example.com/console/?mode=light').darkMode.checked, false);
  assert.equal(setup('https://example.com/console/?mode=unknown').darkMode.checked, true);
});

test('入口、关闭按钮、外部点击与焦点恢复', () => {
  const { dialog, launcher, closeButton } = setup();
  launcher.handlers.click();
  assert.equal(dialog.open, true);
  dialog.handlers.click({ target: dialog, clientX: 150, clientY: 150 });
  assert.equal(dialog.open, true);
  dialog.handlers.click({ target: dialog, clientX: 20, clientY: 20 });
  assert.equal(dialog.open, false);
  assert.equal(launcher.focused, true);
  launcher.handlers.click();
  closeButton.handlers.click();
  assert.equal(dialog.open, false);
});

test('只接受指定 iframe 和来源发出的 Esc 通知', () => {
  const { dialog, launcher, frame, window } = setup();
  const message = { source: frame.contentWindow, origin: 'https://liangdong-ttm.github.io', data: { type: 'gdev-fortune:escape' } };
  launcher.handlers.click();
  for (const invalid of [{ ...message, origin: 'https://untrusted.example' }, { ...message, source: {} }, { ...message, data: null }, { ...message, data: { type: 'close' } }]) {
    window.handlers.message(invalid);
    assert.equal(dialog.open, true);
  }
  window.handlers.message(message);
  assert.equal(dialog.open, false);
  assert.equal(launcher.focused, true);
});

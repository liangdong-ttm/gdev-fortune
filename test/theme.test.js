import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/theme.js', import.meta.url), 'utf8');

test('公开文件和入口不再包含公司控制台演示', () => {
  for (const extension of ['html', 'css', 'js']) {
    assert.equal(existsSync(new URL('../public/console-demo.' + extension, import.meta.url)), false);
  }
  for (const filename of ['../README.md', '../public/styles.html', '../public/embed.html']) {
    assert.ok(!readFileSync(new URL(filename, import.meta.url), 'utf8').includes('console-demo'));
  }
});

function resolveOptions(search) {
  const document = { documentElement: { dataset: { theme: 'dungeon' } } };
  runInNewContext(source, { window: { location: { search } }, document, URLSearchParams });
  return document.documentElement.dataset;
}

function resolveTheme(search) {
  return resolveOptions(search).theme;
}

test('默认及未知主题使用暗黑地牢，内嵌默认一致', () => {
  for (const query of ['', '?embed=1', '?theme=', '?theme=anime', '?theme=unknown', '?theme=%3Cscript%3E']) {
    assert.equal(resolveTheme(query), 'dungeon');
  }
});

test('显式选择经典版会移除默认主题标记', () => {
  assert.equal(resolveTheme('?theme=classic'), undefined);
  assert.equal(resolveTheme('?embed=1&theme=classic'), undefined);
});

test('八种主题均支持独立链接', () => {
  for (const theme of ['island', 'farm', 'dungeon', 'cyber', 'pixel', 'wasteland', 'steampunk', 'console']) {
    assert.equal(resolveTheme('?theme=' + theme), theme);
  }
});

test('控制台与地牢支持深浅参数，其他皮肤忽略参数', () => {
  for (const theme of ['console', 'dungeon']) {
    assert.equal(resolveOptions('?theme=' + theme + '&mode=light').mode, 'light');
    assert.equal(resolveOptions('?embed=1&theme=' + theme + '&mode=light&transparent=1').mode, 'light');
    for (const suffix of ['', '&mode=dark', '&mode=', '&mode=auto', '&mode=%3Cscript%3E']) {
      assert.equal(resolveOptions('?theme=' + theme + suffix).mode, 'dark');
    }
  }
  assert.equal(resolveOptions('?mode=light').mode, 'light');
  for (const theme of ['classic', 'island', 'farm', 'cyber', 'pixel', 'wasteland', 'steampunk']) {
    assert.equal(resolveOptions('?theme=' + theme + '&mode=light').mode, undefined);
  }
});

test('内嵌和透明背景只接受明确参数，透明背景不影响普通页面', () => {
  const options = resolveOptions('?theme=island&embed=1&transparent=1');
  assert.equal(options.theme, 'island');
  assert.equal(options.embed, 'true');
  assert.equal(options.transparent, 'true');
  assert.equal(resolveOptions('?embed=1').transparent, undefined);
  assert.equal(resolveOptions('?transparent=1').transparent, undefined);
  for (const value of ['0', 'true', '', '%3Cscript%3E']) {
    const rejected = resolveOptions('?embed=' + value + '&transparent=1');
    assert.equal(rejected.embed, undefined);
    assert.equal(rejected.transparent, undefined);
  }
});

test('对比页主题与样式一致，已移除星愿风格', () => {
  const gallery = readFileSync(new URL('../public/styles.html', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('../public/themes.css', import.meta.url), 'utf8');
  const themes = [...gallery.matchAll(/<iframe src="[.][/][?]theme=([a-z]+)"/g)].map(match => match[1]);
  assert.equal(new Set(themes).size, 9);
  for (const theme of themes) {
    if (theme === 'classic') {
      assert.equal(resolveTheme('?theme=' + theme), undefined);
      continue;
    }
    assert.equal(resolveTheme('?theme=' + theme), theme);
    assert.ok(styles.includes('html[data-theme="' + theme + '"]'));
  }
  assert.ok(!gallery.includes('theme=anime'));
  assert.ok(!styles.includes('data-theme="anime"'));
});

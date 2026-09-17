import test from 'node:test';
import assert from 'node:assert/strict';
import { activities } from '../public/activities.js';
import { dateKey, getFortune } from '../public/fortune.js';

test('内容库包含48个唯一事项，每项都有宜忌解释', () => {
  assert.equal(activities.length, 48);
  assert.equal(new Set(activities.map(activity => activity.name)).size, 48);
  for (const activity of activities) assert.ok(activity.name && activity.good && activity.bad);
});

test('按本地日期固定结果，不受当天时间及其他调用影响', () => {
  const morning = new Date(2026, 8, 17, 0, 1);
  const evening = new Date(2026, 8, 17, 23, 59);
  const expected = getFortune(morning);
  getFortune(new Date(2026, 8, 18));
  assert.deepEqual(getFortune(evening), expected);
  assert.equal(dateKey(morning), 20260917);
  assert.notDeepEqual(getFortune(new Date(2026, 8, 18)), expected);
});

test('十年日期覆盖：数量、去重、周末筛选、饮品和星级合法', () => {
  const snapshot = JSON.stringify(activities);
  for (let offset = 0; offset < 3653; offset++) {
    const date = new Date(2024, 0, 1 + offset);
    const fortune = getFortune(date);
    assert.ok(fortune.good.length >= 2 && fortune.good.length <= 4);
    assert.ok(fortune.bad.length >= 2 && fortune.bad.length <= 4);
    const picked = [...fortune.good, ...fortune.bad];
    assert.equal(new Set(picked.map(activity => activity.name)).size, picked.length);
    if ([0, 6].includes(date.getDay())) assert.ok(picked.every(activity => activity.special || activity.weekend));
    const annualDate = ['3-9', '3-10', '4-1', '10-31'].includes((date.getMonth() + 1) + '-' + date.getDate());
    assert.equal(picked.filter(activity => activity.special).length, annualDate || date.getDay() === 4 ? 1 : 0);
    assert.equal(new Set(fortune.drinks).size, 2);
    assert.ok(fortune.inspiration >= 1 && fortune.inspiration <= 5);
    assert.ok(fortune.direction);
  }
  assert.equal(JSON.stringify(activities), snapshot);
});

test('闰日、跨年与无效日期', () => {
  assert.match(getFortune(new Date(2024, 1, 29)).date, /2024年2月29日 星期四/);
  assert.equal(dateKey(new Date(2026, 11, 32)), 20270101);
  assert.throws(() => getFortune(new Date('invalid')), TypeError);
  assert.throws(() => getFortune('2026-09-17'), TypeError);
});

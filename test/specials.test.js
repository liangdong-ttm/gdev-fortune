import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpecial } from '../public/specials.js';
import { getFortune } from '../public/fortune.js';

test('只在四个固定纪念日及星期四返回彩蛋', () => {
  for (const [month, day, id] of [[3, 9, 'miku'], [3, 10, 'mar10'], [4, 1, 'april-fools'], [10, 31, 'halloween']]) {
    assert.equal(getSpecial(new Date(2026, month - 1, day)).special, id);
  }
  assert.equal(getSpecial(new Date(2026, 8, 17)).special, 'crazy-thursday');
  for (const [month, day] of [[3, 8], [3, 11], [4, 3], [10, 30], [8, 31], [9, 18]]) {
    assert.equal(getSpecial(new Date(2026, month - 1, day)), null);
  }
});

test('连续四周轮换疯四文案，同一周结果稳定', () => {
  const names = new Set();
  for (const day of [3, 10, 17, 24]) {
    const morning = getSpecial(new Date(2026, 8, day, 0, 1));
    assert.deepEqual(morning, getSpecial(new Date(2026, 8, day, 23, 59)));
    names.add(morning.name);
  }
  assert.equal(names.size, 4);
  assert.deepEqual(getSpecial(new Date(2026, 8, 3)), getSpecial(new Date(2026, 9, 1)));
});

test('纪念日撞星期四只保留纪念日，不增加事项数量', () => {
  const date = new Date(2027, 3, 1);
  assert.equal(date.getDay(), 4);
  const fortune = getFortune(date);
  const specials = [...fortune.good, ...fortune.bad].filter(activity => activity.special);
  assert.equal(specials.length, 1);
  assert.equal(specials[0].special, 'april-fools');
  assert.ok(fortune.good.length >= 2 && fortune.good.length <= 4);
  assert.ok(fortune.bad.length >= 2 && fortune.bad.length <= 4);
});

test('周末纪念日保留一个彩蛋，其余仍是周末事项', () => {
  const date = new Date(2026, 9, 31);
  assert.equal(date.getDay(), 6);
  const fortune = getFortune(date);
  const picked = [...fortune.good, ...fortune.bad];
  assert.equal(picked.filter(activity => activity.special === 'halloween').length, 1);
  assert.ok(picked.filter(activity => !activity.special).every(activity => activity.weekend));
});

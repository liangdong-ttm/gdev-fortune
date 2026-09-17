import { activities, drinks } from './activities.js';
import { getSpecial } from './specials.js';

export function dateKey(date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function generator(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let position = result.length - 1; position > 0; position--) {
    const target = Math.floor(random() * (position + 1));
    [result[position], result[target]] = [result[target], result[position]];
  }
  return result;
}

export function getFortune(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('需要有效日期');
  const random = generator(dateKey(date));
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const pool = activities.filter(activity => !weekend || activity.weekend);
  const goodCount = 2 + Math.floor(random() * 3);
  const badCount = 2 + Math.floor(random() * 3);
  const picked = shuffle(pool, random);
  const good = picked.slice(0, goodCount);
  const bad = picked.slice(goodCount, goodCount + badCount);
  const special = getSpecial(date);
  if (special) {
    const target = generator(dateKey(date) + 97)() < 0.5 ? good : bad;
    target[0] = special;
  }
  const directions = ['北方', '东北方', '东方', '东南方', '南方', '西南方', '西方', '西北方'];
  return {
    date: '今天是' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 星期' + '日一二三四五六'[date.getDay()],
    good,
    bad,
    direction: directions[Math.floor(random() * directions.length)],
    drinks: shuffle(drinks, random).slice(0, 2),
    inspiration: 1 + Math.floor(random() * 5),
  };
}

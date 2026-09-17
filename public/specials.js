const annualEvents = [
  { month: 3, day: 9, id: 'miku', name: '初音日·给 BUG 调音', good: '修不好没关系，它现在会唱了', bad: '调成了电音，报错开始单曲循环' },
  { month: 3, day: 10, id: 'mar10', name: '马力欧日·检查水管', good: '程序员下去了，水管工上来了', bad: '公主不在这里，你的存档也是' },
  { month: 4, day: 1, id: 'april-fools', name: '愚人节·发布公告', good: '宣布修好了所有 BUG，大家居然信了', bad: '你宣布如期发售，大家只当过节' },
  { month: 10, day: 31, id: 'halloween', name: '万圣节·运行旧项目', good: '不用做恐怖游戏，打开就有', bad: '旧 BUG 复活了，还带来了家属' },
];

const thursdayEvents = [
  { name: '疯四·寻找发行商', good: '项目还差最后一笔融资，V我50', bad: '发行商说他也没吃，让你先V他50' },
  { name: '疯四·挑战上校', good: '隐藏 Boss 每周四刷新，掉落炸鸡', bad: '一套连招之后，被清空的是钱包' },
  { name: '疯四·启动众筹', good: '目标五十，回报是精神股东', bad: '股东吃完鸡，问你续作什么时候出' },
  { name: '疯四·写悲情剧情', good: '八百字身世，成功解锁一份炸鸡', bad: '写到结尾，双手自动输入V我50' },
];

export function getSpecial(date) {
  const annual = annualEvents.find(event => event.month === date.getMonth() + 1 && event.day === date.getDate());
  if (annual) return { name: annual.name, good: annual.good, bad: annual.bad, special: annual.id };
  if (date.getDay() !== 4) return null;
  const week = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1970, 0, 1)) / 604800000);
  const index = ((week % thursdayEvents.length) + thursdayEvents.length) % thursdayEvents.length;
  return { ...thursdayEvents[index], special: 'crazy-thursday' };
}

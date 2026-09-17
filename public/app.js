import { dateKey, getFortune } from './fortune.js';

let renderedDate;
let midnightTimer;

function renderActivities(elementId, activities) {
  const list = document.getElementById(elementId);
  list.replaceChildren(...activities.map(activity => {
    const item = document.createElement('li');
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = activity.name;
    const description = document.createElement('div');
    description.className = 'description';
    description.textContent = activity[elementId];
    item.append(name, description);
    return item;
  }));
}

function refresh() {
  const now = new Date();
  if (dateKey(now) !== renderedDate) {
    const fortune = getFortune(now);
    document.getElementById('date').textContent = fortune.date;
    renderActivities('good', fortune.good);
    renderActivities('bad', fortune.bad);
    document.getElementById('direction').textContent = fortune.direction;
    document.getElementById('drinks').textContent = fortune.drinks.join('，');
    const inspiration = document.getElementById('inspiration');
    inspiration.textContent = '★'.repeat(fortune.inspiration) + '☆'.repeat(5 - fortune.inspiration);
    inspiration.setAttribute('aria-label', fortune.inspiration + '颗星，满分5颗星');
    renderedDate = dateKey(now);
  }
  clearTimeout(midnightTimer);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  midnightTimer = setTimeout(refresh, tomorrow.getTime() - now.getTime() + 100);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
});
window.addEventListener('focus', refresh);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !event.defaultPrevented && document.documentElement.dataset.embed && window.parent !== window) {
    window.parent.postMessage({ type: 'gdev-fortune:escape' }, '*');
  }
});
refresh();

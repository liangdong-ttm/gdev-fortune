for (const frame of document.querySelectorAll('.gallery iframe')) {
  let observer;

  function fitPreview() {
    observer?.disconnect();
    const body = frame.contentDocument?.body;
    const card = body?.querySelector('.container');
    if (!card) return;

    body.style.minHeight = '0';
    body.style.display = 'flow-root';
    body.style.paddingBottom = '12px';
    card.style.display = 'flow-root';
    card.style.marginBottom = '0';

    function resize() {
      const borders = frame.offsetHeight - frame.clientHeight;
      const height = Math.ceil(body.getBoundingClientRect().height) + borders;
      if (frame.style.height !== height + 'px') frame.style.height = height + 'px';
    }

    observer = new ResizeObserver(resize);
    observer.observe(body);
    resize();
  }

  frame.addEventListener('load', fitPreview);
  if (frame.contentDocument?.readyState === 'complete') fitPreview();
}

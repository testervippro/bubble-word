(() => {
  const f = document.createElement('div');
  Object.assign(f.style, {
    position: 'fixed',
    zIndex: 99999,
    padding: '10px 15px',
    background: '#fff8c4',
    border: '1px solid #888',
    borderRadius: '12px',
    boxShadow: '2px 2px 6px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    userSelect: 'none',
    cursor: 'move'
  });
  f.textContent = 'Loading...';
  document.body.appendChild(f);

  async function a() {
    const e = innerWidth - f.offsetWidth,
          t = innerHeight - f.offsetHeight,
          x = Math.random() * e,
          y = Math.random() * t;
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;

    try {
      const r = await fetch('https://learn-english-vip.onrender.com/words');
      const j = await r.json();
      f.textContent = j.word || '[no word]';
    } catch (err) {
      f.textContent = '[error]';
    }
  }

  setInterval(a, 4000);
  a();

  let d = false, o = 0, n = 0;
  f.addEventListener('mousedown', e => {
    d = true;
    o = e.offsetX;
    n = e.offsetY;
  });

  document.addEventListener('mousemove', e => {
    if (d) {
      f.style.left = `${e.pageX - o}px`;
      f.style.top = `${e.pageY - n}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    d = false;
  });
})();

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
    cursor: 'move',
    bottom: '20px',
    left: '0px',
    pointerEvents: 'auto'
  });
  f.textContent = 'Loading...';
  document.body.appendChild(f);

  let words = [];

  async function loadWords() {
    try {
      const res = await fetch(chrome.runtime.getURL('words.txt'));
      const text = await res.text();
      words = text.split(/\r?\n/).filter(w => w.trim());
    } catch (e) {
      console.error('Error loading words.txt', e);
      f.textContent = '[load error]';
    }
  }

  function showRandomWord() {
    if (words.length === 0) return;
    const word = words[Math.floor(Math.random() * words.length)];
    f.textContent = word;
  }

  loadWords().then(() => {
    showRandomWord();
    setInterval(showRandomWord, 4000);
  });

  // Animation left ↔ right
  let direction = 1; // 1: right, -1: left
  let pos = 0;
  const speed = 1;

  function animate() {
    const max = window.innerWidth - f.offsetWidth;
    pos += direction * speed;

    if (pos >= max) {
      pos = max;
      direction = -1;
    } else if (pos <= 0) {
      pos = 0;
      direction = 1;
    }

    f.style.left = `${pos}px`;
    requestAnimationFrame(animate);
  }

  animate();

  // Drag functionality
  let dragging = false, offsetX = 0;

  f.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.offsetX;
  });

  document.addEventListener('mousemove', e => {
    if (dragging) {
      pos = Math.max(0, Math.min(e.pageX - offsetX, window.innerWidth - f.offsetWidth));
      direction = 0;
      f.style.left = `${pos}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      direction = pos <= 0 ? 1 : (pos >= window.innerWidth - f.offsetWidth ? -1 : 1);
      animate();
    }
  });
})();

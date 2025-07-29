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
    bottom: '20px', // Always near the bottom
    left: '50%',    // Start centered
    transform: 'translateX(-50%)', // Center alignment
    transition: 'left 0.5s ease' // Smooth horizontal motion
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
      f.textContent = '[load error]';
    }
  }

  function showRandomWord() {
    if (words.length === 0) return;
    const word = words[Math.floor(Math.random() * words.length)];
    f.textContent = word;
    const x = Math.random() * (window.innerWidth - f.offsetWidth);
    f.style.left = `${x}px`;
  }

  setInterval(showRandomWord, 4000);

  loadWords().then(showRandomWord);

  // Drag functionality
  let dragging = false, offsetX = 0;

  f.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.offsetX;
  });

  document.addEventListener('mousemove', e => {
    if (dragging) {
      f.style.left = `${e.pageX - offsetX}px`;
      f.style.transform = 'none'; // Cancel centering transform during drag
    }
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
  });
})();

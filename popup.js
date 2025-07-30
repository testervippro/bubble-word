document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggleSwitch');
  const fileInput = document.getElementById('wordFile');

  const { enabled } = await chrome.storage.local.get('enabled');
  toggle.checked = !!enabled;

  toggle.addEventListener('change', async () => {
    const newState = toggle.checked;
    await chrome.storage.local.set({ enabled: newState });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    }
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim());

    await chrome.storage.local.set({ wordList: lines });

    alert(`Loaded ${lines.length} words from local file!`);
  });
});

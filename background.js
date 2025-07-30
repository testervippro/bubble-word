chrome.action.onClicked.addListener(async (tab) => {
  const { enabled } = await chrome.storage.local.get('enabled');
  const newState = !enabled;

  await chrome.storage.local.set({ enabled: newState });

  // Reload the content script to reflect the new state
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

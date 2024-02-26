chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "copySuccess") {
    chrome.storage.local.get({copiedCases: []}, function(result) {
      const updatedCases = [...result.copiedCases, {content: message.content, type: message.type,url: message.url}];
      chrome.storage.local.set({copiedCases: updatedCases});
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({copiedCases: []});
});

/**
 * Reloads the current tab
 */
chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "refresh") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (arrayOfTabs) {
        chrome.tabs.reload(arrayOfTabs[0].id);
      }
    );
  }
  return true;
});

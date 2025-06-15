import { saveItemToCart } from './firebase';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "addItem") {
    saveItemToCart(message.item)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error }));
    return true;
  }
});

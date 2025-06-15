import { getCartItems } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addButton");

  if (!addButton) {
    console.error("[Popup] #addButton not found");
    return;
  }

  addButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "scrapeProductInfo" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("[Popup] Error:", chrome.runtime.lastError.message);
      } else {
        console.log("[Popup] Received from content script:", response);
      }
    });
  });
});

async function loadCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "Loading...";

  try {
    const items = await getCartItems();

    if (items.length === 0) {
      container.innerHTML = "<p>No items yet.</p>";
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="item">
        <strong>${item.title}</strong><br/>
        <a href="${item.productUrl}" target="_blank">Link to Product</a><br/>
        ${item.imageUrl ? `<img src="${item.imageUrl}" />` : ""}
        <p><small>Added by: ${item.addedBy}</small></p>
      </div>
    `).join("");
  } catch (err) {
    console.error("[Popup] Error loading cart:", err);
    container.innerHTML = `<p>Error loading cart.</p>`;
  }
}

loadCart();

(function () {
  function getProductInfo() {
    const title = document.querySelector('meta[property="og:title"]')?.content ||
                  document.querySelector('title')?.innerText || "No title";

    let imageUrl = document.querySelector("#landingImage")?.src;

    if (!imageUrl) imageUrl = document.querySelector('meta[property="og:image"]')?.content ||
                     document.querySelector('img')?.src || "";

    return {
      title,
      imageUrl,
      productUrl: window.location.href,
      addedBy: "Me",
      timestamp: Date.now()
    };
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeProductInfo") {
        console.log("[Content] Scrape Product info Triggered")
      const item = getProductInfo();
      chrome.runtime.sendMessage({ action: "addItem", item }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
            console.log("Message sent successfully", response);
        }
      });
      sendResponse({ success: true });
    }
  });
})();

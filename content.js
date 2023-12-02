function log(...args) {
  console.log("rea-value-ext::", ...args);
}

function parsePriceRange(priceRange) {
  return priceRange
    .split("_")
    .map((price) => `$${price}`)
    .join("-");
}

function extractAndDisplayValue() {
  log("extractAndDisplayValue start");
  const scriptTag = document.querySelector("body > script");
  if (scriptTag.textContent.includes("window.ArgonautExchange")) {
    const regex = /"marketing_price_range":"([^"]+)"/;
    const [, price] =
      scriptTag.textContent.replaceAll("\\", "").match(regex) ?? [];

    if (price) {
      const parsedPrice = parsePriceRange(price);
      log("parsedPrice", parsedPrice);
      displayPriceRange(parsedPrice);
    }
  }
}

function displayPriceRange(priceRange) {
  // chck if already displayed
  const existingDisplay = document.querySelector(
    "h1.property-info-address > span.rea-value-ext"
  );
  if (existingDisplay) {
    existingDisplay.textContent = priceRange;
    return;
  }

  const displayElement = document.createElement("span");

  displayElement.style.color = "#E4022B";
  displayElement.style.fontWeight = "400";
  displayElement.style.marginLeft = "8px";
  displayElement.classList.add("rea-value-ext");

  displayElement.textContent = priceRange;

  const targetElem = document.querySelector("h1.property-info-address");
  if (!targetElem) {
    return;
  }
  targetElem.appendChild(displayElement);
}

extractAndDisplayValue();

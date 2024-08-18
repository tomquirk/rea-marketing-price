const PRICE_RANGE_REGEX = /"marketing_price_range":"([^"]+)"/;
const TARGET_ELEM_SELECTOR = ".property-info__price";
const MOUNT_CLASSNAME = "rea-value-ext";
const REFRESH_BTN_CLASSNAME = "rea-value-ext-refresh";

let _dataScript = null;

function log(...args) {
  console.log("🏠 rea-value-ext::", ...args);
}

function parsePriceRange(priceRange) {
  return priceRange
    .split("_")
    .map((price) => `$${price}`)
    .join(" - ");
}

function getAddress() {
  return document.querySelector("h1.property-info-address")?.textContent.trim();
}

function getDataScript() {
  if (_dataScript) {
    return _dataScript;
  }

  const scriptTag = document.querySelector("body > script");
  if (!scriptTag.textContent.includes("window.ArgonautExchange")) {
    return;
  }

  _dataScript = scriptTag.textContent.replaceAll("\\", "");
  return _dataScript;
}

function getPriceRange() {
  const dataScript = getDataScript();

  const [, priceRange] = dataScript.match(PRICE_RANGE_REGEX) ?? [];
  if (!priceRange) {
    return;
  }

  return priceRange;
}

function createPriceRangeEl(priceRange) {
  const el = document.createElement("span");
  el.style.color = "#E4022B";
  el.style.borderRadius = "0.5rem";
  el.style.backgroundColor = "#ffdce3";
  el.style.padding = "0.3rem 0.5rem";
  el.style.display = "inline";

  el.className = "property-info__price";

  el.textContent = priceRange;

  return el;
}

function renderPriceRange(priceRange) {
  const el = createPriceRangeEl(priceRange);
  render(el);
}

function createContainerEl() {
  const el = document.createElement("div");
  el.style.marginTop = "8px";
  el.className = MOUNT_CLASSNAME;
  return el;
}

function createRefreshButton() {
  const el = document.createElement("button");
  el.textContent = "🤑 Reveal price range";

  el.className = REFRESH_BTN_CLASSNAME;

  el.style.fontSize = "0.875rem";
  el.style.lineHeight = "1.25rem";
  el.style.letterSpacing = "0.0125rem";
  el.style.fontFamily =
    'Pangea, "Helvetica Neue", Helvetica, Arial, sans-serif';
  el.style.fontVariationSettings = '"XTDR" 0, "APRT" 0, "SPAC" 0';
  el.style.fontWeight = "500";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.flexShrink = "0";
  el.style.position = "relative";
  el.style.outline = "none";
  el.style.width = "auto";
  el.style.border = "0.0625rem solid var(--ck-borderPrimary)";
  el.style.backgroundColor = "transparent";
  el.style.color = "var(--ck-textPrimary)";
  el.style.borderRadius = "0.5rem";
  el.style.padding = "calc(0.3125rem) calc(0.9375rem)";
  el.style.cursor = "pointer";
  el.style.textDecoration = "none";
  el.style.minHeight = "2rem";
  el.style.minWidth = "2rem";
  el.style.transition = "background-color 200ms ease-in";
  el.style.display = "inline";

  return el;
}

function getContainerEl() {
  const targetEl = document.querySelector(TARGET_ELEM_SELECTOR);
  if (!targetEl) {
    return;
  }

  const existingContainerEl = document.querySelector(`.${MOUNT_CLASSNAME}`);
  if (existingContainerEl) {
    return existingContainerEl;
  }

  const containerEl = createContainerEl();
  targetEl.appendChild(containerEl);
  return containerEl;
}

function render(el) {
  if (!el) {
    return;
  }

  const targetElem = getContainerEl();
  if (!targetElem) {
    return;
  }

  targetElem.innerHTML = typeof el === "string" ? el : el.outerHTML;
}

function validatePropertyAddress() {
  const address = getAddress();
  if (!address) {
    return false;
  }
  log(address);
  const dataScript = getDataScript();

  return dataScript?.includes(address);
}

function run() {
  const isValid = validatePropertyAddress();
  if (!isValid) {
    log("Rendering refresh");
    render(createRefreshButton());
    document
      .querySelector(`.${REFRESH_BTN_CLASSNAME}`)
      .addEventListener("click", () => {
        chrome.runtime.sendMessage({
          type: "refresh",
        });
      });
    return;
  }

  log("Rendering price");
  const priceRange = getPriceRange();
  const parsedPrice = parsePriceRange(priceRange);
  renderPriceRange(parsedPrice);
}

const observer = new MutationObserver(() => {
  run();
});

observer.observe(document.querySelector("#argonaut-wrapper"), {
  childList: true,
});
run();

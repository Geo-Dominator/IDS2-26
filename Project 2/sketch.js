const scene = document.getElementById("scene");
const targetElement = document.documentElement;
targetElement.style.cursor = "url('img/cursor.cur'), auto";

const url = "gungeonData.csv";
const backgroundVideo = document.getElementById("bg-video");
const statDefinitions = [
  { label: "Max Ammo", color: "#e5b34b" },
  { label: "Clip Size", color: "#e66f62" },
  { label: "Damage", color: "#f15b50" },
  { label: "Fire Rate", color: "#e6ce58" },
  { label: "Shot Speed", color: "#56c6c1" },
  { label: "Range", color: "#6d9cf5" },
  { label: "Knockback", color: "#b17ae8" },
  { label: "Spread", color: "#f08cba" },
];

let data;
let activeIntro = 1;
let browserShown = false;
let lastClickAt = -Infinity;

function resizeScene() {
  if (!backgroundVideo.videoWidth || !backgroundVideo.videoHeight) {
    return;
  }

  const scale = Math.max(
    window.innerWidth / backgroundVideo.videoWidth,
    window.innerHeight / backgroundVideo.videoHeight,
  );
  scene.style.width = `${backgroundVideo.videoWidth * scale}px`;
  scene.style.height = `${backgroundVideo.videoHeight * scale}px`;
}

backgroundVideo.addEventListener("loadedmetadata", resizeScene);
window.addEventListener("resize", resizeScene);

backgroundVideo.addEventListener("ended", () => {
  backgroundVideo.pause();
  if (activeIntro === 2) {
    renderGunBrowser();
  }
});

function mouseClicked(event) {
  const now = performance.now();
  if (now - lastClickAt < 100) {
    return;
  }
  lastClickAt = now;

  if (event) {
    if (event.target instanceof Element && event.target.closest(".book-page")) {
      return;
    }
  }

  activeIntro = activeIntro === 1 ? 2 : 1;
  if (activeIntro === 1) {
    browserShown = false;
    scene.querySelector(".gun-browser")?.remove();
  }

  backgroundVideo.src = `vid/Intro${activeIntro}.mp4`;
  backgroundVideo.load();
  backgroundVideo.play().catch((error) => {
    console.error("Unable to play intro video:", error);
  });
}

document.addEventListener("click", mouseClicked);

function preload() {
  data = loadTable(url, "csv", "header");
}

function setup() {
  noCanvas();
}

function getItems() {
  return Array.from({ length: data.getRowCount() }, (_, index) => {
    const item = {};
    for (const column of ["Name", "ID", "Game Description", "Fan Description", "Type", "Quality", ...statDefinitions.map((stat) => stat.label)]) {
      item[column] = data.getString(index, column).trim();
    }
    return item;
  }).filter((item) => item.Name);
}

function numericValue(rawValue) {
  const value = rawValue.trim();
  if (!value || /^(n\/a|unknown)$/i.test(value)) {
    return null;
  }
  if (/^infinite$/i.test(value)) {
    return Infinity;
  }

  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function renderGunBrowser() {
  if (browserShown || !data) {
    return;
  }
  browserShown = true;

  const items = getItems();
  const scales = Object.fromEntries(
    statDefinitions.map((stat) => {
      const finiteValues = items
        .map((item) => numericValue(item[stat.label]))
        .filter((value) => value !== null && Number.isFinite(value));
      finiteValues.sort((a, b) => a - b);
      const typicalMaximum = finiteValues[Math.floor((finiteValues.length - 1) * 0.9)] ?? 0;
      return [stat.label, typicalMaximum];
    }),
  );

  const app = makeElement("main", "gun-browser");
  app.setAttribute("aria-label", "Gungeon weapon browser");

  const sidebar = makeElement("section", "gun-sidebar book-page");
  sidebar.setAttribute("aria-label", "Weapon list");
  const sidebarHeader = makeElement("header", "sidebar-header");
  sidebarHeader.append(
    makeElement("p", "eyebrow", "THE GUNGEON'S AMMONOMICON"),
    makeElement("h1", "sidebar-title", "Arsenal"),
    makeElement("p", "item-count", `${items.length} weapons`),
  );
  const itemList = makeElement("nav", "gun-list");
  itemList.setAttribute("aria-label", "Weapons");
  sidebar.append(sidebarHeader, itemList);

  const detail = makeElement("section", "gun-detail book-page");
  detail.setAttribute("aria-live", "polite");
  app.append(sidebar, detail);
  scene.append(app);
  requestAnimationFrame(() => app.classList.add("is-visible"));

  function showItem(item, selectedButton) {
    for (const button of itemList.querySelectorAll(".gun-list-item")) {
      button.setAttribute("aria-pressed", String(button === selectedButton));
      button.classList.toggle("is-selected", button === selectedButton);
    }

    detail.replaceChildren();
    const detailHeader = makeElement("header", "detail-header");
    const title = makeElement("h2", "detail-title", item.Name);
    const metadata = makeElement("div", "detail-metadata");
    if (item.ID) {
      metadata.append(makeElement("span", "detail-id", `ID ${item.ID}`));
    }
    if (item.Type) {
      metadata.append(makeElement("span", "detail-type", item.Type));
    }
    if (item.Quality && !/^n\/a$/i.test(item.Quality)) {
      metadata.append(makeElement("span", "detail-quality", `Quality ${item.Quality}`));
    }
    detailHeader.append(title, metadata);
    detail.append(detailHeader);

    if (item["Game Description"]) {
      detail.append(makeElement("p", "game-description", item["Game Description"]));
    }
    if (item["Fan Description"]) {
      detail.append(makeElement("p", "fan-description", item["Fan Description"]));
    }

    const statsHeading = makeElement("h3", "stats-heading", "Weapon stats");
    const statsList = makeElement("div", "stats-list");
    for (const stat of statDefinitions) {
      const rawValue = item[stat.label];
      const value = numericValue(rawValue);
      const row = makeElement("div", "stat-row");
      const label = makeElement("div", "stat-label", stat.label);
      const valueLabel = makeElement(
        "span",
        "stat-value",
        value === null ? "—" : Number.isFinite(value) ? rawValue : "Infinite",
      );
      label.append(valueLabel);

      const track = makeElement("div", "stat-track");
      track.setAttribute("role", "img");
      track.setAttribute(
        "aria-label",
        `${stat.label}: ${value === null ? "no data" : value === Infinity ? "Infinite" : rawValue}`,
      );
      const fill = makeElement("div", "stat-fill");
      fill.style.backgroundColor = stat.color;
      const percentage =
        value === Infinity
          ? 100
          : value === null || scales[stat.label] === 0
            ? 0
            : Math.min(100, Math.max(0, (value / scales[stat.label]) * 100));
      fill.style.width = `${percentage}%`;
      track.append(fill);
      row.append(label, track);
      statsList.append(row);
    }
    detail.append(statsHeading, statsList);
  }

  const buttons = items.map((item) => {
    const button = makeElement("button", "gun-list-item");
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.append(makeElement("span", "gun-name", item.Name));
    if (item.ID) {
      button.append(makeElement("span", "gun-id", `#${item.ID}`));
    }
    button.addEventListener("click", () => showItem(item, button));
    itemList.append(button);
    return button;
  });

  if (items.length) {
    showItem(items[0], buttons[0]);
  } else {
    detail.append(makeElement("p", "empty-message", "No weapons were found in gungeonData.csv."));
  }
}
function draw() {
  console.log(mouseX, mouseY);
}
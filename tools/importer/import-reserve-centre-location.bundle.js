var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-reserve-centre-location.js
  var import_reserve_centre_location_exports = {};
  __export(import_reserve_centre_location_exports, {
    default: () => import_reserve_centre_location_default
  });

  // tools/importer/parsers/columns-reserve.js
  function parse(element, { document }) {
    const leftCell = document.createElement("div");
    const title = element.querySelector('[class*="Sidebar_title"], [class*="sidebar"] h1');
    if (title) {
      const h1 = document.createElement("h1");
      h1.textContent = title.textContent.trim();
      leftCell.appendChild(h1);
    }
    const addressTitle = element.querySelector('[class*="Sidebar_addressTitle"], [class*="addressTitle"]');
    if (addressTitle) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = addressTitle.textContent.trim();
      p.appendChild(strong);
      leftCell.appendChild(p);
    }
    const addressBlock = element.querySelector('[class*="Sidebar_address"]:not([class*="addressTitle"])');
    if (addressBlock) {
      const lines = addressBlock.querySelectorAll("p");
      lines.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line.textContent.trim();
        if (p.textContent) leftCell.appendChild(p);
      });
    }
    const dirLink = element.querySelector(
      'a[class*="Sidebar_directionLink"], a[href*="google.co.uk/maps"], a[href*="google.com/maps/dir"]'
    );
    if (dirLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = dirLink.getAttribute("href");
      a.textContent = "Get directions";
      p.appendChild(a);
      leftCell.appendChild(p);
    }
    const mapContainer = element.querySelector('[class*="Sidebar_dropShadowImage"], [class*="dropShadow"]');
    if (mapContainer) {
      const mapImg = mapContainer.querySelector("img");
      if (mapImg) {
        const p = document.createElement("p");
        const img = document.createElement("img");
        img.src = mapImg.getAttribute("src");
        img.alt = mapImg.getAttribute("alt") || "Map";
        p.appendChild(img);
        leftCell.appendChild(p);
      }
    }
    const rightCell = document.createElement("div");
    const unitsHeading = element.querySelector(
      '[class*="UnitsAtLocation_heading"], [class*="unitsContainer"] > h1, [class*="unitsContainer"] > h2'
    );
    if (unitsHeading) {
      const h2 = document.createElement("h2");
      h2.textContent = unitsHeading.textContent.trim();
      rightCell.appendChild(h2);
    }
    const unitCards = element.querySelectorAll('[class*="UnitCard_cardContainer"]');
    unitCards.forEach((card) => {
      const cardDiv = document.createElement("div");
      const headerP = document.createElement("p");
      const cardButton = card.querySelector('[class*="UnitCard_cardButton"], button');
      if (cardButton) {
        const badgeImg = cardButton.querySelector('img[alt]:not([src^="data:"])');
        if (badgeImg) {
          const img = document.createElement("img");
          img.src = badgeImg.getAttribute("src");
          img.alt = badgeImg.getAttribute("alt") || "";
          headerP.appendChild(img);
        }
        const unitName = cardButton.querySelector('h1, h2, h3, [class*="UnitCard_text"]');
        if (unitName) {
          headerP.appendChild(document.createTextNode(unitName.textContent.trim()));
        }
      }
      cardDiv.appendChild(headerP);
      const contentDiv = document.createElement("div");
      const cardContent = card.querySelector('[class*="UnitCard_cardContent"]');
      if (cardContent) {
        const children = Array.from(cardContent.children);
        children.forEach((child) => {
          const cls = child.className || "";
          const tag = child.tagName;
          if (cls.includes("UnitCard_heading")) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = child.textContent.trim();
            p.appendChild(strong);
            contentDiv.appendChild(p);
            return;
          }
          if (cls.includes("UnitCard_contactInfo") || cls.includes("contactInfo")) {
            Array.from(child.children).forEach((cc) => {
              const p = document.createElement("p");
              if (cc.tagName === "A") {
                const a = document.createElement("a");
                a.href = cc.getAttribute("href");
                a.textContent = cc.textContent.trim();
                p.appendChild(a);
              } else {
                p.textContent = cc.textContent.trim();
              }
              if (p.textContent) contentDiv.appendChild(p);
            });
            return;
          }
          if (tag === "P") {
            const p = document.createElement("p");
            p.textContent = child.textContent.trim();
            if (p.textContent) contentDiv.appendChild(p);
            return;
          }
          if (tag === "DIV") {
            const innerHeading = child.querySelector('[class*="UnitCard_heading"]');
            if (innerHeading) {
              const p = document.createElement("p");
              const strong = document.createElement("strong");
              strong.textContent = innerHeading.textContent.trim();
              p.appendChild(strong);
              contentDiv.appendChild(p);
            }
            child.querySelectorAll(':scope > p:not([class*="UnitCard_heading"])').forEach((ip) => {
              const p = document.createElement("p");
              p.textContent = ip.textContent.trim();
              if (p.textContent) contentDiv.appendChild(p);
            });
            child.querySelectorAll("ul, ol").forEach((list) => {
              const newList = document.createElement(list.tagName.toLowerCase());
              list.querySelectorAll(":scope > li").forEach((li) => {
                const newLi = document.createElement("li");
                const liLink = li.querySelector("a");
                if (liLink) {
                  const a = document.createElement("a");
                  a.href = liLink.getAttribute("href");
                  a.textContent = liLink.textContent.trim();
                  newLi.appendChild(a);
                } else {
                  newLi.textContent = li.textContent.trim();
                }
                newList.appendChild(newLi);
              });
              if (newList.children.length > 0) contentDiv.appendChild(newList);
            });
            return;
          }
          if (tag === "A") {
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.href = child.getAttribute("href");
            a.textContent = child.textContent.trim();
            p.appendChild(a);
            contentDiv.appendChild(p);
          }
        });
      }
      cardDiv.appendChild(contentDiv);
      rightCell.appendChild(cardDiv);
    });
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-reserve", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/army-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const selectorsToRemove = [
        // Cookie consent
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        '[class*="OneTrust"]',
        // Chat widget (Meetami)
        '[class*="AmiChat"]',
        '[id*="ami-chat"]',
        "#callbackCover",
        "#srLaunch",
        "#srUnreadCount",
        "#srContent",
        "#srRecordMobileUx",
        "#srCloseOverlay",
        "#srCloseTrigger",
        "#srChatter",
        ".ami-icon",
        '[href*="meetami"]',
        '[src*="meetami.ai"]',
        '[href="#min"]',
        '[href="#chat"]',
        '[href="#close"]',
        "audio",
        // Navigation / Header
        "header",
        "nav",
        '[class*="Header_header"]',
        '[class*="Navigation"]',
        // Footer
        "footer",
        '[class*="Footer"]',
        // Page overlay / loading / mobile menu portal
        '[class*="PageOverlay"]',
        '[class*="pageOverlay"]',
        '[class*="MobileMenuPortal"]',
        // Next.js internals
        "#__next-route-announcer__",
        '[aria-live="assertive"]',
        // Scripts (but NOT iframes — parsers may need them)
        "script",
        "noscript",
        // Breadcrumb decorators (visual dot separators)
        '[class*="navDecorator"]',
        // Slick cloned slides (duplicates)
        ".slick-cloned"
      ];
      selectorsToRemove.forEach((selector) => {
        element.querySelectorAll(selector).forEach((el) => {
          el.remove();
        });
      });
      element.querySelectorAll('[class*="Breadcrumbs_breadcrumbs"] li').forEach((li) => {
        if (!li.querySelector("a")) {
          li.remove();
        }
      });
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll("iframe").forEach((el) => {
        el.remove();
      });
    }
  }

  // tools/importer/transformers/army-sections.js
  function createSectionMetadataTable(document, style) {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("td");
    headerCell.setAttribute("colspan", "2");
    headerCell.textContent = "Section Metadata";
    headerRow.appendChild(headerCell);
    tbody.appendChild(headerRow);
    const styleRow = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = "style";
    const valueCell = document.createElement("td");
    valueCell.textContent = style;
    styleRow.appendChild(keyCell);
    styleRow.appendChild(valueCell);
    tbody.appendChild(styleRow);
    table.appendChild(tbody);
    return table;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document, template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;
    const sections = template.sections;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (!section.style) continue;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      const sectionMetadata = createSectionMetadataTable(document, section.style);
      if (sectionEl.nextSibling) {
        sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
      } else {
        sectionEl.parentNode.appendChild(sectionMetadata);
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }

  // tools/importer/import-reserve-centre-location.js
  var parsers = {
    "columns-reserve": parse
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "reserve-centre-location",
    description: "2-column reserve centre detail page with address info and map",
    urls: [
      "https://jobs.army.mod.uk/army-reserve/find-a-reserve-centre/south-east/abingdon-cholswell-road/"
    ],
    blocks: [
      {
        name: "columns-reserve",
        instances: ["div[class*='ReserveUnitCentre_gridContainer']"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Breadcrumb Banner",
        selector: "main > div[class*='Breadcrumbs_breadcrumbsContainer']",
        style: "textured-beige",
        blocks: [],
        defaultContent: ["a[class*='Breadcrumbs_homeLink']", "ul[class*='Breadcrumbs_breadcrumbs']"]
      },
      {
        id: "section-2",
        name: "Reserve Centre Details",
        selector: "div[class*='ReserveUnitCentre_gridContainer']",
        style: "dark",
        blocks: ["columns-reserve"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_reserve_centre_location_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_reserve_centre_location_exports);
})();

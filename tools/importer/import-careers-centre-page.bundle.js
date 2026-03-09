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

  // tools/importer/import-careers-centre-page.js
  var import_careers_centre_page_exports = {};
  __export(import_careers_centre_page_exports, {
    default: () => import_careers_centre_page_default
  });

  // tools/importer/parsers/columns-location.js
  function createBlockTable(document, blockName, rows) {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("td");
    headerCell.setAttribute("colspan", String(rows[0] ? rows[0].length : 1));
    headerCell.textContent = blockName;
    headerRow.appendChild(headerCell);
    tbody.appendChild(headerRow);
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cellContent) => {
        const td = document.createElement("td");
        if (typeof cellContent === "string") {
          td.textContent = cellContent;
        } else if (cellContent instanceof document.defaultView.Node) {
          td.appendChild(cellContent);
        } else if (cellContent && cellContent.nodeType) {
          td.appendChild(cellContent);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }
  function parse(element, { document }) {
    const leftCell = document.createElement("div");
    const heading = element.querySelector('[class*="heading"], h2');
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      leftCell.appendChild(h2);
    }
    const addressBlock = element.querySelector('[class*="address"]');
    if (addressBlock) {
      const addressLines = addressBlock.querySelectorAll("p");
      addressLines.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line.textContent.trim();
        if (p.textContent) leftCell.appendChild(p);
      });
    }
    const timesBlock = element.querySelector('[class*="openingTimes"], [class*="OpeningTimes"]');
    if (timesBlock) {
      const allP = timesBlock.querySelectorAll("p");
      allP.forEach((p) => {
        const newP = document.createElement("p");
        const text = p.textContent.trim();
        if (p.className && p.className.includes("Title")) {
          const strong = document.createElement("strong");
          strong.textContent = text;
          newP.appendChild(strong);
        } else {
          newP.textContent = text;
        }
        if (text) leftCell.appendChild(newP);
      });
    }
    const contactBlock = element.querySelector('[class*="contactNumber"], [class*="ContactNumber"]');
    if (contactBlock) {
      const prefix = contactBlock.querySelector('[class*="prefix"]');
      const numbers = contactBlock.querySelectorAll('a[href^="tel:"]');
      if (prefix || numbers.length > 0) {
        const p = document.createElement("p");
        if (prefix) {
          const strong = document.createElement("strong");
          strong.textContent = prefix.textContent.trim();
          p.appendChild(strong);
          p.appendChild(document.createTextNode(" "));
        }
        numbers.forEach((num, idx) => {
          if (idx > 0) p.appendChild(document.createTextNode(" | "));
          const a = document.createElement("a");
          a.href = num.getAttribute("href");
          a.textContent = num.textContent.trim();
          p.appendChild(a);
        });
        leftCell.appendChild(p);
      }
    }
    const directionsLink = element.querySelector('a[href*="maps"]');
    if (directionsLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = directionsLink.getAttribute("href");
      const btn = directionsLink.querySelector("button");
      a.textContent = btn ? btn.textContent.trim() : directionsLink.textContent.trim();
      p.appendChild(a);
      leftCell.appendChild(p);
    }
    const aboutBlock = element.querySelector('[class*="about"]');
    if (aboutBlock) {
      const aboutPs = aboutBlock.querySelectorAll(":scope > p");
      aboutPs.forEach((ap) => {
        const p = document.createElement("p");
        p.innerHTML = ap.innerHTML;
        leftCell.appendChild(p);
      });
      const aboutLists = aboutBlock.querySelectorAll("ul, ol");
      aboutLists.forEach((list) => {
        const newList = document.createElement(list.tagName.toLowerCase());
        list.querySelectorAll(":scope > li").forEach((li) => {
          const newLi = document.createElement("li");
          newLi.innerHTML = li.innerHTML;
          newList.appendChild(newLi);
        });
        if (newList.children.length > 0) leftCell.appendChild(newList);
      });
    }
    const rightCell = document.createElement("div");
    const iframe = element.querySelector('iframe[src*="google.com/maps"]');
    if (iframe) {
      const mapSrc = iframe.getAttribute("src");
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = mapSrc;
      a.textContent = mapSrc;
      p.appendChild(a);
      rightCell.appendChild(p);
    } else {
      const p = document.createElement("p");
      p.textContent = "[Map placeholder]";
      rightCell.appendChild(p);
    }
    const block = createBlockTable(document, "Columns-Location", [[leftCell, rightCell]]);
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

  // tools/importer/import-careers-centre-page.js
  var parsers = {
    "columns-location": parse
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "careers-centre-page",
    description: "Army careers centre location page with centre details, address, opening hours, contact information, and embedded map",
    urls: [
      "https://jobs.army.mod.uk/army-careers-centre-finder/army-careers-centre-swindon/"
    ],
    blocks: [
      {
        name: "columns-location",
        instances: ["div[class*='CentreDetails_centreDetailsContainer']"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Breadcrumb Banner",
        selector: "main > div[class*='Breadcrumbs_breadcrumbsContainer']",
        style: "textured-beige",
        blocks: [],
        defaultContent: ["h1[class*='Breadcrumbs']", "ul[class*='Breadcrumbs_breadcrumbs']", "button[class*='Breadcrumbs_subAction']"]
      },
      {
        id: "section-2",
        name: "Centre Details",
        selector: "div[class*='CentreDetails_centreDetailsContainer']",
        style: "dark",
        blocks: ["columns-location"],
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
  var import_careers_centre_page_default = {
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
  return __toCommonJS(import_careers_centre_page_exports);
})();

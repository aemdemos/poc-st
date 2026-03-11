/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import reserveCentreParser from './parsers/accordion-reserve.js';

// TRANSFORMER IMPORTS
import armyCleanupTransformer from './transformers/army-cleanup.js';
import armySectionsTransformer from './transformers/army-sections.js';

// PARSER REGISTRY
const parsers = {
  accordion: reserveCentreParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  armyCleanupTransformer,
  armySectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'reserve-centre-location',
  description: 'Reserve centre detail page with sidebar default content and accordion unit cards',
  urls: [
    'https://jobs.army.mod.uk/army-reserve/find-a-reserve-centre/south-east/abingdon-cholswell-road/',
  ],
  blocks: [
    {
      name: 'accordion',
      instances: ['div[class*=\'ReserveUnitCentre_gridContainer\']'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Breadcrumb Banner',
      selector: 'main > div[class*=\'Breadcrumbs_breadcrumbsContainer\']',
      style: 'textured-beige',
      blocks: [],
      defaultContent: ['a[class*=\'Breadcrumbs_homeLink\']', 'ul[class*=\'Breadcrumbs_breadcrumbs\']'],
    },
    {
      id: 'section-2',
      name: 'Reserve Centre Details',
      selector: 'div[class*=\'ReserveUnitCentre_gridContainer\']',
      style: null,
      blocks: ['accordion'],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (section breaks + final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

/**
 * Block Parser Registry
 *
 * Central index mapping block names (from page-templates.json) to their
 * parser modules. The import pipeline uses this to look up the correct
 * parser for each matched DOM element.
 *
 * Each parser exports a default function:
 *   parse(element, { document, url }) → void (replaces element in-place)
 *
 * Some legacy parsers return the block instead of replacing — the pipeline
 * handles both patterns.
 */

import heroParser from './hero.js';
import heroVideoParser from './hero-video.js';
import heroBannerParser from './hero-banner.js';
import columnsParser from './columns.js';
import columnsLocationParser from './columns-location.js';
import cardsParser from './cards.js';
import cardsCTAParser from './cards-cta.js';
import carouselParser from './carousel.js';
import featureCardsParser from './feature-cards.js';
import parallaxCardsParser from './parallax-cards.js';
import quickNavParser from './quick-nav.js';
import quoteParser from './quote.js';
import ctaBannerParser from './cta-banner.js';
import promoBannerParser from './promo-banner.js';
import tabsParser from './tabs.js';
import defaultContentParser from './default-content.js';

/**
 * Map of block names to parser functions.
 *
 * Keys match the `name` field in page-templates.json blocks[].name.
 * The special key 'default-content' handles sections without a named block.
 */
const parsers = {
  // Hero variants
  hero: heroParser,
  'hero-video': heroVideoParser,
  'hero-banner': heroBannerParser,

  // Layout blocks
  columns: columnsParser,
  'columns-location': columnsLocationParser,

  // Card blocks
  cards: cardsParser,
  'cards-cta': cardsCTAParser,
  'feature-cards': featureCardsParser,
  'parallax-cards': parallaxCardsParser,

  // Carousel blocks
  carousel: carouselParser,
  'carousel-social': carouselParser, // Same parser handles both types

  // Navigation
  'quick-nav': quickNavParser,

  // Content blocks
  quote: quoteParser,
  'cta-banner': ctaBannerParser,
  'promo-banner': promoBannerParser,
  tabs: tabsParser,

  // Default content (no block wrapper)
  'default-content': defaultContentParser,
};

/**
 * Get the parser function for a given block name.
 * Falls back to default-content parser for unknown blocks.
 * @param {string} blockName
 * @returns {Function}
 */
export function getParser(blockName) {
  // Check for exact match
  if (parsers[blockName]) return parsers[blockName];

  // Check if it's a default-content section (name starts with "section-")
  if (blockName.startsWith('section-')) return parsers['default-content'];

  // Fallback
  return parsers['default-content'];
}

/**
 * Get all registered parser names.
 * @returns {string[]}
 */
export function getParserNames() {
  return Object.keys(parsers);
}

export default parsers;

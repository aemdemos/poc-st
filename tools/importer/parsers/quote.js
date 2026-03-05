/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: quote
 *
 * Source HTML Pattern:
 * <section class="QuoteBanner_quoteBanner__...">
 *   <div class="QuoteBanner_wrapper__...">
 *     <div class="QuoteBanner_icon__...">...</div>
 *     <div class="QuoteBanner_quotes__...">
 *       <blockquote>Quote text here</blockquote>
 *     </div>
 *   </div>
 * </section>
 *
 * Block Structure:
 * - Single row, single cell: Quote text
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract quote text from blockquote or fallback to quotes container
  const blockquote = element.querySelector('blockquote');
  const quotesContainer = element.querySelector('[class*="QuoteBanner_quotes"]');

  const quoteText = blockquote
    ? blockquote.textContent.trim()
    : quotesContainer
      ? quotesContainer.textContent.trim()
      : element.textContent.trim();

  const cells = [[quoteText]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Quote', cells });
  element.replaceWith(block);
}

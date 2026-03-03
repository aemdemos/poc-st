/**
 * Metadata Block
 *
 * Reads key-value pairs from the block table and applies them as
 * <meta> tags in the document <head>. The block itself is hidden.
 */
export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length >= 2) {
      const key = cols[0].textContent.trim().toLowerCase();
      const value = cols[1].textContent.trim();
      if (key && value) {
        if (key === 'title') {
          document.title = value;
        } else if (key === 'description') {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', value);
        } else if (key === 'image') {
          let meta = document.querySelector('meta[property="og:image"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', value);
        }
      }
    }
  });
  // Hide the block — metadata is not visual content
  block.closest('.section').style.display = 'none';
}

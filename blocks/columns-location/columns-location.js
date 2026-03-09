export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-location-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Convert Google Maps embed links to iframes
      const mapLink = col.querySelector('a[href*="google.com/maps/embed"]');
      if (mapLink) {
        const iframe = document.createElement('iframe');
        iframe.src = mapLink.href;
        iframe.title = 'Location map';
        iframe.loading = 'lazy';
        iframe.setAttribute('allowfullscreen', '');
        col.replaceChildren(iframe);
        col.classList.add('columns-location-map-col');
        return;
      }

      // Setup image columns
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-location-img-col');
        }
      }
    });
  });
}

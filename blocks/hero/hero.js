function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function decorate(block) {
  const section = block.closest('.section');
  if (!section || !section.classList.contains('campaign')) return;

  block.classList.add('hero-campaign');

  // Find and extract video link from content
  let videoUrl = '';
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes('youtube.com/watch') || href.includes('youtu.be/')) {
      videoUrl = href;
      // Remove the video link from visible content
      const parentP = link.closest('p');
      if (parentP) parentP.remove();
    }
  });

  // Create play button
  const playBtn = document.createElement('button');
  playBtn.className = 'hero-play-button';
  playBtn.setAttribute('aria-label', 'Play video');

  const playIcon = document.createElement('span');
  playIcon.className = 'hero-play-icon';
  playBtn.appendChild(playIcon);

  // Create video area wrapper
  const videoArea = document.createElement('div');
  videoArea.className = 'hero-video-area';
  videoArea.appendChild(playBtn);

  // Insert video area before the content layer
  const contentLayer = block.querySelector(':scope > div:last-child');
  block.insertBefore(videoArea, contentLayer);

  // Video modal on click
  playBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'hero-video-modal';

    const modalInner = document.createElement('div');
    modalInner.className = 'hero-video-modal-inner';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'hero-video-modal-close';
    closeBtn.setAttribute('aria-label', 'Close video');
    closeBtn.textContent = '\u00D7';

    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'hero-video-wrapper';

    const videoId = getYouTubeId(videoUrl);
    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
      videoWrapper.appendChild(iframe);

      // "Watch on YouTube" fallback link for embed-restricted videos (error 150/153)
      const fallback = document.createElement('a');
      fallback.href = videoUrl;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.className = 'hero-video-fallback';
      fallback.textContent = 'Watch on YouTube';
      videoWrapper.appendChild(fallback);
    }

    const removeModal = () => {
      modal.remove();
    };

    closeBtn.addEventListener('click', removeModal);

    modalInner.appendChild(closeBtn);
    modalInner.appendChild(videoWrapper);
    modal.appendChild(modalInner);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) removeModal();
    });

    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        removeModal();
        document.removeEventListener('keydown', handler);
      }
    });

    document.body.appendChild(modal);
  });
}

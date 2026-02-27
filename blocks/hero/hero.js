export default function decorate(block) {
  const section = block.closest('.section');
  if (!section || !section.classList.contains('campaign')) return;

  block.classList.add('hero-campaign');

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
    closeBtn.addEventListener('click', () => modal.remove());

    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'hero-video-wrapper';
    videoWrapper.textContent = 'Video content';

    modalInner.appendChild(closeBtn);
    modalInner.appendChild(videoWrapper);
    modal.appendChild(modalInner);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handler);
      }
    });

    document.body.appendChild(modal);
  });
}

function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const ANIMATION_DURATION = 1000;

function initSliderMode(block) {
  block.classList.add('hero-slider');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length < 2) return;

  // Last row is content; everything before it is an image row
  const contentRow = rows[rows.length - 1];
  const imageRows = rows.slice(0, -1);

  // --- Stack all images into the first row ---
  const imgContainer = imageRows[0];
  const pictures = [];
  imageRows.forEach((row) => {
    const pic = row.querySelector('picture');
    if (pic) pictures.push(pic);
  });

  imgContainer.innerHTML = '';
  pictures.forEach((pic, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-slider-img';
    if (i === 0) wrapper.classList.add('active');
    wrapper.appendChild(pic);
    imgContainer.appendChild(wrapper);
  });

  // Remove extra image rows (keep first as the image container)
  imageRows.slice(1).forEach((row) => row.remove());

  // --- Parse content ---
  const contentCell = contentRow.querySelector(':scope > div') || contentRow;
  const h3 = contentCell.querySelector('h3');
  const h2s = [...contentCell.querySelectorAll('h2')];
  const ctaP = contentCell.querySelector('p');

  // First h2: "Be a reserve Soldier" → static = "Be a reserve", first word = "Soldier"
  let staticTitle = '';
  const words = [];

  if (h2s[0]) {
    const text = h2s[0].textContent.trim();
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      staticTitle = text.substring(0, lastSpace);
      words.push(text.substring(lastSpace + 1));
    } else {
      staticTitle = text;
    }
  }

  // Remaining h2s are additional rotating words
  for (let i = 1; i < h2s.length; i += 1) {
    const w = h2s[i].textContent.trim();
    if (w) words.push(w);
  }

  // --- Rebuild content ---
  contentCell.innerHTML = '';

  if (h3) contentCell.appendChild(h3);

  // Static title
  const titleEl = document.createElement('h2');
  titleEl.className = 'hero-slider-title';
  titleEl.textContent = staticTitle;
  contentCell.appendChild(titleEl);

  // Word slider container
  if (words.length > 0) {
    const wordContainer = document.createElement('div');
    wordContainer.className = 'hero-slider-words';

    // Invisible sizer: determines container height from longest word
    const sizer = document.createElement('h2');
    sizer.className = 'hero-slider-word-sizer';
    sizer.textContent = words.reduce((a, b) => (a.length >= b.length ? a : b), '');
    sizer.setAttribute('aria-hidden', 'true');
    wordContainer.appendChild(sizer);

    words.forEach((word, i) => {
      const wordEl = document.createElement('h2');
      wordEl.className = 'hero-slider-word';
      if (i === 0) wordEl.classList.add('active');
      wordEl.textContent = word;
      wordContainer.appendChild(wordEl);
    });

    contentCell.appendChild(wordContainer);
  }

  // Orange underline
  const underline = document.createElement('div');
  underline.className = 'hero-slider-underline';
  contentCell.appendChild(underline);

  // Progress bar
  const progressWrap = document.createElement('div');
  progressWrap.className = 'hero-slider-progress';
  const progressBar = document.createElement('div');
  progressBar.className = 'hero-slider-progress-bar';
  progressWrap.appendChild(progressBar);
  contentCell.appendChild(progressWrap);

  // CTA
  if (ctaP) contentCell.appendChild(ctaP);

  // --- Auto-advance (only when more than one slide) ---
  const slideCount = Math.max(words.length, pictures.length);
  if (slideCount <= 1) return;

  let currentSlide = 0;
  const imgWrappers = imgContainer.querySelectorAll('.hero-slider-img');
  const wordEls = contentCell.querySelectorAll(
    '.hero-slider-word:not(.hero-slider-word-sizer)',
  );

  function advanceSlide() {
    const prev = currentSlide;
    currentSlide = (currentSlide + 1) % slideCount;

    // Crossfade images
    if (imgWrappers.length > 1) {
      imgWrappers[prev].classList.remove('active');
      imgWrappers[prev].classList.add('fade-out');
      imgWrappers[currentSlide].classList.add('fade-in');

      setTimeout(() => {
        imgWrappers[prev].classList.remove('fade-out');
        imgWrappers[currentSlide].classList.remove('fade-in');
        imgWrappers[currentSlide].classList.add('active');
      }, ANIMATION_DURATION);
    }

    // Scroll words
    if (wordEls.length > 1) {
      wordEls[prev].classList.remove('active');
      wordEls[prev].classList.add('scroll-out');
      wordEls[currentSlide].classList.add('scroll-in');

      setTimeout(() => {
        wordEls[prev].classList.remove('scroll-out');
        wordEls[currentSlide].classList.remove('scroll-in');
        wordEls[currentSlide].classList.add('active');
      }, ANIMATION_DURATION);
    }
  }

  // Drive slides from progress-bar animation iterations (keeps bar + slides in sync)
  progressBar.addEventListener('animationiteration', advanceSlide);

  // Pause on hover / focus
  const section = block.closest('.section') || block;
  const pause = () => { progressBar.style.animationPlayState = 'paused'; };
  const resume = () => { progressBar.style.animationPlayState = 'running'; };
  section.addEventListener('mouseenter', pause);
  section.addEventListener('mouseleave', resume);
  section.addEventListener('focusin', pause);
  section.addEventListener('focusout', resume);

  // Respect prefers-reduced-motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mq.matches) {
    progressBar.classList.add('filling');
  }
  mq.addEventListener('change', (e) => {
    if (e.matches) {
      progressBar.classList.remove('filling');
    } else {
      progressBar.classList.add('filling');
    }
  });
}

function initVideoMode(block) {
  // Find and extract video link from content
  let videoUrl = '';
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes('youtube.com/watch') || href.includes('youtu.be/')) {
      videoUrl = href;
      const parentP = link.closest('p');
      if (parentP) parentP.remove();
    }
  });

  const videoId = getYouTubeId(videoUrl);
  if (!videoId) return;

  // Create inline video embed container
  const embedContainer = document.createElement('div');
  embedContainer.className = 'hero-video-embed';

  const playerId = `hero-yt-${Date.now()}`;
  const playerDiv = document.createElement('div');
  playerDiv.id = playerId;
  embedContainer.appendChild(playerDiv);

  // Create play/pause toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'hero-video-toggle';
  toggleBtn.setAttribute('aria-label', 'Play video');
  toggleBtn.setAttribute('tabindex', '0');

  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'hero-video-toggle-icon play';
  toggleBtn.appendChild(toggleIcon);

  // Insert video embed before the content layer
  const contentLayer = block.querySelector(':scope > div:last-child');
  block.insertBefore(embedContainer, contentLayer);

  // Append toggle button at end of block
  block.appendChild(toggleBtn);

  // YouTube IFrame API integration
  let player = null;
  let isPlaying = false;

  function updateToggle() {
    if (isPlaying) {
      toggleBtn.setAttribute('aria-label', 'Pause video');
      toggleIcon.className = 'hero-video-toggle-icon pause';
    } else {
      toggleBtn.setAttribute('aria-label', 'Play video');
      toggleIcon.className = 'hero-video-toggle-icon play';
    }
  }

  function createPlayer() {
    player = new window.YT.Player(playerId, {
      videoId,
      playerVars: {
        controls: 0,
        mute: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        disablekb: 1,
        fs: 0,
      },
      events: {
        onReady: () => {
          const iframe = embedContainer.querySelector('iframe');
          if (iframe) {
            iframe.setAttribute('title', 'Army Reserve video');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
          }
        },
        onStateChange: (event) => {
          const { YT: ytApi } = window;
          isPlaying = event.data === ytApi.PlayerState.PLAYING;
          updateToggle();
        },
      },
    });
  }

  // Load YouTube IFrame API if not already available
  if (window.YT && window.YT.Player) {
    createPlayer();
  } else {
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      createPlayer();
    };
  }

  toggleBtn.addEventListener('click', () => {
    if (!player || typeof player.getPlayerState !== 'function') return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });
}

export default function decorate(block) {
  const section = block.closest('.section');

  // Slider variant: crossfading images, rotating words, progress bar (no chevron)
  if (section && block.classList.contains('slider')) {
    initSliderMode(block);
    return;
  }

  // Video variant: inline YouTube embed with play/pause toggle (no chevron)
  if (block.classList.contains('video')) {
    block.classList.add('hero-video');
    initVideoMode(block);
    return;
  }

  // Scroll-to-next-section chevron button (default variant only)
  const chevron = document.createElement('button');
  chevron.className = 'hero-chevron';
  chevron.setAttribute('aria-label', 'Scroll to next section');
  chevron.innerHTML = '<svg viewBox="0 0 11 18" width="11" height="18"><line x1="10.18" y1="9.86" x2="1.5" y2="1.18" stroke="#15171a" stroke-width="2"></line><line x1="10.23" y1="8.5" x2="1.55" y2="17.18" stroke="#15171a" stroke-width="2"></line></svg>';
  chevron.addEventListener('click', () => {
    const heroSection = block.closest('.section');
    const nextSection = heroSection?.nextElementSibling;
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  });
  block.appendChild(chevron);
}

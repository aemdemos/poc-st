import { getMetadata } from '../../scripts/aem.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function getDirectTextContent(menuItem) {
  const menuLink = menuItem.querySelector(':scope > :where(a,p)');
  if (menuLink) {
    return menuLink.textContent.trim();
  }
  return Array.from(menuItem.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ');
}

async function buildBreadcrumbsFromNavTree(nav, currentUrl) {
  const crumbs = [];

  const homeUrl = document.querySelector('.nav-brand a[href]').href;

  let menuItem = Array.from(nav.querySelectorAll('a')).find((a) => a.href === currentUrl);
  if (menuItem) {
    do {
      const link = menuItem.querySelector(':scope > a');
      crumbs.unshift({ title: getDirectTextContent(menuItem), url: link ? link.href : null });
      menuItem = menuItem.closest('ul')?.closest('li');
    } while (menuItem);
  } else if (currentUrl !== homeUrl) {
    crumbs.unshift({ title: getMetadata('og:title'), url: currentUrl });
  }

  const placeholders = await fetchPlaceholders();
  const homePlaceholder = placeholders.breadcrumbsHomeLabel || 'Home';

  crumbs.unshift({ title: homePlaceholder, url: homeUrl });

  // last link is current page and should not be linked
  if (crumbs.length > 1) {
    crumbs[crumbs.length - 1].url = null;
  }
  crumbs[crumbs.length - 1]['aria-current'] = 'page';
  return crumbs;
}

async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  const crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);

  const ol = document.createElement('ol');
  ol.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ol);
  return breadcrumbs;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // promo content for each dropdown section (matched by dropdown label text)
  const promoData = {
    'Regular Army': {
      title: 'Explore an Army Base',
      description: 'See what life is like on a base with our interactive Base Tour experience',
      cta: 'Explore an Army Base',
      url: '/regular-army/army-life/base-tour/',
      image: 'https://a.storyblok.com/f/88791/750x1334/6cb4ff36cf/base-tour.png/m/450x540/filters:focal(347x828:348x829)/',
    },
    'Army Reserve': {
      title: "What's it like?",
      description: 'Check out our chats that cover everything from your first visit to heading off on your first training camp.',
      cta: 'Reserve Q&A Chats',
      url: '/army-reserve/reservists-qa-dms/',
      image: 'https://a.storyblok.com/f/88791/355x728/ce283bf0c0/reserve-dm-screenshot.png/m/450x540/filters:focal(191x336:192x337)/',
    },
    'How to Join': {
      title: 'Find your fit',
      description: 'Are you not quite sure the best way to join is? Discover where you could fit best and what is available.',
      cta: 'Where to start',
      url: '/how-to-join/find-your-fit/',
      image: 'https://a.storyblok.com/f/88791/1800x1350/2c700ce461/hp-hero-soldier-on-steps2.png/m/450x540/smart',
    },
  };

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });

      // build mega-menu wrapper with categories + promo panel
      const categoryList = navSection.querySelector(':scope > ul');
      if (categoryList) {
        const megaMenu = document.createElement('div');
        megaMenu.className = 'nav-mega-menu';

        // move category list into mega-menu wrapper
        navSection.insertBefore(megaMenu, categoryList);
        megaMenu.append(categoryList);

        // add promo panel if data exists for this dropdown
        // use broad selector: EDS pipeline may wrap <strong> in <p> tags
        const sectionLabel = (navSection.querySelector(':scope > strong') || navSection.querySelector(':scope > p > strong'))?.textContent?.trim();
        const promo = promoData[sectionLabel];
        if (promo) {
          const promoDiv = document.createElement('div');
          promoDiv.className = 'nav-promo';
          if (promo.image) {
            promoDiv.style.backgroundImage = `url('${promo.image}')`;
          }
          promoDiv.innerHTML = `
            <p class="nav-promo-title">${promo.title}</p>
            <p class="nav-promo-desc">${promo.description}</p>
            <a href="${promo.url}">${promo.cta}</a>
          `;
          megaMenu.append(promoDiv);
        }
      }

      // setup second-level category expand/collapse
      navSection.querySelectorAll(':scope > .nav-mega-menu > ul > li').forEach((category) => {
        const subList = category.querySelector(':scope > ul');
        if (subList) {
          category.classList.add('has-children');
          category.setAttribute('aria-expanded', 'false');

          // EDS pipeline may wrap <a> in <p> tags
          const categoryLink = category.querySelector(':scope > a') || category.querySelector(':scope > p > a');
          category.addEventListener('click', (e) => {
            if (isDesktop.matches) {
              e.stopPropagation();
              const clickedLink = e.target.closest('a');
              if (!clickedLink || clickedLink === categoryLink) {
                e.preventDefault();
                const catExpanded = category.getAttribute('aria-expanded') === 'true';
                category.closest('ul').querySelectorAll(':scope > li').forEach((sibling) => {
                  sibling.setAttribute('aria-expanded', 'false');
                });
                category.setAttribute('aria-expanded', catExpanded ? 'false' : 'true');
              }
            }
          });
        }
      });
    });
    navSections.querySelectorAll('.button-container').forEach((buttonContainer) => {
      buttonContainer.classList.remove('button-container');
      buttonContainer.querySelector('.button').classList.remove('button');
    });
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const toolsList = navTools.querySelector('ul');
    if (toolsList) {
      const allItems = [...toolsList.querySelectorAll(':scope > li')];
      // separate CTA buttons ("Find a Recruiting Centre" and "Apply Now") from utility links
      const ctaLabels = ['find a recruiting centre', 'apply now'];
      const utilityItems = [];
      const ctaItems = [];
      allItems.forEach((li) => {
        const linkText = li.textContent.trim().toLowerCase();
        if (ctaLabels.includes(linkText)) {
          ctaItems.push(li);
        } else {
          utilityItems.push(li);
        }
      });

      // add search icon to utility links
      const searchItem = document.createElement('li');
      searchItem.className = 'nav-search';
      searchItem.innerHTML = '<button class="nav-search-btn" aria-label="Search"><span class="icon icon-search"><img data-icon-name="search" src="/icons/search.svg" alt="Search" loading="lazy"></span></button>';
      utilityItems.push(searchItem);

      // rebuild tools list with only utility links
      toolsList.innerHTML = '';
      utilityItems.forEach((li) => toolsList.append(li));

      // create CTA buttons container in the main nav row
      if (ctaItems.length > 0) {
        const ctaNav = document.createElement('div');
        ctaNav.className = 'nav-cta';
        ctaItems.forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const linkText = link.textContent.trim().toLowerCase();
            if (linkText === 'apply now') {
              link.classList.add('nav-cta-btn', 'nav-cta-apply');
            } else {
              link.classList.add('nav-cta-btn', 'nav-cta-outline');
            }
            ctaNav.append(link);
          }
        });
        nav.insertBefore(ctaNav, navTools);
      }
    }
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    navWrapper.append(await buildBreadcrumbs());
  }
}

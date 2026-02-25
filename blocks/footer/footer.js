import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // The footer content has 4 sections (divs from markdown HR separators):
  // 0. Home breadcrumb link
  // 1. Main footer nav links (How to Join, Find a Recruitment Centre, etc.)
  // 2. Social media icon links
  // 3. Lower bar (Main Army Website button + legal links + copyright)
  const sectionWrappers = footer.querySelectorAll(':scope > div');

  // Save references to each section wrapper before any DOM mutations
  const section0 = sectionWrappers[0];
  const section1 = sectionWrappers[1];
  const section2 = sectionWrappers[2];
  const section3 = sectionWrappers[3];

  // Section 0: Home breadcrumb
  if (section0) {
    const homeLink = section0.querySelector('a');
    if (homeLink) {
      const breadcrumbDiv = document.createElement('div');
      breadcrumbDiv.className = 'footer-breadcrumb';

      // build home icon — handles both <span class="icon"> and <picture>/<img>
      const iconSpan = homeLink.querySelector('.icon');
      const iconPicture = homeLink.querySelector('picture');
      const iconEl = iconSpan || iconPicture;
      if (iconEl) {
        const homeIconLink = document.createElement('a');
        homeIconLink.href = '/';
        homeIconLink.className = 'footer-home-icon';
        homeIconLink.setAttribute('aria-label', 'Homepage');
        homeIconLink.append(iconEl);
        breadcrumbDiv.append(homeIconLink);
      }

      const breadcrumbText = document.createElement('span');
      breadcrumbText.className = 'footer-breadcrumb-text';
      breadcrumbText.innerHTML = '<span class="footer-breadcrumb-dot">.</span> Home';
      breadcrumbDiv.append(breadcrumbText);

      section0.textContent = '';
      section0.append(breadcrumbDiv);
    }
  }

  // Section 1: Footer navigation links
  if (section1) {
    const navList = section1.querySelector('ul');
    if (navList) {
      navList.className = 'footer-nav';
    }
  }

  // Section 2: Social media icons
  if (section2) {
    const socialList = section2.querySelector('ul');
    if (socialList) {
      socialList.className = 'footer-social';
      socialList.querySelectorAll('li a').forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noreferrer');
        // extract icon and text, restructure for visual display
        const iconSpan = link.querySelector('.icon');
        const iconPicture = link.querySelector('picture');
        const iconEl = iconSpan || iconPicture;
        const textContent = link.textContent.trim();
        if (iconEl) {
          link.textContent = '';
          link.append(iconEl);
          const label = document.createElement('span');
          label.className = 'social-label';
          label.textContent = textContent;
          link.append(label);
          link.setAttribute('aria-label', textContent);
        }
      });
    }
  }

  // Group sections 0+1+2 into upper container
  const upperDiv = document.createElement('div');
  upperDiv.className = 'footer-upper';
  if (section0) upperDiv.append(...section0.children);
  if (section1) upperDiv.append(...section1.children);
  if (section2) upperDiv.append(...section2.children);
  if (section0) section0.remove();
  if (section1) section1.remove();
  if (section2) section2.remove();

  // Section 3: Lower bar (Main Army Website + legal links + copyright)
  if (section3) {
    const lowerDiv = document.createElement('div');
    lowerDiv.className = 'footer-lower';
    const contentWrapper = section3.querySelector('.default-content-wrapper') || section3;

    // "Main Army Website" link/button
    const mainSiteLink = contentWrapper.querySelector('p > a');
    if (mainSiteLink) {
      mainSiteLink.className = '';
      const mainSiteDiv = document.createElement('div');
      mainSiteDiv.className = 'footer-main-site';
      mainSiteDiv.append(mainSiteLink);
      mainSiteLink.setAttribute('target', '_blank');
      lowerDiv.append(mainSiteDiv);
    }

    // Legal links list
    const legalList = contentWrapper.querySelector('ul');
    if (legalList) {
      legalList.className = 'footer-legal';
      lowerDiv.append(legalList);
    }

    // Copyright text
    const paragraphs = contentWrapper.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (p.textContent.includes('©') || p.textContent.includes('Copyright')) {
        p.className = 'footer-copyright';
        lowerDiv.append(p);
      }
    });

    section3.textContent = '';
    section3.append(lowerDiv);
  }

  // Insert upper div at the top
  footer.prepend(upperDiv);

  block.append(footer);
}

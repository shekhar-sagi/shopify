import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const banner = document.createElement('div');
  banner.className = 'banner-wrapper';

  const rows = [...block.children];
  rows.forEach((row) => {
    const imageEl = row.querySelector('picture, video');
    const title = row.querySelector('h1, h2, h3, h4, h5, h6');
    const subtitle = [...row.children].find(el => el.tagName === 'P' && el !== title);
    const cta = row.querySelector('a');

    const bannerContent = document.createElement('div');
    bannerContent.className = 'banner-content';

    if (title) {
      const titleEl = document.createElement(title.tagName);
      titleEl.textContent = title.textContent;
      bannerContent.appendChild(titleEl);
    }

    if (subtitle) {
      const subtitleEl = document.createElement('p');
      subtitleEl.textContent = subtitle.textContent;
      subtitleEl.className = 'banner-subtitle';
      bannerContent.appendChild(subtitleEl);
    }

    if (cta) {
      const ctaWrapper = document.createElement('p');
      ctaWrapper.className = 'banner-cta';
      const clonedCta = cta.cloneNode(true);
      ctaWrapper.appendChild(clonedCta);
      bannerContent.appendChild(ctaWrapper);
    }

    if (imageEl) {
      const mediaWrapper = document.createElement('div');
      mediaWrapper.className = 'banner-media';
      const media = imageEl.tagName === 'PICTURE'
        ? createOptimizedPicture(imageEl.querySelector('img').src, imageEl.querySelector('img').alt, false, [{ width: '2000' }])
        : imageEl.cloneNode(true);
      mediaWrapper.appendChild(media);
      banner.appendChild(mediaWrapper);
    }

    banner.appendChild(bannerContent);
  });

  block.textContent = '';
  block.appendChild(banner);
}

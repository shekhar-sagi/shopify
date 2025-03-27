export default function decorate(block) {
  // Extracting data from the original block HTML
  const pictureElement = block.querySelector('picture');
  const imgElement = pictureElement.querySelector('img');
  const subtitleElement = block.querySelectorAll('div > div')[1].querySelector('p');
  const titleElement = block.querySelectorAll('div > div')[2].querySelector('p');

  // Creating new structure using the data extracted
  const bannerContent = `
    <div class="banner-content">
      <p class="banner-subtitle">${subtitleElement.textContent}</p>
      <h1 class="banner-title">${titleElement.textContent}</h1>
    </div>
  `;

  // Replacing the block inner HTML with the new structure
  block.innerHTML = bannerContent;

  // Setting background image using the image URL from the original block
  block.style.backgroundImage = `url(${imgElement.src})`;
}

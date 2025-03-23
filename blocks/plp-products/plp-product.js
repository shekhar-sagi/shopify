export default function decorate(block) {
  block.classList.add('plp-static');
  const title = document.createElement('h2');
  title.className = 'plp-title';
  title.textContent = block.dataset.title || 'Choose what best suits you';
  block.prepend(title);
}

import {
  getCartCount,
  addToCart,
} from '../../scripts/cart-service.js';

function renderMiniCart(block) {
  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'minicart-wrapper';

  const icon = document.createElement('span');
  icon.className = 'minicart-icon';
  icon.innerHTML = '🛒';

  const count = document.createElement('span');
  count.className = 'minicart-count';
  count.textContent = getCartCount();

  wrapper.append(icon, count);
  block.appendChild(wrapper);
}

export default function decorate(block) {
  block.classList.add('minicart');
  renderMiniCart(block);

  document.addEventListener('add-to-cart', (e) => {
    addToCart(e.detail);
    renderMiniCart(block);
  });

  block.addEventListener('click', () => {
    const url = '/cart'; // getShopifyCartUrl();
    if (url) window.location.href = url;
  });
}

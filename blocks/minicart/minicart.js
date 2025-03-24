function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('shopify-cart')) || [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}
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

  document.addEventListener('add-to-cart', () => {
    renderMiniCart(block);
  });

  block.addEventListener('click', () => {
    window.location.href = '/cart';
  });
}

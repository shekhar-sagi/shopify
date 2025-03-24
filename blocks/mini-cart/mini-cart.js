const SHOPIFY_STORE_DOMAIN = 'y5kch8-7n.myshopify.com';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('shopify-cart')) || [];
  } catch {
    return [];
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
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
  console.log('Hello from minicart block');

  renderMiniCart(block); // Always show cart icon

  document.addEventListener('add-to-cart', (e) => {
    const item = e.detail;

    const cart = getCart();
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem('shopify-cart', JSON.stringify(cart));
    renderMiniCart(block);
  });

  block.addEventListener('click', () => {
    const cart = getCart();

    if (!cart.length) return;

    const cartParams = cart
      .map((item) => {
        const variantId = item.id?.split('/')?.pop();
        return `${variantId}:${item.quantity}`;
      })
      .join(',');

    const shopifyCartUrl = `https://${SHOPIFY_STORE_DOMAIN}/cart/${cartParams}`;
    window.location.href = shopifyCartUrl;
  });
}

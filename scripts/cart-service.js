const SHOPIFY_STORE_DOMAIN = 'y5kch8-7n.myshopify.com';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem('shopify-cart')) || [];
  } catch {
    return [];
  }
}

export function setCart(cart) {
  localStorage.setItem('shopify-cart', JSON.stringify(cart));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push(item);
  }
  setCart(cart);
}

export function removeFromCart(item) {
  const cart = getCart();
  const itemIndex = cart.findIndex((i) => i.id === item.id);

  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    setCart(cart);
  }
}

export function getShopifyCartUrl() {
  const cart = getCart();
  if (!cart.length) return null;

  const cartParams = cart
    .map((item) => {
      const variantId = item.id?.split('/')?.pop();
      return `${variantId}:${item.quantity}`;
    })
    .join(',');

  return `https://${SHOPIFY_STORE_DOMAIN}/cart/${cartParams}`;
}

export function updateCartCount() {
  const count = getCartCount();
  document.querySelector('.minicart-count').textContent = count;
}

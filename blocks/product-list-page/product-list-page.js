import fetchShopifyProducts from '../../scripts/shopify-api.js';

export default async function decorate(block) {
  block.classList.add('product-list-page');

  const loading = document.createElement('p');
  loading.textContent = 'Loading products...';
  block.append(loading);

  try {
    const products = await fetchShopifyProducts();
    loading.remove();

    if (!products.length) {
      block.append('No products found.');
      return;
    }

    const productCardsHTML = products.map((product) => {
      const variant = product.variants?.edges?.[0]?.node;
      if (!variant) return '';

      const imageUrl = product.featuredImage?.url || '';
      const imageAlt = product.featuredImage?.altText || product.title;
      const productTitle = product.title;
      const price = variant.priceV2 ? `${variant.priceV2.amount} ${variant.priceV2.currencyCode}` : 'Unavailable';

      return `
        <div class="product-list-page-card">
          <img src="${imageUrl}" alt="${imageAlt}">
          <h3>${productTitle}</h3>
          <div class="rating" aria-label="Rating 0 out of 5 stars"><span>☆☆☆☆☆</span> <span>(0)</span></div>
          <p class="price">$${price}</p>
        </div>
      `;
    }).join('');

    block.innerHTML = productCardsHTML;
  } catch (err) {
    console.error('Shopify API Error:', err);
    loading.textContent = 'Failed to load products.';
  }
}

import fetchShopifyProductById from '../../scripts/product-page.js';
// import { addToCart } from '../../scripts/cart-service.js';

export default async function decorate(block) {
  block.classList.add('product-detail');

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    block.innerHTML = 'Product ID not found in the URL.';
    return;
  }

  const loading = document.createElement('p');
  loading.textContent = 'Loading product details...';
  block.append(loading);

  try {
    const product = await fetchShopifyProductById(productId);
    loading.remove();

    if (!product) {
      block.innerHTML = 'Product not found.';
      return;
    }

    const {
      title: productTitle,
      descriptionHtml,
      featuredImage,
      variants,
    } = product;

    const variant = variants?.edges?.[0]?.node;
    const imageUrl = featuredImage?.url || '';
    const imageAlt = featuredImage?.altText || productTitle;
    const price = variant?.priceV2
      ? `${variant.priceV2.amount} ${variant.priceV2.currencyCode}`
      : 'Unavailable';

    const sizeOptions = variant?.selectedOptions
      .map((option) => `<option value="${option.value}">${option.value}</option>`)
      .join('');

    block.innerHTML = `
      <div class="product-detail-wrapper">
        <div class="product-image-container">
          <img src="${imageUrl}" alt="${imageAlt}" class="product-image">
        </div>
        <div class="product-info">
          <h1>${productTitle}</h1>
          <div class="rating-review">
            <span aria-label="0 stars" role="img">⭐⭐⭐⭐⭐</span>
            <span>(0)</span>
            <a href="#write-review" aria-label="Write a review">Write a review</a>
          </div>
          <p>${descriptionHtml}</p>
          <p class="price">$${price}</p>
          <p>
            4 interest-free installments, or from
            <strong>$43.23/mo</strong> with
            <a href="#shop-pay">shopPay</a>
          </p>
          <a href="#details" class="details-link">Size and Dimensions</a>
          <div class="size-selector">
            <label for="size">Size</label>
            <select id="size" name="size">${sizeOptions || '<option selected>Unavailable</option>'}</select>
          </div>
          <button class="add-to-cart">Add to cart</button>
          <button class="find-store">Find a Store</button>
        </div>
      </div>
    `;

    const addToCartBtn = block.querySelector('.add-to-cart');
    addToCartBtn?.addEventListener('click', () => {
      if (!variant) return;
      const item = {
        id: variant.id,
        title: productTitle,
        quantity: 1,
        price: variant.priceV2?.amount,
        currency: variant.priceV2?.currencyCode,
        image: imageUrl,
      };

      document.dispatchEvent(new CustomEvent('add-to-cart', { detail: item }));
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Shopify API Error:', err);
    loading.textContent = 'Failed to load product details.';
  }
}

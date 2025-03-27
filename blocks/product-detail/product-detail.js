import fetchShopifyProductById from '../../scripts/product-page.js';

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

    // Destructure necessary product information
    const { title: productTitle, descriptionHtml, featuredImage, variants } = product;
    const variant = variants?.edges?.[0]?.node;
    const imageUrl = featuredImage?.url || '';
    const imageAlt = featuredImage?.altText || productTitle;
    const price = variant?.priceV2 ? `${variant.priceV2.amount} ${variant.priceV2.currencyCode}` : 'Unavailable';

    const sizeOptions = variant?.selectedOptions
      .map(option => `<option value="${option.value}">${option.value}</option>`)
      .join('');

    block.innerHTML = `
      <h1>${productTitle}</h1>
      <img src="${imageUrl}" alt="${imageAlt}" class="product-image">
      
      <div class="rating-review">
        <span aria-label="0 stars" role="img">⭐⭐⭐⭐⭐</span>
        <span>(0)</span>
        <a href="#write-review" aria-label="Write a review">Write a review</a>
      </div>
      
      <p>${descriptionHtml}</p>
      
      <p class="price">$${price}</p>
      <p>4 interest-free installments, or from <strong>$43.23/mo</strong> with <a href="#shop-pay">shopPay</a></p>
      <a href="#details" class="details-link">Size and Dimensions</a>
      
      <div class="size-selector">
        <label for="size">Size</label>
        <select id="size" name="size">${sizeOptions || '<option selected>Unavailable</option>'}</select>
      </div>
      
      <button class="add-to-cart">Add to cart</button>
      <button class="find-store">Find a Store</button>
      
      <div class="features">
        <div class="feature">
          <img src="#" alt="100-night trial icon">
          <span>100-night trial</span>
        </div>
        <div class="feature">
          <img src="#" alt="Free Shipping & Returns icon">
          <span>Free Shipping & Returns</span>
        </div>
        <div class="feature">
          <img src="#" alt="Free white glove delivery icon">
          <span>Free white glove delivery</span>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Shopify API Error:', err);
    loading.textContent = 'Failed to load product details.';
  }
}
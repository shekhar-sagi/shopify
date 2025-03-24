import fetchShopifyProducts from '../../scripts/shopify-api.js';

export default async function decorate(block) {
  block.classList.add('plp-static');

  const title = document.createElement('h2');
  title.className = 'plp-title';
  title.textContent = block.dataset.pagetitle || 'Choose what best suits you';
  block.prepend(title);

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

    const ul = document.createElement('ul');
    ul.className = 'plp-card-list';

    products.forEach((product) => {
      const variant = product.variants?.edges?.[0]?.node;
      if (!variant) return;

      const li = document.createElement('li');
      li.className = 'plp-card';

      const img = document.createElement('img');
      img.src = product.featuredImage?.url || '';
      img.alt = product.featuredImage?.altText || product.title;
      li.appendChild(img);

      const body = document.createElement('div');
      body.className = 'plp-card-body';

      const name = document.createElement('h3');
      name.textContent = product.title;
      body.appendChild(name);

      const desc = document.createElement('div');
      desc.innerHTML = product.descriptionHtml || '';
      body.appendChild(desc);

      if (variant.priceV2) {
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `Price: ${variant.priceV2.amount} ${variant.priceV2.currencyCode}`;
        body.appendChild(price);
      }

      const addToCartBtn = document.createElement('button');
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.className = 'add-to-cart-btn';

      addToCartBtn.addEventListener('click', () => {
        const item = {
          id: variant.id,
          title: product.title,
          price: variant.priceV2.amount,
          currency: variant.priceV2.currencyCode,
          image: product.featuredImage?.url,
          quantity: 1,
        };

        document.dispatchEvent(
          new CustomEvent('add-to-cart', {
            detail: item,
          }),
        );
      });

      body.appendChild(addToCartBtn);
      li.appendChild(body);
      ul.appendChild(li);
    });

    block.appendChild(ul);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Shopify API Error:', err);
    loading.textContent = 'Failed to load products.';
  }
}

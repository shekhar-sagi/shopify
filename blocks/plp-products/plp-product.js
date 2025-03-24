const SHOPIFY_STORE_DOMAIN = 'y5kch8-7n.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '6964502587c1f9d114a7e3f93fd0a40b';

export default async function decorate(block) {
  block.classList.add('plp-static');

  const title = document.createElement('h2');
  title.className = 'plp-title';

  title.textContent = block.dataset.pagetitle || 'Choose what best suits you';
  block.prepend(title);
  const loading = document.createElement('p');
  loading.textContent = 'Loading products...';
  block.append(loading);

  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
            featuredImage {
              url
              altText
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    loading.remove();

    const products = json?.data?.products?.edges?.map((edge) => edge.node) || [];

    if (products.length === 0) {
      block.append('No products found.');
      return;
    }
    console.log('🚀 PLP block executing');
    console.log('Raw Shopify response:', json);
    const ul = document.createElement('ul');
    ul.className = 'plp-card-list';

    products.forEach((product) => {
      const variant = product.variants?.edges?.[0]?.node;
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

      if (variant?.priceV2) {
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `Price: ${variant.priceV2.amount} ${variant.priceV2.currencyCode}`;
        body.appendChild(price);
      }

      const buyBtn = document.createElement('button');
      buyBtn.textContent = 'Buy Now';
      buyBtn.className = 'buy-btn';
      buyBtn.addEventListener('click', () => {
        const variantId = variant?.id?.split('/')?.pop();
        if (variantId) {
          const checkoutUrl = `https://${SHOPIFY_STORE_DOMAIN}/cart/${variantId}:1`;
          window.location.href = checkoutUrl;
        }
      });

      body.appendChild(buyBtn);
      li.appendChild(body);
      ul.appendChild(li);
    });

    block.appendChild(ul);
  } catch (err) {
    console.error('Shopify API Error:', err);
    loading.textContent = 'Failed to load products.';
  }
}

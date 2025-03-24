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
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    );

    const json = await response.json();
    loading.remove();

    const products =
      json?.data?.products?.edges?.map((edge) => edge.node) || [];

    if (products.length === 0) {
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
          new CustomEvent('add-to-cart', { detail: item })
        );
      });

      body.appendChild(addToCartBtn);
      li.appendChild(body);
      ul.appendChild(li);
    });

    block.appendChild(ul);
  } catch (err) {
    console.error('Shopify API Error:', err);
    loading.textContent = 'Failed to load products.';
  }
}

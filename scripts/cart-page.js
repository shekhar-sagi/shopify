import { getCart } from './cart-service.js';

const SHOPIFY_STORE_DOMAIN = 'y5kch8-7n.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '6964502587c1f9d114a7e3f93fd0a40b'; // 🔐 Consider using an environment variable
async function fetchCartDetails() {
  const CART_QUERY = `query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          lines(first: 5) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
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
      }`;

  const variables = {
    cartId: 'gid://shopify/Cart/NEW_CART_ID',
  };
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: CART_QUERY, variables }),
    },
  );

  const json = await response.json();
  return json?.data?.products?.edges?.map((edge) => edge.node) || [];
}

export async function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/orders.json`,
    {
      method: 'GET',
      // headers: {
      //   'X-Shopify-Access-Token': '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',
      //   mode: 'no-cors',
      //   'Content-Type': 'application/json',
      //   Accept: 'application/json',
      // },
    },
  );
  const json = await response.json();
  console.log(json);
  // window.location.href = checkoutUrl;
}

export default fetchCartDetails;

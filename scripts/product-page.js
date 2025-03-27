const SHOPIFY_STORE_DOMAIN = "y5kch8-7n.myshopify.com";
const SHOPIFY_ACCESS_TOKEN = "6964502587c1f9d114a7e3f93fd0a40b";

async function fetchShopifyProductById(productId) {
  const PRODUCT_QUERY = `
    query ($id: ID!) {
      product(id: $id) {
        id
        title
        descriptionHtml
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const variables = { id: productId };

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: PRODUCT_QUERY, variables }),
    }
  );

  const json = await response.json();
  return json?.data?.product || null;
}

export default fetchShopifyProductById;

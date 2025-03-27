const SHOPIFY_STORE_DOMAIN = "y5kch8-7n.myshopify.com";
const SHOPIFY_ACCESS_TOKEN = "6964502587c1f9d114a7e3f93fd0a40b";

const PRODUCTS_QUERY = `
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

async function fetchShopifyProducts() {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    }
  );

  const json = await response.json();
  return json?.data?.products?.edges?.map((edge) => edge.node) || [];
}

export default fetchShopifyProducts;

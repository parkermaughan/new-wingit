const gql = String.raw

/**
 * Sends a GraphQL query to the Shopify Storefront API.
 * @param {string} query - The GraphQL query string.
 * @param {object} variables - The variables for the GraphQL query.
 * @returns {object} - The response data from the Shopify Storefront API.
 */
export async function storeFront(query, variables = {}) {
  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token':
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESSTOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  }

  const response = await fetch(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN, options)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.errors ? data.errors[0].message : 'Error fetching data'
    )
  }

  return data
}

/**
 * Fetches all products.
 * @returns {array} - The list of all products.
 */
export async function getAllProducts() {
  const query = gql`
    {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 10) {
              edges {
                node {
                  transformedSrc
                  altText
                }
              }
            }
            tags
            options {
              name
              values
            }
            collections(first: 5) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      }
    }
  `

  const { data } = await storeFront(query)
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  return products
}

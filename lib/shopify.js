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

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
      options
    )
    const data = await response.json()

    // Log response details to help with debugging
    console.log('Response Status:', response.status)
    console.log('Response Data:', data)

    if (!response.ok) {
      throw new Error(
        `Error fetching products: ${response.status} ${
          data.errors ? data.errors[0].message : ''
        }`
      )
    }

    return data
  } catch (error) {
    console.error('Fetch error:', error.message)
    throw new Error('Error fetching products')
  }
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
                  url
                  altText
                }
              }
            }
            tags
            options {
              name
              values
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  image {
                    url
                  }
                  selectedOptions {
                    name
                    value
                  }
                  metafield(namespace: "custom", key: "variant_media") {
                    id
                    value
                    type
                  }
                }
              }
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

/**
 * Fetches a single product by its handle and related products.
 * @param {object} params - The parameters for the query.
 * @param {string} params.handle - The handle of the product.
 * @returns {object} - The product details and related products.
 */
export async function getSingleProductByHandleAndRelatedProducts({ handle }) {
  const query = gql`
    query getProductAndRelated($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        descriptionHtml
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
              url
              altText
            }
          }
        }
        tags
        variants(first: 10) {
          edges {
            node {
              id
              title
              image {
                url
              }
              selectedOptions {
                name
                value
              }
              metafield(namespace: "custom", key: "variant_media") {
                id
                value
                type
              }
            }
          }
        }
      }
      products(first: 10) {
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
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            tags
          }
        }
      }
    }
  `

  const variables = { handle }
  const { data } = await storeFront(query, variables)
  const productByHandle = data?.productByHandle ?? null
  const products = data?.products.edges.map((edge) => edge.node) ?? []

  // Fetch media images for each variant
  if (productByHandle) {
    for (const variant of productByHandle.variants.edges) {
      if (variant.node.metafield && variant.node.metafield.value) {
        const mediaIds = JSON.parse(variant.node.metafield.value)
        const mediaQuery = gql`
          query getMedia($ids: [ID!]!) {
            nodes(ids: $ids) {
              ... on MediaImage {
                id
                image {
                  url
                }
              }
            }
          }
        `
        const mediaData = await storeFront(mediaQuery, { ids: mediaIds })

        // Log media data for debugging
        console.log('Media Data:', mediaData)

        variant.node.media = mediaData.nodes
          ? mediaData.nodes
              .filter((node) => node !== null)
              .map((node) => node.image.url)
          : []
      }
    }
  }

  return { productByHandle, products }
}

/**
 * Creates a checkout for a given variant ID.
 * @param {string} variantId - The ID of the variant.
 * @returns {object} - The checkout response.
 */
export async function checkout(variantId) {
  const checkoutMutation = gql`
    mutation CheckoutCreate($variantId: ID!) {
      checkoutCreate(
        input: { lineItems: { variantId: $variantId, quantity: 1 } }
      ) {
        checkout {
          webUrl
        }
      }
    }
  `
  const response = await storeFront(checkoutMutation, { variantId: variantId })
  return response
}

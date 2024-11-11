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

const gql = String.raw

// Add this function to handle search queries
export async function searchProducts(query) {
  const searchQuery = gql`
    query Search($query: String!) {
      products(first: 10, query: $query) {
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
                  transformedSrc
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

  const variables = { query }
  const { data } = await storeFront(searchQuery, variables)
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  return products
}

// Define and export getAllProducts function
export async function getAllProducts() {
  const query = gql`
    {
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
          }
        }
      }
    }
  `

  const { data } = await storeFront(query)
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  return products
}
// Define and export getAllProductHandles function
export async function getAllProductHandles() {
  const query = gql`
    {
      products(first: 10) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `

  const { data } = await storeFront(query)
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  return products
}

// Define and export getSingleProductByHandleAndRelatedProducts function
export async function getSingleProductByHandleAndRelatedProducts({ handle }) {
  const query = gql`
    query getProductAndRelated($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 10) {  // Fetch up to 10 images for the single product
          edges {
            node {
              transformedSrc
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
              selectedOptions {
                name
                value
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
                  transformedSrc
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
  return { productByHandle, products }
}

// Define a template literal tag function for GraphQL queries
const gql = String.raw

// Define and export the storeFront function to make requests to the Shopify Storefront API
export async function storeFront(query, variables = {}) {
  // Set up the options for the fetch request
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
    // Make the fetch request to the Shopify Storefront API
    const response = await fetch(
      process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
      options
    )
    const data = await response.json()

    // Log the response to verify the data
    console.log('Shopify response:', data)

    // Check if the response is not OK and throw an error if necessary
    if (!response.ok) {
      throw new Error(
        `Error fetching products: ${response.status} ${
          data.errors ? data.errors[0].message : ''
        }`
      )
    }

    // Return the data from the response
    return data
  } catch (error) {
    // Log and throw an error if the fetch request fails
    console.error('Fetch error:', error.message)
    throw new Error('Error fetching products')
  }
}

// Define and export the getSingleProductByHandleAndRelatedProducts function to fetch a single product and related products by handle
export async function getSingleProductByHandleAndRelatedProducts({ handle }) {
  // Define the GraphQL query to fetch the product and related products
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
        images(first: 20) {
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
              image {
                transformedSrc
                altText
              }
              selectedOptions {
                name
                value
              }
              metafields(
                identifiers: [
                  { namespace: "global", key: "variant_images_grouping_list" }
                ]
              ) {
                key
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

  // Define the variables for the GraphQL query
  const variables = { handle }
  // Make the request to the Shopify Storefront API using the storeFront function
  const { data } = await storeFront(query, variables)

  // Log the response to verify the data
  console.log('Fetched product and related products:', data)

  // Extract the productByHandle and products from the response data
  const productByHandle = data?.productByHandle ?? null
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  // Return the productByHandle and products
  return { productByHandle, products }
}

// Define and export the getAllProducts function to fetch all products
export async function getAllProducts() {
  // Define the GraphQL query to fetch all products
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

  // Make the request to the Shopify Storefront API using the storeFront function
  const { data } = await storeFront(query)
  // Extract the products from the response data
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  // Return the products
  return products
}

// Define and export the getAllProductHandles function to fetch all product handles
export async function getAllProductHandles() {
  // Define the GraphQL query to fetch all product handles
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

  // Make the request to the Shopify Storefront API using the storeFront function
  const { data } = await storeFront(query)

  // Log the response to verify the data
  console.log('Fetched product handles:', data)

  // Extract the products from the response data
  const products = data?.products.edges.map((edge) => edge.node) ?? []
  // Return the products
  return products
}

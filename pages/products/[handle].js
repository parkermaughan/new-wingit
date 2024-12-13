import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  getAllProducts,
  getSingleProductByHandleAndRelatedProducts,
} from '@/lib/shopify'
import ProductForm from '@/components/Product/ProductForm'
import styles from '@/components/Product/ProductForm.module.css' // Import the CSS module

// Fetch all product handles to generate static paths
export async function getStaticPaths() {
  const products = await getAllProducts()
  const paths = products.map((product) => ({
    params: { handle: product.handle },
  }))

  return {
    paths,
    fallback: false, // Any paths not returned by getStaticPaths will result in a 404 page
  }
}

// Fetch product data based on the handle
export async function getStaticProps({ params }) {
  const { productByHandle, products } =
    await getSingleProductByHandleAndRelatedProducts({
      handle: params.handle,
    })

  if (!productByHandle) {
    return {
      notFound: true, // Return 404 page if product is not found
    }
  }

  // Log the product data for debugging
  console.log('Product Data:', productByHandle)

  return {
    props: {
      product: productByHandle,
      relatedProducts: products,
    },
  }
}

// Main component to display the product page
const ProductPage = ({ product }) => {
  const router = useRouter()
  const [featuredImage, setFeaturedImage] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)

  // Set the initial featured image
  useEffect(() => {
    if (product?.images?.edges?.length > 0) {
      setFeaturedImage(product.images.edges[0].node.url)
    }
  }, [product])

  // Set the initial selected variant
  useEffect(() => {
    if (product?.variants?.edges?.length > 0) {
      setSelectedVariant(product.variants.edges[0].node)
    }
  }, [product])

  // Show loading state if the page is in fallback mode
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Show 404 message if the product is not found
  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductForm
        product={product}
        featuredImage={featuredImage}
        setFeaturedImage={setFeaturedImage}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
      />
    </div>
  )
}

export default ProductPage

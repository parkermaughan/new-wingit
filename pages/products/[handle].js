import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  getAllProducts,
  getSingleProductByHandleAndRelatedProducts,
} from '@/lib/shopify'
import ProductForm from '@/components/Product/ProductForm'
import Image from 'next/image'
import { formatPrice } from '@/utils/index'
import styles from '@/components/Product/ProductForm.module.css' // Import the CSS module

export async function getStaticPaths() {
  const products = await getAllProducts()
  const paths = products.map((product) => ({
    params: { handle: product.handle },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { productByHandle, products } =
    await getSingleProductByHandleAndRelatedProducts({
      handle: params.handle,
    })

  if (!productByHandle) {
    return {
      notFound: true,
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

const ProductPage = ({ product }) => {
  const router = useRouter()
  const [featuredImage, setFeaturedImage] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    if (product?.images?.edges?.length > 0) {
      setFeaturedImage(product.images.edges[0].node.url)
    }
  }, [product])

  useEffect(() => {
    if (product?.variants?.edges?.length > 0) {
      setSelectedVariant(product.variants.edges[0].node)
    }
  }, [product])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const {
    title,
    descriptionHtml,
    images,
    priceRange,
    compareAtPriceRange,
    tags,
  } = product

  const price = formatPrice(priceRange.minVariantPrice.amount)
  const originalPrice = compareAtPriceRange?.minVariantPrice?.amount
    ? formatPrice(compareAtPriceRange.minVariantPrice.amount)
    : null
  const hasSale =
    originalPrice &&
    compareAtPriceRange.minVariantPrice.amount >
      priceRange.minVariantPrice.amount
  const savings = hasSale
    ? (
        ((compareAtPriceRange.minVariantPrice.amount -
          priceRange.minVariantPrice.amount) /
          compareAtPriceRange.minVariantPrice.amount) *
        100
      ).toFixed(2)
    : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`grid grid-cols-24 gap-4 items-start ${styles.gridTemplate}`}
      >
        {/* Thumbnails */}
        <div className="space-y-4 col-span-2">
          {images.edges.map(({ node }) => (
            <div
              key={node.url}
              className={`relative cursor-pointer ${styles.thumbnail}`}
              onClick={() => {
                setFeaturedImage(node.url)
                const selectedVariant = product.variants.edges.find(
                  (variant) => variant.node.image?.url === node.url
                )?.node
                if (selectedVariant) {
                  setSelectedVariant(selectedVariant)
                }
              }}
            >
              {node.url ? (
                <Image
                  src={node.url}
                  alt={node.altText ?? 'Product Thumbnail'}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded"></div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-full col-span-11">
          {featuredImage && (
            <Image
              src={featuredImage}
              alt="Featured Image"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          )}
        </div>

        {/* Product Description */}
        <div className="col-span-11">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
          <div className="mb-4">
            <p className="text-2xl font-semibold">{price}</p>
            {hasSale && (
              <>
                <p className="text-xl line-through text-gray-500">
                  {originalPrice}
                </p>
                <p className="text-xl text-red-500">{savings}% off</p>
              </>
            )}
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">{tags.join(', ')}</p>
          </div>
          <ProductForm
            product={product}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductPage

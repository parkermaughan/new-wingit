import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { checkout } from '@/lib/shopify'
import { formatPrice, getAllVariantOptions } from '@/utils/index'
import ProductOptions from './ProductOptions'

// Component to display the product form
function ProductForm({
  product,
  featuredImage,
  setFeaturedImage,
  selectedVariant,
  setSelectedVariant,
}) {
  const [isLoading, setIsLoading] = useState(false) // State to manage the loading state

  const {
    title,
    images,
    descriptionHtml,
    priceRange,
    compareAtPriceRange,
    tags,
  } = product // Destructure product details
  const image = images.edges[0]?.node // Get the first image of the product

  // Log the image data to verify the data
  console.log('Product Image:', image)

  const allVariantOptions = getAllVariantOptions(product) // Get all variant options of the product

  // Set the initial selected variant
  useEffect(() => {
    if (allVariantOptions.length > 0 && !selectedVariant) {
      setSelectedVariant(allVariantOptions[0])
    }
  }, [allVariantOptions, selectedVariant])

  // Function to handle the checkout process
  async function onCheckout() {
    setIsLoading(true)
    const { data } = await checkout(selectedVariant.id)
    const { webUrl } = data.checkoutCreate.checkout
    window.location.href = webUrl
  }

  // Function to handle color selection
  const handleColorSelection = (variant) => {
    setSelectedVariant(variant)
    if (variant.image?.url) {
      setFeaturedImage(variant.image.url)
    }
  }

  // Format the price and calculate savings if the product is on sale
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
    <div>
      <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-16">
        <div className="lg:col-span-4 flex">
          <div className="space-y-4 mr-4">
            {images.edges.map(({ node }) => (
              <div
                key={node.url}
                className="relative cursor-pointer w-20 h-20"
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
          <div className="overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1 flex-grow">
            {featuredImage ? (
              <Image
                src={featuredImage}
                className="object-cover object-center"
                alt={image.altText ?? 'Product Image'}
                layout="fill"
              />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </div>
        </div>
        <div className="mt-14 sm:mt-16 lg:mt-0 lg:col-span-3">
          <div className="flex flex-col-reverse">
            <div>
              <p className="mt-4 text-3xl text-gray-900">{price}</p>
              {hasSale && (
                <>
                  <p className="text-xl line-through text-gray-500">
                    {originalPrice}
                  </p>
                  <p className="text-xl text-red-500">{savings}% off</p>
                </>
              )}
            </div>
          </div>
          <div
            className="mt-6 text-gray-500"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
          <div className="mb-4">
            <p className="text-sm text-gray-600">{tags.join(', ')}</p>
          </div>
          <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-4">
            <div className="mt-8">
              {product.variants.edges && (
                <ProductOptions
                  variants={product.variants.edges.map((edge) => edge.node)}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={handleColorSelection} // Use the handleColorSelection function
                />
              )}
            </div>
          </div>
          <Button onClick={onCheckout} selectedVariant={selectedVariant}>
            {isLoading && <Spinner />}
            Buy now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductForm

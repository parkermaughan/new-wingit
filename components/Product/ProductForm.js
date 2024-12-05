import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import styles from '@/components/Product/ProductForm.module.css'
import Spinner from '@/components/Spinner'
import { checkout } from '@/lib/shopify'
import { formatPrice, getAllVariantOptions } from '@/utils/index'
import ProductOptions from './ProductOptions'

function ProductForm({ product, featuredImage, setFeaturedImage }) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { title, images, description, variants } = product
  const allVariantOptions = getAllVariantOptions(product)

  // Ensure variants is defined
  const variantEdges = variants?.edges || []

  // Log the product data and variants for debugging
  console.log('Product Data:', product)
  console.log('Variants:', variantEdges)

  // Find the color options from the product variants
  const colorOptions = variantEdges.map(({ node }) => {
    const metafields = {
      variant_media: node.metafield?.value || '',
    }

    // Log the metafields for debugging
    console.log('Metafields:', metafields)

    return {
      id: node.id,
      title: node.selectedOptions.find(
        (option) => option.name.toLowerCase() === 'color'
      ).value,
      image: node.image?.url || null, // Fetch the image URL associated with each variant
      media: node.media || [], // Fetch the media images
    }
  })

  // Log the color options for debugging
  console.log('Color Options:', colorOptions)

  useEffect(() => {
    if (colorOptions.length > 0 && !selectedVariant) {
      setSelectedVariant(colorOptions[0])
    }
  }, [colorOptions, selectedVariant])

  useEffect(() => {
    if (selectedVariant && selectedVariant.image) {
      setFeaturedImage(selectedVariant.image)
    }
  }, [selectedVariant, setFeaturedImage])

  async function onCheckout() {
    setIsLoading(true)
    const { data } = await checkout(selectedVariant.id)
    const { webUrl } = data.checkoutCreate.checkout
    window.location.href = webUrl
  }

  return (
    <div>
      <div className="flex space-x-2 mt-4">
        {images.edges.map(({ node }) => (
          <div
            key={node.url}
            className={`relative w-15 h-15 cursor-pointer ${styles.thumbnail}`}
            onClick={() => {
              setFeaturedImage(node.url)
              const selectedVariant = colorOptions.find(
                (variant) => variant.image === node.url
              )
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
      <div className="mt-14 sm:mt-16 lg:mt-0">
        <div className="flex flex-col-reverse">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-loose sm:text-3xl">
              {title}
            </h1>
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>
            <p className="mt-4 text-3xl text-gray-900">
              {formatPrice(product.priceRange.minVariantPrice.amount)}
            </p>
          </div>
        </div>
        <p className="mt-6 text-gray-500">{description}</p>
        <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-4">
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <a
                href="#"
                className="text-sm font-medium text-gray-500 hover:text-gray-400"
              >
                Color guide
              </a>
            </div>
            {colorOptions.length > 0 && (
              <ProductOptions
                selectedSize={selectedVariant}
                setSelectedSize={setSelectedVariant}
                sizes={colorOptions}
              />
            )}
          </div>
        </div>
        <Button onClick={onCheckout} selectedVariant={selectedVariant}>
          {isLoading && <Spinner />}
          Buy now
        </Button>
        {selectedVariant && (
          <div className="mt-4">
            {selectedVariant.media.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedVariant.media.map((media, index) => (
                    <div key={index} className="relative w-full h-48">
                      {media ? (
                        <Image
                          src={media}
                          alt={`Media ${index + 1}`}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductForm

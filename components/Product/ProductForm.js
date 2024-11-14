import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { checkout } from '@/lib/shopify'
import { formatPrice, getAllVariantOptions } from '@/utils/index'
import ProductOptions from '@/components/Product/ProductOptions'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from './ProductForm.module.css'

function ProductForm({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [featuredImage, setFeaturedImage] = useState(
    product.images.edges[0]?.node
  )
  const [selectedColor, setSelectedColor] = useState(null)
  const [thumbnails, setThumbnails] = useState(product.images.edges)
  const [inProp, setInProp] = useState(true)

  const {
    title,
    images,
    description,
    priceRange,
    compareAtPriceRange,
    variants,
    metafields,
  } = product
  const allVariantOptions = getAllVariantOptions(product)

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

  // Log the variants to verify the data
  console.log('Variants:', variants)

  const colors = variants?.edges
    ?.map((variant) =>
      variant.node.selectedOptions.find(
        (option) => option.name.toLowerCase() === 'color'
      )
    )
    .filter(Boolean)
    .map((option) => option.value)

  useEffect(() => {
    if (selectedColor) {
      const colorVariant = variants.edges.find((variant) =>
        variant.node.selectedOptions.some(
          (option) =>
            option.name.toLowerCase() === 'color' &&
            option.value === selectedColor
        )
      )

      if (colorVariant) {
        const metafield = colorVariant.node.metafields?.find(
          (field) => field?.key === 'variant_images_grouping_list'
        )

        if (metafield) {
          const imageUrls = JSON.parse(metafield.value)
          const newThumbnails = imageUrls.map((url, index) => ({
            node: {
              transformedSrc: url,
              altText: `Thumbnail ${index + 1}`,
            },
          }))

          setInProp(false)
          setFeaturedImage(
            newThumbnails[0]?.node || product.images.edges[0]?.node
          )
          setThumbnails(
            newThumbnails.length > 0 ? newThumbnails : product.images.edges
          )
          setSelectedVariant(colorVariant.node)
          setInProp(true)
        } else {
          setInProp(false)
          setFeaturedImage(colorVariant.node.image)
          setThumbnails(product.images.edges)
          setSelectedVariant(colorVariant.node)
          setInProp(true)
        }
      }
    }
  }, [selectedColor, variants.edges, product.images.edges])

  async function onCheckout() {
    setIsLoading(true)
    const { data } = await checkout(selectedVariant.id)
    const { webUrl } = data.checkoutCreate
    window.location.href = webUrl
  }

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-xl w-full px-4 lg:px-8">
        <div className="lg:flex lg:space-x-8 xl:space-x-16">
          <div className="flex flex-col space-y-2">
            {thumbnails.map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => setFeaturedImage(image.node)}
              >
                <Image
                  src={image.node.transformedSrc}
                  alt={image.node.altText ?? 'Thumbnail Image'}
                  className="object-cover object-center w-full h-full"
                  layout="fill"
                />
              </div>
            ))}
          </div>
          <div className="flex-1">
            <SwitchTransition>
              <CSSTransition
                key={featuredImage.transformedSrc}
                timeout={200}
                classNames={{
                  enter: styles['fade-enter'],
                  enterActive: styles['fade-enter-active'],
                  exit: styles['fade-exit'],
                  exitActive: styles['fade-exit-active'],
                }}
              >
                <div className="overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1">
                  {featuredImage && (
                    <Image
                      src={featuredImage.transformedSrc}
                      className="object-cover object-center"
                      alt={featuredImage.altText ?? 'Product Image'}
                      layout="fill"
                    />
                  )}
                </div>
              </CSSTransition>
            </SwitchTransition>
          </div>
          <div className="flex-1 mt-14 sm:mt-16 lg:mt-0">
            <div className="flex flex-col-reverse">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-loose sm:text-3xl">
                  {title}
                </h1>
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>
                <p className="mt-4 text-3xl text-gray-900">
                  {price}
                  {originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {originalPrice}
                    </span>
                  )}
                  {savings && (
                    <span className="ml-2 text-sm text-green-500">
                      {savings}% off
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="mt-6 text-gray-500">{description}</p>
            <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-4">
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-500 hover:text-gray-400"
                  >
                    Size guide
                  </a>
                </div>
                <ProductOptions
                  selectedSize={selectedVariant}
                  setSelectedSize={setSelectedVariant}
                  sizes={allVariantOptions}
                />
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                <div className="flex space-x-2 mt-2">
                  {colors.map((color, index) => (
                    <span
                      key={index}
                      className={`w-6 h-6 rounded-full border border-gray-300 cursor-pointer ${
                        selectedColor === color ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></span>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">
                  Variant Images Grouping List
                </h3>
                <div className="mt-2">
                  {metafields
                    ?.filter(
                      (metafield) =>
                        metafield?.key === 'variant_images_grouping_list'
                    )
                    .map((metafield, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        <strong>{metafield.key}:</strong> {metafield.value}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <Button onClick={onCheckout} selectedVariant={selectedVariant}>
              {isLoading && <Spinner />}
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductForm

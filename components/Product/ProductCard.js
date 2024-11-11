import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/utils/index'
import styles from './ProductCard.module.css' // Import custom styles

function ProductCard({ product }) {
  const { handle, title, images, tags } = product
  const [mainImage, setMainImage] = useState(images?.edges?.[0]?.node)
  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const originalPrice = product.compareAtPriceRange?.maxVariantPrice?.amount
    ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
    : null
  const savingsPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  // Log the product data to verify
  console.log('Product data:', product)

  return (
    <Link href={`/products/${handle}`}>
      <a className="group">
        <div className="border">
          <div className="relative w-full overflow-hidden aspect-w-1 aspect-h-1 md:aspect-w-1 md:aspect-h-1">
            {mainImage && (
              <Image
                src={mainImage.transformedSrc}
                alt={mainImage.altText ?? 'Product Image'}
                className="object-cover object-center w-full h-full group-hover:opacity-75"
                layout="fill"
                priority
              />
            )}
          </div>
          <div className="m-4">
            <h3 className="mt-1 text-sm font-bold text-gray-700 uppercase">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 uppercase">
              {tags?.[0] ?? 'No tag'}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-700">{formatPrice(price)}</p>
              {originalPrice && originalPrice > price && (
                <p className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </p>
              )}
            </div>
            {savingsPercentage && (
              <p className="mt-1 text-sm text-green-500">
                {savingsPercentage}% off
              </p>
            )}
          </div>
          <div
            className={`flex justify-center mt-2 space-x-2 ${styles.thumbnailContainer}`}
          >
            {images?.edges?.slice(1).map(({ node }) => (
              <div
                key={node.id}
                className={`relative w-16 h-16 overflow-hidden ${styles.thumbnail}`}
                onMouseEnter={() => setMainImage(node)}
                onMouseLeave={() => setMainImage(images?.edges?.[0]?.node)}
              >
                <Image
                  src={node.transformedSrc}
                  alt={node.altText ?? 'Thumbnail Image'}
                  className="object-cover object-center w-full h-full"
                  layout="fill"
                />
              </div>
            ))}
          </div>
        </div>
      </a>
    </Link>
  )
}

export default ProductCard

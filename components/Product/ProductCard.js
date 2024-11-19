import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/utils/index'
import styles from './ProductCard.module.css' // Assuming you have a CSS module file

function ProductCard({ product }) {
  const { handle, title, images, tags, priceRange, compareAtPriceRange } =
    product
  const originalImage = images?.edges?.[0]?.node
  const [featuredImage, setFeaturedImage] = useState(originalImage)
  const [hoveredImage, setHoveredImage] = useState(null)
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

  const handleMouseEnter = (node) => {
    setHoveredImage(node)
  }

  const handleMouseLeave = () => {
    setHoveredImage(null)
  }

  return (
    <Link href={`/products/${handle}`}>
      <a className={`group relative ${styles.productHover}`}>
        <div className={styles.productContainer}>
          <div
            className={`relative w-full overflow-hidden ${styles.productImageWrapper}`}
          >
            {featuredImage && (
              <Image
                src={featuredImage.transformedSrc}
                alt={featuredImage.altText ?? 'Product Image'}
                className={`object-cover object-center w-full h-full ${
                  hoveredImage ? styles.fadeOut : styles.fadeIn
                }`}
                layout="fill"
                priority
              />
            )}
            {hoveredImage && (
              <Image
                src={hoveredImage.transformedSrc}
                alt={hoveredImage.altText ?? 'Thumbnail Image'}
                className={`object-cover object-center w-full h-full ${styles.fadeIn}`}
                layout="fill"
                priority
              />
            )}
          </div>
          <div className={`m-4 ${styles.productInfo}`}>
            <div className={`${styles.thumbnailDropdown}`}>
              {images?.edges?.slice(1, 4)?.map(({ node }, index) => (
                <div
                  key={`${node.id}-${index}`} // Ensure each key is unique
                  className={`relative ${styles.thumbnail}`}
                  onMouseEnter={() => handleMouseEnter(node)}
                  onMouseLeave={handleMouseLeave}
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
            <h3
              className={`mt-1 text-sm font-bold text-gray-700 uppercase ${styles.title}`}
            >
              {title}
            </h3>
            <p className={`mt-1 text-sm text-gray-500 uppercase ${styles.tag}`}>
              {tags?.[0] ?? 'No tag'}
            </p>
            <div className="flex flex-col mt-1">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">{price}</p>
                {hasSale && (
                  <>
                    <p className="ml-2 text-sm text-gray-500 line-through">
                      {originalPrice}
                    </p>
                  </>
                )}
              </div>
              {hasSale && (
                <p className="text-sm text-green-500">{savings}% off</p>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default ProductCard

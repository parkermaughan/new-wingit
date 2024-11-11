import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/utils/index'
import styles from './ProductCard.module.css' // Assuming you have a CSS module file

function ProductCard({ product }) {
  const { handle, title, images, tags, priceRange, compareAtPriceRange } =
    product
  const [featuredImage, setFeaturedImage] = useState(images?.edges?.[0]?.node)
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
    <Link href={`/products/${handle}`}>
      <a className="group">
        <div className="bg-gray-100 border">
          <div
            className={`relative w-full overflow-hidden bg-gray-400 aspect-w-1 aspect-h-1 md:aspect-w-2 md:aspect-h-3 ${styles.productImage}`}
          >
            {featuredImage && (
              <Image
                src={featuredImage.transformedSrc}
                alt={featuredImage.altText ?? 'Product Image'}
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
              <p className="text-sm text-gray-700">{price}</p>
              {hasSale && (
                <>
                  <p className="ml-2 text-sm text-gray-500 line-through">
                    {originalPrice}
                  </p>
                  <p className="ml-2 text-sm text-green-500">{savings}% off</p>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-2 space-x-2">
            {images?.edges?.slice(1, 4)?.map(({ node }, index) => (
              <div
                key={`${node.id}-${index}`} // Ensure each key is unique
                className="relative w-12 h-12 overflow-hidden bg-gray-200"
                onMouseEnter={() => setFeaturedImage(node)}
                onMouseLeave={() => setFeaturedImage(images?.edges?.[0]?.node)}
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

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import styles from './ProductList.module.css'

const ProductList = ({ products, label }) => {
  const [visibleProducts, setVisibleProducts] = useState(products)
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    setAnimationClass('fade-out')
    const timeout = setTimeout(() => {
      setVisibleProducts(products)
      setAnimationClass('fade-in')
    }, 500)

    return () => clearTimeout(timeout)
  }, [products])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{label}</h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${styles.productGrid}`}
      >
        {visibleProducts.map((product) => (
          <div key={product.id} className={animationClass}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList

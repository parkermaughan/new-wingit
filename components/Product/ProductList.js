import React from 'react'
import ProductCard from './ProductCard'

const ProductList = ({ products, label }) => {
  return (
    <div>
      <h2>{label}</h2>
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList

import { useState } from 'react'
import { NextSeo } from 'next-seo'
import { getAllProducts } from '@/lib/shopify'
import ProductList from '@/components/Product/ProductList'
import Filter from '@/components/Filter/Filter'
import Sort from '@/components/Sort/Sort'

export async function getStaticProps() {
  const products = await getAllProducts()

  // Extract unique categories from products
  const categories = [
    ...new Set(products.map((product) => product.tags).flat()),
  ]

  return {
    props: {
      products,
      categories,
    },
    revalidate: 10,
  }
}

const ShopPage = ({ products, categories }) => {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [showFilters, setShowFilters] = useState(true)

  const handleFilterChange = ({ categories, brands, colors, prices }) => {
    let filtered = products

    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.some((category) => product.tags.includes(category))
      )
    }

    if (brands.length > 0) {
      filtered = filtered.filter((product) =>
        brands.some((brand) => product.tags.includes(brand))
      )
    }

    if (colors.length > 0) {
      filtered = filtered.filter((product) =>
        colors.some((color) => product.tags.includes(color))
      )
    }

    if (prices.length > 0) {
      filtered = filtered.filter((product) =>
        prices.some((price) => {
          const [min, max] = price.split('-').map(Number)
          return (
            product.priceRange.minVariantPrice.amount >= min &&
            product.priceRange.minVariantPrice.amount <= max
          )
        })
      )
    }

    setFilteredProducts(filtered)
  }

  const handleSortChange = (sortOption) => {
    let sortedProducts = [...filteredProducts]
    switch (sortOption) {
      case 'newest':
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        break
      case 'price-low-high':
        sortedProducts.sort(
          (a, b) =>
            a.priceRange.minVariantPrice.amount -
            b.priceRange.minVariantPrice.amount
        )
        break
      case 'price-high-low':
        sortedProducts.sort(
          (a, b) =>
            b.priceRange.minVariantPrice.amount -
            a.priceRange.minVariantPrice.amount
        )
        break
      default:
        // Featured or default sorting logic
        break
    }
    setFilteredProducts(sortedProducts)
  }

  return (
    <>
      <NextSeo title="Shop" description="Browse our collection of products" />
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border p-2 rounded mr-4"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <Sort onSortChange={handleSortChange} />
          </div>
        </div>
        <div className="flex">
          {showFilters && (
            <div className="w-1/4 pr-4">
              <Filter
                categories={categories}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
          <div className={`w-full ${showFilters ? 'w-3/4' : 'w-full'}`}>
            <ProductList products={filteredProducts} label="All Products" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopPage

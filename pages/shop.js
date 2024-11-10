import { useState, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { getAllProducts } from '@/lib/shopify'
import ProductList from '@/components/Product/ProductList'
import Filter from '@/components/Filter/Filter'
import Sort from '@/components/Sort/Sort'
import styles from '@/components/Filter/Filter.module.css'

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
  const [filterMove, setFilterMove] = useState(false)

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

  useEffect(() => {
    if (!showFilters) {
      setFilterMove(true)
    } else {
      setFilterMove(false)
    }
  }, [showFilters])

  return (
    <>
      <NextSeo title="Shop" description="Browse our collection of products" />
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border p-2 rounded mr-4 flex items-center"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              <svg
                aria-hidden="true"
                className="icon-filter-ds ml-2"
                focusable="false"
                viewBox="0 0 24 24"
                role="img"
                width="24px"
                height="24px"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M21 8.25H10m-5.25 0H3"
                ></path>
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                  clipRule="evenodd"
                ></path>
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M3 15.75h10.75m5 0H21"
                ></path>
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <Sort onSortChange={handleSortChange} />
          </div>
        </div>
        <div className="flex">
          <div
            className={`${styles.filterContainer} ${
              showFilters ? '' : styles.filterMove
            } ${filterMove ? styles.filterMove : ''}`}
          >
            <Filter
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div
            className={`${styles.mainContent} ${
              showFilters ? '' : styles.expanded
            }`}
          >
            <ProductList products={filteredProducts} label="All Products" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopPage

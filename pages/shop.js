import { useState, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { getAllProducts } from '@/lib/shopify'
import ProductList from '@/components/Product/ProductList'
import Filter from '@/components/Filter/Filter'
import Sort from '@/components/Sort/Sort'
import styles from '@/components/Filter/Filter.module.css'

export async function getStaticProps() {
  const products = await getAllProducts()

  // Log the products to verify the data
  console.log('Fetched products:', products)

  // Extract unique collections from products
  const collections = [
    ...new Set(
      products.flatMap((product) =>
        product.collections.edges.map((edge) => edge.node.title)
      )
    ),
  ]

  // Extract unique brands from products
  const brands = [...new Set(products.map((product) => product.tags).flat())]

  // Extract unique colors from products
  const colors = [
    ...new Set(
      products.flatMap((product) =>
        product.options
          .filter((option) => option.name.toLowerCase() === 'color')
          .flatMap((option) => option.values)
      )
    ),
  ]

  return {
    props: {
      products,
      collections,
      brands,
      colors,
    },
    revalidate: 10,
  }
}

const ShopPage = ({ products, collections, brands, colors }) => {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [showFilters, setShowFilters] = useState(false)
  const [filterMove, setFilterMove] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleFilterChange = (newFilters) => {
    console.log('Applied Filters:', newFilters)
    let filtered = products

    if (newFilters.collections && newFilters.collections.length > 0) {
      console.log('Filtering by collections:', newFilters.collections)
      filtered = filtered.filter((product) =>
        newFilters.collections.some((collection) =>
          product.collections.edges.some((edge) =>
            edge.node.title.includes(collection)
          )
        )
      )
    }

    if (newFilters.brands && newFilters.brands.length > 0) {
      console.log('Filtering by brands:', newFilters.brands)
      filtered = filtered.filter((product) =>
        newFilters.brands.some((brand) => product.tags.includes(brand))
      )
    }

    if (newFilters.colors && newFilters.colors.length > 0) {
      console.log('Filtering by colors:', newFilters.colors)
      filtered = filtered.filter((product) =>
        newFilters.colors.some((color) =>
          product.options
            .filter((option) => option.name.toLowerCase() === 'color')
            .flatMap((option) => option.values)
            .includes(color)
        )
      )
    }

    if (newFilters.prices && newFilters.prices.length > 0) {
      console.log('Filtering by prices:', newFilters.prices)
      filtered = filtered.filter((product) =>
        newFilters.prices.some((price) => {
          const [min, max] = price.split('-').map(Number)
          return (
            product.priceRange.minVariantPrice.amount >= min &&
            product.priceRange.minVariantPrice.amount <= max
          )
        })
      )
    }

    console.log('Filtered Products:', filtered)
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

  const handleApplyFilters = (filters) => {
    setShowFilters(false)
    handleFilterChange(filters)
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
          {isMobile && showFilters && (
            <div className={`${styles.filterOverlay}`}>
              <div className={styles.filterContent}>
                <Filter
                  collections={collections}
                  brands={brands}
                  colors={colors}
                  onFilterChange={handleFilterChange}
                  onApplyFilters={handleApplyFilters}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}
          {!isMobile && (
            <div
              className={`${styles.filterContainer} ${
                showFilters ? '' : styles.filterMove
              } ${filterMove ? styles.filterMove : ''}`}
            >
              <Filter
                collections={collections}
                brands={brands}
                colors={colors}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
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

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash.debounce'
import styles from './SearchBar.module.css'
import { searchProducts } from '../../lib/shopify'

const SearchBar = ({ width = '24px', height = '24px', color = '#000000' }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const router = useRouter()

  const fetchSearchResults = useCallback(async (searchTerm) => {
    if (!searchTerm) return

    try {
      const products = await searchProducts(searchTerm)
      setResults(products)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }, [])

  useEffect(() => {
    const debouncedFetchSearchResults = debounce((searchTerm) => {
      fetchSearchResults(searchTerm)
    }, 300)

    if (query.length > 1) {
      debouncedFetchSearchResults(query)
    } else {
      setResults([])
    }

    return () => debouncedFetchSearchResults.cancel()
  }, [query, fetchSearchResults])

  const handleSearchChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (results.length === 1) {
      router.push(`/products/${results[0].handle}`)
    } else {
      router.push(`/search?query=${encodeURIComponent(query)}`)
    }
    setQuery('')
    setIsOpen(false)
  }

  const handleResultClick = (handle) => {
    router.push(`/products/${handle}`)
    handleClose()
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setActiveIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleResultClick(results[activeIndex].handle)
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div className="relative">
      <svg
        onClick={() => setIsOpen((prev) => !prev)}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.searchIcon} cursor-pointer`}
      >
        <g clipPath="url(#clip0_15_152)">
          <rect width="24" height="24" fill="white" />
          <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            stroke={color}
            strokeLinejoin="round"
          />
          <path
            d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_15_152">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div
        className={`fixed top-0 left-0 right-0 bg-white z-50 p-4 shadow-lg flex items-center justify-center transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full items-center"
        >
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-1/4 border rounded-l-lg p-2"
          />
          <button type="submit" className="hidden">
            Search
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="ml-2 px-3 bg-gray-300 rounded-r-lg"
          >
            X
          </button>
        </form>

        {query && results && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-md mt-2">
            {results.map((product, index) => (
              <div
                key={product.id}
                className={`p-2 cursor-pointer ${
                  index === activeIndex ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleResultClick(product.handle)}
              >
                {product.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar

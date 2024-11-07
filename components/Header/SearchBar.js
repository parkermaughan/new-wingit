import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash.debounce'
import { searchProducts, getAllProducts } from '@/lib/shopify'
import Image from 'next/image'
import styles from './SearchBar.module.css'

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

  const fetchInitialProducts = useCallback(async () => {
    try {
      const products = await getAllProducts()
      setResults(products.slice(0, 5)) // Show the first 5 products
    } catch (error) {
      console.error('Error fetching initial products:', error)
    }
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      const debouncedFetchSearchResults = debounce((searchTerm) => {
        fetchSearchResults(searchTerm)
      }, 300)
      debouncedFetchSearchResults(query)
      return () => debouncedFetchSearchResults.cancel()
    } else {
      fetchInitialProducts()
    }
  }, [query, fetchSearchResults, fetchInitialProducts])

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

  const handleClearSearch = () => {
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
    <div className={`relative flex justify-center items-center`}>
      <div className={`w-full max-w-2xl`}>
        <div className={`flex justify-center items-center`}>
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
        </div>

        <div
          className={`fixed top-0 left-0 right-0 bg-white z-50 p-4 shadow-lg flex items-center justify-center transition-transform duration-300 transform ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          } ${styles.searchModal}`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className={`flex w-full items-center justify-center relative ${styles.search} ${styles.search_modal__form}`}
          >
            <div className={`${styles.field}`}>
              <input
                className={`${styles.search__input} ${styles.field__input}`}
                id="Search-In-Modal"
                type="search"
                name="q"
                value={query}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                role="combobox"
                aria-expanded="true"
                aria-owns="predictive-search-results"
                aria-controls="predictive-search-results"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                autoCorrect="off"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-activedescendant=""
              />
              <label
                className={`${styles.field__label}`}
                htmlFor="Search-In-Modal"
              >
                Search
              </label>
              <input
                type="hidden"
                name="options[prefix]"
                value="last"
                className={`${styles.input__field} ${styles.inputField}`}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={`${styles.reset__button} ${styles.field__button}`}
                  aria-label="Clear search term"
                >
                  <span className={`${styles.svg_wrapper}`}>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      className={`icon icon-close ${styles.iconClose}`}
                      viewBox="0 0 18 18"
                    >
                      <circle cx="9" cy="9" r="8.5" strokeOpacity=".2"></circle>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.83 11.83 6.172 6.17M6.229 11.885l5.544-5.77"
                      ></path>
                    </svg>
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className={`${styles.search__button} ${styles.field__button}`}
                aria-label="Search"
                style={{
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <span className={`${styles.svg_wrapper}`}>
                  <svg
                    fill="none"
                    className={`icon icon-search ${styles.icon} ${styles.icon_search}`}
                    viewBox="0 0 18 19"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M11.03 11.68A5.784 5.784 0 1 1 2.85 3.5a5.784 5.784 0 0 1 8.18 8.18m.26 1.12a6.78 6.78 0 1 1 .72-.7l5.4 5.4a.5.5 0 1 1-.71.7z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </form>
          <button
            type="button"
            onClick={handleClose}
            className={` ${styles.icon} ${styles.modal__close_button} ${styles.link} ${styles.link__text} ${styles.focus_inset}`}
          >
            <span className={`${styles.svg_wrapper}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="icon icon-close"
                viewBox="0 0 18 17"
              >
                <path
                  fill="currentColor"
                  d="M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z"
                ></path>
              </svg>
            </span>
          </button>
          {query && (
            <div
              className={`absolute top-full left-0 w-full bg-white border border-gray-200 shadow-md p-4 flex justify-center ${styles.resulrts_container}`}
            >
              <div className={`w-1/2 flex ${styles.resultsWrapper}`}>
                <div className={`w-1/4 p-2 ${styles.suggestions}`}>
                  <h3
                    className={`text-lg font-semibold ${styles.suggestionsTitle}`}
                  >
                    Suggestions
                  </h3>
                  <ul>
                    <li
                      className={`cursor-pointer hover:bg-gray-100 p-2 ${styles.suggestionItem}`}
                      onClick={() => router.push('/')}
                    >
                      Home Page
                    </li>
                    <li
                      className={`cursor-pointer hover:bg-gray-100 p-2 ${styles.suggestionItem}`}
                      onClick={() => router.push('/shop')}
                    >
                      Shop Page
                    </li>
                  </ul>
                </div>
                <div className={`w-3/4 p-2 ${styles.products}`}>
                  <h3
                    className={`text-lg font-semibold ${styles.productsTitle}`}
                  >
                    Products
                  </h3>
                  {results.map((product, index) => {
                    const image = product.images?.edges?.[0]?.node
                    return (
                      <div
                        key={product.id}
                        className={`p-2 cursor-pointer flex items-center ${
                          index === activeIndex
                            ? `bg-gray-200 ${styles.activeProduct}`
                            : `hover:bg-gray-100 ${styles.productItem}`
                        }`}
                        onClick={() => handleResultClick(product.handle)}
                      >
                        {image && (
                          <Image
                            src={image.transformedSrc}
                            alt={image.altText ?? 'Product Image'}
                            width={64}
                            height={64}
                            className={`object-cover mr-4 ${styles.productImage}`}
                          />
                        )}
                        <div>
                          <h3
                            className={`text-lg font-semibold ${styles.productTitle}`}
                          >
                            {product.title}
                          </h3>
                          <p
                            className={`text-sm text-gray-500 ${styles.productPrice}`}
                          >
                            {product.priceRange.minVariantPrice.amount}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar

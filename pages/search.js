// pages/search.js
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SearchBar from '../components/Header/SearchBar'

const SearchPage = () => {
  const [results, setResults] = useState([])
  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return

      try {
        const res = await fetch(`/api/search?query=${query}`)
        const data = await res.json()
        console.log('Fetched Data:', data) // Debugging statement
        setResults(data.products || [])
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="p-4">
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {results && results.length > 0 ? (
          results.map((product) => (
            <div key={product.id} className="border p-2">
              <h2>{product.title}</h2>
              <p>{product.price}</p>
            </div>
          ))
        ) : (
          <p>No products found for &quot;{query}&quot;</p>
        )}
      </div>
    </div>
  )
}

export default SearchPage

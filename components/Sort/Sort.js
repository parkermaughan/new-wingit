import React from 'react'

const Sort = ({ onSortChange }) => {
  const handleSortChange = (e) => {
    onSortChange(e.target.value)
  }

  return (
    <div className="mb-8">
      <label htmlFor="sort" className="mr-2">
        Sort By:
      </label>
      <select
        id="sort"
        onChange={handleSortChange}
        className="border p-2 rounded"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
      </select>
    </div>
  )
}

export default Sort

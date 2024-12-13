import React from 'react'

// Component to display product options
const ProductOptions = ({ variants, selectedVariant, setSelectedVariant }) => {
  return (
    <div className="mt-4">
      {/* Title for the color options */}
      <h3 className="text-sm font-medium text-gray-900">Color</h3>
      <div className="mt-2 grid grid-cols-4 gap-4">
        {/* Map through the variants to display color options */}
        {variants?.map((variant) => (
          <button
            key={variant.id} // Unique key for each variant
            className={`border rounded-md p-2 ${
              selectedVariant?.id === variant.id // Highlight the selected variant
                ? 'border-black'
                : 'border-gray-300'
            }`}
            onClick={() => setSelectedVariant(variant)} // Set the selected variant on click
          >
            {/* Display the color value */}
            {
              variant.selectedOptions.find(
                (option) => option.name.toLowerCase() === 'color'
              )?.value
            }
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductOptions

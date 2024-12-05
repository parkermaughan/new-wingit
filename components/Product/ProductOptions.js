import React from 'react'
import { RadioGroup } from '@headlessui/react'

const ProductOptions = ({ sizes, selectedSize, setSelectedSize }) => {
  if (!sizes) {
    return null
  }

  return (
    <RadioGroup value={selectedSize} onChange={setSelectedSize}>
      <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
        {sizes.map((product, index) => (
          <RadioGroup.Option
            key={`${product.id}-${index}`}
            value={product}
            className={({ active, checked }) =>
              `${active ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
              ${checked ? 'bg-indigo-600 text-white' : 'bg-white'}
              relative border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none`
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex-1 flex">
                  <div className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={`block text-sm font-medium ${
                        checked ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {product.title}
                    </RadioGroup.Label>
                  </div>
                </div>
                <div
                  className={`absolute -inset-px rounded-lg pointer-events-none ${
                    active ? 'border' : 'border-2'
                  } ${checked ? 'border-indigo-500' : 'border-transparent'}`}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}

export default ProductOptions

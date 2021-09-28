import { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/solid'
import { RadioGroup } from '@headlessui/react'
import {
  getSingleProductByHandleAndRelatedProducts,
  getAllProductHandles,
} from '@/lib/shopify'

import { formatPrice } from '@/utils/format'
import ProductList from '@/components/ProductList'

const product = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Men', href: '#' },
    { id: 2, name: 'Clothing', href: '#' },
  ],
  images: [
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  colors: [
    { name: 'White', className: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', className: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', className: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: false },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
    { name: '2XL', inStock: true },
    { name: '3XL', inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({ product: singleProduct, products }) {
  console.log(singleProduct)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[2])
  const [isLoading, setIsLoading] = useState(false)

  const { handle, title, images, tags, description } = singleProduct
  const image = images.edges[0]?.node
  const price = formatPrice(singleProduct.priceRange.minVariantPrice.amount)

  const variantId = singleProduct.variants.edges[0].node.id

  async function checkout() {
    setIsLoading(true)
    const { data } = await storeFront(checkoutMutation, { variantId })
    const { webUrl } = data.checkoutCreate.checkout
    window.location.href = webUrl
  }

  return (
    <div>
      <div className="lg:grid lg:grid-cols-6 lg:gap-x-8 xl:gap-x-16">
        <div className="lg:col-span-3">
          <div className="overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1">
            <Image
              src={image.transformedSrc}
              className="object-cover object-center"
              alt=""
              layout="fill"
            />
          </div>
        </div>
        <div className="mt-14 sm:mt-16 lg:mt-0 lg:col-span-3">
          <div className="flex flex-col-reverse">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-loose sm:text-3xl">
                {title}
              </h1>
              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>
              <p className="mt-4 text-3xl text-gray-900">{price}</p>
            </div>
          </div>
          <p className="mt-6 text-gray-500">{description}</p>
          <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-4">
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-400"
                >
                  Size guide
                </a>
              </div>
              {/* Radio group */}
              <RadioGroup
                value={selectedSize}
                onChange={setSelectedSize}
                className="mt-4"
              >
                <RadioGroup.Label className="sr-only">
                  Choose a size
                </RadioGroup.Label>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                  {product.sizes.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      disabled={!size.inStock}
                      className={({ active }) =>
                        classNames(
                          size.inStock
                            ? 'bg-white text-gray-900 cursor-pointer'
                            : 'bg-gray-50 text-gray-200 cursor-not-allowed',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'group relative border py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="p">
                            {size.name}
                          </RadioGroup.Label>
                          {size.inStock ? (
                            <div
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked
                                  ? 'border-indigo-500'
                                  : 'border-transparent',
                                'absolute -inset-px pointer-events-none'
                              )}
                              aria-hidden="true"
                            />
                          ) : (
                            <div
                              aria-hidden="true"
                              className="absolute border-2 border-gray-200 rounded-md pointer-events-none -inset-px"
                            >
                              <svg
                                className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line
                                  x1={0}
                                  y1={100}
                                  x2={100}
                                  y2={0}
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </div>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center justify-center px-8 py-3 mt-8 text-base font-medium text-white bg-gray-900 border border-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
          >
            <span>Add to bag</span>
          </button>
        </div>
      </div>
      <ProductList products={products} label="Related products" />
    </div>
  )
}

export async function getStaticPaths() {
  const { data } = await getAllProductHandles()

  return {
    paths: data.products.edges.map((product) => ({
      params: {
        handle: product.node.handle,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { data } = await getSingleProductByHandleAndRelatedProducts({
    handle: params.handle,
  })

  return {
    props: {
      product: data.productByHandle,
      products: data.products,
    },
  }
}

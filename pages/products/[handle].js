import { NextSeo } from 'next-seo'
import {
  getSingleProductByHandleAndRelatedProducts,
  getAllProductHandles,
} from '@/lib/shopify'
import ProductList from '@/components/Product/ProductList'
import ProductForm from '@/components/Product/ProductForm'

export default function ProductPage({ productByHandle, products }) {
  // Log the productByHandle and products to verify the data
  console.log('Product by handle:', productByHandle)
  console.log('Related products:', products)

  if (!productByHandle) {
    return <div>Product not found</div>
  }

  const relatedProducts = products.filter(
    (product) => product.handle !== productByHandle.handle
  )

  return (
    <>
      <NextSeo
        title={productByHandle.title ?? 'Product title'}
        description={productByHandle.description ?? 'Product description'}
      />
      <ProductForm product={productByHandle} />
      <ProductList products={relatedProducts} label="Related products" />
    </>
  )
}

export async function getStaticPaths() {
  const products = await getAllProductHandles()

  // Log the products to verify the data
  console.log('Products in getStaticPaths:', products)

  return {
    paths: products.map((product) => ({
      params: {
        handle: product.handle,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { productByHandle, products } =
    await getSingleProductByHandleAndRelatedProducts({
      handle: params.handle,
    })

  // Log the productByHandle and products to verify the data
  console.log('Product by handle in getStaticProps:', productByHandle)
  console.log('Related products in getStaticProps:', products)

  return {
    props: {
      productByHandle,
      products,
    },
    revalidate: 10,
  }
}

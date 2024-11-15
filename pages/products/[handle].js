import { NextSeo } from 'next-seo'
import {
  getSingleProductByHandleAndRelatedProducts,
  getAllProductHandles,
} from '@/lib/shopify'
import ProductList from '@/components/Product/ProductList'
import ProductForm from '@/components/Product/ProductForm'

// pages/products/[handle].js

export async function getStaticPaths() {
  const products = await getAllProductHandles()

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

  return {
    props: {
      productByHandle,
      products,
    },
    revalidate: 10,
  }
}

const ProductPage = ({ productByHandle, products }) => {
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

export default ProductPage

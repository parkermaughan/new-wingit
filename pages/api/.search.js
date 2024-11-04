// pages/api/search.js
import { searchProducts } from '@/lib/shopify'

export default async (req, res) => {
  const { query } = req.query

  try {
    const products = await searchProducts(query)
    res.status(200).json({ products })
  } catch (error) {
    console.error('Error in API endpoint:', error)
    res.status(500).json({ error: 'Error fetching search results' })
  }
}

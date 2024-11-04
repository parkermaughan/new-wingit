export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`
}

export const getAllVariantOptions = (product) => {
  const { variants } = product
  if (!variants || !variants.edges) {
    return []
  }

  return variants.edges.map((variant) => {
    const allOptions = {}

    variant.node.selectedOptions.forEach((item) => {
      allOptions[item.name] = item.value
    })

    return {
      id: variant.node.id,
      title: variant.node.title,
      options: allOptions,
    }
  })
}

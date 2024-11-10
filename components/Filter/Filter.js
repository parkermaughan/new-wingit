import React, { useState } from 'react'
import styles from './Filter.module.css'

const Filter = ({ categories = [], colors = [], onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])
  const [openSections, setOpenSections] = useState({
    category: false,
    brand: false,
    color: false,
    price: false,
  })

  const handleToggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCheckboxChange = (value, setSelected, selected) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]

    setSelected(newSelected)

    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      colors: selectedColors,
      prices: selectedPrices,
      [setSelected === setSelectedCategories
        ? 'categories'
        : setSelected === setSelectedBrands
        ? 'brands'
        : setSelected === setSelectedColors
        ? 'colors'
        : 'prices']: newSelected,
    })
  }

  const renderCheckbox = (value, selected, setSelected) => (
    <button
      className={styles.checkboxContainer}
      onClick={() => handleCheckboxChange(value, setSelected, selected)}
    >
      <div
        className={`${styles['pseudo-checkbox']} ${
          selected.includes(value) ? styles['is--checked'] : ''
        }`}
      >
        {selected.includes(value) && (
          <div
            className={`${styles['icon-checkmark']} ${styles['is--toggled']}`}
          />
        )}
      </div>
      <label className={styles.checkboxLabel}>{value}</label>
    </button>
  )

  const renderFilterGroup = (label, section, items, selected, setSelected) => (
    <div className={styles['filter-group']}>
      <div
        className={styles.accordionButton}
        onClick={() => handleToggleSection(section)}
      >
        <div className={styles['trigger-content']}>
          <div className={styles['trigger-content__label']}>{label}</div>
          <div
            className={`${styles['icon-chevron']} ${
              openSections[section] ? styles.open : ''
            }`}
          />
        </div>
      </div>
      <div
        className={`${styles.accordionContent} ${
          openSections[section] ? styles.open : ''
        }`}
      >
        {items.map((item) => (
          <div key={item}>{renderCheckbox(item, selected, setSelected)}</div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.filter}>
        {renderFilterGroup(
          'Filter by Category',
          'category',
          categories,
          selectedCategories,
          setSelectedCategories
        )}
        {renderFilterGroup(
          'Filter by Brand',
          'brand',
          ['Brand 1', 'Brand 2'],
          selectedBrands,
          setSelectedBrands
        )}
        {renderFilterGroup(
          'Filter by Color',
          'color',
          colors,
          selectedColors,
          setSelectedColors
        )}
        {renderFilterGroup(
          'Shop by Price',
          'price',
          ['0-25', '25-50', '50-100'],
          selectedPrices,
          setSelectedPrices
        )}
      </div>
    </div>
  )
}

export default Filter

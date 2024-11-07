import React, { useState } from 'react'
import styles from './Filter.module.css'

const Filter = ({ categories = [], onFilterChange }) => {
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
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value))
    } else {
      setSelected([...selected, value])
    }
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      colors: selectedColors,
      prices: selectedPrices,
    })
  }

  const renderCheckbox = (value, selected, setSelected) => (
    <div className={styles.checkboxContainer}>
      <div
        className={`${styles['pseudo-checkbox']} ${
          selected.includes(value)
            ? `${styles['is--checked']} ${styles['css-1bppeb5']}`
            : ''
        }`}
        onClick={() => handleCheckboxChange(value, setSelected, selected)}
      >
        {selected.includes(value) && (
          <div
            className={`${styles['icon-checkmark']} ${styles['is--toggled']} ${styles['css-1iktvq5']}`}
          />
        )}
      </div>
      <label className={styles.checkboxLabel}>{value}</label>
    </div>
  )

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter}>
        <button
          className={styles.accordionButton}
          onClick={() => handleToggleSection('category')}
        >
          Filter by Category
        </button>
        {openSections.category && (
          <div className={styles.accordionContent}>
            {categories.map((category) => (
              <div key={category}>
                {renderCheckbox(
                  category,
                  selectedCategories,
                  setSelectedCategories
                )}
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.accordionButton}
          onClick={() => handleToggleSection('brand')}
        >
          Filter by Brand
        </button>
        {openSections.brand && (
          <div className={styles.accordionContent}>
            {['Brand 1', 'Brand 2'].map((brand) => (
              <div key={brand}>
                {renderCheckbox(brand, selectedBrands, setSelectedBrands)}
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.accordionButton}
          onClick={() => handleToggleSection('color')}
        >
          Filter by Color
        </button>
        {openSections.color && (
          <div className={styles.accordionContent}>
            {['Red', 'Blue'].map((color) => (
              <div key={color}>
                {renderCheckbox(color, selectedColors, setSelectedColors)}
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.accordionButton}
          onClick={() => handleToggleSection('price')}
        >
          Shop by Price
        </button>
        {openSections.price && (
          <div className={styles.accordionContent}>
            {['0-25', '25-50', '50-100'].map((price) => (
              <div key={price}>
                {renderCheckbox(price, selectedPrices, setSelectedPrices)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Filter

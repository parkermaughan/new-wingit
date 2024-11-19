import React, { useState, useEffect } from 'react'
import styles from './Filter.module.css'

const Filter = ({
  collections,
  brands,
  colors,
  onFilterChange,
  onApplyFilters,
  isMobile,
}) => {
  const [selectedCollections, setSelectedCollections] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])
  const [openSections, setOpenSections] = useState({
    collection: false,
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

    if (!isMobile) {
      onFilterChange({
        collections:
          setSelected === setSelectedCollections
            ? newSelected
            : selectedCollections,
        brands:
          setSelected === setSelectedBrands ? newSelected : selectedBrands,
        colors:
          setSelected === setSelectedColors ? newSelected : selectedColors,
        prices:
          setSelected === setSelectedPrices ? newSelected : selectedPrices,
      })
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      collections: selectedCollections,
      brands: selectedBrands,
      colors: selectedColors,
      prices: selectedPrices,
    })
  }

  const renderCheckbox = (value, selected, setSelected, isColor = false) => {
    if (!value) return null

    const isChecked = selected.includes(value)
    const isWhiteColor = value.toLowerCase() === 'white'
    const checkmarkColor = isWhiteColor ? '#111' : '#fff'
    const backgroundColor = isWhiteColor ? '#fff' : value

    return (
      <button
        className={`${styles.checkboxContainer} ${
          isWhiteColor ? styles.whiteColorCircle : ''
        }`}
        onClick={() => handleCheckboxChange(value, setSelected, selected)}
      >
        <div
          className={`${styles.pseudoCheckbox} ${
            isChecked ? styles.isChecked : ''
          } ${isColor ? styles.colorCircle : ''}`}
          style={isColor ? { backgroundColor } : {}}
        >
          {isChecked && (
            <div
              className={`${styles.iconCheckmark} ${styles.isToggled}`}
              style={{ color: checkmarkColor }}
            />
          )}
        </div>
        {isColor && <span className={styles.colorName}>{value}</span>}
        {!isColor && <label className={styles.checkboxLabel}>{value}</label>}
      </button>
    )
  }

  const renderFilterGroup = (
    label,
    section,
    items,
    selected,
    setSelected,
    isColor = false
  ) => (
    <div className={styles.filterGroup}>
      <div
        className={styles.accordionButton}
        onClick={() => handleToggleSection(section)}
      >
        <div className={styles.triggerContent}>
          <div className={styles.triggerContentLabel}>{label}</div>
          <div
            className={`${styles.iconChevron} ${
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
          <div key={item.id || item}>
            {renderCheckbox(item.title || item, selected, setSelected, isColor)}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.filter}>
        {renderFilterGroup(
          'Filter by Collection',
          'collection',
          collections,
          selectedCollections,
          setSelectedCollections
        )}
        {renderFilterGroup(
          'Filter by Brand',
          'brand',
          brands,
          selectedBrands,
          setSelectedBrands
        )}
        {renderFilterGroup(
          'Filter by Color',
          'color',
          colors,
          selectedColors,
          setSelectedColors,
          true
        )}
        {renderFilterGroup(
          'Shop by Price',
          'price',
          ['0-25', '25-50', '50-100'],
          selectedPrices,
          setSelectedPrices
        )}
        {isMobile && (
          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Apply Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default Filter

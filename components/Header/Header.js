import React from 'react'
import styles from './Header.module.css' // Assuming you have a CSS module
function Header({ children }) {
  return (
    <header className={`px-4 mx-auto sm:px-6 lg:px-8 ${styles.container}`}>
      {children}
    </header>
  )
}

export default Header

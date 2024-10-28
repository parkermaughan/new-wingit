// components/Header/MobileNavigation.js
import React, { useState } from 'react'
import NavLink from './NavLink'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import Logo from '../Logo'
import styles from './MobileNavigation.module.css'
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav
      className={`lg:hidden items-center justify-between p-4 bg-white duration-300 relative flex ${styles.container}`}
    >
      <Logo />
      <button onClick={toggleMenu} className="lg:hidden focus:outline-none">
        <span className="material-icons">menu</span>
      </button>
      <div
        className={`absolute inset-0 bg-white transition-transform duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } lg:hidden`}
      >
        <ul className="flex flex-col space-y-4 p-4">
          <NavLink label="HOME" href="/" />
          <NavLink label="SHOP" href="/shop" />
          <NavLink label="BLOG" href="/blog" />
          <NavLink label="ABOUT US" href="/about" />
          <NavLink label="CONTACT" href="/contact" />
        </ul>
        <div className="flex flex-col items-center space-y-4 p-4">
          <SearchBar />
          <CartIcon />
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <SearchBar />
        <CartIcon />
      </div>
    </nav>
  )
}

export default MobileNavigation

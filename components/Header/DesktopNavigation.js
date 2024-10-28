// components/Header/DesktopNavigation.js
import React from 'react'
import NavLink from './NavLink'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import Logo from '../Logo'
import styles from './DesktopNavigation.module.css' // Assuming you have a CSS module
const DesktopNavigation = () => {
  return (
    <nav
      className={`hidden lg:flex items-center justify-between p-4 bg-white duration-300 ${styles.container}`}
    >
      <Logo />
      <ul className="flex space-x-8">
        <NavLink label="HOME" href="/" />
        <NavLink label="SHOP" href="/shop" />
        <NavLink label="BLOG" href="/blog" />
        <NavLink label="ABOUT US" href="/about" />
        <NavLink label="CONTACT" href="/contact" />
      </ul>
      <div className="flex items-center space-x-4">
        <SearchBar />
        <CartIcon />
      </div>
    </nav>
  )
}

export default DesktopNavigation

// components/Header/NavLink.js
import Link from 'next/link'
import styles from './NavLink.module.css'
const NavLink = ({ label, href }) => {
  return (
    <li>
      <Link href={href}>
        <a
          className={`text-gray-700 hover:text-blue-500 transition-colors duration-300 transform hover:scale-105 ${styles.navlink}`}
        >
          {label}
        </a>
      </Link>
    </li>
  )
}

export default NavLink

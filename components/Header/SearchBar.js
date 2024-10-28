import React from 'react'
import styles from './SearchBar.module.css'
const SearchBar = ({ width = '24px', height = '24px', color = '#000000' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.search}
    >
      <g clipPath="url(#clip0_15_152)">
        <rect width="24" height="24" fill="white" />
        <circle
          cx="10.5"
          cy="10.5"
          r="6.5"
          stroke={color}
          strokeLinejoin="round"
        />
        <path
          d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_15_152">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SearchBar

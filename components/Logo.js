import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href="/" className="logo">
      <a>
        <Image
          src="/logos/wing-it-logo.png"
          alt="Wing It Disc Golf"
          width={135.047}
          height={155.094}
          priority
          className="object-contain"
        />
      </a>
    </Link>
  )
}

export default Logo

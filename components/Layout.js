import React from 'react'
import Footer from './Footer'
import Header from '/components/Header/Header'
import DesktopNavigation from '/components/Header/DesktopNavigation'
import MobileNavigation from '/components/Header/MobileNavigation'
function Layout({ children }) {
  return (
    <>
      <Header>
        <DesktopNavigation />
        <MobileNavigation />
      </Header>
      <main className="w-full px-4 py-8">{children}</main>
      <Footer />
    </>
  )
}

export default Layout

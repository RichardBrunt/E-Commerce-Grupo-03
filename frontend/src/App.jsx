import React from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { AppRouter } from './app/router.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './assets/base.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="container">
          <AppRouter />
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  )
}

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { DataInitializer } from '@/components/DataInitializer'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/pages/HomePage'
import { MenuPage } from '@/pages/MenuPage'
import { FeaturedPage } from '@/pages/FeaturedPage'
import { ContactPage } from '@/pages/ContactPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AdminPage } from '@/pages/AdminPage'
import { OrdersPage } from '@/pages/OrdersPage'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage />
          </motion.div>
        } />
        <Route path="/menu" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MenuPage />
          </motion.div>
        } />
        <Route path="/featured" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FeaturedPage />
          </motion.div>
        } />
        <Route path="/contact" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ContactPage />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfilePage />
          </motion.div>
        } />
        <Route path="/admin" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPage />
          </motion.div>
        } />
        <Route path="/orders" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <OrdersPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <DataInitializer />
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Navbar />
              
              <main className="flex-1">
                <AnimatedRoutes />
              </main>
              
              <Footer />
              <Toaster position="bottom-right" />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

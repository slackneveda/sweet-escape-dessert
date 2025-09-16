import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CartIcon } from '@/components/CartIcon'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, Coffee, LogIn, User, UserPlus } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Base navigation items
  const baseNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Featured', path: '/featured' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Orders', path: '/orders' },
    { name: 'Contact', path: '/contact' },
  ]

  // Navigation items (no conditional logic needed since dashboard and profile are always accessible)
  const navItems = baseNavItems

  const NavLink = ({ item, mobile = false }: { item: { name: string; path: string }, mobile?: boolean }) => {
    const isActive = location.pathname === item.path
    
    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsOpen(false)}
        className="relative"
      >
        <motion.span
          className={`${
            mobile ? 'block py-2 text-lg' : 'px-3 py-2'
          } rounded-md transition-colors duration-200 ${
            isActive
              ? 'text-primary font-medium'
              : 'text-foreground hover:text-primary'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.name}
        </motion.span>
        {isActive && !mobile && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
            layoutId="activeTab"
            initial={false}
          />
        )}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground">Sweet Escape</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            )}
            <CartIcon onClick={() => navigate('/checkout')} />
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon onClick={() => navigate('/checkout')} />
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} mobile />
                  ))}
                  
                  {/* Login/User Button for Mobile */}
                  <div className="pt-4 border-t space-y-2">
                    {!user ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          navigate('/login')
                          setIsOpen(false)
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          navigate('/dashboard')
                          setIsOpen(false)
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
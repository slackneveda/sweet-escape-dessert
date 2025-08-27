import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { List, Cake } from '@phosphor-icons/react'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Featured', path: '/featured' },
  { name: 'Contact', path: '/contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

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
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
            layoutId="activeTab"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Cake className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="font-bold text-xl text-primary">Sweet Delights</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
            {user && (
              <Link to="/profile">
                <Button variant="ghost" size="sm">Profile</Button>
              </Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} mobile />
                  ))}
                  {user && (
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <span className="block py-2 text-lg text-foreground hover:text-primary">
                        Profile
                      </span>
                    </Link>
                  )}
                  {user?.isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <span className="block py-2 text-lg text-foreground hover:text-primary">
                        Admin
                      </span>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
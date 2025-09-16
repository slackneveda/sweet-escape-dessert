import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { AuroraText } from '@/components/magicui/aurora-text'

export function DashboardPage() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  // Show welcome message for guests or logged-in users
  const displayName = user?.name || 'Guest'
  const displayEmail = user?.email || 'Not signed in'

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Welcome Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tighter md:text-5xl">
            Welcome back, <AuroraText>{displayName}</AuroraText>!
          </h1>
          <p className="text-muted-foreground text-lg">Manage your <AuroraText>sweet journey</AuroraText> with Sweet Escape</p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <User className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{displayName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{displayEmail}</p>
                </div>
                {user ? (
                  <Link to="/profile">
                    <Button className="w-full" variant="outline">
                      View Full Profile
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="w-full">
                      Sign In to Access Profile
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-muted-foreground">Total Orders</p>
                </div>
                <Link to="/orders">
                  <Button className="w-full" variant="outline">
                    View Order History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorites Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Favorites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-muted-foreground">Saved Items</p>
                </div>
                <Link to="/menu">
                  <Button className="w-full" variant="outline">
                    Browse Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/menu">
                  <Button className="w-full h-16" variant="outline">
                    <div className="text-center">
                      <ShoppingBag className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm">Browse Menu</p>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/featured">
                  <Button className="w-full h-16" variant="outline">
                    <div className="text-center">
                      <Heart className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm">Featured Items</p>
                    </div>
                  </Button>
                </Link>

                <Link to="/orders">
                  <Button className="w-full h-16" variant="outline">
                    <div className="text-center">
                      <ShoppingBag className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm">Order History</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Section */}
        {user && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { DessertCard } from '@/components/DessertCard'
import { DessertDetailModal } from '@/components/DessertDetailModal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dessert } from '@/types'
import { TrendingUp, Crown, CreditCard, Shield, Clock } from '@phosphor-icons/react'

export function FeaturedPage() {
  const [desserts] = useKV<Dessert[]>('desserts', [])
  const featuredDesserts = (desserts || []).filter(d => d.featured && d.available)
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleSelectDessert = (dessert: Dessert) => {
    setSelectedDessert(dessert)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedDessert(null)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-4xl font-bold">Featured Desserts</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our chef's special selections and customer favorites
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-card p-6 rounded-lg text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{featuredDesserts.length}</h3>
            <p className="text-muted-foreground">Featured Items</p>
          </div>
          <div className="bg-card p-6 rounded-lg text-center">
            <span className="text-3xl mb-2 block">⭐</span>
            <h3 className="text-2xl font-bold">4.9/5</h3>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="bg-card p-6 rounded-lg text-center">
            <span className="text-3xl mb-2 block">🏆</span>
            <h3 className="text-2xl font-bold">Best Sellers</h3>
            <p className="text-muted-foreground">Customer Picks</p>
          </div>
        </motion.div>

        {/* Payment Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <h3 className="text-xl font-semibold text-center">Secure & Easy Checkout</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe Payments</p>
                    <p className="text-sm text-muted-foreground">Secure card processing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Bank-Level Security</p>
                    <p className="text-sm text-muted-foreground">Your data is protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Checkout</p>
                    <p className="text-sm text-muted-foreground">Order in under 2 minutes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {featuredDesserts.length > 0 ? (
          <>
            {/* Featured Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {featuredDesserts.map((dessert, index) => (
                <motion.div
                  key={dessert.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <DessertCard 
                    dessert={dessert} 
                    onSelect={handleSelectDessert}
                  />
                  {index === 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      #1 Best Seller
                    </Badge>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Chef's Note */}
            <motion.div
              className="mt-16 bg-card p-8 rounded-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center">
                <span className="text-6xl mb-4 block">👨‍🍳</span>
                <h3 className="text-2xl font-bold mb-4">Chef's Note</h3>
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  "Each featured dessert represents hours of careful crafting and testing. 
                  These are the creations I'm most proud of - the perfect balance of flavor, 
                  texture, and visual appeal that our customers have come to love."
                </p>
                <p className="text-primary font-medium mt-4">- Chef Marina Rodriguez</p>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-2xl font-bold mb-4">No Featured Items</h3>
            <p className="text-muted-foreground">
              Check back soon for our latest featured desserts!
            </p>
          </motion.div>
        )}
        
        {/* Dessert Detail Modal */}
        <DessertDetailModal
          dessert={selectedDessert}
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}
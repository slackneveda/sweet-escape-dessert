import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/StarRating'
import { AddToCartButton } from '@/components/AddToCartButton'
import { Reviews } from '@/components/Reviews'
import { Dessert } from '@/types'
import { X } from '@phosphor-icons/react'

interface DessertDetailModalProps {
  dessert: Dessert | null
  isOpen: boolean
  onClose: () => void
}

export function DessertDetailModal({ dessert, isOpen, onClose }: DessertDetailModalProps) {
  if (!dessert) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Dessert Details</DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-8xl">🧁</span>
              </div>
              {dessert.featured && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
              {!dessert.available && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{dessert.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={dessert.rating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    {dessert.rating.toFixed(1)} ({dessert.reviewCount} review{dessert.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {dessert.description}
              </p>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {dessert.category.replace('-', ' ')}
                </Badge>
                <span className="text-2xl font-bold text-primary">
                  ${dessert.price.toFixed(2)}
                </span>
              </div>
              
              <div className="pt-4">
                <AddToCartButton 
                  dessert={dessert} 
                  showQuantitySelector={true}
                  size="lg"
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="border-t pt-6">
            <Reviews dessertId={dessert.id} dessertName={dessert.name} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
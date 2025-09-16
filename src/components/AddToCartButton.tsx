import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCart } from '@/contexts/CartContext'
import { Dessert } from '@/types'
import { motion } from 'framer-motion'

interface AddToCartButtonProps {
  dessert: Dessert
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showQuantitySelector?: boolean
}

export function AddToCartButton({ 
  dessert, 
  className = '', 
  variant = 'default',
  size = 'default',
  showQuantitySelector = false
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleQuickAdd = async () => {
    if (!showQuantitySelector) {
      setIsAdding(true)
      addToCart(dessert, 1)
      
      // Visual feedback
      setTimeout(() => setIsAdding(false), 500)
      return
    }
    
    setIsModalOpen(true)
  }

  const handleAddWithDetails = () => {
    addToCart(dessert, quantity, specialInstructions || undefined)
    setIsModalOpen(false)
    setQuantity(1)
    setSpecialInstructions('')
  }

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  if (!dessert.available) {
    return (
      <Button disabled variant="outline" size={size} className={className}>
        Unavailable
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleQuickAdd}
        variant={variant}
        size={size}
        className={`${className} ${isAdding ? 'scale-95' : ''} transition-transform`}
        disabled={isAdding}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={isAdding ? { scale: [1, 0.9, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
                      <ShoppingCart className="w-4 h-4 mr-2" />
          {isAdding ? 'Added!' : 'Add to Cart'}
        </motion.div>
      </Button>

      {showQuantitySelector && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Cart</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Dessert Info */}
              <div className="flex gap-3">
                <img
                  src={dessert.image}
                  alt={dessert.name}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{dessert.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {dessert.description}
                  </p>
                  <p className="font-medium">${dessert.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => updateQuantity(1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or allergies..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Total */}
              <div className="flex justify-between items-center font-semibold text-lg border-t pt-3">
                <span>Total:</span>
                <span>${(dessert.price * quantity).toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddWithDetails} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
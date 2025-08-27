import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import { CheckoutModal } from './CheckoutModal'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={onClose}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-background shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingBag size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Shopping Cart</h2>
                    <p className="text-sm text-muted-foreground">
                      {(cart.items || []).length} {(cart.items || []).length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
                  <X size={20} />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {(cart.items || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                    <div className="p-4 bg-muted/30 rounded-full mb-6">
                      <ShoppingBag size={48} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-sm">
                      Add some delicious desserts to get started with your order
                    </p>
                    <Button variant="outline" onClick={onClose} className="w-full max-w-xs">
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {(cart.items || []).map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
                          <div className="relative">
                            <img
                              src={item.dessert.image}
                              alt={item.dessert.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="absolute -top-2 -right-2">
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash size={12} />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-base truncate pr-2">{item.dessert.name}</h3>
                              <p className="font-bold text-lg text-primary whitespace-nowrap">
                                ${(item.dessert.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              ${item.dessert.price.toFixed(2)} each
                            </p>
                            
                            {item.specialInstructions && (
                              <Badge variant="secondary" className="text-xs mb-3 bg-accent/20">
                                Special Instructions
                              </Badge>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={14} />
                                </Button>
                                <div className="w-12 text-center">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    className="w-12 h-8 text-center text-sm border-0 bg-transparent font-medium"
                                  />
                                </div>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                              
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {index < (cart.items || []).length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with totals and checkout */}
              {(cart.items || []).length > 0 && (
                <div className="border-t border-border bg-card/30 p-6">
                  <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax (8.75%):</span>
                          <span className="font-medium">${cart.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery:</span>
                          <span className="font-medium">${cart.delivery.toFixed(2)}</span>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-primary">${cart.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      <Button 
                        onClick={handleCheckout} 
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={clearCart} 
                        className="w-full h-10 text-sm"
                        size="sm"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
      />
    </>
  )
}
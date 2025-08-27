import React, { createContext, useContext, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { CartItem, Cart, Dessert } from '@/types'
import { toast } from 'sonner'

interface CartContextType {
  cart: Cart
  addToCart: (dessert: Dessert, quantity?: number, specialInstructions?: string) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.0875 // 8.75% tax
const DELIVERY_FEE = 4.99

function calculateCartTotals(items: CartItem[] | undefined): Cart {
  const itemsArray = items || []
  const subtotal = itemsArray.reduce((sum, item) => sum + (item.dessert.price * item.quantity), 0)
  const tax = subtotal * TAX_RATE
  const delivery = itemsArray.length > 0 ? DELIVERY_FEE : 0
  const total = subtotal + tax + delivery

  return {
    items: itemsArray,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    delivery,
    total: Math.round(total * 100) / 100
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', [])

  const cart = calculateCartTotals(cartItems)

  const addToCart = useCallback((dessert: Dessert, quantity = 1, specialInstructions?: string) => {
    if (!dessert.available) {
      toast.error('Sorry, this item is currently unavailable')
      return
    }

    setCartItems(currentItems => {
      const items = currentItems || []
      const existingItem = items.find(item => 
        item.dessert.id === dessert.id && 
        item.specialInstructions === specialInstructions
      )

      if (existingItem) {
        // Update quantity of existing item
        return items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${dessert.id}-${Date.now()}`,
          dessert,
          quantity,
          specialInstructions
        }
        return [...items, newItem]
      }
    })

    toast.success(`Added ${dessert.name} to cart`)
  }, [setCartItems])

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(currentItems => {
      const items = currentItems || []
      const item = items.find(item => item.id === itemId)
      if (item) {
        toast.success(`Removed ${item.dessert.name} from cart`)
      }
      return items.filter(item => item.id !== itemId)
    })
  }, [setCartItems])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems(currentItems => {
      const items = currentItems || []
      return items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    })
  }, [setCartItems, removeFromCart])

  const clearCart = useCallback(() => {
    setCartItems([])
    toast.success('Cart cleared')
  }, [setCartItems])

  const getItemCount = useCallback(() => {
    return (cartItems || []).reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
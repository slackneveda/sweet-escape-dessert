import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { motion } from 'framer-motion'

interface CartIconProps {
  onClick: () => void
  className?: string
}

export function CartIcon({ onClick, className = '' }: CartIconProps) {
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`relative ${className}`}
    >
          <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.div>
      )}
    </Button>
  )
}
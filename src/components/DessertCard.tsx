import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dessert } from '@/types'

interface DessertCardProps {
  dessert: Dessert
  onSelect?: (dessert: Dessert) => void
  showActions?: boolean
  onEdit?: (dessert: Dessert) => void
  onDelete?: (dessert: Dessert) => void
}

export function DessertCard({ dessert, onSelect, showActions, onEdit, onDelete }: DessertCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden cursor-pointer group border-border/50 hover:border-primary/50 transition-colors duration-300">
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
            <span className="text-4xl">🧁</span>
          </div>
          {dessert.featured && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          {!dessert.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4" onClick={() => onSelect?.(dessert)}>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight">{dessert.name}</h3>
              <span className="font-bold text-primary">${dessert.price.toFixed(2)}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {dessert.description}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary" className="capitalize">
                {dessert.category.replace('-', ' ')}
              </Badge>
              
              {showActions && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.(dessert)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(dessert)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { DessertCard } from '@/components/DessertCard'
import { DessertDetailModal } from '@/components/DessertDetailModal'
import { Button } from '@/components/ui/button'
import { Dessert } from '@/types'

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'ice-creams', name: 'Ice Creams' },
  { id: 'cookies', name: 'Cookies' },
  { id: 'seasonal', name: 'Seasonal' }
]

export function MenuPage() {
  const [desserts] = useKV<Dessert[]>('desserts-v2', [])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredDesserts, setFilteredDesserts] = useState<Dessert[]>([])
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    console.log('📋 MenuPage: Filtering desserts...')
    console.log('📋 Raw desserts from KV:', desserts)
    console.log('📋 Is desserts an array?', Array.isArray(desserts))
    console.log('📋 Desserts length:', desserts?.length || 0)
    console.log('📋 Selected category:', selectedCategory)
    
    const dessertsArray = Array.isArray(desserts) ? desserts : []
    console.log('📋 Desserts array length:', dessertsArray.length)
    
    if (selectedCategory === 'all') {
      const availableDesserts = dessertsArray.filter(d => d.available)
      console.log('📋 Available desserts (all):', availableDesserts.length)
      setFilteredDesserts(availableDesserts)
    } else {
      const categoryDesserts = dessertsArray.filter(d => d.category === selectedCategory && d.available)
      console.log(`📋 Available desserts (${selectedCategory}):`, categoryDesserts.length)
      setFilteredDesserts(categoryDesserts)
    }
  }, [desserts, selectedCategory])

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
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious selection of handcrafted desserts, made fresh daily
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all duration-200"
            >
              {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Desserts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {(filteredDesserts || []).map((dessert, index) => (
            <motion.div
              key={dessert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <DessertCard 
                dessert={dessert} 
                onSelect={handleSelectDessert}
              />
            </motion.div>
          ))}
        </motion.div>

        {(filteredDesserts || []).length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-muted-foreground text-lg">
              {selectedCategory === 'all' 
                ? 'No desserts available at the moment.'
                : `No ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} available.`
              }
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
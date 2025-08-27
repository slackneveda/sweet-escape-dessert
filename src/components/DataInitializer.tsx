import { useKV } from '@github/spark/hooks'
import { Dessert } from '@/types'

const sampleDesserts: Dessert[] = [
  {
    id: '1',
    name: 'Chocolate Lava Cake',
    description: 'Rich chocolate cake with molten chocolate center, served warm with vanilla ice cream',
    price: 8.99,
    category: 'cakes',
    image: '🍰',
    featured: true,
    available: true
  },
  {
    id: '2',
    name: 'Strawberry Cheesecake',
    description: 'Creamy New York style cheesecake topped with fresh strawberries and berry coulis',
    price: 7.99,
    category: 'cakes',
    image: '🍰',
    featured: true,
    available: true
  },
  {
    id: '3',
    name: 'French Macarons',
    description: 'Delicate almond macarons in assorted flavors - vanilla, chocolate, and raspberry',
    price: 12.99,
    category: 'pastries',
    image: '🧁',
    featured: false,
    available: true
  },
  {
    id: '4',
    name: 'Vanilla Bean Ice Cream',
    description: 'House-made vanilla ice cream with real Madagascar vanilla beans',
    price: 5.99,
    category: 'ice-creams',
    image: '🍦',
    featured: false,
    available: true
  },
  {
    id: '5',
    name: 'Chocolate Chip Cookies',
    description: 'Fresh baked cookies with premium dark chocolate chips, served warm',
    price: 3.99,
    category: 'cookies',
    image: '🍪',
    featured: false,
    available: true
  },
  {
    id: '6',
    name: 'Pumpkin Spice Latte Cake',
    description: 'Seasonal spiced cake with cinnamon cream frosting and caramel drizzle',
    price: 9.99,
    category: 'seasonal',
    image: '🎃',
    featured: true,
    available: true
  }
]

export function DataInitializer() {
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts', [])

  // Initialize sample data if empty
  if (desserts.length === 0) {
    setDesserts(sampleDesserts)
  }

  return null
}
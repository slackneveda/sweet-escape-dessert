import { useKV } from '@github/spark/hooks'
import { Dessert, Review } from '@/types'

const sampleDesserts: Dessert[] = [
  {
    id: '1',
    name: 'Chocolate Lava Cake',
    description: 'Rich chocolate cake with molten chocolate center, served warm with vanilla ice cream',
    price: 8.99,
    category: 'cakes',
    image: '🍰',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: '2',
    name: 'Strawberry Cheesecake',
    description: 'Creamy New York style cheesecake topped with fresh strawberries and berry coulis',
    price: 7.99,
    category: 'cakes',
    image: '🍰',
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 18
  },
  {
    id: '3',
    name: 'French Macarons',
    description: 'Delicate almond macarons in assorted flavors - vanilla, chocolate, and raspberry',
    price: 12.99,
    category: 'pastries',
    image: '🧁',
    featured: false,
    available: true,
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: '4',
    name: 'Vanilla Bean Ice Cream',
    description: 'House-made vanilla ice cream with real Madagascar vanilla beans',
    price: 5.99,
    category: 'ice-creams',
    image: '🍦',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 12
  },
  {
    id: '5',
    name: 'Chocolate Chip Cookies',
    description: 'Fresh baked cookies with premium dark chocolate chips, served warm',
    price: 3.99,
    category: 'cookies',
    image: '🍪',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 29
  },
  {
    id: '6',
    name: 'Pumpkin Spice Latte Cake',
    description: 'Seasonal spiced cake with cinnamon cream frosting and caramel drizzle',
    price: 9.99,
    category: 'seasonal',
    image: '🎃',
    featured: true,
    available: true,
    rating: 4.4,
    reviewCount: 15
  }
]

const sampleReviews: { [dessertId: string]: Review[] } = {
  '1': [
    {
      id: 'r1-1',
      dessertId: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely divine! The molten center was perfect and the vanilla ice cream complemented it beautifully.',
      date: new Date('2024-01-15'),
      verified: true
    },
    {
      id: 'r1-2',
      dessertId: '1',
      userId: 'user2',
      userName: 'Mike Chen',
      rating: 5,
      comment: 'Best chocolate lava cake I\'ve ever had. Worth every penny!',
      date: new Date('2024-01-10'),
      verified: true
    },
    {
      id: 'r1-3',
      dessertId: '1',
      userId: 'user3',
      userName: 'Emma Wilson',
      rating: 4,
      comment: 'Really good but could use a bit more chocolate in the center. Still recommend!',
      date: new Date('2024-01-08'),
      verified: true
    }
  ],
  '2': [
    {
      id: 'r2-1',
      dessertId: '2',
      userId: 'user4',
      userName: 'David Rodriguez',
      rating: 5,
      comment: 'Creamy, rich, and the strawberries were so fresh. Perfect cheesecake!',
      date: new Date('2024-01-12'),
      verified: true
    },
    {
      id: 'r2-2',
      dessertId: '2',
      userId: 'user5',
      userName: 'Lisa Park',
      rating: 4,
      comment: 'Great texture and flavor. The berry coulis was a nice touch.',
      date: new Date('2024-01-09'),
      verified: true
    }
  ],
  '3': [
    {
      id: 'r3-1',
      dessertId: '3',
      userId: 'user6',
      userName: 'James Thompson',
      rating: 5,
      comment: 'These macarons are works of art! Perfect texture and amazing flavors.',
      date: new Date('2024-01-14'),
      verified: true
    },
    {
      id: 'r3-2',
      dessertId: '3',
      userId: 'user7',
      userName: 'Sophie Miller',
      rating: 5,
      comment: 'Absolutely perfect macarons. The raspberry flavor is incredible!',
      date: new Date('2024-01-11'),
      verified: true
    }
  ]
}

export function DataInitializer() {
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts', [])
  const [reviewsInitialized, setReviewsInitialized] = useKV<boolean>('reviews-initialized', false)

  // Initialize sample data if empty
  if (desserts.length === 0) {
    setDesserts(sampleDesserts)
  }

  // Initialize sample reviews if not done yet
  if (!reviewsInitialized) {
    Object.entries(sampleReviews).forEach(([dessertId, reviews]) => {
      spark.kv.set(`reviews-${dessertId}`, reviews)
    })
    setReviewsInitialized(true)
  }

  return null
}
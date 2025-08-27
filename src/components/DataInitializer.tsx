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

const sampleReviews: Review[] = [
  // Approved reviews
  {
    id: 'r1-1',
    dessertId: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely divine! The molten center was perfect and the vanilla ice cream complemented it beautifully.',
    date: new Date('2024-01-15'),
    verified: true,
    status: 'approved',
    moderatedBy: 'Admin',
    moderatedAt: new Date('2024-01-15')
  },
  {
    id: 'r1-2',
    dessertId: '1',
    userId: 'user2',
    userName: 'Mike Chen',
    rating: 5,
    comment: 'Best chocolate lava cake I\'ve ever had. Worth every penny!',
    date: new Date('2024-01-10'),
    verified: true,
    status: 'approved',
    moderatedBy: 'Admin',
    moderatedAt: new Date('2024-01-10')
  },
  {
    id: 'r2-1',
    dessertId: '2',
    userId: 'user4',
    userName: 'David Rodriguez',
    rating: 5,
    comment: 'Creamy, rich, and the strawberries were so fresh. Perfect cheesecake!',
    date: new Date('2024-01-12'),
    verified: true,
    status: 'approved',
    moderatedBy: 'Admin',
    moderatedAt: new Date('2024-01-12')
  },
  // Pending reviews (need moderation)
  {
    id: 'r3-pending-1',
    dessertId: '3',
    userId: 'user8',
    userName: 'Alex Smith',
    rating: 5,
    comment: 'These macarons are incredible! The texture is perfect and the flavors are so balanced. Highly recommend the raspberry one!',
    date: new Date('2024-01-20'),
    verified: true,
    status: 'pending'
  },
  {
    id: 'r1-pending-1',
    dessertId: '1',
    userId: 'user9',
    userName: 'Maria Garcia',
    rating: 4,
    comment: 'Good lava cake but I think it could use a bit more chocolate sauce. The ice cream was delicious though!',
    date: new Date('2024-01-19'),
    verified: false,
    status: 'pending'
  },
  {
    id: 'r4-pending-1',
    dessertId: '4',
    userId: 'user10',
    userName: 'John Lee',
    rating: 5,
    comment: 'Amazing vanilla ice cream! You can really taste the quality of the vanilla beans. Will definitely order again.',
    date: new Date('2024-01-18'),
    verified: true,
    status: 'pending'
  },
  {
    id: 'r5-pending-1',
    dessertId: '5',
    userId: 'user11',
    userName: 'Rachel Wong',
    rating: 3,
    comment: 'Cookies were okay but a bit too sweet for my taste. They were fresh though.',
    date: new Date('2024-01-17'),
    verified: false,
    status: 'pending'
  },
  // A rejected review example
  {
    id: 'r6-rejected-1',
    dessertId: '6',
    userId: 'user12',
    userName: 'Anonymous User',
    rating: 1,
    comment: 'This is spam content with inappropriate language that should not be displayed.',
    date: new Date('2024-01-16'),
    verified: false,
    status: 'rejected',
    moderationNote: 'Contains inappropriate content and appears to be spam.',
    moderatedBy: 'Admin',
    moderatedAt: new Date('2024-01-16')
  }
]

export function DataInitializer() {
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts', [])
  const [reviews, setReviews] = useKV<Review[]>('reviews', [])

  // Initialize sample data if empty
  if ((desserts || []).length === 0) {
    setDesserts(sampleDesserts)
  }

  // Initialize sample reviews if empty
  if ((reviews || []).length === 0) {
    setReviews(sampleReviews)
  }

  return null
}
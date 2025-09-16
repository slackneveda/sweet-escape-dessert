import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dessert, Review } from '@/types'

const sampleDesserts: Dessert[] = [
  // Cakes
  {
    id: '1',
    name: 'Chocolate Lava Cake',
    description: 'Rich chocolate cake with molten chocolate center, served warm with vanilla ice cream',
    price: 12.99,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop&auto=format',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: '2',
    name: 'Strawberry Cheesecake',
    description: 'Creamy New York style cheesecake topped with fresh strawberries and berry coulis',
    price: 9.99,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 18
  },
  {
    id: '3',
    name: 'Red Velvet Cake',
    description: 'Classic red velvet cake with cream cheese frosting and delicate vanilla notes',
    price: 11.49,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 32
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Traditional Italian dessert with layers of coffee-soaked ladyfingers and mascarpone',
    price: 8.99,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: '5',
    name: 'Black Forest Cake',
    description: 'German chocolate cake with cherries, whipped cream, and dark chocolate shavings',
    price: 13.99,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.5,
    reviewCount: 28
  },
  {
    id: '6',
    name: 'Lemon Drizzle Cake',
    description: 'Moist lemon sponge cake with tangy lemon glaze and candied lemon zest',
    price: 7.99,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.4,
    reviewCount: 19
  },
  {
    id: '7',
    name: 'Carrot Cake',
    description: 'Spiced carrot cake with cream cheese frosting, walnuts, and cinnamon',
    price: 10.49,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.6,
    reviewCount: 23
  },

  // Pastries
  {
    id: '8',
    name: 'French Macarons',
    description: 'Delicate almond macarons in assorted flavors - vanilla, chocolate, and raspberry',
    price: 15.99,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1558312657-b2dead7fb5ac?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: '9',
    name: 'Croissant au Chocolat',
    description: 'Buttery, flaky croissant filled with rich dark chocolate',
    price: 4.99,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 42
  },
  {
    id: '10',
    name: 'Éclair au Café',
    description: 'Choux pastry filled with coffee cream and topped with coffee fondant',
    price: 6.49,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1587080266227-677cc2167301?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 27
  },
  {
    id: '11',
    name: 'Danish Pastry',
    description: 'Flaky pastry with sweet almond paste and fresh berries',
    price: 5.99,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 36
  },
  {
    id: '12',
    name: 'Profiteroles',
    description: 'Light choux pastry balls filled with vanilla cream and drizzled with chocolate',
    price: 8.49,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.6,
    reviewCount: 21
  },
  {
    id: '13',
    name: 'Apple Turnovers',
    description: 'Golden puff pastry filled with spiced apple compote and cinnamon',
    price: 4.49,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.4,
    reviewCount: 18
  },
  {
    id: '14',
    name: 'Cinnamon Rolls',
    description: 'Soft, spiral pastry with cinnamon sugar filling and cream cheese glaze',
    price: 3.99,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 55
  },

  // Ice Creams
  {
    id: '15',
    name: 'Vanilla Bean Ice Cream',
    description: 'House-made vanilla ice cream with real Madagascar vanilla beans',
    price: 6.99,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1563569007-8db8e35bb42c?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 12
  },
  {
    id: '16',
    name: 'Chocolate Fudge Ice Cream',
    description: 'Rich chocolate ice cream with chunks of fudge brownie',
    price: 7.49,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 38
  },
  {
    id: '17',
    name: 'Strawberry Swirl',
    description: 'Creamy strawberry ice cream with fresh strawberry swirls',
    price: 6.99,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 25
  },
  {
    id: '18',
    name: 'Mint Chocolate Chip',
    description: 'Refreshing mint ice cream with dark chocolate chips',
    price: 7.99,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.4,
    reviewCount: 20
  },
  {
    id: '19',
    name: 'Salted Caramel',
    description: 'Smooth caramel ice cream with a hint of sea salt',
    price: 8.49,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 44
  },
  {
    id: '20',
    name: 'Pistachio Gelato',
    description: 'Authentic Italian gelato with real Sicilian pistachios',
    price: 9.99,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.9,
    reviewCount: 33
  },
  {
    id: '21',
    name: 'Rocky Road',
    description: 'Chocolate ice cream with marshmallows, almonds, and chocolate chunks',
    price: 8.99,
    category: 'ice-creams',
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 29
  },

  // Cookies
  {
    id: '22',
    name: 'Chocolate Chip Cookies',
    description: 'Fresh baked cookies with premium dark chocolate chips, served warm',
    price: 2.99,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 29
  },
  {
    id: '23',
    name: 'Oatmeal Raisin',
    description: 'Chewy oatmeal cookies with plump raisins and warm spices',
    price: 2.49,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.3,
    reviewCount: 17
  },
  {
    id: '24',
    name: 'Double Chocolate',
    description: 'Rich chocolate cookies with white and dark chocolate chunks',
    price: 3.49,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 41
  },
  {
    id: '25',
    name: 'Snickerdoodles',
    description: 'Soft cinnamon sugar cookies with a perfect chewy texture',
    price: 2.99,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.6,
    reviewCount: 22
  },
  {
    id: '26',
    name: 'Peanut Butter Cookies',
    description: 'Classic peanut butter cookies with cross-hatch pattern',
    price: 3.99,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 26
  },
  {
    id: '27',
    name: 'Sugar Cookies',
    description: 'Buttery sugar cookies with colorful royal icing decorations',
    price: 2.49,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1571506165871-0d3c4138ec98?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.4,
    reviewCount: 19
  },
  {
    id: '28',
    name: 'Gingerbread Cookies',
    description: 'Spiced gingerbread cookies with molasses and warm holiday spices',
    price: 3.99,
    category: 'cookies',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 35
  },

  // Seasonal
  {
    id: '29',
    name: 'Pumpkin Spice Latte Cake',
    description: 'Seasonal spiced cake with cinnamon cream frosting and caramel drizzle',
    price: 11.99,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.4,
    reviewCount: 15
  },
  {
    id: '30',
    name: 'Apple Cinnamon Tart',
    description: 'Rustic apple tart with cinnamon streusel and vanilla bean ice cream',
    price: 9.49,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.6,
    reviewCount: 28
  },
  {
    id: '31',
    name: 'Eggnog Crème Brûlée',
    description: 'Holiday-spiced custard with caramelized sugar top and nutmeg',
    price: 7.99,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.8,
    reviewCount: 21
  },
  {
    id: '32',
    name: 'Hot Chocolate Soufflé',
    description: 'Warm chocolate soufflé with peppermint ice cream',
    price: 12.49,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.9,
    reviewCount: 18
  },
  {
    id: '33',
    name: 'Cranberry Orange Scones',
    description: 'Buttery scones with dried cranberries and orange zest',
    price: 4.99,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 24
  },
  {
    id: '34',
    name: 'Pecan Pie Cheesecake',
    description: 'Fusion dessert combining pecan pie filling with creamy cheesecake',
    price: 13.49,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    featured: true,
    available: true,
    rating: 4.7,
    reviewCount: 31
  },
  {
    id: '35',
    name: 'Mulled Wine Poached Pears',
    description: 'Poached pears in spiced wine with vanilla mascarpone',
    price: 8.99,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop',
    featured: false,
    available: true,
    rating: 4.6,
    reviewCount: 16
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
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts-v2', [])
  const [reviews, setReviews] = useKV<Review[]>('reviews-v2', [])

  // Force data reload with new storage key
  useEffect(() => {
    console.log('🍰 DataInitializer: Force loading desserts with new key...')
    
    // Immediate load
    setDesserts(sampleDesserts)
    console.log('✅ Loaded', sampleDesserts.length, 'desserts immediately')
    
    // Also verify after a brief delay
    setTimeout(() => {
      console.log('🔍 Verification: Current desserts state:', desserts?.length || 0)
      if (!desserts || desserts.length === 0) {
        console.log('🔄 Retrying desserts load...')
        setDesserts(sampleDesserts)
      }
    }, 500)
  }, [])

  useEffect(() => {
    console.log('💬 DataInitializer: Force loading reviews with new key...')
    setReviews(sampleReviews)
    console.log('✅ Loaded', sampleReviews.length, 'reviews immediately')
  }, [])

  // Debug logging
  useEffect(() => {
    if (desserts && desserts.length > 0) {
      console.log('🎯 SUCCESS: Desserts are now available in state:', desserts.length)
      console.log('🎯 First few desserts:', desserts.slice(0, 3).map(d => ({ id: d.id, name: d.name, category: d.category })))
    } else {
      console.log('❌ ISSUE: Desserts state is still empty')
    }
  }, [desserts])

  return null
}
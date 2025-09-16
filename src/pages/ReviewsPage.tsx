import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Calendar, ThumbsUp, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

const allReviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Downtown LA",
    rating: 5,
    comment: "Absolutely incredible! The chocolate lava cake was perfection - warm, gooey center with the most amazing vanilla ice cream. Our family's new favorite spot! The presentation was beautiful and the service was exceptional.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    dessert: "Chocolate Lava Cake",
    date: "February 26, 2025",
    helpful: 24,
    verified: true
  },
  {
    id: 2,
    name: "Marcus Thompson",
    location: "Beverly Hills",
    rating: 5,
    comment: "The French macarons here are authentic and delicate - just like the ones I had in Paris. The pistachio flavor is my absolute favorite! Perfect texture, not too sweet, and the almond flavor really shines through.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    dessert: "French Macarons",
    date: "February 21, 2025",
    helpful: 18,
    verified: true
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Santa Monica",
    rating: 5,
    comment: "Ordered for my daughter's birthday party and everyone was raving about the strawberry cheesecake. Smooth, creamy, and the presentation was gorgeous! The kids and adults all loved it equally.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    dessert: "Strawberry Cheesecake",
    date: "February 25, 2025",
    helpful: 32,
    verified: true
  },
  {
    id: 4,
    name: "David Chen",
    location: "Pasadena",
    rating: 5,
    comment: "As a food blogger, I've tried desserts everywhere. Sweet Escape's tiramisu is hands down the best I've had outside of Italy. Exceptional quality! The coffee flavor is perfectly balanced and the mascarpone is so smooth.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    dessert: "Tiramisu",
    date: "February 23, 2025",
    helpful: 45,
    verified: true
  },
  {
    id: 5,
    name: "Jessica Williams",
    location: "Hollywood",
    rating: 5,
    comment: "The salted caramel ice cream is pure heaven! Rich, creamy, with just the right amount of sea salt. I drive 30 minutes just for this! Worth every mile and every penny.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    dessert: "Salted Caramel Ice Cream",
    date: "February 21, 2025",
    helpful: 28,
    verified: true
  },
  {
    id: 6,
    name: "Robert Kim",
    location: "West Hollywood",
    rating: 5,
    comment: "Brought my wife here for our anniversary. The ambiance, service, and desserts were all perfect. The chocolate crinkle cookies are addictive! We'll definitely be back for more special occasions.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    dessert: "Chocolate Crinkles",
    date: "February 24, 2025",
    helpful: 22,
    verified: true
  },
  {
    id: 7,
    name: "Amanda Foster",
    location: "Culver City",
    rating: 5,
    comment: "The cinnamon rolls are out of this world! Soft, fluffy, and the cream cheese glaze is perfectly sweet. I ordered a dozen for my office and everyone was asking where I got them from.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    dessert: "Cinnamon Rolls",
    date: "February 22, 2025",
    helpful: 19,
    verified: true
  },
  {
    id: 8,
    name: "Michael Rodriguez",
    location: "Long Beach",
    rating: 5,
    comment: "Best cookies I've ever had! The triple chocolate chip cookies are incredible - crispy on the outside, chewy on the inside. My kids beg me to come here every weekend.",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
    dessert: "Triple Chocolate Chip Cookies",
    date: "February 20, 2025",
    helpful: 15,
    verified: true
  },
  {
    id: 9,
    name: "Lisa Chang",
    location: "Koreatown",
    rating: 5,
    comment: "The seasonal pumpkin spice cake is amazing! Even though it's not fall anymore, they still had it and it was perfect. Moist, flavorful, and the frosting is incredible.",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
    dessert: "Pumpkin Spice Latte Cake",
    date: "February 19, 2025",
    helpful: 27,
    verified: true
  }
]

const reviewStats = {
  totalReviews: 847,
  averageRating: 4.9,
  ratingBreakdown: {
    5: 789,
    4: 45,
    3: 8,
    2: 3,
    1: 2
  }
}

export function ReviewsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            See what our customers are saying about their Sweet Escape experience
          </p>
        </motion.div>

        {/* Review Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">{reviewStats.averageRating}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-muted-foreground">Average Rating</div>
          </Card>

          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">{reviewStats.totalReviews}</div>
            <div className="text-muted-foreground">Total Reviews</div>
          </Card>

          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">93%</div>
            <div className="text-muted-foreground">5-Star Reviews</div>
          </Card>

          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-muted-foreground">Would Recommend</div>
          </Card>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-14 h-14 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{review.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {review.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {review.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Review Content */}
                  <Quote className="w-6 h-6 text-primary/30 mb-3" />
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {review.comment}
                  </p>
                  
                  {/* Review Footer */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Badge variant="outline" className="text-xs">
                      {review.dessert}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {review.helpful} helpful
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Create Your Own Sweet Memory?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of satisfied customers who've made Sweet Escape their favorite dessert destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg">
                Explore Our Menu
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Visit Our Store
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

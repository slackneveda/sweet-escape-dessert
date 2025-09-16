import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Clock, Award, Heart, Quote, MapPin, Phone, ChefHat } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuroraText } from '@/components/magicui/aurora-text'

const customerReviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Downtown LA",
    rating: 5,
    comment: "Absolutely incredible! The chocolate lava cake was perfection - warm, gooey center with the most amazing vanilla ice cream. Our family's new favorite spot!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    dessert: "Chocolate Lava Cake",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Marcus Thompson",
    location: "Beverly Hills",
    rating: 5,
    comment: "The French macarons here are authentic and delicate - just like the ones I had in Paris. The pistachio flavor is my absolute favorite!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    dessert: "French Macarons",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Santa Monica",
    rating: 5,
    comment: "Ordered for my daughter's birthday party and everyone was raving about the strawberry cheesecake. Smooth, creamy, and the presentation was gorgeous!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    dessert: "Strawberry Cheesecake",
    date: "3 days ago"
  },
  {
    id: 4,
    name: "David Chen",
    location: "Pasadena",
    rating: 5,
    comment: "As a food blogger, I've tried desserts everywhere. Sweet Escape's tiramisu is hands down the best I've had outside of Italy. Exceptional quality!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    dessert: "Tiramisu",
    date: "5 days ago"
  },
  {
    id: 5,
    name: "Jessica Williams",
    location: "Hollywood",
    rating: 5,
    comment: "The salted caramel ice cream is pure heaven! Rich, creamy, with just the right amount of sea salt. I drive 30 minutes just for this!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    dessert: "Salted Caramel Ice Cream",
    date: "1 week ago"
  },
  {
    id: 6,
    name: "Robert Kim",
    location: "West Hollywood",
    rating: 5,
    comment: "Brought my wife here for our anniversary. The ambiance, service, and desserts were all perfect. The chocolate crinkle cookies are addictive!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    dessert: "Chocolate Crinkles",
    date: "4 days ago"
  }
]



export function HomePage() {
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <div className="relative container mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              variants={itemVariants}
            >
              <Award className="w-4 h-4 mr-2" />
              Award-Winning Dessert Boutique Since 2020
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
              variants={itemVariants}
            >
              <AuroraText>Sweet Escape</AuroraText>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Where <AuroraText>culinary artistry</AuroraText> meets sweet perfection. Handcrafted desserts made fresh daily with <AuroraText>premium ingredients</AuroraText> from around the world.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={itemVariants}
            >
              <Link to="/menu">
                <Button size="lg" className="group text-lg px-8 py-6">
                  Explore Our Menu
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/featured">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Featured Desserts
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              {[
                { number: "10K+", label: "Happy Customers" },
                { number: "4.9★", label: "Average Rating" },
                { number: "40+", label: "Artisan Desserts" },
                { number: "5", label: "Years of Excellence" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Real reviews from real customers who've experienced the magic of Sweet Escape
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {review.location}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    <Quote className="w-6 h-6 text-primary/30 mb-2" />
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {review.comment}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {review.dessert}
                      </Badge>
                      <span className="text-muted-foreground">{review.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link to="/reviews">
              <Button variant="outline" size="lg">
                Read More Reviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">The <AuroraText>Sweet Escape</AuroraText> Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every dessert tells a story of passion, precision, and uncompromising quality
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <ChefHat className="h-10 w-10 text-primary" />,
                title: "Master Craftsmen",
                description: "Our pastry chefs trained in France and Italy bring authentic techniques to every creation"
              },
              {
                icon: <Star className="h-10 w-10 text-primary" />,
                title: "Premium Ingredients",
                description: "Valrhona chocolate, Madagascar vanilla, and organic dairy from local farms"
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "Made Fresh Daily",
                description: "Every item is crafted fresh each morning ensuring peak flavor and quality"
              },
              {
                icon: <Heart className="h-10 w-10 text-primary" />,
                title: "Customer Obsessed",
                description: "4.9/5 stars from over 10,000 customers who keep coming back for more"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg hover:bg-background/50 transition-colors duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to <AuroraText>Indulge</AuroraText>?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of dessert lovers who've made <AuroraText>Sweet Escape</AuroraText> their go-to destination for life's sweetest moments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" className="text-lg px-8 py-6">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
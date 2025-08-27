import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Sweet Delights
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Artisanal desserts crafted with passion, made fresh daily with the finest ingredients
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={itemVariants}
            >
              <Link to="/menu">
                <Button size="lg" className="group">
                  Explore Menu
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/featured">
                <Button variant="outline" size="lg">
                  View Featured Items
                </Button>
              </Link>
            </motion.div>

            {/* Dessert Gallery */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              {['🍰', '🧁', '🍪', '🍨'].map((emoji, index) => (
                <motion.div
                  key={index}
                  className="aspect-square bg-card rounded-lg flex items-center justify-center text-6xl hover:scale-110 transition-transform duration-300 cursor-pointer"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Sweet Delights?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every dessert tells a story of craftsmanship and care
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Star className="h-8 w-8 text-primary" />,
                title: "Premium Quality",
                description: "Only the finest ingredients from trusted suppliers"
              },
              {
                icon: <span className="text-3xl">👨‍🍳</span>,
                title: "Expert Craftsmanship",
                description: "Hand-crafted by our skilled pastry chefs"
              },
              {
                icon: <span className="text-3xl">🌱</span>,
                title: "Fresh Daily",
                description: "Made fresh every morning with love and care"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg hover:bg-background transition-colors duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
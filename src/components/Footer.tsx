import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  Heart,
  Star,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuroraText } from '@/components/magicui/aurora-text'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ]

  const quickLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Reviews", href: "/reviews" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="relative">
        {/* Newsletter Section */}
        <motion.div 
          className="border-b border-border py-12 bg-card/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div variants={itemVariants}>
                <h3 className="text-3xl font-bold mb-2 text-foreground">
                  Stay Sweet with <AuroraText>Our Newsletter</AuroraText>
                </h3>
                <p className="text-muted-foreground text-lg">
                  Get updates on new desserts, special offers, and sweet treats delivered to your inbox.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3"
                variants={itemVariants}
              >
                <Input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 h-12"
                />
                <Button 
                  size="lg" 
                  className="h-12 px-8"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div 
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Brand Section */}
              <motion.div variants={itemVariants}>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-3">
                    <AuroraText>Sweet Escape</AuroraText>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Crafting artisanal desserts with love and the finest ingredients since 2020. Every bite tells a story of passion and perfection.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">123 Dessert Lane</p>
                      <p>Sweet City, SC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <p>(555) 123-CAKE</p>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-5 w-5 mr-3 text-primary" />
                    <p>hello@sweetescape.com</p>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p>Mon - Sat: 7AM - 10PM</p>
                      <p>Sunday: 8AM - 9PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={itemVariants}>
                <h4 className="font-semibold text-lg mb-6 text-foreground">Quick Links</h4>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        to={link.href} 
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group text-lg"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Awards */}
                <div className="mt-8">
                  <h5 className="font-medium mb-4 text-foreground">Awards & Recognition</h5>
                  <div className="space-y-3">
                    <div className="flex items-center text-muted-foreground">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>4.9/5 Customer Rating</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span>50K+ Happy Customers</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Social & Newsletter */}
              <motion.div variants={itemVariants}>
                <h4 className="font-semibold text-lg mb-6 text-foreground">Follow Our Sweet Journey</h4>
                
                {/* Social Media */}
                <div className="mb-8">
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        className="group bg-card hover:bg-primary/10 p-3 rounded-lg transition-all duration-300 border border-border hover:border-primary/50"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Why Choose Us */}
                <div>
                  <h5 className="font-medium mb-4 text-foreground">Why Choose Sweet Escape?</h5>
                  <div className="space-y-3 text-muted-foreground">
                    <p>✨ Fresh ingredients daily</p>
                    <p>🎂 Custom cake designs</p>
                    <p>🚚 Fast & safe delivery</p>
                    <p>💝 Perfect for any occasion</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-border py-6 bg-card/20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
              variants={itemVariants}
            >
              <div className="flex items-center text-muted-foreground">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                <p>&copy; {currentYear} Sweet Escape. Made with love for dessert lovers everywhere.</p>
              </div>
              
              <div className="flex items-center gap-6 text-muted-foreground text-sm">
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
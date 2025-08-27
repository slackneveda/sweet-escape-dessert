export interface Dessert {
  id: string
  name: string
  description: string
  price: number
  category: 'cakes' | 'pastries' | 'ice-creams' | 'cookies' | 'seasonal'
  image: string
  featured: boolean
  available: boolean
}

export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}
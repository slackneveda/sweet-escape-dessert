export interface Dessert {
  id: string
  name: string
  description: string
  price: number
  category: 'cakes' | 'pastries' | 'ice-creams' | 'cookies' | 'seasonal'
  image: string
  featured: boolean
  available: boolean
  rating: number
  reviewCount: number
}

export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  picture?: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface CartItem {
  id: string
  dessert: Dessert
  quantity: number
  specialInstructions?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  subtotal: number
  tax: number
  delivery: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  orderDate: Date
  deliveryDate?: Date
  customerInfo: CustomerInfo
  paymentInfo: PaymentInfo
  orderType: 'pickup' | 'delivery'
}

export interface DeliveryLocation {
  lat: number
  lng: number
  address: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  deliveryLocation?: DeliveryLocation
}

export interface PaymentInfo {
  method: 'card' | 'paypal' | 'cash'
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  transactionId?: string
  amount: number
  stripePaymentMethodId?: string
  stripePaymentIntentId?: string
}

export interface Review {
  id: string
  dessertId: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: Date
  verified: boolean
  status: 'pending' | 'approved' | 'rejected'
  moderationNote?: string
  moderatedBy?: string
  moderatedAt?: Date
}

export interface StripeWebhookEvent {
  id: string
  type: string
  created: number
  data: {
    object: any
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
}

export interface PaymentStatusUpdate {
  orderId: string
  paymentIntentId: string
  status: 'succeeded' | 'failed' | 'canceled' | 'processing' | 'requires_action'
  amount: number
  currency: string
  metadata?: Record<string, string>
}
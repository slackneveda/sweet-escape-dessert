import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, MapPin, Phone, Clock, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StripePaymentForm } from '@/components/StripePaymentForm'
import { DeliveryLocationMap } from '@/components/DeliveryLocationMap'
import { useKV } from '@github/spark/hooks'
import { useCart } from '@/contexts/CartContext'
import { useWebhookListener } from '@/hooks/useWebhookListener'
import { Cart, Order, CustomerInfo, PaymentInfo, DeliveryLocation } from '@/types'
import { toast } from 'sonner'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: Cart
}

type CheckoutStep = 'details' | 'payment' | 'confirmation'

export function CheckoutModal({ isOpen, onClose, cart }: CheckoutModalProps) {
  const { clearCart } = useCart()
  const [orders, setOrders] = useKV<Order[]>('user-orders', [])
  const [allOrders, setAllOrders] = useKV<Order[]>('orders', []) // Store all orders for admin
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('details')
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  // Set up webhook listener for the completed order
  useWebhookListener(completedOrder?.id)

  // Form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: orderType === 'delivery' ? {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    } : undefined
  })

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card')
  
  const handleStripePaymentSuccess = async (paymentInfo: PaymentInfo) => {
    const orderId = `order_${Date.now()}`
    const newOrder: Order = {
      id: orderId,
      userId: 'current-user', // In real app, get from auth context
      items: cart.items,
      total: cart.total,
      status: 'pending',
      orderDate: new Date(),
      customerInfo,
      paymentInfo: {
        ...paymentInfo,
        // Ensure we have the payment intent ID for webhook tracking
        stripePaymentIntentId: paymentInfo.stripePaymentIntentId || `pi_${Date.now()}`
      },
      orderType
    }
    
    // Store in both user orders and all orders
    setOrders(currentOrders => [...(currentOrders || []), newOrder])
    setAllOrders(allCurrentOrders => [...(allCurrentOrders || []), newOrder])
    
    setCompletedOrder(newOrder)
    setCurrentStep('confirmation')
    clearCart()
    
    toast.success('Order placed successfully! Payment processing...')
  }

  const handleStripePaymentError = (error: string) => {
    toast.error(error)
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      address: { ...prev.address!, [field]: value }
    }))
  }

  const validateCustomerInfo = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields')
      return false
    }
    
    if (orderType === 'delivery') {
      // Check if delivery location is selected via map OR manual address is filled
      const hasMapLocation = customerInfo.deliveryLocation
      const hasManualAddress = customerInfo.address && 
        customerInfo.address.street && 
        customerInfo.address.city && 
        customerInfo.address.state && 
        customerInfo.address.zipCode

      if (!hasMapLocation && !hasManualAddress) {
        toast.error('Please select a delivery location on the map or fill in the address fields manually')
        return false
      }
    }
    
    return true
  }

  const validatePayment = () => {
    if (paymentMethod === 'cash' || paymentMethod === 'paypal') return true
    
    // For Stripe payments, validation is handled by the StripePaymentForm component
    if (paymentMethod === 'card') return true
    
    return true
  }

  const processPayment = async (): Promise<PaymentInfo> => {
    // For non-card payments, simulate processing
    if (paymentMethod !== 'card') {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate payment success (95% success rate for non-card payments)
      const isSuccess = Math.random() > 0.05
      
      if (!isSuccess) {
        throw new Error('Payment failed. Please try again.')
      }
      
      return {
        method: paymentMethod,
        status: 'paid',
        transactionId: `txn_${Date.now()}`,
        amount: cart.total
      }
    }
    
    // Card payments are handled by StripePaymentForm
    throw new Error('Card payments should be handled by Stripe component')
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      // Stripe payments are handled by the StripePaymentForm component
      return
    }
    
    if (!validatePayment()) return
    
    setIsProcessing(true)
    
    try {
      const paymentInfo = await processPayment()
      handleStripePaymentSuccess(paymentInfo) // Reuse the same success handler
    } catch (error) {
      handleStripePaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setCurrentStep('details')
    setCompletedOrder(null)
    onClose()
  }

  const resetForm = () => {
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: orderType === 'delivery' ? {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      } : undefined,
      deliveryLocation: undefined
    })
    setPaymentMethod('card')
  }

  // Update address when order type changes
  const handleOrderTypeChange = (type: 'pickup' | 'delivery') => {
    setOrderType(type)
    setCustomerInfo(prev => ({
      ...prev,
      address: type === 'delivery' ? {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      } : undefined,
      deliveryLocation: undefined // Reset delivery location when switching
    }))
  }

  // Handle delivery location selection from map
  const handleDeliveryLocationSelect = (location: DeliveryLocation) => {
    setCustomerInfo(prev => {
      // Parse the geocoded address to fill in individual fields
      const addressParts = location.address.split(',').map(part => part.trim())
      
      // Try to intelligently parse the address components
      const street = addressParts[0] || ''
      const city = addressParts[1] || ''
      const stateZip = addressParts[2] || ''
      
      // Extract state and zip from the last part (e.g., "CA 90210")
      const stateZipMatch = stateZip.match(/^(.+?)\s+(\d{5}(?:-\d{4})?)$/)
      const state = stateZipMatch ? stateZipMatch[1] : stateZip
      const zipCode = stateZipMatch ? stateZipMatch[2] : ''

      return {
        ...prev,
        deliveryLocation: location,
        // Auto-populate address fields from geocoded address
        address: {
          street,
          city,
          state,
          zipCode
        }
      }
    })
  }

  if (currentStep === 'confirmation' && completedOrder) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Order Confirmed!</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
            </motion.div>
            
            <h3 className="text-lg font-semibold mb-2">Thank you for your order!</h3>
            <p className="text-muted-foreground mb-4">
              Order #{completedOrder.id.split('_')[1]}
            </p>
            
            <div className="bg-muted p-4 rounded-lg mb-4 space-y-2">
              <p className="text-sm">
                {orderType === 'pickup' 
                  ? 'Your order will be ready for pickup in 20-30 minutes'
                  : 'Your order will be delivered in 45-60 minutes'
                }
              </p>
              {orderType === 'delivery' && completedOrder.customerInfo.deliveryLocation && (
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Delivery Address:</p>
                  <p className="text-xs">{completedOrder.customerInfo.deliveryLocation.address}</p>
                </div>
              )}
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant={currentStep === 'details' ? 'default' : 'secondary'}>
            1. Details
          </Badge>
          <div className="h-px bg-border flex-1" />
          <Badge variant={currentStep === 'payment' ? 'default' : 'secondary'}>
            2. Payment
          </Badge>
        </div>

        {currentStep === 'details' && (
          <div className="space-y-6">
            {/* Order Type */}
            <div>
              <Label className="text-base font-semibold">Order Type</Label>
              <RadioGroup 
                value={orderType} 
                onValueChange={handleOrderTypeChange}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center gap-2">
                    <Clock size={16} />
                    Pickup (20-30 min)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex items-center gap-2">
                    <MapPin size={16} />
                    Delivery (45-60 min)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Contact Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="space-y-4">
                {/* Interactive Map for Location Selection */}
                <DeliveryLocationMap
                  onLocationSelect={handleDeliveryLocationSelect}
                  selectedLocation={customerInfo.deliveryLocation}
                />
                
                {/* Manual Address Entry (Optional - auto-populated from map) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">Delivery Address Details</Label>
                    <Badge variant="secondary" className="text-xs">
                      Auto-filled from map selection
                    </Badge>
                  </div>
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={customerInfo.address?.street || ''}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={customerInfo.address?.city || ''}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={customerInfo.address?.state || ''}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={customerInfo.address?.zipCode || ''}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.dessert.name}</span>
                    <span>${(item.dessert.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${cart.tax.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>${cart.delivery.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base border-t pt-1">
                    <span>Total:</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (validateCustomerInfo()) {
                    setCurrentStep('payment')
                  }
                }}
                className="flex-1"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <Label className="text-base font-semibold">Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value: 'card' | 'paypal' | 'cash') => setPaymentMethod(value)}
                className="space-y-3 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard size={16} />
                    Credit/Debit Card (Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash ({orderType === 'pickup' ? 'on pickup' : 'on delivery'})</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Stripe Card Payment */}
            {paymentMethod === 'card' && (
              <StripePaymentForm
                cart={cart}
                customerEmail={customerInfo.email}
                onPaymentSuccess={handleStripePaymentSuccess}
                onPaymentError={handleStripePaymentError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            )}

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to PayPal to complete your payment.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('details')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processing...' : `Pay with PayPal - $${cart.total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You can pay with cash when you {orderType === 'pickup' ? 'pick up' : 'receive'} your order.
                    Please have exact change ready.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('details')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processing...' : `Place Order - $${cart.total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}

            {/* Back button for card payments is handled within StripePaymentForm */}
            {paymentMethod === 'card' && (
              <div className="flex">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('details')}
                  className="flex-1"
                >
                  Back to Details
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
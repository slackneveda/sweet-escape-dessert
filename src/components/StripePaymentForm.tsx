import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { CreditCard, Lock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Cart, PaymentInfo } from '@/types'
import { toast } from 'sonner'

interface StripePaymentFormProps {
  cart: Cart
  customerEmail: string
  onPaymentSuccess: (paymentInfo: PaymentInfo) => void
  onPaymentError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export function StripePaymentForm({ 
  cart, 
  customerEmail, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing,
  setIsProcessing 
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      onPaymentError('Stripe has not loaded yet. Please try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      onPaymentError('Card element not found')
      return
    }

    setIsProcessing(true)
    setCardError(null)

    try {
      // Create payment method
      const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: customerEmail,
        },
      })

      if (createError) {
        throw new Error(createError.message || 'Failed to create payment method')
      }

      // Generate unique payment intent ID and order ID for demo
      const orderId = `order_${Date.now()}`
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // In a real app, you would create a payment intent on your backend with metadata
      // For demo purposes, we'll simulate this process
      console.log('Creating payment intent with metadata:', {
        orderId,
        customerEmail,
        amount: cart.total * 100, // Stripe uses cents
        metadata: {
          orderId: orderId,
          customerEmail: customerEmail,
          itemCount: cart.items.length.toString()
        }
      })

      // Simulate successful payment for demo
      const paymentInfo: PaymentInfo = {
        method: 'card',
        status: 'pending', // Start as pending, will be updated by webhook
        transactionId: paymentIntentId,
        amount: cart.total,
        stripePaymentMethodId: paymentMethod.id,
        stripePaymentIntentId: paymentIntentId
      }

      toast.success('Payment submitted! Processing...')
      onPaymentSuccess(paymentInfo)

      // Simulate webhook processing after a short delay
      setTimeout(() => {
        // This would normally be triggered by a real Stripe webhook
        console.log('Simulating webhook processing for payment:', paymentIntentId)
      }, 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setCardError(errorMessage)
      onPaymentError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#3c4043',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#B7410E',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: false,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard size={20} />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>
            {cart.delivery > 0 && (
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>${cart.delivery.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock size={20} />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement 
              options={cardElementOptions}
              onChange={(event) => {
                setCardError(event.error ? event.error.message : null)
              }}
            />
          </div>
          
          {cardError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {cardError}
            </motion.div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock size={14} />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size={16} />
            Processing Payment...
          </div>
        ) : (
          `Pay $${cart.total.toFixed(2)}`
        )}
      </Button>

      {/* Test Card Info */}
      <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
        <p className="font-medium mb-1">Test Card Numbers:</p>
        <p>• Visa: 4242 4242 4242 4242</p>
        <p>• Use any future expiry date and any 3-digit CVC</p>
      </div>
    </form>
  )
}
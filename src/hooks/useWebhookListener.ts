import { useEffect, useCallback } from 'react'
import { webhookService } from '@/services/webhookService'
import type { PaymentStatusUpdate } from '@/types'
import { toast } from 'sonner'

/**
 * Hook for subscribing to webhook events for order status updates
 */
export function useWebhookListener(orderId?: string) {
  const handlePaymentUpdate = useCallback((update: PaymentStatusUpdate) => {
    console.log('Payment status update received:', update)
    
    switch (update.status) {
      case 'succeeded':
        toast.success('Payment successful! Your order has been confirmed.', {
          description: `Order #${update.orderId}`
        })
        break
      case 'failed':
        toast.error('Payment failed. Please try again.', {
          description: `Order #${update.orderId}`
        })
        break
      case 'canceled':
        toast.warning('Payment was canceled.', {
          description: `Order #${update.orderId}`
        })
        break
      case 'processing':
        toast.info('Payment is being processed...', {
          description: `Order #${update.orderId}`
        })
        break
      case 'requires_action':
        toast.warning('Payment requires additional action.', {
          description: `Order #${update.orderId}`
        })
        break
    }
  }, [])

  useEffect(() => {
    if (!orderId) return

    console.log('Setting up webhook listener for order:', orderId)
    const unsubscribe = webhookService.subscribeToOrderUpdates(orderId, handlePaymentUpdate)

    return () => {
      console.log('Cleaning up webhook listener for order:', orderId)
      unsubscribe()
    }
  }, [orderId, handlePaymentUpdate])

  return {
    simulateWebhook: useCallback((eventType: string, paymentIntentId: string) => {
      if (orderId) {
        webhookService.simulateWebhookEvent(orderId, eventType, paymentIntentId)
      }
    }, [orderId])
  }
}
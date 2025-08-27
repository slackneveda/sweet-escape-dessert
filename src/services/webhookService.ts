import type { StripeWebhookEvent, PaymentStatusUpdate, Order } from '@/types'

/**
 * Webhook service for handling Stripe payment status updates
 * In a real application, this would be a backend service
 * This implementation simulates webhook handling for the frontend
 */
export class WebhookService {
  private static instance: WebhookService
  private listeners: Map<string, ((event: PaymentStatusUpdate) => void)[]> = new Map()
  
  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService()
    }
    return WebhookService.instance
  }

  /**
   * Subscribe to payment status updates for a specific order
   */
  subscribeToOrderUpdates(orderId: string, callback: (event: PaymentStatusUpdate) => void) {
    if (!this.listeners.has(orderId)) {
      this.listeners.set(orderId, [])
    }
    this.listeners.get(orderId)!.push(callback)
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(orderId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
        if (callbacks.length === 0) {
          this.listeners.delete(orderId)
        }
      }
    }
  }

  /**
   * Process incoming Stripe webhook events
   */
  async processWebhookEvent(event: StripeWebhookEvent): Promise<void> {
    try {
      console.log('Processing webhook event:', event.type, event.id)
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event)
          break
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event)
          break
        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event)
          break
        case 'payment_intent.processing':
          await this.handlePaymentProcessing(event)
          break
        case 'payment_intent.requires_action':
          await this.handlePaymentRequiresAction(event)
          break
        default:
          console.log('Unhandled webhook event type:', event.type)
      }
    } catch (error) {
      console.error('Error processing webhook event:', error)
      throw error
    }
  }

  private async handlePaymentSucceeded(event: StripeWebhookEvent) {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata?.orderId
    
    if (orderId) {
      const update: PaymentStatusUpdate = {
        orderId,
        paymentIntentId: paymentIntent.id,
        status: 'succeeded',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      }
      
      await this.notifyOrderListeners(orderId, update)
      await this.updateOrderStatus(orderId, 'confirmed')
    }
  }

  private async handlePaymentFailed(event: StripeWebhookEvent) {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata?.orderId
    
    if (orderId) {
      const update: PaymentStatusUpdate = {
        orderId,
        paymentIntentId: paymentIntent.id,
        status: 'failed',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      }
      
      await this.notifyOrderListeners(orderId, update)
      await this.updateOrderStatus(orderId, 'cancelled')
    }
  }

  private async handlePaymentCanceled(event: StripeWebhookEvent) {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata?.orderId
    
    if (orderId) {
      const update: PaymentStatusUpdate = {
        orderId,
        paymentIntentId: paymentIntent.id,
        status: 'canceled',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      }
      
      await this.notifyOrderListeners(orderId, update)
      await this.updateOrderStatus(orderId, 'cancelled')
    }
  }

  private async handlePaymentProcessing(event: StripeWebhookEvent) {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata?.orderId
    
    if (orderId) {
      const update: PaymentStatusUpdate = {
        orderId,
        paymentIntentId: paymentIntent.id,
        status: 'processing',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      }
      
      await this.notifyOrderListeners(orderId, update)
    }
  }

  private async handlePaymentRequiresAction(event: StripeWebhookEvent) {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata?.orderId
    
    if (orderId) {
      const update: PaymentStatusUpdate = {
        orderId,
        paymentIntentId: paymentIntent.id,
        status: 'requires_action',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      }
      
      await this.notifyOrderListeners(orderId, update)
    }
  }

  private async notifyOrderListeners(orderId: string, update: PaymentStatusUpdate) {
    const callbacks = this.listeners.get(orderId)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(update)
        } catch (error) {
          console.error('Error in payment status callback:', error)
        }
      })
    }
  }

  private async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      // Get current orders from storage
      const orders = await spark.kv.get<Order[]>('orders') || []
      
      // Find and update the order
      const orderIndex = orders.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status,
          paymentInfo: {
            ...orders[orderIndex].paymentInfo,
            status: status === 'confirmed' ? 'paid' : 
                   status === 'cancelled' ? 'failed' : 
                   orders[orderIndex].paymentInfo.status
          }
        }
        
        // Save updated orders
        await spark.kv.set('orders', orders)
        console.log(`Order ${orderId} status updated to ${status}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  /**
   * Simulate webhook events for testing purposes
   * In production, these would come from Stripe's webhook endpoint
   */
  async simulateWebhookEvent(orderId: string, eventType: string, paymentIntentId: string) {
    const event: StripeWebhookEvent = {
      id: `evt_${Date.now()}`,
      type: eventType,
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: paymentIntentId,
          amount: 2000, // $20.00
          currency: 'usd',
          status: eventType.includes('succeeded') ? 'succeeded' : 
                 eventType.includes('failed') ? 'failed' : 
                 eventType.includes('canceled') ? 'canceled' : 'processing',
          metadata: {
            orderId: orderId
          }
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null
      }
    }

    await this.processWebhookEvent(event)
  }
}

// Export singleton instance
export const webhookService = WebhookService.getInstance()
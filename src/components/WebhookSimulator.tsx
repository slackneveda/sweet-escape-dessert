import { useState } from 'react'
import { Webhook, Play, CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { webhookService } from '@/services/webhookService'
import { useKV } from '@github/spark/hooks'
import { Order } from '@/types'
import { toast } from 'sonner'

export function WebhookSimulator() {
  const [orders] = useKV<Order[]>('orders', [])
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [eventType, setEventType] = useState<string>('payment_intent.succeeded')
  const [paymentIntentId, setPaymentIntentId] = useState<string>('')
  const [isSimulating, setIsSimulating] = useState(false)
  const [webhookHistory, setWebhookHistory] = useState<Array<{
    id: string
    orderId: string
    eventType: string
    timestamp: Date
    status: 'success' | 'error'
    message: string
  }>>([])

  const eventTypes = [
    { value: 'payment_intent.succeeded', label: 'Payment Succeeded', icon: CheckCircle, color: 'text-green-600' },
    { value: 'payment_intent.payment_failed', label: 'Payment Failed', icon: XCircle, color: 'text-red-600' },
    { value: 'payment_intent.canceled', label: 'Payment Canceled', icon: XCircle, color: 'text-gray-600' },
    { value: 'payment_intent.processing', label: 'Payment Processing', icon: Clock, color: 'text-blue-600' },
    { value: 'payment_intent.requires_action', label: 'Requires Action', icon: Clock, color: 'text-yellow-600' }
  ]

  const pendingOrders = orders.filter(order => 
    order.status === 'pending' && order.paymentInfo.status === 'pending'
  )

  const handleSimulateWebhook = async () => {
    if (!selectedOrderId || !eventType) {
      toast.error('Please select an order and event type')
      return
    }

    setIsSimulating(true)

    try {
      const intentId = paymentIntentId || `pi_sim_${Date.now()}`
      
      await webhookService.simulateWebhookEvent(selectedOrderId, eventType, intentId)
      
      const newHistoryEntry = {
        id: `wh_${Date.now()}`,
        orderId: selectedOrderId,
        eventType,
        timestamp: new Date(),
        status: 'success' as const,
        message: `Webhook event ${eventType} simulated successfully`
      }
      
      setWebhookHistory(prev => [newHistoryEntry, ...prev].slice(0, 10)) // Keep last 10 entries
      
      toast.success('Webhook event simulated successfully!')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to simulate webhook'
      
      const newHistoryEntry = {
        id: `wh_${Date.now()}`,
        orderId: selectedOrderId,
        eventType,
        timestamp: new Date(),
        status: 'error' as const,
        message: errorMessage
      }
      
      setWebhookHistory(prev => [newHistoryEntry, ...prev].slice(0, 10))
      
      toast.error(errorMessage)
    } finally {
      setIsSimulating(false)
    }
  }

  const selectedEventType = eventTypes.find(e => e.value === eventType)
  const selectedOrder = orders.find(o => o.id === selectedOrderId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook size={20} />
          Webhook Simulator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Simulate Stripe webhook events to test payment status updates
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook Configuration */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="order-select">Select Order</Label>
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an order to simulate webhook for" />
              </SelectTrigger>
              <SelectContent>
                {pendingOrders.length === 0 ? (
                  <SelectItem value="" disabled>No pending orders available</SelectItem>
                ) : (
                  pendingOrders.map(order => (
                    <SelectItem key={order.id} value={order.id}>
                      Order #{order.id.split('_')[1]} - ${order.total.toFixed(2)} ({order.customerInfo.name})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="event-type">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(event => {
                  const IconComponent = event.icon
                  return (
                    <SelectItem key={event.value} value={event.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent size={16} className={event.color} />
                        {event.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payment-intent-id">Payment Intent ID (Optional)</Label>
            <Input
              id="payment-intent-id"
              value={paymentIntentId}
              onChange={(e) => setPaymentIntentId(e.target.value)}
              placeholder="pi_1234567890..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to auto-generate a test payment intent ID
            </p>
          </div>

          {selectedOrder && (
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Selected Order Details</h4>
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Customer:</span> {selectedOrder.customerInfo.name}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.customerInfo.email}</p>
                <p><span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentInfo.status}</p>
                <p><span className="font-medium">Order Status:</span> {selectedOrder.status}</p>
                {selectedOrder.paymentInfo.stripePaymentIntentId && (
                  <p><span className="font-medium">Payment Intent:</span> {selectedOrder.paymentInfo.stripePaymentIntentId}</p>
                )}
              </div>
            </div>
          )}

          <Button 
            onClick={handleSimulateWebhook}
            disabled={isSimulating || !selectedOrderId || pendingOrders.length === 0}
            className="w-full"
          >
            {isSimulating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Simulating Webhook...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play size={16} />
                Simulate {selectedEventType?.label}
              </div>
            )}
          </Button>
        </div>

        {/* Webhook History */}
        {webhookHistory.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Webhook Events</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {webhookHistory.map(entry => {
                  const eventTypeConfig = eventTypes.find(e => e.value === entry.eventType)
                  const IconComponent = eventTypeConfig?.icon || Webhook
                  
                  return (
                    <div key={entry.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <IconComponent size={16} className={eventTypeConfig?.color || 'text-gray-600'} />
                          <span className="text-sm font-medium">{eventTypeConfig?.label}</span>
                          <Badge variant={entry.status === 'success' ? 'default' : 'destructive'}>
                            {entry.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Order: #{entry.orderId.split('_')[1]}
                      </p>
                      <p className="text-xs">{entry.message}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">How it works</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Select a pending order to simulate webhook events for</li>
            <li>• Choose the type of webhook event to simulate</li>
            <li>• The system will process the event and update the order status</li>
            <li>• Users will receive real-time notifications about status changes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
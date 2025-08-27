import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle2, Clock, XCircle, Zap } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { webhookService } from '@/services/webhookService'
import type { Order, PaymentStatusUpdate } from '@/types'

export function WebhookTester() {
  const [orders] = useKV<Order[]>('orders', [])
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [eventType, setEventType] = useState('payment_intent.succeeded')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [testResults, setTestResults] = useKV<PaymentStatusUpdate[]>('webhook-test-results', [])
  const [isProcessing, setIsProcessing] = useState(false)

  // Generate random payment intent ID if empty
  useEffect(() => {
    if (!paymentIntentId) {
      setPaymentIntentId(`pi_test_${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [paymentIntentId])

  const eventTypes = [
    { value: 'payment_intent.succeeded', label: 'Payment Succeeded', icon: CheckCircle2, color: 'text-green-600' },
    { value: 'payment_intent.payment_failed', label: 'Payment Failed', icon: XCircle, color: 'text-red-600' },
    { value: 'payment_intent.canceled', label: 'Payment Canceled', icon: XCircle, color: 'text-gray-600' },
    { value: 'payment_intent.processing', label: 'Payment Processing', icon: Clock, color: 'text-blue-600' },
    { value: 'payment_intent.requires_action', label: 'Requires Action', icon: AlertCircle, color: 'text-yellow-600' }
  ]

  const handleTestWebhook = async () => {
    if (!selectedOrderId) {
      toast.error('Please select an order to test')
      return
    }

    setIsProcessing(true)
    
    try {
      // Subscribe to order updates to capture the result
      const unsubscribe = webhookService.subscribeToOrderUpdates(selectedOrderId, (update) => {
        setTestResults(prev => [update, ...(prev || []).slice(0, 9)]) // Keep last 10 results
        
        const eventTypeInfo = eventTypes.find(et => et.value === eventType)
        toast.success(`Webhook processed: ${eventTypeInfo?.label}`, {
          description: `Order ${selectedOrderId} status updated`
        })
      })

      // Simulate the webhook event
      await webhookService.simulateWebhookEvent(selectedOrderId, eventType, paymentIntentId)
      
      // Clean up subscription after a delay
      setTimeout(() => {
        unsubscribe()
      }, 1000)
      
      // Generate new payment intent ID for next test
      setPaymentIntentId(`pi_test_${Math.random().toString(36).substr(2, 9)}`)
      
    } catch (error) {
      console.error('Webhook test failed:', error)
      toast.error('Webhook test failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const clearTestResults = () => {
    setTestResults([])
    toast.success('Test results cleared')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'canceled':
        return <XCircle className="h-4 w-4 text-gray-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'requires_action':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'requires_action':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Webhook Event Tester
          </CardTitle>
          <CardDescription>
            Test Stripe webhook events for order status updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="order-select">Select Order</Label>
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an order to test" />
              </SelectTrigger>
              <SelectContent>
                {orders.map(order => (
                  <SelectItem key={order.id} value={order.id}>
                    Order #{order.id.slice(-6)} - ${order.total.toFixed(2)} ({order.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-type">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(event => {
                  const Icon = event.icon
                  return (
                    <SelectItem key={event.value} value={event.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${event.color}`} />
                        {event.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-intent">Payment Intent ID</Label>
            <Input
              id="payment-intent"
              value={paymentIntentId}
              onChange={(e) => setPaymentIntentId(e.target.value)}
              placeholder="pi_test_123..."
            />
          </div>

          <Button 
            onClick={handleTestWebhook} 
            disabled={isProcessing || !selectedOrderId}
            className="w-full"
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Clock className="h-4 w-4" />
              </motion.div>
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? 'Processing...' : 'Test Webhook Event'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Recent webhook test results
            </CardDescription>
          </div>
          {testResults.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearTestResults}>
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No test results yet</p>
              <p className="text-sm">Run a webhook test to see results here</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <motion.div
                    key={`${result.orderId}-${result.paymentIntentId}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            #{result.orderId.slice(-6)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Intent:</span>
                            <span className="font-mono text-xs">{result.paymentIntentId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span>${(result.amount / 100).toFixed(2)} {result.currency.toUpperCase()}</span>
                          </div>
                          {result.metadata && Object.keys(result.metadata).length > 0 && (
                            <div>
                              <span className="text-muted-foreground">Metadata:</span>
                              <div className="ml-2 mt-1 space-y-1">
                                {Object.entries(result.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{key}:</span>
                                    <span className="font-mono">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    {index < testResults.length - 1 && <Separator className="my-2" />}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
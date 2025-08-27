import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Copy, Code, Play, Terminal, CheckCircle2, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { webhookService } from '@/services/webhookService'

export function WebhookEndpointSimulator() {
  const [endpointUrl, setEndpointUrl] = useState('https://your-app.com/webhooks/stripe')
  const [webhookSecret, setWebhookSecret] = useState('whsec_test_...')
  const [customPayload, setCustomPayload] = useState('')
  const [responses, setResponses] = useState<Array<{
    id: string
    timestamp: number
    status: number
    payload: any
    response: string
  }>>([])

  const defaultPayload = {
    id: "evt_test_webhook",
    object: "event",
    created: Math.floor(Date.now() / 1000),
    type: "payment_intent.succeeded",
    data: {
      object: {
        id: "pi_test_123",
        object: "payment_intent",
        amount: 2000,
        currency: "usd",
        status: "succeeded",
        metadata: {
          orderId: "order_123"
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

  const simulateWebhookCall = async () => {
    try {
      let payload
      if (customPayload.trim()) {
        payload = JSON.parse(customPayload)
      } else {
        payload = {
          ...defaultPayload,
          id: `evt_${Date.now()}`,
          created: Math.floor(Date.now() / 1000),
          data: {
            ...defaultPayload.data,
            object: {
              ...defaultPayload.data.object,
              id: `pi_test_${Math.random().toString(36).substr(2, 9)}`
            }
          }
        }
      }

      // Simulate processing the webhook
      await webhookService.processWebhookEvent(payload)

      const response = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 200,
        payload,
        response: JSON.stringify({ received: true, processed: true }, null, 2)
      }

      setResponses(prev => [response, ...prev.slice(0, 9)]) // Keep last 10

      toast.success('Webhook processed successfully', {
        description: `Event ${payload.type} processed`
      })

    } catch (error) {
      const errorResponse = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 400,
        payload: null,
        response: JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Invalid webhook payload' 
        }, null, 2)
      }

      setResponses(prev => [errorResponse, ...prev.slice(0, 9)])

      toast.error('Webhook processing failed', {
        description: error instanceof Error ? error.message : 'Invalid payload'
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const sampleCode = `// Express.js webhook endpoint example
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Webhook endpoint for Stripe events
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send('Webhook Error: \${err.message}');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      
      // Update order status to confirmed
      updateOrderStatus(orderId, 'confirmed');
      console.log('PaymentIntent was successful!');
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedOrderId = failedPayment.metadata.orderId;
      
      // Update order status to cancelled
      updateOrderStatus(failedOrderId, 'cancelled');
      console.log('PaymentIntent failed!');
      break;
      
    default:
      console.log('Unhandled event type \${event.type}');
  }

  // Return a 200 response to acknowledge receipt
  res.json({received: true});
});

async function updateOrderStatus(orderId, status) {
  // Update order in your database
  await Order.findByIdAndUpdate(orderId, { status });
  
  // Notify customer via email/SMS
  await notifyCustomer(orderId, status);
}

app.listen(3000, () => console.log('Server running on port 3000'));`

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Webhook Endpoint Simulator</h3>
        <p className="text-sm text-muted-foreground">
          Test webhook payload processing and view responses in real-time
        </p>
      </div>

      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="code">Sample Code</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Endpoint Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint-url">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="endpoint-url"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      placeholder="https://your-app.com/webhooks/stripe"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(endpointUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-secret"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      placeholder="whsec_test_..."
                      type="password"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(webhookSecret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Payload</CardTitle>
                <CardDescription>
                  Leave empty to use default payload or paste custom JSON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  placeholder="Leave empty for default or paste custom JSON payload..."
                  rows={8}
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button onClick={simulateWebhookCall} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Send Webhook Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCustomPayload(JSON.stringify(defaultPayload, null, 2))}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Load Default Payload
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Sample Webhook Endpoint Implementation
              </CardTitle>
              <CardDescription>
                Example Node.js/Express implementation for handling Stripe webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ScrollArea className="h-[500px] w-full rounded-md border">
                  <pre className="p-4 text-sm">
                    <code className="text-muted-foreground">{sampleCode}</code>
                  </pre>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(sampleCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Response History</CardTitle>
              <CardDescription>
                Log of webhook calls and their responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {responses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No webhook calls yet</p>
                  <p className="text-sm">Send a webhook event to see responses here</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {responses.map((response, index) => (
                      <motion.div
                        key={response.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {response.status === 200 ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Badge variant={response.status === 200 ? "default" : "destructive"}>
                              {response.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        {response.payload && (
                          <div className="mb-3">
                            <Label className="text-xs text-muted-foreground">Payload:</Label>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(response.payload, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Response:</Label>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                            {response.response}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
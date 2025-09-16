import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, CheckCircle2, Code, ExternalLink, Lightbulb, PlayCircle, Terminal, Webhook, Zap } from 'lucide-react'

export function WebhookTestingGuide() {
  const testingSteps = [
    {
      title: "Create Test Orders",
      description: "Navigate to the menu and create some test orders to have data to work with",
      icon: PlayCircle,
      status: "required"
    },
    {
      title: "Use Manual Tester",
      description: "Select an order and test different webhook event types manually",
      icon: Zap,
      status: "recommended"
    },
    {
      title: "Enable Real-time Monitoring",
      description: "Start monitoring to enable automatic webhook simulations",
      icon: Terminal,
      status: "optional"
    },
    {
      title: "Test Endpoint Simulation",
      description: "Use the endpoint simulator to test custom payloads and responses",
      icon: Code,
      status: "advanced"
    }
  ]

  const webhookEvents = [
    {
      event: "payment_intent.succeeded",
      description: "Payment completed successfully",
      expectedBehavior: "Order status changes to 'confirmed'",
      testScenario: "Complete a successful payment"
    },
    {
      event: "payment_intent.payment_failed",
      description: "Payment failed or was declined",
      expectedBehavior: "Order status changes to 'cancelled'",
      testScenario: "Simulate a failed payment"
    },
    {
      event: "payment_intent.canceled",
      description: "Payment was cancelled by customer",
      expectedBehavior: "Order status changes to 'cancelled'",
      testScenario: "Customer cancels before payment"
    },
    {
      event: "payment_intent.processing",
      description: "Payment is being processed",
      expectedBehavior: "No status change, shows processing",
      testScenario: "Long-running payment process"
    },
    {
      event: "payment_intent.requires_action",
      description: "Payment requires additional authentication",
      expectedBehavior: "Customer prompted for 3D Secure",
      testScenario: "Strong customer authentication"
    }
  ]

  const troubleshooting = [
    {
      problem: "No orders available for testing",
      solution: "Create test orders by adding items to cart and going through checkout process",
      severity: "high"
    },
    {
      problem: "Webhook events not updating order status",
      solution: "Check browser console for errors and verify order IDs match",
      severity: "medium"
    },
    {
      problem: "Real-time monitoring not working",
      solution: "Ensure monitoring is enabled and check connection status",
      severity: "low"
    },
    {
      problem: "Custom payloads causing errors",
      solution: "Validate JSON syntax and ensure required fields are present",
      severity: "medium"
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'required':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'recommended':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'optional':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Webhook Testing Guide
        </CardTitle>
        <CardDescription>
          Complete guide for testing Stripe webhook events and order status updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="steps">Testing Steps</TabsTrigger>
            <TabsTrigger value="events">Webhook Events</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Testing Workflow</h4>
              {testingSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{step.title}</h5>
                        <Badge className={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Webhook Event Types</h4>
              {webhookEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Webhook className="h-4 w-4 text-primary" />
                    <code className="text-sm bg-muted px-2 py-1 rounded">{event.event}</code>
                  </div>
                  <p className="text-sm mb-2">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Expected Behavior:</span>
                      <p>{event.expectedBehavior}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Test Scenario:</span>
                      <p>{event.testScenario}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Common Issues & Solutions</h4>
              {troubleshooting.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{item.problem}</h5>
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.solution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Stripe Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h6 className="font-medium mb-1">Webhook Events</h6>
                    <p className="text-sm text-muted-foreground mb-2">
                      Complete reference for all Stripe webhook events
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View Docs
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h6 className="font-medium mb-1">Payment Intents API</h6>
                    <p className="text-sm text-muted-foreground mb-2">
                      Learn about payment intent lifecycle and events
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View API Reference
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Always verify webhook signatures in production</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Handle webhook events idempotently</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Return 200 status code for successful processing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Implement retry logic for failed webhooks</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Log webhook events for debugging</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
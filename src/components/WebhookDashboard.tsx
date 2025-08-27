import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle2, Clock, XCircle, Zap, Activity, Server, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { WebhookTester } from '@/components/WebhookTester'
import { WebhookEndpointSimulator } from '@/components/WebhookEndpointSimulator'
import { WebhookTestingGuide } from '@/components/WebhookTestingGuide'
import { webhookService } from '@/services/webhookService'
import type { Order } from '@/types'

interface WebhookLog {
  id: string
  timestamp: number
  event: string
  orderId: string
  status: 'success' | 'error' | 'processing'
  message: string
  duration?: number
}

export function WebhookDashboard() {
  const [orders] = useKV<Order[]>('orders', [])
  const [webhookLogs, setWebhookLogs] = useKV<WebhookLog[]>('webhook-logs', [])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')

  useEffect(() => {
    // Simulate webhook monitoring connection
    if (isMonitoring) {
      setConnectionStatus('connected')
      const interval = setInterval(() => {
        // Simulate periodic health check
        setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'error')
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    } else {
      setConnectionStatus('disconnected')
    }
  }, [isMonitoring])

  const addWebhookLog = (log: Omit<WebhookLog, 'id' | 'timestamp'>) => {
    const newLog: WebhookLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    setWebhookLogs(prev => [newLog, ...(prev || []).slice(0, 49)]) // Keep last 50 logs
  }

  const simulateRealTimeWebhook = async () => {
    if (!orders || orders.length === 0) {
      toast.error('No orders available for testing')
      return
    }

    const randomOrder = orders[Math.floor(Math.random() * orders.length)]
    const events = [
      'payment_intent.succeeded',
      'payment_intent.payment_failed', 
      'payment_intent.processing',
      'payment_intent.requires_action'
    ]
    const randomEvent = events[Math.floor(Math.random() * events.length)]

    addWebhookLog({
      event: randomEvent,
      orderId: randomOrder.id,
      status: 'processing',
      message: `Processing ${randomEvent} for order ${randomOrder.id.slice(-6)}`
    })

    try {
      const startTime = Date.now()
      await webhookService.simulateWebhookEvent(
        randomOrder.id, 
        randomEvent, 
        `pi_test_${Math.random().toString(36).substr(2, 9)}`
      )
      const duration = Date.now() - startTime

      addWebhookLog({
        event: randomEvent,
        orderId: randomOrder.id,
        status: 'success',
        message: `Successfully processed ${randomEvent}`,
        duration
      })

      toast.success('Real-time webhook simulated', {
        description: `${randomEvent} processed for order #${randomOrder.id.slice(-6)}`
      })
    } catch (error) {
      addWebhookLog({
        event: randomEvent,
        orderId: randomOrder.id,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })

      toast.error('Webhook simulation failed')
    }
  }

  const clearLogs = () => {
    setWebhookLogs([])
    toast.success('Webhook logs cleared')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const stats = {
    totalLogs: (webhookLogs || []).length,
    successfulEvents: (webhookLogs || []).filter(log => log.status === 'success').length,
    errors: (webhookLogs || []).filter(log => log.status === 'error').length,
    avgDuration: (webhookLogs || [])
      .filter(log => log.duration)
      .reduce((acc, log) => acc + (log.duration || 0), 0) / ((webhookLogs || []).filter(log => log.duration).length || 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Webhook Testing Dashboard</h2>
          <p className="text-muted-foreground">Test and monitor Stripe webhook events for order status updates</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getConnectionStatusColor(connectionStatus)}>
            <Globe className="h-3 w-3 mr-1" />
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
          </Badge>
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            <Activity className="h-4 w-4 mr-2" />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalLogs}</p>
              </div>
              <Server className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successfulEvents}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">{stats.avgDuration.toFixed(0)}ms</p>
              </div>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Guide */}
      <WebhookTestingGuide />

      {/* Webhook Tester */}
      <WebhookTester />

      {/* Webhook Endpoint Simulator */}
      <WebhookEndpointSimulator />

      {/* Real-time Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Real-time Webhook Simulation
          </CardTitle>
          <CardDescription>
            Simulate random webhook events to test real-time order status updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={simulateRealTimeWebhook}
              disabled={!isMonitoring}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              Simulate Random Event
            </Button>
            <Button 
              variant="outline" 
              onClick={clearLogs}
              disabled={(webhookLogs || []).length === 0}
            >
              Clear Logs
            </Button>
          </div>
          
          {!isMonitoring && (
            <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                Start monitoring to enable real-time webhook simulation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Webhook Event Logs</CardTitle>
            <CardDescription>Real-time log of webhook events and their processing status</CardDescription>
          </div>
          {(webhookLogs || []).length > 0 && (
            <Badge variant="outline">
              {(webhookLogs || []).length} events
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {(webhookLogs || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No webhook events logged yet</p>
              <p className="text-sm">Start testing to see event logs here</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {(webhookLogs || []).map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {log.event}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>#{log.orderId.slice(-6)}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        {log.duration && (
                          <>
                            <span>•</span>
                            <span>{log.duration}ms</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{log.message}</p>
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
import { useState, useEffect } from 'react'
import { Clock, MapPin, CheckCircle, Package, Truck, XCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WebhookTesting } from '@/components/WebhookTesting'
import { useKV } from '@github/spark/hooks'
import { useWebhookListener } from '@/hooks/useWebhookListener'
import { Order } from '@/types'

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
  preparing: { icon: Package, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Preparing' },
  ready: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Ready' },
  delivered: { icon: Truck, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' }
}

export function OrdersPage() {
  const [orders, setOrders] = useKV<Order[]>('user-orders', [])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Set up webhook listeners for all pending orders
  const pendingOrders = (orders || []).filter(order => 
    order.status === 'pending' && order.paymentInfo.status === 'pending'
  )
  
  // Use webhook listener for the first pending order only (hooks rules compliance)
  const firstPendingOrder = pendingOrders.length > 0 ? pendingOrders[0] : null
  useWebhookListener(firstPendingOrder?.id || '')

  // Refresh orders data when orders change
  useEffect(() => {
    const refreshOrders = async () => {
      const latestOrders = await spark.kv.get<Order[]>('orders') || []
      const userOrders = latestOrders.filter(order => order.userId === 'current-user') // In real app, use actual user ID
      setOrders(userOrders)
    }
    
    // Refresh orders every 30 seconds to catch webhook updates
    const interval = setInterval(refreshOrders, 30000)
    return () => clearInterval(interval)
  }, [setOrders])

  // Sort orders by date (newest first)
  const sortedOrders = [...(orders || [])].sort((a, b) => 
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  )

  if ((orders || []).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Button onClick={() => window.location.href = '/menu'}>
            Browse Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
          <p className="text-muted-foreground">
            Track your recent orders and view order history
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {sortedOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            const orderDate = new Date(order.orderDate)
            
            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          Order #{order.id.split('_')[1]}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${statusConfig[order.status].bg} ${statusConfig[order.status].color} border-none`}
                      >
                        <StatusIcon size={16} className="mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* Order Type and Total */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {order.orderType === 'delivery' ? (
                            <>
                              <Truck size={16} />
                              Delivery
                            </>
                          ) : (
                            <>
                              <MapPin size={16} />
                              Pickup
                            </>
                          )}
                        </div>
                        <span className="font-semibold">${order.total.toFixed(2)}</span>
                      </div>

                      {/* Order Items Summary */}
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • {' '}
                        {order.items.slice(0, 2).map(item => item.dessert.name).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </div>

                      {/* Expanded Details */}
                      {selectedOrder?.id === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-4 border-t border-border"
                        >
                          <div className="space-y-4">
                            {/* Detailed Items */}
                            <div>
                              <h4 className="font-medium mb-2">Order Details</h4>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>
                                      {item.quantity}x {item.dessert.name}
                                      {item.specialInstructions && (
                                        <span className="text-muted-foreground block text-xs">
                                          Note: {item.specialInstructions}
                                        </span>
                                      )}
                                    </span>
                                    <span>${(item.dessert.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Customer Info */}
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <div className="text-sm space-y-1">
                                <p>{order.customerInfo.name}</p>
                                <p className="text-muted-foreground">{order.customerInfo.email}</p>
                                <p className="text-muted-foreground">{order.customerInfo.phone}</p>
                                {order.orderType === 'delivery' && order.customerInfo.address && (
                                  <p className="text-muted-foreground">
                                    {order.customerInfo.address.street}, {order.customerInfo.address.city}, {' '}
                                    {order.customerInfo.address.state} {order.customerInfo.address.zipCode}
                                  </p>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Payment Info */}
                            <div>
                              <h4 className="font-medium mb-2">Payment Information</h4>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>Payment Method:</span>
                                  <span className="capitalize">{order.paymentInfo.method}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Payment Status:</span>
                                  <Badge variant={order.paymentInfo.status === 'paid' ? 'default' : 'secondary'}>
                                    {order.paymentInfo.status}
                                  </Badge>
                                </div>
                                {order.paymentInfo.transactionId && (
                                  <div className="flex justify-between">
                                    <span>Transaction ID:</span>
                                    <span className="font-mono text-xs">{order.paymentInfo.transactionId}</span>
                                  </div>
                                )}
                                {order.paymentInfo.stripePaymentIntentId && (
                                  <div className="flex justify-between">
                                    <span>Payment Intent ID:</span>
                                    <span className="font-mono text-xs">{order.paymentInfo.stripePaymentIntentId}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Webhook Testing (Development Only) */}
                            {order.status === 'pending' && order.paymentInfo.status === 'pending' && (
                              <WebhookTesting 
                                orderId={order.id}
                                paymentIntentId={order.paymentInfo.stripePaymentIntentId}
                              />
                            )}

                            {/* Order Status Help */}
                            {order.status === 'pending' && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                  Your order is being reviewed. You'll receive a confirmation soon!
                                </p>
                              </div>
                            )}

                            {order.status === 'preparing' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                  Your delicious treats are being prepared with care!
                                </p>
                              </div>
                            )}

                            {order.status === 'ready' && order.orderType === 'pickup' && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800">
                                  Your order is ready for pickup! Please come to our store when convenient.
                                </p>
                              </div>
                            )}

                            {order.status === 'delivered' && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800">
                                  Order completed! We hope you enjoyed your sweet treats.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
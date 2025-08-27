# Webhook System Documentation

## Overview

The Sweet Delights application implements a comprehensive webhook system for handling Stripe payment status updates. This system ensures that order statuses are automatically synchronized when payment events occur.

## Architecture

### Components

1. **WebhookService** (`src/services/webhookService.ts`)
   - Central service for processing webhook events
   - Handles Stripe webhook event types
   - Updates order statuses automatically
   - Manages event subscriptions

2. **useWebhookListener Hook** (`src/hooks/useWebhookListener.ts`)
   - React hook for subscribing to payment updates
   - Provides real-time notifications to users
   - Handles cleanup and unsubscription

3. **WebhookSimulator** (`src/components/WebhookSimulator.tsx`)
   - Admin interface for testing webhook events
   - Simulates Stripe webhook payloads
   - Tracks webhook event history

4. **WebhookTesting** (`src/components/WebhookTesting.tsx`)
   - User-facing webhook testing component
   - Allows simulation of payment events on orders page

## Supported Webhook Events

- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed or was declined
- `payment_intent.canceled` - Payment was canceled
- `payment_intent.processing` - Payment is being processed
- `payment_intent.requires_action` - Payment requires additional customer action

## Usage

### For Developers

```typescript
import { useWebhookListener } from '@/hooks/useWebhookListener'

// Subscribe to webhook events for an order
function OrderComponent({ orderId }: { orderId: string }) {
  const { simulateWebhook } = useWebhookListener(orderId)
  
  // Webhook events will automatically trigger notifications
  // and update order status in storage
  
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

### For Admins

1. Navigate to Admin → Webhook Testing
2. Select a pending order
3. Choose an event type to simulate
4. Click "Simulate" to trigger the webhook

### Webhook Processing Flow

1. **Event Creation**: Stripe sends webhook event (or simulation creates event)
2. **Event Processing**: WebhookService processes the event based on type
3. **Order Update**: Order status is updated in storage
4. **Notification**: Subscribed components receive updates
5. **User Notification**: Toast notifications inform users of status changes

## Event Handling Details

### Payment Succeeded
- Updates order status to "confirmed"
- Updates payment status to "paid"
- Triggers success notification

### Payment Failed
- Updates order status to "cancelled"
- Updates payment status to "failed"
- Triggers error notification

### Payment Canceled
- Updates order status to "cancelled"
- Updates payment status to "failed"
- Triggers warning notification

### Payment Processing
- Keeps order status as "pending"
- Triggers info notification

### Payment Requires Action
- Keeps order status as "pending"
- Triggers warning notification for additional action needed

## Storage Integration

The webhook system integrates with the application's KV storage:

- **Orders Storage**: `spark.kv.get/set('orders')` for all orders
- **User Orders**: `spark.kv.get/set('user-orders')` for user-specific orders
- **Automatic Sync**: Webhook events update both storage locations

## Real-time Features

- **Live Updates**: Order status changes are reflected immediately
- **Notifications**: Toast notifications provide instant feedback
- **Auto Refresh**: Orders page automatically refreshes to show updates
- **Event History**: Admin can view recent webhook events

## Security Considerations

### Current Implementation (Demo)
- Webhook simulation for development and testing
- No actual Stripe webhook endpoint verification
- Events are processed in the frontend

### Production Recommendations
- Implement server-side webhook endpoint
- Verify webhook signatures from Stripe
- Use HTTPS for webhook endpoint
- Implement idempotency for webhook processing
- Add webhook event logging and monitoring

## Testing

### Manual Testing
1. Place an order with pending payment
2. Use webhook testing interface to simulate events
3. Verify order status updates correctly
4. Check that notifications appear

### Automated Testing
The webhook system can be tested programmatically:

```typescript
import { webhookService } from '@/services/webhookService'

// Simulate a webhook event
await webhookService.simulateWebhookEvent(
  'order_123',
  'payment_intent.succeeded', 
  'pi_test_123'
)
```

## Troubleshooting

### Common Issues

1. **Webhook not triggering**: Check that order ID matches and event type is correct
2. **Order not updating**: Verify order exists in storage and has pending status
3. **Notifications not showing**: Check that useWebhookListener is properly set up

### Debug Information

The webhook service logs debug information to the console:
- Event processing details
- Order update confirmations
- Error messages for failed operations

### Admin Tools

Use the Webhook Simulator in the admin panel to:
- View pending orders
- Test webhook events
- Monitor webhook history
- Debug payment processing issues

## Future Enhancements

1. **Real Webhook Endpoint**: Implement server-side webhook handling
2. **Webhook Verification**: Add Stripe signature verification
3. **Retry Logic**: Implement automatic retry for failed webhook processing
4. **Webhook Monitoring**: Add comprehensive logging and monitoring
5. **Event Types**: Support additional Stripe webhook event types
6. **Rate Limiting**: Implement rate limiting for webhook processing
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWebhookListener } from '@/hooks/useWebhookListener'

interface WebhookTestingProps {
  orderId: string
  paymentIntentId?: string
}

export function WebhookTesting({ orderId, paymentIntentId }: WebhookTestingProps) {
  const { simulateWebhook } = useWebhookListener(orderId)

  const handleSimulateSuccess = () => {
    simulateWebhook('payment_intent.succeeded', paymentIntentId || 'pi_test_123')
  }

  const handleSimulateFailure = () => {
    simulateWebhook('payment_intent.payment_failed', paymentIntentId || 'pi_test_123')
  }

  const handleSimulateProcessing = () => {
    simulateWebhook('payment_intent.processing', paymentIntentId || 'pi_test_123')
  }

  const handleSimulateCancel = () => {
    simulateWebhook('payment_intent.canceled', paymentIntentId || 'pi_test_123')
  }

  return (
    <div className="bg-muted/50 border rounded-lg p-3">
      <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
        <Zap size={16} />
        Webhook Testing (Dev Mode)
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Simulate webhook events to test payment status updates
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={handleSimulateSuccess}>
          Simulate Success
        </Button>
        <Button size="sm" variant="outline" onClick={handleSimulateFailure}>
          Simulate Failure
        </Button>
        <Button size="sm" variant="outline" onClick={handleSimulateProcessing}>
          Simulate Processing
        </Button>
        <Button size="sm" variant="outline" onClick={handleSimulateCancel}>
          Simulate Cancel
        </Button>
      </div>
    </div>
  )
}
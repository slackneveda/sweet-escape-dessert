import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface StripeSettings {
  publishableKey: string
  secretKey: string
  enabled: boolean
  testMode: boolean
}

export function PaymentSettings() {
  const [stripeSettings, setStripeSettings] = useKV<StripeSettings>('stripe-settings', {
    publishableKey: 'pk_test_51RnoADC2x3xqWzx4bJrS0MFF1eCID80RUy9c4RFWptwhq6khTbv5zeW3AwCufPgdlemEg6HjIsCSjEhida7n4rTO00ue0yFARw',
    secretKey: 'sk_test_51RnoADC2x3xqWzx4TrsCrmRPbs7a0QCzDMERU9OHgxvM5A7SSIXUGpyOL5aGVtWiDy9iLcqw5jpT0Txw4AzVkWuo001nRStcjC',
    enabled: true,
    testMode: true
  })
  
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempSettings, setTempSettings] = useState(stripeSettings)

  const handleSave = () => {
    setStripeSettings(tempSettings)
    setIsEditing(false)
    toast.success('Stripe settings saved successfully!')
  }

  const handleCancel = () => {
    setTempSettings(stripeSettings)
    setIsEditing(false)
  }

  const isTestKey = (key: string) => {
    return key.startsWith('pk_test_') || key.startsWith('sk_test_')
  }

  const validateKeys = () => {
    const pubKeyValid = tempSettings.publishableKey.startsWith('pk_')
    const secretKeyValid = tempSettings.secretKey.startsWith('sk_')
    return pubKeyValid && secretKeyValid
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Payment Settings</h2>
        <p className="text-muted-foreground">
          Configure your Stripe payment processing settings
        </p>
      </div>

      {/* Stripe Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Stripe Configuration
            <Badge variant={stripeSettings.enabled ? "default" : "secondary"}>
              {stripeSettings.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Stripe Payments</Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to pay with credit/debit cards
              </p>
            </div>
            <Switch
              checked={isEditing ? tempSettings.enabled : stripeSettings.enabled}
              onCheckedChange={(enabled) => {
                if (isEditing) {
                  setTempSettings(prev => ({ ...prev, enabled }))
                } else {
                  setStripeSettings(prev => ({ ...prev, enabled }))
                  toast.success(enabled ? 'Stripe enabled' : 'Stripe disabled')
                }
              }}
            />
          </div>

          <Separator />

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Test Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use test keys for development and testing
              </p>
            </div>
            <Switch
              checked={isEditing ? tempSettings.testMode : stripeSettings.testMode}
              onCheckedChange={(testMode) => {
                if (isEditing) {
                  setTempSettings(prev => ({ ...prev, testMode }))
                } else {
                  setStripeSettings(prev => ({ ...prev, testMode }))
                  toast.success(testMode ? 'Test mode enabled' : 'Live mode enabled')
                }
              }}
            />
          </div>

          <Separator />

          {/* API Keys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">API Keys</Label>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Keys
                </Button>
              )}
            </div>

            {/* Publishable Key */}
            <div className="space-y-2">
              <Label htmlFor="publishableKey">
                Publishable Key
                <span className="text-xs text-muted-foreground ml-2">
                  (Safe to share publicly)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="publishableKey"
                  value={isEditing ? tempSettings.publishableKey : stripeSettings.publishableKey}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, publishableKey: e.target.value }))}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
                {stripeSettings.publishableKey && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {isTestKey(stripeSettings.publishableKey) ? (
                      <Badge variant="outline" className="text-xs">TEST</Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">LIVE</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Secret Key */}
            <div className="space-y-2">
              <Label htmlFor="secretKey">
                Secret Key
                <span className="text-xs text-muted-foreground ml-2">
                  (Keep confidential)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecretKey ? "text" : "password"}
                  value={isEditing ? tempSettings.secretKey : stripeSettings.secretKey}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, secretKey: e.target.value }))}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {stripeSettings.secretKey && isTestKey(stripeSettings.secretKey) && (
                    <Badge variant="outline" className="text-xs">TEST</Badge>
                  )}
                  {stripeSettings.secretKey && !isTestKey(stripeSettings.secretKey) && (
                    <Badge variant="default" className="text-xs">LIVE</Badge>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="h-6 w-6 p-0"
                  >
                    {showSecretKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                {validateKeys() ? (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-600">Keys appear to be valid</span>
                  </>
                ) : (
                  <>
                    <Warning size={16} className="text-yellow-600" />
                    <span className="text-yellow-600">Please check your key formats</span>
                  </>
                )}
              </motion.div>
            )}

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={!validateKeys()}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Information */}
      {stripeSettings.testMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning size={20} />
              Test Mode Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                You're currently in test mode. Use these test card numbers for testing:
              </p>
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p><strong>Visa:</strong> 4242 4242 4242 4242</p>
                <p><strong>Visa (Debit):</strong> 4000 0566 5566 5556</p>
                <p><strong>Mastercard:</strong> 5555 5555 5555 4444</p>
                <p><strong>American Express:</strong> 3782 822463 10005</p>
                <p><strong>Declined Card:</strong> 4000 0000 0000 0002</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Use any future expiry date and any 3-digit CVC for testing.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Mode Warning */}
      {!stripeSettings.testMode && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Warning size={20} />
              Live Mode Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You're currently in live mode. Real payments will be processed and real money will be charged to customers.
              Make sure you're ready for production before enabling live mode.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
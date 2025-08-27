import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { useForm } from 'react-hook-form'
import { DessertCard } from '@/components/DessertCard'
import { ReviewModeration } from '@/components/ReviewModeration'
import { PaymentSettings } from '@/components/PaymentSettings'
import { WebhookDashboard } from '@/components/WebhookDashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dessert } from '@/types'
import { Plus, Shield, TrendingUp, Cake, MessageSquare, CreditCard, Webhook } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Navigate } from 'react-router-dom'

interface DessertForm {
  name: string
  description: string
  price: number
  category: 'cakes' | 'pastries' | 'ice-creams' | 'cookies' | 'seasonal'
  featured: boolean
  available: boolean
}

export function AdminPage() {
  const { user } = useAuth()
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDessert, setEditingDessert] = useState<Dessert | null>(null)
  const [activeTab, setActiveTab] = useState('menu')
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<DessertForm>()

  const watchedFeatured = watch('featured')
  const watchedAvailable = watch('available')

  useEffect(() => {
    if (editingDessert) {
      setValue('name', editingDessert.name)
      setValue('description', editingDessert.description)
      setValue('price', editingDessert.price)
      setValue('category', editingDessert.category)
      setValue('featured', editingDessert.featured)
      setValue('available', editingDessert.available)
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        category: 'cakes',
        featured: false,
        available: true
      })
    }
  }, [editingDessert, setValue, reset])

  if (!user?.isAdmin) {
    return <Navigate to="/profile" replace />
  }

  const onSubmit = async (data: DessertForm) => {
    if (editingDessert) {
      // Update existing dessert
      setDesserts((current) =>
        current.map(d => d.id === editingDessert.id
          ? { ...editingDessert, ...data }
          : d
        )
      )
      toast.success('Dessert updated successfully!')
    } else {
      // Add new dessert
      const newDessert: Dessert = {
        id: Date.now().toString(),
        image: '',
        rating: 0,
        reviewCount: 0,
        ...data
      }
      setDesserts((current) => [...current, newDessert])
      toast.success('Dessert added successfully!')
    }
    
    setIsDialogOpen(false)
    setEditingDessert(null)
    reset()
  }

  const handleEdit = (dessert: Dessert) => {
    setEditingDessert(dessert)
    setIsDialogOpen(true)
  }

  const handleDelete = (dessert: Dessert) => {
    if (confirm(`Are you sure you want to delete "${dessert.name}"?`)) {
      setDesserts((current) => current.filter(d => d.id !== dessert.id))
      toast.success('Dessert deleted successfully!')
    }
  }

  const handleAddNew = () => {
    setEditingDessert(null)
    setIsDialogOpen(true)
  }

  const stats = {
    total: desserts.length,
    featured: desserts.filter(d => d.featured).length,
    available: desserts.filter(d => d.available).length,
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center mb-2">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Manage your dessert menu and moderate reviews</p>
          </div>
        </motion.div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Cake className="h-4 w-4" />
              Menu Management
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Review Moderation
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Settings
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Webhook Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Menu Management</h2>
                  <p className="text-muted-foreground">Add, edit, and manage your dessert menu items</p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Dessert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingDessert ? 'Edit Dessert' : 'Add New Dessert'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Chocolate Cake"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          {...register('description', { required: 'Description is required' })}
                          placeholder="Rich and decadent chocolate cake..."
                          rows={3}
                        />
                        {errors.description && (
                          <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', { 
                              required: 'Price is required',
                              min: { value: 0.01, message: 'Price must be greater than 0' }
                            })}
                            placeholder="12.99"
                          />
                          {errors.price && (
                            <p className="text-sm text-destructive">{errors.price.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select onValueChange={(value) => setValue('category', value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cakes">Cakes</SelectItem>
                              <SelectItem value="pastries">Pastries</SelectItem>
                              <SelectItem value="ice-creams">Ice Creams</SelectItem>
                              <SelectItem value="cookies">Cookies</SelectItem>
                              <SelectItem value="seasonal">Seasonal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={watchedFeatured}
                            onCheckedChange={(checked) => setValue('featured', checked)}
                          />
                          <Label htmlFor="featured">Featured Item</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="available"
                            checked={watchedAvailable}
                            onCheckedChange={(checked) => setValue('available', checked)}
                          />
                          <Label htmlFor="available">Available</Label>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button type="submit" className="flex-1">
                          {editingDessert ? 'Update' : 'Add'} Dessert
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false)
                            setEditingDessert(null)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground">Total Desserts</p>
                        <p className="text-3xl font-bold">{stats.total}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground">Featured Items</p>
                        <p className="text-3xl font-bold">{stats.featured}</p>
                      </div>
                      <span className="text-2xl">⭐</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground">Available</p>
                        <p className="text-3xl font-bold">{stats.available}</p>
                      </div>
                      <span className="text-2xl">✅</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Desserts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {desserts.map((dessert, index) => (
                  <motion.div
                    key={dessert.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <DessertCard
                      dessert={dessert}
                      showActions
                      showCartButton={false}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </div>

              {desserts.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🧁</span>
                  <h3 className="text-2xl font-bold mb-4">No Desserts Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your menu by adding your first dessert!
                  </p>
                  <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Dessert
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewModeration />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="webhooks">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <WebhookDashboard />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
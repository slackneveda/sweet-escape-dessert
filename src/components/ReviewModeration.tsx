import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Review, Dessert } from '@/types'
import { Check, X, Eye, Clock, Shield } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ReviewModerationProps {
  className?: string
}

interface ModerationAction {
  reviewId: string
  action: 'approve' | 'reject'
  note?: string
}

export function ReviewModeration({ className }: ReviewModerationProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useKV<Review[]>('reviews', [])
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts', [])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [moderationNote, setModerationNote] = useState('')
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  // Get dessert name for a review
  const getDessertName = (dessertId: string) => {
    const dessert = desserts.find(d => d.id === dessertId)
    return dessert?.name || 'Unknown Dessert'
  }

  // Filter reviews by status
  const filteredReviews = (reviews || []).filter(review => {
    switch (activeTab) {
      case 'pending':
        return review.status === 'pending'
      case 'approved':
        return review.status === 'approved'
      case 'rejected':
        return review.status === 'rejected'
      default:
        return true
    }
  })

  // Handle moderation action
  const handleModeration = async (action: 'approve' | 'reject', reviewId: string, note?: string) => {
    setReviews(current => 
      current.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              status: action === 'approve' ? 'approved' : 'rejected',
              moderationNote: note,
              moderatedBy: user?.name || 'Admin',
              moderatedAt: new Date()
            }
          : review
      )
    )

    // Update dessert rating if approved
    if (action === 'approve') {
      const review = reviews.find(r => r.id === reviewId)
      if (review) {
        setDesserts(current => 
          current.map(dessert => {
            if (dessert.id === review.dessertId) {
              const approvedReviews = reviews.filter(r => 
                r.dessertId === dessert.id && 
                (r.status === 'approved' || (r.id === reviewId))
              )
              const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0)
              const avgRating = totalRating / approvedReviews.length
              
              return {
                ...dessert,
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: approvedReviews.length
              }
            }
            return dessert
          })
        )
      }
    }

    toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
    setSelectedReview(null)
    setModerationNote('')
    setIsDetailDialogOpen(false)
  }

  // Quick moderation actions
  const handleQuickApprove = (review: Review) => {
    handleModeration('approve', review.id)
  }

  const handleQuickReject = (review: Review) => {
    handleModeration('reject', review.id, 'Rejected by quick action')
  }

  // Open detail dialog for detailed moderation
  const openDetailDialog = (review: Review) => {
    setSelectedReview(review)
    setModerationNote('')
    setIsDetailDialogOpen(true)
  }

  // Get status badge variant
  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  const stats = {
    pending: (reviews || []).filter(r => r.status === 'pending').length,
    approved: (reviews || []).filter(r => r.status === 'approved').length,
    rejected: (reviews || []).filter(r => r.status === 'rejected').length,
    total: (reviews || []).length
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-bold">Review Moderation</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Review Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Approved ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Rejected ({stats.rejected})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({stats.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">No Reviews Found</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'pending' 
                        ? 'No pending reviews to moderate at this time.'
                        : `No ${activeTab} reviews found.`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{review.userName}</h3>
                              {getStatusBadge(review.status)}
                              {review.verified && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-muted-foreground">
                                for {getDessertName(review.dessertId)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {formatDate(review.date)}
                            </p>
                            <p className="text-sm line-clamp-2">{review.comment}</p>
                          </div>
                        </div>

                        {review.moderationNote && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                              <strong>Moderation Note:</strong> {review.moderationNote}
                            </p>
                            {review.moderatedBy && review.moderatedAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                By {review.moderatedBy} on {formatDate(review.moderatedAt)}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailDialog(review)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          
                          {review.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-700 border-green-200 hover:bg-green-50"
                                onClick={() => handleQuickApprove(review)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Quick Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-700 border-red-200 hover:bg-red-50"
                                onClick={() => handleQuickReject(review)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Quick Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Review Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            
            {selectedReview && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Reviewer</Label>
                    <p className="mt-1">{selectedReview.userName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Dessert</Label>
                    <p className="mt-1">{getDessertName(selectedReview.dessertId)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Rating</Label>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2">({selectedReview.rating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="mt-1">{formatDate(selectedReview.date)}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Review Comment</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedReview.comment}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedReview.status)}
                  </div>
                </div>

                {selectedReview.status !== 'pending' && (
                  <div>
                    <Label className="text-sm font-medium">Previous Moderation</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{selectedReview.moderationNote || 'No note provided'}</p>
                      {selectedReview.moderatedBy && selectedReview.moderatedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          By {selectedReview.moderatedBy} on {formatDate(selectedReview.moderatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="moderationNote" className="text-sm font-medium">
                    Moderation Note (Optional)
                  </Label>
                  <Textarea
                    id="moderationNote"
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                    placeholder="Add a note about your moderation decision..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleModeration('approve', selectedReview.id, moderationNote)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Review
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleModeration('reject', selectedReview.id, moderationNote)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
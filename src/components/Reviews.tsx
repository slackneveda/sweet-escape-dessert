import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/StarRating'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { Review, Dessert } from '@/types'
import { updateDessertRating } from '@/lib/rating-utils'
import { CheckCircle, User } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ReviewsProps {
  dessertId: string
  dessertName: string
}

export function Reviews({ dessertId, dessertName }: ReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useKV<Review[]>(`reviews-${dessertId}`, [])
  const [desserts, setDesserts] = useKV<Dessert[]>('desserts', [])
  const [showAddReview, setShowAddReview] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to leave a review')
      return
    }

    if (newRating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (newComment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const newReview: Review = {
        id: Date.now().toString(),
        dessertId,
        userId: user.id,
        userName: user.name,
        rating: newRating,
        comment: newComment.trim(),
        date: new Date(),
        verified: true // In a real app, this would be based on purchase history
      }

      setReviews(currentReviews => [newReview, ...currentReviews])
      
      // Update dessert rating and review count
      const updatedRating = await updateDessertRating(dessertId)
      setDesserts(currentDesserts => 
        currentDesserts.map(dessert => 
          dessert.id === dessertId 
            ? { ...dessert, ...updatedRating }
            : dessert
        )
      )
      
      // Reset form
      setNewRating(0)
      setNewComment('')
      setShowAddReview(false)
      
      toast.success('Review submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = (reviews || []).length > 0 
    ? (reviews || []).reduce((sum, review) => sum + review.rating, 0) / (reviews || []).length 
    : 0

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          {(reviews || []).length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} size="sm" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({(reviews || []).length} review{(reviews || []).length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        
        {user && (
          <Button 
            onClick={() => setShowAddReview(!showAddReview)}
            variant="outline"
            size="sm"
          >
            {showAddReview ? 'Cancel' : 'Write Review'}
          </Button>
        )}
      </div>

      {/* Add Review Form */}
      <AnimatePresence>
        {showAddReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Write a Review for {dessertName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <StarRating 
                    rating={newRating}
                    interactive
                    onRatingChange={setNewRating}
                    size="lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Review</label>
                  <Textarea
                    placeholder="Share your thoughts about this dessert..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {newComment.length}/500
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || newRating === 0 || newComment.trim().length < 10}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddReview(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {(reviews || []).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {(reviews || []).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        
                        <StarRating rating={review.rating} size="sm" />
                        
                        <p className="text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
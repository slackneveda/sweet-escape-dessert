import { Review } from '@/types'

export async function updateDessertRating(dessertId: string) {
  try {
    // Get reviews for this dessert
    const reviewsKey = `reviews-${dessertId}`
    const reviews = await spark.kv.get<Review[]>(reviewsKey) || []
    
    if ((reviews || []).length === 0) {
      return { rating: 0, reviewCount: 0 }
    }
    
    // Calculate average rating
    const totalRating = (reviews || []).reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / (reviews || []).length
    
    return {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: (reviews || []).length
    }
  } catch (error) {
    console.error('Error updating dessert rating:', error)
    return { rating: 0, reviewCount: 0 }
  }
}

export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars)
}
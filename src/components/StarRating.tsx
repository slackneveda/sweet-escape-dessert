import { Star } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false,
  onRatingChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1
        const isFilled = starRating <= rating
        const isHalfFilled = !isFilled && starRating - 0.5 <= rating

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "relative transition-colors",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default"
            )}
            onClick={() => handleStarClick(starRating)}
            disabled={!interactive}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled 
                  ? "fill-amber-400 text-amber-400" 
                  : isHalfFilled 
                    ? "fill-amber-400/50 text-amber-400/50"
                    : "fill-transparent text-muted-foreground"
              )}
              weight={isFilled ? "fill" : "regular"}
            />
          </button>
        )
      })}
    </div>
  )
}
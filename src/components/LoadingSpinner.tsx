import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full">
          <div className="w-full h-full border-4 border-primary border-r-transparent rounded-full"></div>
        </div>
      </motion.div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-muted-foreground mt-4">Loading Sweet Delights...</p>
      </div>
    </div>
  )
}
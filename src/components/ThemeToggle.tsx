import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from '@phosphor-icons/react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="transition-transform duration-200 hover:scale-110"
    >
      {theme === 'light' ? (
        <Moon className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
      ) : (
        <Sun className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { useDocsTheme } from '../hooks/useDocsTheme'

export function DocsThemeToggle() {
  const { theme, toggleTheme } = useDocsTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {theme === 'dark' ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </Button>
  )
}

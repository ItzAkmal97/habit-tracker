import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <button onClick={toggleTheme} className="flex items-center">
      <Sun className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default ModeToggle;
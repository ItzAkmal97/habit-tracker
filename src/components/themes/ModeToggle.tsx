import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"
import { getDarkModeAccess, setDarkMode } from "@/features/darkModeSlice"
import { useDispatch } from "react-redux"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch()
  const [hasDarkModeAccess, setHasDarkModeAccess] = useState(false)

  useEffect(() => {
    const initializeDarkMode = async () => {
      try {
        // First check localStorage for immediate UI response
        const localAccess = localStorage.getItem("darkModeAccess")
        
        if (localAccess === "true") {
          setHasDarkModeAccess(true)
          dispatch(setDarkMode(true))
          
          // Respect user's last theme preference if they have access
          const savedTheme = localStorage.getItem("vite-ui-theme")
          if (savedTheme) {
            setTheme(savedTheme as "light" | "dark")
          }
        } else {
          // If no local access, force light theme
          setTheme("light")
        }

        // Then verify with Firebase
        const firebaseAccess = await getDarkModeAccess()
        if (firebaseAccess === "true") {
          setHasDarkModeAccess(true)
          localStorage.setItem("darkModeAccess", "true")
          dispatch(setDarkMode(true))
        } else {
          // If no Firebase access, ensure light theme
          setHasDarkModeAccess(false)
          localStorage.removeItem("darkModeAccess")
          dispatch(setDarkMode(false))
          setTheme("light")
        }
      } catch (error) {
        console.error("Error initializing dark mode:", error)
        // On error, default to light theme
        setTheme("light")
      }
    }

    initializeDarkMode()
  }, [dispatch, setTheme])

  const toggleTheme = () => {
    if (!hasDarkModeAccess) return
    
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    dispatch(setDarkMode(newTheme === "dark"))
    localStorage.setItem("vite-ui-theme", newTheme)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative ${!hasDarkModeAccess && "cursor-not-allowed"}`}>
            <button 
              onClick={toggleTheme}
              disabled={!hasDarkModeAccess}
              className={`
                flex items-center justify-center w-8 h-8 rounded-md
                ${hasDarkModeAccess ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "opacity-50"}
              `}
            >
              <Sun className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <Moon className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {hasDarkModeAccess 
            ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
            : "Upgrade to premium to unlock dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ModeToggle
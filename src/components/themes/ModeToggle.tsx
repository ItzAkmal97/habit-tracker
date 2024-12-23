import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"
import { getDarkModeAccess, setDarkMode } from "@/features/darkModeSlice"
import { useDispatch } from "react-redux"

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch()
  const [hasDarkModeAccess, setHasDarkModeAccess] = useState(false)

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        // Check localStorage first for immediate UI response
        const localAccess = localStorage.getItem("darkModeAccess")
        if (localAccess === "true") {
          setHasDarkModeAccess(true)
          // Get user's preferred theme from localStorage or default to system preference
          const savedTheme = localStorage.getItem("vite-ui-theme")
          if (savedTheme) {
            setTheme(savedTheme)
            dispatch(setDarkMode(savedTheme === "dark"))
          }
        }

        // Then verify with Firebase
        const darkMode = await getDarkModeAccess()
        if (darkMode === "true") {
          setHasDarkModeAccess(true)
          // Only set theme if it hasn't been set by localStorage
          if (!localStorage.getItem("vite-ui-theme")) {
            setTheme("light") // Default to light theme
            dispatch(setDarkMode(false))
          }
        } else {
          setHasDarkModeAccess(false)
          dispatch(setDarkMode(false))
          setTheme("light")
        }
      } catch (error) {
        console.error("Error fetching dark mode access:", error)
      }
    }

    fetchDarkMode()
  }, [dispatch, setTheme])

  const toggleTheme = () => {
    if (!hasDarkModeAccess) return
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    dispatch(setDarkMode(newTheme === "dark"))
    localStorage.setItem("vite-ui-theme", newTheme) // Save user's preference
  }

  return (
    <div className="relative">
      {hasDarkModeAccess ? (
        <button 
          onClick={toggleTheme} 
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Sun className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Moon className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <span className="sr-only">Toggle theme</span>
        </button>
      ) : (
        <div 
          className="flex items-center justify-center w-8 h-8 cursor-not-allowed opacity-50"
          title="Upgrade to premium to access dark mode"
        >
          <Moon className="h-5 w-5"/>
        </div>
      )}
    </div>
  )
}

export default ModeToggle
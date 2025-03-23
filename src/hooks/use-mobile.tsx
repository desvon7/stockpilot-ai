
import * as React from "react"

// Define standard breakpoints for consistency
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

/**
 * Hook to detect if the viewport is mobile-sized
 * @param breakpoint - Custom breakpoint in pixels (defaults to md/768px)
 * @returns Boolean indicating if the viewport is below the breakpoint
 */
export function useIsMobile(breakpoint: number = BREAKPOINTS.md) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint)
    
    // Set initial value
    checkMobile()
    
    // Add event listener for resize
    window.addEventListener("resize", checkMobile)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile ?? false // Default to false during SSR
}

/**
 * Hook to get the current breakpoint name
 * @returns Current breakpoint name as string ('xs', 'sm', 'md', etc.)
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<string>("xl")
  
  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < BREAKPOINTS.xs) return setBreakpoint("xxs")
      if (width < BREAKPOINTS.sm) return setBreakpoint("xs")
      if (width < BREAKPOINTS.md) return setBreakpoint("sm")
      if (width < BREAKPOINTS.lg) return setBreakpoint("md")
      if (width < BREAKPOINTS.xl) return setBreakpoint("lg")
      if (width < BREAKPOINTS["2xl"]) return setBreakpoint("xl")
      return setBreakpoint("2xl")
    }
    
    updateBreakpoint()
    window.addEventListener("resize", updateBreakpoint)
    
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])
  
  return breakpoint
}

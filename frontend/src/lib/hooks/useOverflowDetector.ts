import { RefObject, useEffect, useState } from "react"

export const useOverflowDetector = (ref: RefObject<HTMLElement | null>) => {
  const [overflow, setOverflow] = useState({ left: false, right: false })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const checkOverflow = () => {
      const isOverflowingLeft = element.scrollLeft > 0
      const isOverflowingRight = 
        element.scrollLeft + element.clientWidth < element.scrollWidth

      setOverflow({ 
        left: isOverflowingLeft, 
        right: isOverflowingRight 
      })
    }

    checkOverflow()
    element.addEventListener('scroll', checkOverflow)
    window.addEventListener('resize', checkOverflow)

    return () => {
      element.removeEventListener('scroll', checkOverflow)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [ref])

  return overflow
}
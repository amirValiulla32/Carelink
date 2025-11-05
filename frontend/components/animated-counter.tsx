"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ value, duration = 2000, suffix = "", className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  // Extract numeric value if string contains non-numeric characters
  const numericValue = typeof value === "string"
    ? parseInt(value.replace(/[^0-9]/g, ""))
    : value

  const displayValue = typeof value === "string" ? value : value.toString()

  useEffect(() => {
    if (!inView) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      setCount(Math.floor(progress * numericValue))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [inView, numericValue, duration])

  // Format the display value
  const formattedValue = typeof value === "string"
    ? displayValue.replace(/[0-9]+/, count.toString())
    : count

  return (
    <span ref={ref} className={className}>
      {formattedValue}{suffix}
    </span>
  )
}

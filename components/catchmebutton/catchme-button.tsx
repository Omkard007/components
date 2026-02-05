import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  evade?: boolean
  evadeDistance?: number
  evadeThreshold?: number
  boundaryWidth?: number
  boundaryHeight?: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      evade = false,
      evadeDistance = 180,
      evadeThreshold = 150,
      boundaryWidth = 400,
      boundaryHeight = 300,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [isEvading, setIsEvading] = React.useState(false)

    React.useImperativeHandle(ref, () => buttonRef.current!)

    React.useEffect(() => {
      if (!evade || !buttonRef.current) return

      const handleMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current) return

        const button = buttonRef.current
        const rect = button.getBoundingClientRect()

        // Calculate button center
        const buttonCenterX = rect.left + rect.width / 2
        const buttonCenterY = rect.top + rect.height / 2

        // Calculate distance from mouse to button center
        const deltaX = e.clientX - buttonCenterX
        const deltaY = e.clientY - buttonCenterY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        if (distance < evadeThreshold) {
          setIsEvading(true)

          // Calculate angle from mouse to button
          const angle = Math.atan2(deltaY, deltaX)

          // Calculate evasion intensity (stronger when closer)
          const intensity = 1 - distance / evadeThreshold
          const currentEvadeDistance = evadeDistance * intensity

          // Calculate new position (move away from mouse)
          const moveX = -Math.cos(angle) * currentEvadeDistance
          const moveY = -Math.sin(angle) * currentEvadeDistance

          // Apply boundaries
          const maxX = boundaryWidth
          const maxY = boundaryHeight

          const clampedX = Math.max(-maxX, Math.min(maxX, moveX))
          const clampedY = Math.max(-maxY, Math.min(maxY, moveY))

          setPosition({ x: clampedX, y: clampedY })
        } else if (distance > evadeThreshold * 1.8) {
          setIsEvading(false)
          setPosition({ x: 0, y: 0 })
        }
      }

      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }, [evade, evadeDistance, evadeThreshold, boundaryWidth, boundaryHeight])

    return (
      <Comp
        ref={buttonRef}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        style={
          evade && (position.x !== 0 || position.y !== 0 || isEvading)
            ? {
                transform: `translate(${position.x}px, ${position.y}px) scale(${
                  isEvading ? 1.08 : 1
                }) rotate(${position.x * 0.02}deg)`,
                boxShadow: isEvading
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)"
                  : undefined,
                transition:
                  "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, background 0.3s ease",
              }
            : undefined
        }
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
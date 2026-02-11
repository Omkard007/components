"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ")
}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ ...props }, ref) => {
  return <AccordionPrimitive.Root ref={ref} data-slot="accordion" {...props} />
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  // Motion values for smooth animation
  const hoverProgress = useMotionValue(0)
  const openProgress = useMotionValue(0)

  // Spring configuration for smooth, bouncy animation
  const springConfig = { stiffness: 300, damping: 25, mass: 0.5 }
  const hoverSpring = useSpring(hoverProgress, springConfig)
  const openSpring = useSpring(openProgress, springConfig)

  // Transform rotation based on hover and open state
  // Hover: 0 -> 45deg (slight tilt forward)
  // Open: 0 -> 180deg (full rotation)
  const hoverRotation = useTransform(hoverSpring, [0, 1], [0, 45])
  const openRotation = useTransform(openSpring, [0, 1], [0, 180])

  // Combine both rotations
  const rotation = useTransform(
    [hoverRotation, openRotation],
    ([hover, open]) => {
      if (isOpen) return open as number
      return hover as number
    }
  )

  // Update motion values when hover/open state changes
  React.useEffect(() => {
    hoverProgress.set(isHovered ? 1 : 0)
  }, [isHovered, hoverProgress])

  React.useEffect(() => {
    openProgress.set(isOpen ? 1 : 0)
  }, [isOpen, openProgress])

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onMouseEnter={() => !isOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          setIsOpen(!isOpen)
          setIsHovered(false)
          props.onClick?.(e)
        }}
        {...props}
      >
        {children}
        <motion.div
          style={{ rotate: rotation }}
          className="pointer-events-none flex items-center justify-center"
        >
          <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
        </motion.div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
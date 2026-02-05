"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
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
      if (isOpen) return open
      return hover
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
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{
          height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.25, ease: "easeInOut" }
        }}
      >
        <div className={cn("pt-0 pb-4", className)}>{children}</div>
      </motion.div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
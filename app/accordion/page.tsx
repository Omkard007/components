"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/accordion/accordion"

export default function Page() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Animated Accordion
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hover over items to see the preview animation, click to expand
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1" className="bg-white dark:bg-slate-800 rounded-lg px-6 border-slate-200 dark:border-slate-700">
            <AccordionTrigger>
              What is Framer Motion?
            </AccordionTrigger>
            <AccordionContent>
              Framer Motion is a production-ready motion library for React. It's designed to make creating 
              animations simple and intuitive, with a declarative API that makes complex animations feel effortless. 
              It provides powerful features like spring animations, gestures, and layout animations out of the box.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white dark:bg-slate-800 rounded-lg px-6 border-slate-200 dark:border-slate-700">
            <AccordionTrigger>
              How does the hover animation work?
            </AccordionTrigger>
            <AccordionContent>
              The hover animation uses Framer Motion's useMotionValue and useSpring hooks to create a smooth, 
              physics-based rotation. When you hover, the chevron rotates 45 degrees forward as a preview. 
              When clicked, it completes the full 180-degree rotation. The spring configuration ensures 
              the movement feels natural and responsive.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white dark:bg-slate-800 rounded-lg px-6 border-slate-200 dark:border-slate-700">
            <AccordionTrigger>
              Can I customize the animation?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! You can modify the spring configuration (stiffness, damping, mass) to change how 
              bouncy or smooth the animation feels. You can also adjust the rotation angles in the useTransform 
              hooks to create different effects. The transition durations and easing functions are fully customizable.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white dark:bg-slate-800 rounded-lg px-6 border-slate-200 dark:border-slate-700">
            <AccordionTrigger>
              What makes this animation smooth?
            </AccordionTrigger>
            <AccordionContent>
              The smoothness comes from several factors: using spring physics instead of linear transitions, 
              combining motion values for hover and open states, and leveraging hardware-accelerated CSS transforms. 
              The spring configuration creates natural deceleration and slight overshoot that mimics real-world physics.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-white dark:bg-slate-800 rounded-lg px-6 border-slate-200 dark:border-slate-700">
            <AccordionTrigger>
              Is this accessible?
            </AccordionTrigger>
            <AccordionContent>
              Yes! The accordion is built on Radix UI's Accordion primitive, which handles all the accessibility 
              concerns like keyboard navigation, ARIA attributes, and focus management. The animations are purely 
              visual enhancements that don't interfere with the underlying accessible structure.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Animation Features
          </h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li>• <strong>Hover Preview:</strong> 45° rotation hints at interactivity</li>
            <li>• <strong>Smooth Open:</strong> 180° rotation with spring physics</li>
            <li>• <strong>Natural Motion:</strong> Physics-based animations feel organic</li>
            <li>• <strong>State Management:</strong> Hover disabled when item is open</li>
            <li>• <strong>Content Fade:</strong> Smooth height and opacity transitions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { CSSProperties, useEffect } from "react"
import { motion, HTMLMotionProps } from "motion/react"

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ")
}

// Inject animations into the document
const injectFlipAnimations = () => {
  if (typeof document === 'undefined') return;
  
  const styleId = 'Flip-animations-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes Flip-slide {
      to {
        transform: translate(calc(100cqw - 100%), 0);
      }
    }

    @keyframes spin-around {
      0% {
        transform: translateZ(0) rotate(0);
      }
      15%, 35% {
        transform: translateZ(0) rotate(90deg);
      }
      65%, 85% {
        transform: translateZ(0) rotate(270deg);
      }
      100% {
        transform: translateZ(0) rotate(360deg);
      }
    }

    .animate-Flip-slide {
      animation: Flip-slide var(--speed, 3s) ease-in-out infinite alternate;
    }

    .animate-spin-around {
      animation: spin-around calc(var(--speed, 3s) * 2) infinite linear;
    }
  `;
  document.head.appendChild(style);
};

interface FlipButtonProps extends Omit<HTMLMotionProps<"button">, 'style'> {
  FlipColor?: string
  FlipSize?: string
  borderRadius?: string
  FlipDuration?:string
  background?: string
  className?: string
  children?: React.ReactNode
  flipContent?: React.ReactNode
  flipFrom?: 'top' | 'bottom' | 'left' | 'right'
  tapScale?: number
  style?: CSSProperties
  flipBackground?: string
  flipTextColor?: string
}

const buildVariant = ({
  opacity,
  rotation,
  offset,
  isVertical,
  rotateAxis,
}: {
  opacity: number
  rotation: number
  offset: string | null
  isVertical: boolean
  rotateAxis: string
}) => ({
  opacity,
  [rotateAxis]: rotation,
  ...(isVertical && offset !== null ? { y: offset } : {}),
  ...(!isVertical && offset !== null ? { x: offset } : {}),
})

const FlipButton = React.forwardRef<HTMLButtonElement, FlipButtonProps>(
  (props, ref) => {
    const {
      FlipColor = "#ffffff",
      FlipSize = "0.05em",
      FlipDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      flipContent,
      flipFrom = 'top',
      tapScale = 0.95,
      style,
      flipBackground = "rgba(255, 255, 255, 1)",
      flipTextColor = "#000000",
      ...restProps
    } = props

    // Inject animations on mount
    useEffect(() => {
      injectFlipAnimations();
    }, []);

    const isVertical = flipFrom === 'top' || flipFrom === 'bottom'
    const rotateAxis = isVertical ? 'rotateX' : 'rotateY'
    const frontOffset = flipFrom === 'top' || flipFrom === 'left' ? '50%' : '-50%'
    const backOffset = flipFrom === 'top' || flipFrom === 'left' ? '-50%' : '50%'

    const frontVariants = {
      initial: buildVariant({
        opacity: 1,
        rotation: 0,
        offset: '0%',
        isVertical,
        rotateAxis,
      }),
      hover: buildVariant({
        opacity: 0,
        rotation: 90,
        offset: frontOffset,
        isVertical,
        rotateAxis,
      }),
    }

    const backVariants = {
      initial: buildVariant({
        opacity: 0,
        rotation: -90,
        offset: backOffset,
        isVertical,
        rotateAxis,
      }),
      hover: buildVariant({
        opacity: 1,
        rotation: 0,
        offset: '0%',
        isVertical,
        rotateAxis,
      }),
    }

    // Slower, more realistic transition
    const transition = { 
      type: 'spring' as const, 
      stiffness: 180, 
      damping: 25,
      mass: 1.2
    }

    const buttonStyle: CSSProperties = {
      "--spread": "90deg",
      "--flip-color": FlipColor,
      "--radius": borderRadius,
      "--speed": FlipDuration,
      "--cut": FlipSize,
      "--bg": background,
      "--flip-bg": flipBackground,
      ...style,
    } as CSSProperties

    // If no flip content, render regular Flip button
    if (!flipContent) {
      return (
        <button
          style={buttonStyle}
          className={cn(
            "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-white/10 whitespace-nowrap text-white [background:var(--bg)]",
            "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
            className
          )}
          ref={ref}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {/* spark container */}
          <div
            className={cn(
              "-z-30 blur-[5px]",
              "@container-[size] absolute inset-0 overflow-visible"
            )}
          >
            <div className="animate-Flip-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
              <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--Flip-color)_var(--spread),transparent_var(--spread))]" />
            </div>
          </div>
          {children}

          {/* Highlight */}
          <div
            className={cn(
              "absolute inset-0 size-full",
              "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
              "transform-gpu transition-all duration-300 ease-in-out",
              "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
              "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
            )}
          />

          {/* backdrop */}
          <div
            className={cn(
              "absolute inset-(--cut) -z-20 rounded-lg [background:var(--bg)]"
            )}
          />
        </button>
      )
    }

    // Render flip button with Flip effect
    return (
      <motion.button
        initial="initial"
        whileHover="hover"
        whileTap={{ scale: tapScale }}
        style={{
          ...buttonStyle,
          display: 'inline-grid',
          placeItems: 'center',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          "group relative z-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 px-6 py-3 whitespace-nowrap [background:var(--bg)]",
          "transform-gpu",
          className
        )}
        ref={ref}
        {...restProps}
      >
        {/* Background layer that changes color on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          transition={transition}
          style={{
            background: flipBackground,
            zIndex: 0,
          }}
        />

        {/* spark container - fades out on hover */}
        <motion.div
          className={cn(
            "-z-30 blur-[2px]",
            "@container-[size] absolute inset-0 overflow-visible"
          )}
          variants={{
            initial: { opacity: 1 },
            hover: { opacity: 0 }
          }}
          transition={transition}
        >
          <div className="animate-Flip-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--Flip-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </motion.div>

        {/* Front face - white text */}
        <motion.span
          variants={frontVariants}
          transition={transition}
          style={{
            gridArea: '1 / 1',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            color: '#ffffff',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          {children}
        </motion.span>

        {/* Back face - black text */}
        <motion.span
          variants={backVariants}
          transition={transition}
          style={{
            gridArea: '1 / 1',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: flipTextColor,
            zIndex: 1,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          {flipContent}
        </motion.span>

        {/* Highlight - fades out on hover */}
        <motion.div
          className={cn(
            "absolute inset-0 size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
          variants={{
            initial: { opacity: 1 },
            hover: { opacity: 0 }
          }}
          transition={transition}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-(--cut) -z-20 rounded-lg [background:var(--bg)]"
          )}
        />
      </motion.button>
    )
  }
)

FlipButton.displayName = "FlipButton"

export { FlipButton, type FlipButtonProps }
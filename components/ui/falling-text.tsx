"use client";
import Matter from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";

export interface FallingTextProps {
  text: string;
  highlightWords?: string[];
  trigger?: "auto" | "scroll" | "click" | "hover";
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  className?: string;

  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;

  physicsOptions?: {
    restitution?: number;
    frictionAir?: number;
    friction?: number;
    density?: number;
  };

  initialVelocity?: {
    x?: number;
    y?: number;
    angular?: number;
  };
  highlightClassName?: string;
  wordSpacing?: number;
  minHeight?: string;
  enableMouseInteraction?: boolean;
  resetKey?: number;

  // Shadow projection options
  enableShadows?: boolean;
  shadowColor?: string;
  shadowIntensity?: number;
  lightSourceY?: number;
}

const FallingText: React.FC<FallingTextProps> = ({
  text,
  highlightWords = [],
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
  className = "",
  onAnimationStart,
  onAnimationEnd,
  physicsOptions = {},
  initialVelocity = {},
  highlightClassName = "text-red-500 font-bold underline",
  wordSpacing = 2,
  minHeight = "300px",
  enableMouseInteraction = true,
  resetKey = 0,

  // Shadow projection defaults
  enableShadows = false,
  shadowColor = "rgba(0, 0, 0, 0.3)",
  shadowIntensity = 0.5,
  lightSourceY = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const shadowContainerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const [effectStarted, setEffectStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const mergedPhysicsOptions = {
    restitution: 0.8,
    frictionAir: 0.01,
    friction: 0.2,
    density: 0.001,
    ...physicsOptions,
  };

  const mergedInitialVelocity = {
    x: 5,
    y: 0,
    angular: 0.05,
    ...initialVelocity,
  };

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (runnerRef.current && engineRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }

    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      if (renderRef.current.canvas && canvasContainerRef.current) {
        try {
          canvasContainerRef.current.removeChild(renderRef.current.canvas);
        } catch (_e) {}
      }
      renderRef.current = null;
    }

    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }

    hasStartedRef.current = false;
  }, []);

  useEffect(() => {
    if (resetKey > 0) {
      cleanup();
      setEffectStarted(false);
      setIsReady(false);

      setTimeout(() => setIsReady(true), 50);
    }
  }, [resetKey, cleanup]);

  useEffect(() => {
    if (!textRef.current || !text) return;

    const words = text.split(" ").filter((word) => word.length > 0);

    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) =>
          word.toLowerCase().startsWith(hw.toLowerCase())
        );
        return `<span
          class="inline-block select-none transition-colors duration-200 ${
            isHighlighted ? highlightClassName : ""
          }"
          style="margin: 0 ${wordSpacing}px;"
        >
          ${word}
        </span>`;
      })
      .join(" ");

    textRef.current.innerHTML = newHTML;
    setIsReady(true);
  }, [text, highlightWords, highlightClassName, wordSpacing]);

  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }

    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted || !isReady || hasStartedRef.current) return;

    const {
      Engine,
      Render,
      World,
      Bodies,
      Runner,
      Mouse,
      MouseConstraint,
      Body,
    } = Matter;

    if (
      !containerRef.current ||
      !canvasContainerRef.current ||
      !textRef.current
    )
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) {
      console.warn("FallingText: Container has invalid dimensions");
      return;
    }

    hasStartedRef.current = true;
    onAnimationStart?.();

    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    engineRef.current = engine;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });
    renderRef.current = render;

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };

    const floor = Bodies.rectangle(
      width / 2,
      height + 25,
      width,
      50,
      boundaryOptions
    );
    const leftWall = Bodies.rectangle(
      -25,
      height / 2,
      50,
      height,
      boundaryOptions
    );
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height,
      boundaryOptions
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -25,
      width,
      50,
      boundaryOptions
    );

    const wordSpans = textRef.current.querySelectorAll("span");
    const wordBodies = Array.from(wordSpans).map((elem) => {
      const rect = elem.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        ...mergedPhysicsOptions,
      });

      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * mergedInitialVelocity.x,
        y: (Math.random() - 0.5) * mergedInitialVelocity.y,
      });
      Body.setAngularVelocity(
        body,
        (Math.random() - 0.5) * mergedInitialVelocity.angular
      );

      return { elem: elem as HTMLElement, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = "absolute";
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = "translate(-50%, -50%)";
      elem.style.willChange = "transform";
    });

    // Create shadow elements
    const shadowElements: HTMLElement[] = [];
    if (enableShadows && shadowContainerRef.current) {
      wordBodies.forEach(({ elem }) => {
        const shadow = document.createElement("div");
        shadow.style.position = "absolute";
        shadow.style.backgroundColor = shadowColor;
        shadow.style.borderRadius = "50%";
        shadow.style.pointerEvents = "none";
        shadow.style.transformOrigin = "center center";
        shadowContainerRef.current!.appendChild(shadow);
        shadowElements.push(shadow);
      });
    }

    let mouseConstraint: Matter.MouseConstraint | null = null;
    if (enableMouseInteraction) {
      const mouse = Mouse.create(containerRef.current);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: mouseConstraintStiffness,
          render: { visible: false },
        },
      });
      render.mouse = mouse;
    }

    const bodiesToAdd = [
      floor,
      leftWall,
      rightWall,
      ceiling,
      ...wordBodies.map((wb) => wb.body),
    ];
    if (mouseConstraint) {
      bodiesToAdd.push(mouseConstraint as any);
    }
    World.add(engine.world, bodiesToAdd);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    let settledCount = 0;
    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }, index) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;

        // Shadow projection
        if (enableShadows && shadowElements[index]) {
          const shadow = shadowElements[index];
          const floorY = height;
          const distanceFromFloor = floorY - y;
          const lightDistance = y - lightSourceY;

          // Calculate shadow properties based on distance from floor
          const shadowScale = 1 + Math.max(0, (height - distanceFromFloor) / height) * 0.8;
          const shadowBlur = Math.max(2, (height - distanceFromFloor) / height * 15);
          const shadowOpacity = Math.max(0, Math.min(shadowIntensity, shadowIntensity * (distanceFromFloor / height)));

          // Position shadow on the floor
          shadow.style.left = `${x}px`;
          shadow.style.top = `${floorY - 30}px`; // Slightly above the actual floor
          shadow.style.width = `${elem.offsetWidth * 0.6}px`;
          shadow.style.height = `${elem.offsetHeight * 0.3}px`;
          shadow.style.transform = `translate(-50%, -50%) scaleX(${shadowScale})`;
          shadow.style.filter = `blur(${shadowBlur}px)`;
          shadow.style.opacity = `${shadowOpacity}`;
        }
      });

      const allSettled = wordBodies.every(({ body }) => {
        const speed = Math.abs(body.velocity.x) + Math.abs(body.velocity.y);
        return speed < 0.1;
      });

      if (allSettled) {
        settledCount++;
        if (settledCount > 60) {
          onAnimationEnd?.();
          return;
        }
      } else {
        settledCount = 0;
      }

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      cleanup();
      // Clean up shadow elements
      if (shadowContainerRef.current) {
        shadowContainerRef.current.innerHTML = "";
      }
    };
  }, [
    effectStarted,
    isReady,
    gravity,
    wireframes,
    backgroundColor,
    mouseConstraintStiffness,
    mergedPhysicsOptions,
    mergedInitialVelocity,
    enableMouseInteraction,
    cleanup,
    onAnimationStart,
    onAnimationEnd,
    enableShadows,
    shadowColor,
    shadowIntensity,
    lightSourceY,
  ]);

  const handleTrigger = useCallback(() => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true);
    }
  }, [effectStarted, trigger]);

  return (
    <div
      ref={containerRef}
      className={`relative z-[1] w-full overflow-hidden pt-8 text-center ${className}`}
      style={{ minHeight }}
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
      role="presentation"
      aria-label={
        trigger !== "auto" ? "Click or hover to animate text" : undefined
      }
    >
      <div
        ref={textRef}
        className="pointer-events-none inline-block"
        style={{
          fontSize,
          lineHeight: 1.4,
        }}
        aria-live="polite"
      />

      {/* Shadow container */}
      {enableShadows && (
        <div
          ref={shadowContainerRef}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Physics canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        ref={canvasContainerRef}
        aria-hidden="true"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default FallingText;
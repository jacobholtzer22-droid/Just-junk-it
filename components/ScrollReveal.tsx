"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals its children as they scroll into view.
 *
 * WHY IT IS BUILT THIS WAY:
 *   - Starts VISIBLE, then hides itself on mount only if the browser supports
 *     IntersectionObserver and the user has not asked for reduced motion. That ordering
 *     matters: if JavaScript never runs, the content is simply there. A reveal animation
 *     must never be the reason a paid-traffic landing page renders blank.
 *   - Animates transform and opacity only — never height, top or margin — so it composites
 *     on the GPU and cannot trigger layout or contribute to CLS.
 *   - Honours prefers-reduced-motion by not animating at all, not merely animating faster.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger in ms. Keep under ~200 — longer reads as the page being slow. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const el = ref.current;
    if (!el) return;
    setShown(false);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // one-shot: re-animating on every scroll-by is nauseating
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

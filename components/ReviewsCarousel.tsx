"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Review } from "@/site.config";
import Stars from "./Stars";

/**
 * Rotating reviews carousel.
 *
 * BUILT ON CSS SCROLL-SNAP, NOT ON JAVASCRIPT POSITIONING.
 *   The track is a scroll-snap container, so with JS disabled it is still a perfectly good
 *   swipeable carousel — every review is present in the HTML, readable, and reachable by
 *   thumb or keyboard. Auto-rotation and the arrow buttons are progressive enhancement
 *   layered on top. No review is ever hidden behind a script that might not run.
 *
 * ACCESSIBILITY, because auto-rotating content is where carousels usually fail:
 *   - Auto-advance STOPS permanently on any interaction: pointer down, focus, or an arrow
 *     press. Text that moves while you are reading it is the classic carousel sin.
 *   - It never starts at all under prefers-reduced-motion.
 *   - It pauses while the tab is hidden, so you do not return to a carousel mid-spin.
 *   - aria-live="off" deliberately: the reviews are not urgent updates and announcing every
 *     rotation would be hostile to a screen reader user.
 *   - Arrows are real <button>s with labels, 44px targets, and are hidden from the a11y
 *     tree only when there is a single review.
 */
export default function ReviewsCarousel({ reviews }: { reviews: readonly Review[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = (i + reviews.length) % reviews.length;
    const child = track.children[clamped] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({
        left: child.offsetLeft - track.offsetLeft,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
    setIndex(clamped);
  }, [reviews.length]);

  /** Any deliberate interaction ends auto-rotation for the rest of the visit. */
  const stopAuto = useCallback(() => setAuto(false), []);

  useEffect(() => {
    if (!auto || reviews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return; // do not spin in a background tab
      setIndex((i) => {
        const next = (i + 1) % reviews.length;
        const track = trackRef.current;
        const child = track?.children[next] as HTMLElement | undefined;
        if (track && child) {
          track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 7000); // long enough to actually finish reading a review
    return () => window.clearInterval(id);
  }, [auto, reviews.length]);

  /** Keep the dots honest when the user swipes the track directly. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kids = [...track.children] as HTMLElement[];
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bestD = Infinity;
        kids.forEach((k, i) => {
          const d = Math.abs(k.offsetLeft - track.offsetLeft + k.clientWidth / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => { track.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  if (reviews.length === 0) return null;
  const multiple = reviews.length > 1;

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        aria-live="off"
        onPointerDown={stopAuto}
        onFocusCapture={stopAuto}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <li
            key={`${r.author}-${i}`}
            className="w-[86%] shrink-0 snap-center border-2 border-paper/15 bg-surface p-6 sm:w-[48%] sm:p-8 lg:w-[32%]"
          >
            <div className="flex items-start justify-between gap-4">
              {r.rating ? <Stars rating={r.rating} /> : null}
              <Quote className="h-7 w-7 shrink-0 text-accent/70" strokeWidth={2} aria-hidden="true" />
            </div>
            {/* Verbatim. Never trimmed to fit the box — the box grows instead.
                whitespace-pre-line preserves the line break in Judith's review. */}
            <blockquote className="mt-4 whitespace-pre-line text-lg leading-relaxed text-paper/85">
              {r.body}
            </blockquote>
            <footer className="mt-6 border-t-2 border-paper/10 pt-4">
              <p className="font-display text-xl uppercase text-paper">{r.author}</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-paper/60">
                via {r.source}
                {r.date ? ` · ${new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}` : ""}
              </p>
            </footer>
          </li>
        ))}
      </ul>

      {multiple ? (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => { stopAuto(); scrollTo(index - 1); }}
            aria-label="Previous review"
            className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-paper/25 text-paper transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => { stopAuto(); scrollTo(index + 1); }}
            aria-label="Next review"
            className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-paper/25 text-paper transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          <ol className="ml-1 flex items-center">
            {reviews.map((r, i) => (
              <li key={`dot-${i}`}>
                <button
                  type="button"
                  onClick={() => { stopAuto(); scrollTo(i); }}
                  aria-label={`Go to review ${i + 1} of ${reviews.length}`}
                  aria-current={i === index ? "true" : undefined}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                >
                  <span
                    className={`block h-1.5 w-5 transition-colors ${i === index ? "bg-accent" : "bg-paper/25"}`}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

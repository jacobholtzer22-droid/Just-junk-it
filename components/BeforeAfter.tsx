import Photo from "./Photo";

type Props = {
  beforeKey: string;
  afterKey: string;
  caption: string;
};

/**
 * A before/after pair.
 *
 * MOBILE FIRST, LITERALLY: side-by-side at 390px would render each frame about 180px wide,
 * which is useless — you cannot see what was hauled. So the pair STACKS on phones and only
 * goes side-by-side from `sm` up, where each half still has real width.
 *
 * The BEFORE / AFTER labels are text in the markup, not an overlay image and not colour
 * alone, so they survive with images off, with CSS off, and in a screen reader. The accent
 * is used only on the AFTER label — the eye needs one thing to land on.
 *
 * No JavaScript. No slider, no tap-to-swap: both need JS, and a static page that works with
 * JS disabled was a build requirement.
 */
export default function BeforeAfter({ beforeKey, afterKey, caption }: Props) {
  return (
    <figure className="border-2 border-paper/10 bg-surface">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {[
          { key: beforeKey, label: "Before", accent: false },
          { key: afterKey, label: "After", accent: true },
        ].map((side, i) => (
          <div key={side.label} className={i === 1 ? "border-t-2 border-paper/10 sm:border-l-2 sm:border-t-0" : ""}>
            <p
              className={`px-4 py-2 font-display text-sm uppercase tracking-[0.2em] ${
                side.accent ? "bg-accent text-paper" : "bg-paper/10 text-paper"
              }`}
            >
              {side.label}
            </p>
            <Photo
              photoKey={side.key}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <figcaption className="border-t-2 border-paper/10 px-4 py-4 text-paper/70">
        {caption}
      </figcaption>
    </figure>
  );
}

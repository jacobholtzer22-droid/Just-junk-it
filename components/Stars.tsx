import { Star } from "lucide-react";

/**
 * Five filled stars, shown only where a review's real rating is known.
 *
 * ⚠ This is a VISUAL element for humans and nothing more. It is never accompanied by
 * Review or AggregateRating structured data — self-serving review markup on your own
 * domain is a Google penalty risk regardless of whether the reviews are genuine.
 *
 * The rating is also stated in text for screen readers, because a row of icons is not
 * information to anyone who cannot see it.
 */
export default function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <p className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={i < rating ? "h-5 w-5 fill-accent text-accent" : "h-5 w-5 text-paper/25"}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">{rating} out of 5 stars</span>
    </p>
  );
}

"use client";

import { SkeletonLines } from "./SkeletonLines";

/** Page-level loader: N rows, alternating left/right */
export default function PageSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="page-container py-10"
    >
      <div className="space-y-6">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLines key={i} align={i % 2 === 0 ? "left" : "right"} />
        ))}
      </div>
    </div>
  );
}

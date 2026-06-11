"use client";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] shimmer mb-4" />
      <div className="h-5 w-3/4 shimmer mb-2" />
      <div className="h-4 w-1/2 shimmer" />
    </div>
  );
}

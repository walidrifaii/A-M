"use client";

type Align = "left" | "right";

/** One block of three shimmering lines, aligned left or right */
export function SkeletonLines({ align = "left" }: { align?: Align }) {
  // widths: left = short → long → medium, right = long → short → medium
  const w1 = align === "left" ? "w-1/2" : "w-5/6";
  const w2 = align === "left" ? "w-5/6" : "w-1/2";
  const w3 = "w-2/3";

  const justify = align === "right" ? "justify-end" : "justify-start";

  return (
    <div className={`w-full flex ${justify}`}>
      <div className="w-full max-w-[680px] space-y-3">
        <div className={`flex ${justify}`}><span className={`sk-line ${w1}`} /></div>
        <div className={`flex ${justify}`}><span className={`sk-line ${w2}`} /></div>
        <div className={`flex ${justify}`}><span className={`sk-line ${w3}`} /></div>
      </div>
    </div>
  );
}
